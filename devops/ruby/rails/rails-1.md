
# 基于consul实现

### 说明

- 可以在每一天机器安装  consul client, 然后通过脚本去watch
  - 需要在每一台机器安装consul client
- 直接在代码watch service
  - 经过实践证明, 不存在性能瓶颈
- 本文通过在代码watch service 实现


## 服务注册 , 健康检查

- diplomat 

- before configuration  加载consul
  - rails 有可能需要在consul获取database的配置文件

```ruby
    config.before_configuration do
      puts "before configuration"
      require "#{Rails.root}/config/before_configuration/consul.rb"
      server_register
    end


# consul example
require "socket"
require "diplomat"

link = ::Socket::PF_LINK if ::Socket.const_defined? :PF_LINK

packet = ::Socket::PF_PACKET if ::Socket.const_defined? :PF_PACKET
INTERFACE_PACKET_FAMILY = link || packet

raise "ruby version 至少2.4.5" if RUBY_VERSION < "2.4.5"

def server_ip
  ip = ::Socket.ip_address_list.detect { |intf| intf.ipv4_private? }
  ip.ip_address
end

def server_mac
  interfaces = ::Socket.getifaddrs.select do |addr|
    if addr.addr
      addr.addr.pfamily == INTERFACE_PACKET_FAMILY
    end
  end

  mac, = if ::Socket.const_defined? :PF_LINK
      interfaces.map do |addr|
        addr.addr.getnameinfo
      end.find do |m, |
        !m.empty?
      end
    elsif ::Socket.const_defined? :PF_PACKET
      interfaces.map do |addr|
        addr.addr.inspect_sockaddr[/hwaddr=([\h:]+)/, 1]
      end.find do |mac_addr|
        mac_addr != "00:00:00:00:00:00"
      end
    end
  return mac if mac
  raise "获取 server_mac failed"
end

def server_hostname
  ::Socket.gethostname
end

CONSUL = YAML.load_file("#{Rails.root}/config/consul.yaml")["consul"]
::Diplomat.configure do |config|
  config.url = CONSUL["url"]
  config.options = CONSUL["opts"] || {}
end

def server_register
  address = server_ip
  name = CONSUL["name"]
  port = CONSUL["port"]

  serivice_opts = {
    id: "#{server_mac}_#{server_ip}",
    name: name,
    address: address,
    port: port,
    checks: [],
  }
  if CONSUL["check"]
    serivice_opts[:checks] = [
      "id": "#{server_mac}_#{server_ip}",
      "name": name,
      "http": "#{CONSUL["check"]["protocol"]}://#{address}:#{port}#{CONSUL["check"]["path"]}",
      "interval": "#{CONSUL["check"]["interval"]}s",
      "timeout": "#{CONSUL["check"]["timeout"]}s",
      "DeregisterCriticalServiceAfter": "1m",
      "method": "GET",
      "header": {},
      "tls_skip_verify": false,

    ]
  end
  ::Diplomat::Service.register serivice_opts
end


```


## 服务发现

### 实现思路

- 每隔2秒查看consul ui 有没注册服务
  - consul 没有watch 方法
- 在控制台启动 
  - console sope
- puma 启动
  - on_worker_boot watch
  - 打开 workers ENV.fetch("WEB_CONCURRENCY") { 2 }  
- loadbalance
  - 在获取到到url 直接round robbin 访问
    - 其他的访问策略需要自己写代码

```ruby
# console 配置
    config.after_initialize do
      require "#{Rails.root}/config/after_initialize/consul_service_discovery.rb"
      console do
        require "#{Rails.root}/config/after_initialize/consul_service_discovery.rb"
        # add watch server code  
      end
    end

# puma 配置
    on_worker_boot do
      # add watch server code

    end

class AsyncConsul
  include Concurrent::Async

  CACHE ||= Concurrent::Hash.new
  SERVICE_CACHE ||= Concurrent::Map.new

  class << self
    def get_service_url(servicename )
      begin
        result = SERVICE_CACHE[servicename].sample
        return "#{result[:type]}://#{result[:address]}:#{result[:port]}"
      rescue => e
         
      end
    end
  end

  def service_discovery(servicename = "sso-server")
    loop do
      begin
        Timeout::timeout 2 do
          success_service_list = Diplomat::Health.service(servicename, passing: true)
          list = []
          success_service_list.each do |s|
            address = s.Service["Address"]
            port = s.Service["Port"]
            list << { port: port, address: address, type: "http" }
          end
          SERVICE_CACHE[servicename] ||= list
          if SERVICE_CACHE[servicename] != list
            SERVICE_CACHE[servicename] = list
          end
        end
      rescue => e
      end
      sleep 2
    end
  end
end

```


## 配置下发


### 实现思路
  - 和服务发现一致
  - console , puma  方法需要扩展

```ruby

class AsyncConsul
  include Concurrent::Async

  CACHE ||= Concurrent::Hash.new
  SERVICE_CACHE ||= Concurrent::Map.new
  def reload_const
    loop do
      begin
        Timeout::timeout 2 do
          config = JSON.load Diplomat::Kv.get("xxx") # your key ,value
          database = config["database"]
          redis = config["redis"]
          reset_database database
          reset_redisconfig redis
        end
      rescue => e
      end
      sleep 2
    end
  end

  def reset_database(database)
    CACHE["database"] ||= database
    if CACHE["database"] != database
      CACHE["database"] = database
      ActiveRecord::Base.establish_connection database
    end
  end

  def reset_redisconfig(ldap)
    CACHE["redis"] ||= ldap
    if CACHE["redis"] != ldap
      CACHE["redis"] = ldap
      #LDAP_CONFIG.merge! ldap
    end
  end
end

```


## sidekiq karafka  微服务(consul)


### sidekiq

 - 官方没有实现的方法
  - k8s 直接重启容器
  - 虚拟器 重启应用

### 虚拟机重启的方式 GOD
 - god 监听consul ,发现字段变化重启
  - consul挂机,连接失败,跳过
 - 扩展PollCondition test 方法

```ruby
require "diplomat"
require "yaml"
RAILS_ROOT = File.dirname File.expand_path(__FILE__)
CONSUL = YAML.load_file("#{RAILS_ROOT}/config/consul.yaml")["consul"]
module God
  module Conditions
    class AwifiConsul < PollCondition
      attr_accessor :file
      def initialize
        super
        self.setupdiplomat
      end
      def setupdiplomat
        ::Diplomat.configure do |config|
          config.url = CONSUL["url"]
          config.options = CONSUL["opts"]
        end
      end
      def prepare
        @timeline = Timeline.new 2
      end

      def reset
        @timeline.clear
      end
      def valid?
        valid = true
        valid &= complain("Attribute 'file' must be specified", self) if self.file.nil?
        valid
      end
      #如果 true 重启 , false skip
      def test
        data = ::Diplomat::Kv.get(self.file)
        @timeline.push data
        p @timeline.length
        a = @timeline.all? do |x|
          x == data
        end
        !a
      end
    end
  end
end


God.watch do |w|

  w.name = "sidekiq"
  w.dir = RAILS_ROOT
  w.env = { 'RAILS_ROOT' => "#{RAILS_ROOT}", 'RAILS_ENV' => "production" }
  w.pid_file = File.join(RAILS_ROOT, "tmp/pids/sidekiq.pid")
  w.start = "bundle exec sidekiq  -P #{RAILS_ROOT}/tmp/pids/sidekiq.pid -d"
  #w.stop =  "kill -9 `cat #{RAILS_ROOT}/tmp/pids/sidekiq.pid`"
  #w.restart = "kill -9 `cat #{RAILS_ROOT}/tmp/pids/sidekiq.pid` ; bundle exec rails restart -P #{RAILS_ROOT}/tmp/pids/sidekiq.pid"
  w.keepalive
  w.restart_if do |restart|
    restart.condition(:awifi_consul) do |c|
      c.interval = 5.seconds
      c.file = "devops/automationtesting-backend"
    end
  end


end


```

### 启动方式

 - bundle exec  god -c sidekiq.god
> god 默认后台启动
 
 - bundle exec  god restart -c sidekiq.god 
> 配置pid文件,不需要重新写restart脚本


## controller heartbeat 实现




### rails 心跳日志实现



#### rails agent  每3秒钟 同步一次 hearheat


```ruby
def agent_env
  JSON.load(Diplomat::Kv.get("devops/automationtesting-backend-agent"))["env"]
end

def agent_threads
  threads = TestWorker.class_variable_get :@@awifi_test_threads
  threaddata = []
  threads.each do |thread|
    threaddata << { name: thread[:name], idle: thread[:idle] }
  end
end

class RemoteSync
  def self.sync
    t = Thread.new do
      loop do
        begin
          data = Api::NodeController.info
          node = Node.new data
          node.sync
          sleep 1
        rescue => e
          sleep 1
          Rails.logger.info "sync node info failed  #{e.backtrace}"
        end
      end
    end
    #at_exit do
    #  Rails.logger.info "stop sync thread "
    #  t.kill
    #end
  end
end

if defined?(Rails::Server)
  Rails.logger.info "sync node to remote master  info only on server node"
  RemoteSync.sync
end


```


#### rails controller 记录同步信息到redis




#### rails controller  listen redis  key expire event


```ruby
Rails.logger.info "server mode needs a thread to watch agent node online or not"

def monitor_redis_expirekey
  redis = V3::CaseNodesController.node_redis
  redis.config :set, "notify-keyspace-events", "Ex"
  client = redis.instance_variable_get "@client"
  Rails.logger.info "db xxxxxxxx  #{client.db}"
  redis.psubscribe("__keyevent@#{client.db}__:expired") do |on|
    on.pmessage do |pattern, channel, key|
      # add to do stuff if needed
      if key.match /xxx___(.*)___xxx/
        Rails.logger.info " #{$1} node expire "
        V3::CaseReport.where(:status => "RUNNING").where(:agent_node_ip => $1).find_each do |report|
          report.update status: "ERROR", exec_status: "ERROR"
          report.report_consoles.create! message: "执行中断", status: "ERROR", detail: "master 检查 #{$1} offline ", finish: true
        end

        V3::ProjectDeploy.where(:status => "pending").where(:agent_node_ip => $1).find_each do |deploy|
          deploy.update status: "failed"
          deploy.consoles.create! message: "部署中断", status: "ERROR", detail: "master 检查 #{$1} offline ", finish: true
        end
      end
    end
  end
end

if defined?(Rails::Server)
  Thread.new do
    Rails.logger.info "expire key"
    monitor_redis_expirekey
  end
end


```

#### 配置rails log ,不显示 sync data

- gem 'silencer'


```ruby
require 'silencer/logger'

Rails.application.configure do
  config.middleware.swap(
    Rails::Rack::Logger, 
    Silencer::Logger, 
    config.log_tags,
    get: [%r{^/api/health$}],
    post: [%r{^/api/v3/case_nodes$}]
  )
end

```



