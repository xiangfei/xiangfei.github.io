## ruby  zookeeper cluster 配置


```ruby
require 'zk'

zk = ZK.new("127.0.0.1:2181,127.0.0.1:2281,127.0.0.1:2381")

```



## karafka 配置


```ruby
    kafk_conn = JSON.load(Awifi::Consul::Kv.get("devops/devops-server"))["kafka_conn"]
    kafk_conn.split(",").each do |conn|
      connect << "kafka://#{conn}"
    end
    config.kafka.seed_brokers = connect

```




## karafka  批量返回处理

```ruby

class KarafkaApp < Karafka::App
  setup do |config|
    config.batch_fetching = true  #批量获取一次处理
 
  end

end

class CollectGatewayConsumer < ApplicationConsumer

  def consume
    params_batch.each do |params|

    end

   end

end

```



##  集成rails


### karafka 使用ruby kafka monitor 监控业务状态


```ruby
#frozen_string_literal: true

ENV["RAILS_ENV"] ||= "development"
ENV["KARAFKA_ENV"] = ENV["RAILS_ENV"]
require ::File.expand_path("../config/environment", __FILE__)
Rails.application.eager_load!
# This lines will make Karafka print to stdout like puma or unicorn
if Rails.env.development?
  Rails.logger.extend(
    ActiveSupport::Logger.broadcast(
      ActiveSupport::Logger.new($stdout)
    )
  )
end
ENV["KARAFKA_ROOT_DIR"] = File.expand_path(".", File.dirname(__FILE__))
require "active_support/notifications"

class KarafkaApp < Karafka::App
  setup do |config|
    kflogger = ActiveSupport::Logger.new("log/karafka.log")
    config.batch_fetching = true
    #config.backend = :sidekiq
    #config.monitor = ActiveSupport::Notifications
    config.batch_consuming = true
    connect = []
    kafk_conn = JSON.load(Awifi::Consul::Kv.get("devops/devops-server"))["kafka_conn"]

    kafk_conn.split(",").each do |conn|
      connect << "kafka://#{conn}"
    end
    #config.kafka.seed_brokers =  ["kafka://192.168.212.58:9092",  "kafka://192.168.213.37:9092" , "kafka://192.168.213.35:9092"]
    config.kafka.seed_brokers = connect
    config.kafka.start_from_beginning = false
    config.kafka.automatically_mark_as_consumed = true
    #config.kafka.fetcher_max_queue_size = 100
    #config.kafka.offset_commit_interval = 10
    #config.kafka.offset_commit_threshold = 100
    #config.kafka.offset_retention_time = 7 * 60 * 60
    config.kafka.session_timeout = 300  #调整时间，保证数据处理完,数据过大?
    #config.kafka.socket_timeout =  300
    #config.kafka.max_wait_time =  300
    #config.kafka.max_bytes_per_partition = 10 * 1024 * 1024
    #config.client_id = "teamwork_manage_#{ENV["HOSTNAME"]}"
    config.client_id = "devops_server"
    if Rails.env.development?
      config.logger = Rails.logger
    else
      kflogger.level = Logger::ERROR
      config.logger = kflogger
    end
    config.monitor = ActiveSupport::Notifications
  end

  # Comment out this part if you are not using instrumentation and/or you are not
  # interested in logging events for certain environments. Since instrumentation
  # notifications add extra boilerplate, if you want to achieve max performance,
  # listen to only what you really need for given environment.

  #  Karafka.monitor.subscribe(WaterDrop::Instrumentation::StdoutListener.new)
  #  Karafka.monitor.subscribe(Karafka::Instrumentation::StdoutListener.new)
  #  Karafka.monitor.subscribe(Karafka::Instrumentation::ProctitleListener.new)

  # Uncomment that in order to achieve code reload in development mode
  # Be aware, that this might have some side-effects. Please refer to the wiki
  # for more details on benefits and downsides of the code reload in the
  # development mode
  #
  # Karafka.monitor.subscribe(
  #   Karafka::CodeReloader.new(
  #     *Rails.application.reloaders
  #   )
  # )

  class << self
    def sync_to_redis(payload)
      key = "devops___#{payload[:group_id]}:#{payload[:topic]}:#{payload[:partition]}___devops"
      monitor_redis.set key, payload.to_json
    end

    def monitor_redis
      @@redis_url ||= JSON.load(Awifi::Consul::Kv.get("devops/devops-server"))["redis"]["monitor_url"]
      @@redis ||= Redis.new url: @@redis_url
    end
  end

  # 增加业务监控
  ActiveSupport::Notifications.subscribe("process_message.consumer.kafka") do |*args|
    event = ActiveSupport::Notifications::Event.new(*args)
    KarafkaApp.sync_to_redis event.payload
  end

  ActiveSupport::Notifications.subscribe("process_batch.consumer.kafka") do |*args|
    #logger.info "event.name  #{event.name} --------  #{event.payload}"
    event = ActiveSupport::Notifications::Event.new(*args)
    KarafkaApp.sync_to_redis event.payload
  end
  consumer_groups.draw do
    consumer_group :resource do
      topic :"host.teamwork.resource" do
        consumer TeamworkResourceHostConsumer
        batch_consuming true
      end
    end
    consumer_group :resourceusage do
      topic :"host.teamwork.resourceusage" do
        consumer TeamworkResourceUsageHostConsumer
        batch_consuming true
      end
    end
    consumer_group :vtcp do
      topic :"host.teamwork.vtcp" do
        consumer TeamworkResourceUsageVtcpConsumer
        batch_consuming true
      end
    end
    consumer_group :vtcpconf do
      topic :"host.teamwork.vtcpconf" do
        consumer TeamworkResourceVtcpConsumer
        batch_consuming true
      end
    end
    consumer_group :service_monitor do
      topic :"host.teamwork.service_monitor" do
        consumer TeamworkResourceServiceNewConsumer
        batch_consuming true
      end
    end
    consumer_group :bigscreen do
      topic :"host.teamwork.bigscreenalarm" do
        consumer TeamworkResourceBigscreenAlarmConsumer
        batch_consuming true
      end
    end
    consumer_group :downstream do
      topic :"host.teamwork.downstream" do
        consumer TeamworkResourceDownstreamConsumer
        batch_consuming true
      end
    end
    consumer_group :upstream do
      topic :"host.teamwork.upstream" do
        consumer TeamworkResourceUpstreamConsumer
        batch_consuming true
      end
    end
    consumer_group :heartbeat do
      topic :"host.teamwork.heartbeat" do
        consumer TeamworkResourceHeartbeatConsumer
        batch_consuming true
      end
    end
    consumer_group :gateway do
      topic :"host.teamwork.collectgateway" do
        consumer TeamworkResourceCollectGatewayConsumer
        batch_consuming true
      end
    end
    consumer_group :route do
      topic :"host.teamwork.routedata" do
        consumer TeamworkResourceRouteDataConsumer
        batch_consuming true
      end
    end
    consumer_group :api_alarm do
      topic :"host.teamwork.apialarm" do
        consumer TeamworkResourceApiAlarmConsumer
        batch_consuming true
      end
    end
    consumer_group :port_alarm do
      topic :"host.teamwork.portalarm" do
        consumer TeamworkResourcePortAlarmConsumer
        batch_consuming true
      end
    end
    consumer_group :script_alarm do
      topic :"host.teamwork.scriptalarm" do
        consumer TeamworkResourceScriptAlarmConsumer
        batch_consuming true
      end
    end
    consumer_group :script_check_alarm do
      topic :"host.teamwork.scriptcheckalarm" do
        consumer TeamworkResourceScriptCheckAlarmConsumer
        batch_consuming true
      end
    end
    consumer_group :script_data do
      topic :"host.teamwork.scriptdata" do
        consumer TeamworkResourceScriptDataConsumer
        batch_consuming true
      end
    end

    consumer_group :script_once do
      topic :"host.teamwork.scripttask" do
        consumer TeamworkResourceScriptOnceConsumer
        batch_consuming true
      end
    end

    consumer_group :k8s_service do
      topic :"host.teamwork.helm_info" do
        consumer TeamworkResourceK8sServiceConsumer
        batch_consuming true
      end
    end

    consumer_group :resource_alarm do
      topic :"host.teamwork.resourcealarm" do
        consumer TeamworkResourceAlarmConsumer
        batch_consuming true
      end
    end

    consumer_group :k8s_alarm do
      topic :"host.teamwork.helm_alarm" do
        consumer TeamworkResourceK8sAlarmConsumer
        batch_consuming true
      end
    end

    consumer_group :nginx_upstream_group do
      topic :"host.teamwork.nginxgroup" do
        consumer NginxUpstreamGroupConsumer
        start_from_beginning false
      end
    end

    consumer_group :backup_task_status_group do
      topic :"host.teamwork.cronscriptdata" do
        consumer BackupTaskStatusConsumer
        batch_consuming true
        start_from_beginning false
      end
    end
  end
end

#Karafka.monitor.subscribe("app.initialized") do
#  #  # Put here all the things you want to do after the Karafka framework
#  #  # initialization
#  WaterDrop.setup do |config|
#    config.deliver = true
#    config.kafka.seed_brokers = ["kafka://#{ENV["KAFKA_CONN"]}"]
#  end
#end

KarafkaApp.boot!


```

> 使用自定义log