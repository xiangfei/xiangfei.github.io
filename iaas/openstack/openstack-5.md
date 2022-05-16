---
title:  openstack stein 高可用安装(mariadb  rabbitmq , memcached  , chronyd , etcd)
date: 2020-05-20 14:19:29
author: 相飞
comments:
- true
tags:
- openstack
categories:
- openstack

---


## mariadb galera 安装

### controller node 执行

```bash
# controller01 
[root@controller01 ~]# yum install mariadb mariadb-server python2-PyMySQL  galera mariadb-galera-server rsync   -y
# controller02 , controller03
[root@controller03 ~]# yum install mariadb mariadb-server python2-PyMySQL  galera  rsync  -y


```


### 修改配置文件(all node)

```bash


#controller01

[root@controller01 ~]# vim /etc/my.cnf.d/mariadb-server.cnf 
[galera]
# Mandatory settings
#wsrep_on=ON
#wsrep_provider=
#wsrep_cluster_address=
#binlog_format=row
#default_storage_engine=InnoDB
#innodb_autoinc_lock_mode=2
#
# Allow server to accept connections on all interfaces.
#
#bind-address=0.0.0.0
#
# Optional setting
#wsrep_slave_threads=1
#innodb_flush_log_at_trx_commit=0
wsrep_on=ON
wsrep_provider=/usr/lib64/galera/libgalera_smm.so
wsrep_cluster_address="gcomm://192.168.151.71,192.168.151.72,192.168.151.73"
wsrep_node_name= controller01
wsrep_node_address=192.168.151.71
binlog_format=row
default_storage_engine=InnoDB
innodb_autoinc_lock_mode=2
wsrep_slave_threads=1
innodb_flush_log_at_trx_commit=0
innodb_buffer_pool_size=120M
wsrep_sst_method=rsync
wsrep_causal_reads=ON


#controller02 ,controller03  
copy 内容 修改 wsrep_node_name , wsrep_node_address

```


### 启动

```bash

#controller01  ,第一次启动
[root@controller01 ~]# galera_new_cluster  #或者 /usr/libexec/mysqld  --wsrep-new-cluster --user=mysql
# controller01 , 第二次启动
###[root@controller01 ~]# service mariadb start

#controller02 , controller03
[root@controller02 ~]# service mariadb start

# all node

[root@controller02 ~]# systemctl enable mariadb


```


### 测试


```bash

#controller01
Query OK, 1 row affected (0.006 sec)

MariaDB [(none)]> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| sss                |
| vvv                |
+--------------------+
5 rows in set (0.002 sec)

#controller02 , controller03


Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

MariaDB [(none)]> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| sss                |
| vvv                |
+--------------------+
5 rows in set (0.002 sec)

MariaDB [(none)]> exit
Bye


```


## rabbitmq 安装



```bash
# all  controller nodes
[root@controller03 ~]#  yum install rabbitmq-server -y
[root@controller03 ~]#  systemctl enable rabbitmq-server.service

# controller01 执行

[root@controller01 ~]# service rabbitmq-server start   # 启动完成生成文件 /var/lib/rabbitmq/.erlang.cookie

# copy文件到controller02 , controller03

[root@controller01 ~]# scp /var/lib/rabbitmq/.erlang.cookie root@controller03:/var/lib/rabbitmq/.erlang.cookie

# 修改文件权限 controller02 ,controller03

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
Cluster status of node rabbit@controller01
[{nodes,[{disc,[rabbit@controller01]},
         {ram,[rabbit@controller03,rabbit@controller02]}]},
 {running_nodes,[rabbit@controller01]},
 {cluster_name,<<"rabbit@controller01">>},
 {partitions,[]},
 {alarms,[{rabbit@controller01,[]}]}]



## 以后service  rabbitmq-server restart
```

### 创建用户,配置权限


```
[root@controller01 ~]#  rabbitmqctl add_user openstack openstack
Creating user "openstack"
[root@controller01 ~]# rabbitmqctl set_permissions openstack ".*" ".*" ".*"
Setting permissions for user "openstack" in vhost "/"


```


## memach 安装


```bash
## all nodes执行
[root@controller02 ~]# yum install memcached python-memcached -y
[root@controller02 ~]# systemctl enable memcached.service


## 修改配置文件

[root@controller02 ~]# cat   /etc/sysconfig/memcached
PORT="11211"
USER="memcached"
MAXCONN="1024"
CACHESIZE="64"
OPTIONS="-l 127.0.0.1,::1,controller02"

## 不同机器监听不同的hostname

## 启动
[root@controller02 ~]# systemctl start memcached.service
```



## ntp 服务器

```bash
# all nodes include compute nodes
[root@controller03 ~]#  yum install chrony -y
[root@controller03 ~]# systemctl enable chronyd.service
[root@controller03 ~]# vim /etc/chrony.conf 
#server 0.centos.pool.ntp.org iburst
#server 1.centos.pool.ntp.org iburst
#server 2.centos.pool.ntp.org iburst
#server 3.centos.pool.ntp.org iburst

server ntp1.aliyun.com  iburst
server ntp2.aliyun.com  iburst

[root@controller03 ~]# systemctl start chronyd.service

```


## etcd 

```bash
#没用到, 先不安装。等出错在<处理

```
