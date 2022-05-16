---
title: rails consul 微服务(register service check)
date: 2020-02-24 09:25:37
tags: rails
author: 相飞
comments:
- true
categories:
- rails
---

### 说明

- 可以在每一天机器安装  consul client, 然后通过脚本去watch
  - 需要在每一台机器安装consul client
- 直接在代码watch service
  - 经过实践证明, 不存在性能瓶颈
- 本文通过在代码watch service 实现


### 服务注册 , 健康检查

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
