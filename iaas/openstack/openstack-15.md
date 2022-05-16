---
title: openstack ussuri centos8 高可用安装 rabbitmq cluster
date: 2020-07-17 16:00:59
author: 相飞
comments:
- true
tags:
- openstack
- centos8
categories:
- openstack
- centos8


---





### all  controller nodes

```
[root@controller03 ~]#  yum install rabbitmq-server -y
[root@controller03 ~]#  systemctl enable rabbitmq-server.service

```

###  controller01 执行

```
[root@controller01 ~]# service rabbitmq-server start   # 启动完成生成文件 /var/lib/rabbitmq/.erlang.cookie
# copy文件到controller02 , controller03

[root@controller01 ~]# scp /var/lib/rabbitmq/.erlang.cookie root@controller03:/var/lib/rabbitmq/.erlang.cookie

```



# controller02 ,controller03 执行
- 修改文件权限 

```
[root@controller02 ~]# chown rabbitmq:rabbitmq /var/lib/rabbitmq/.erlang.cookie
[root@controller02 ~]# chmod 400 /var/lib/rabbitmq/.erlang.cookie


# controller02 , controller03  执行
## 启动rabbitmq-server
[root@controller03 ~]# systemctl start rabbitmq-server.service
[root@controller03 ~]# rabbitmqctl stop_app
[root@controller03 ~]#  rabbitmqctl join_cluster --ram rabbit@controller01


```


### 检查


```bash
[root@controller01 ~]# rabbitmqctl cluster_status
[root@controller01 ~]# rabbitmqctl cluster_status
Cluster status of node rabbit@controller01 ...
Basics

Cluster name: rabbit@controller01

Disk Nodes

rabbit@controller01

RAM Nodes

rabbit@controller02
rabbit@controller03

Running Nodes

rabbit@controller01
rabbit@controller02
rabbit@controller03

Versions

rabbit@controller01: RabbitMQ 3.8.3 on Erlang 22.3.4.1
rabbit@controller02: RabbitMQ 3.8.3 on Erlang 22.3.4.1
rabbit@controller03: RabbitMQ 3.8.3 on Erlang 22.3.4.1

Alarms

(none)

Network Partitions

(none)

Listeners

Node: rabbit@controller01, interface: [::], port: 25672, protocol: clustering, purpose: inter-node and CLI tool communication
Node: rabbit@controller01, interface: [::], port: 5672, protocol: amqp, purpose: AMQP 0-9-1 and AMQP 1.0
Node: rabbit@controller02, interface: [::], port: 25672, protocol: clustering, purpose: inter-node and CLI tool communication
Node: rabbit@controller02, interface: [::], port: 5672, protocol: amqp, purpose: AMQP 0-9-1 and AMQP 1.0
Node: rabbit@controller03, interface: [::], port: 25672, protocol: clustering, purpose: inter-node and CLI tool communication
Node: rabbit@controller03, interface: [::], port: 5672, protocol: amqp, purpose: AMQP 0-9-1 and AMQP 1.0

Feature flags

Flag: implicit_default_bindings, state: enabled
Flag: quorum_queue, state: enabled
Flag: virtual_host_metadata, state: enabled



## 以后service  rabbitmq-server restart
```

### 创建用户,配置权限


```
[root@controller01 ~]#  rabbitmqctl add_user openstack openstack
Creating user "openstack"
[root@controller01 ~]# rabbitmqctl set_permissions openstack ".*" ".*" ".*"
Setting permissions for user "openstack" in vhost "/"


```

