---
title: rails  controller heartbeat 实现
date: 2020-07-13 08:59:25
tags: rails
author: 相飞
comments:
- true
categories:
- rails

---


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



