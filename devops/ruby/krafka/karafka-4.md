---
title: karafka 集群配置
date: 2020-03-20 14:06:51
author: 相飞
comments:
- true
categories:
- karafka


---


## ruby  zookeeper 配置


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

