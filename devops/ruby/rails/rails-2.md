---
title: rails consul 微服务(服务发现 , 负载均衡)
date: 2020-02-24 09:35:40
tags: rails
author: 相飞
comments:
- true
categories:
- rails
---


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

