---
title: sidekiq karafka  微服务(consul)
date: 2020-04-09 15:19:10
author: 相飞
comments:
- true
categories:
- rails


---


#### sidekiq

 - 官方没有实现的方法
  - k8s 直接重启容器
  - 虚拟器 重启应用

#### 虚拟机重启的方式 GOD
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

#### 启动方式

 - bundle exec  god -c sidekiq.god
> god 默认后台启动
 
 - bundle exec  god restart -c sidekiq.god 
> 配置pid文件,不需要重新写restart脚本






