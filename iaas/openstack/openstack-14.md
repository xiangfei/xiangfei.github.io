---
title: openstack ussuri centos8 高可用安装 Mysql galera cluster
date: 2020-07-17 10:45:21
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


## 准备 管理网段
- 10.10.102.191 controller1
- 10.10.102.192 controller2
- 10.10.102.193 controller3


### 在控制节点运行




- 安装mariadb all node


```
[root@cotroller01 yum.repos.d]# yum install mariadb-server mariadb galera xinetd rsync lsof -y
[root@cotroller01 yum.repos.d]# yum -y install  python3-PyMySQL
```

- 安装galera server
 - only controller 01

```bash
[root@cotroller01 yum.repos.d]# yum -y install mariadb-galera-server
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
wsrep_cluster_address="gcomm://10.10.102.191,10.10.102.192,10.10.102.193"
wsrep_node_name= controller01
wsrep_node_address=10.10.102.191
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

## 安装错误

> 需要关闭防火墙

```
2020-07-17 15:42:27 0 [Warning] WSREP: Could not open state file for reading: '/var/lib/mysql//grastate.dat'
2020-07-17 15:42:27 0 [Note] WSREP: Found saved state: 00000000-0000-0000-0000-000000000000:-1, safe_to_bootstrap: 1
2020-07-17 15:42:40 0 [Note] WSREP: (0fb5fb12, 'tcp://0.0.0.0:4567') connection to peer 00000000 with addr tcp://10.10.102.91:4567 timed out, no messages seen in PT3S
2020-07-17 15:42:43 0 [Note] WSREP: (0fb5fb12, 'tcp://0.0.0.0:4567') connection to peer 00000000 with addr tcp://10.10.102.92:4567 timed out, no messages seen in PT3S
2020-07-17 15:42:49 0 [Note] WSREP: (0fb5fb12, 'tcp://0.0.0.0:4567') connection to peer 00000000 with addr tcp://10.10.102.92:4567 timed out, no messages seen in PT3S
2020-07-17 15:42:56 0 [Note] WSREP: (0fb5fb12, 'tcp://0.0.0.0:4567') connection to peer 00000000 with addr tcp://10.10.102.92:4567 timed out, no messages seen in PT3S
2020-07-17 15:42:59 0 [Note] WSREP: (0fb5fb12, 'tcp://0.0.0.0:4567') connection to peer 00000000 with addr tcp://10.10.102.91:4567 timed out, no messages seen in PT3S
2020-07-17 15:43:00 0 [Note] WSREP: view((empty))
2020-07-17 15:43:00 0 [ERROR] WSREP: failed to open gcomm backend connection: 110: failed to reach primary view: 110 (Connection timed out)
         at gcomm/src/pc.cpp:connect():158

```
> 安装lsof


```bash
2020-07-17 15:50:48 0 [Note] WSREP: Running: 'wsrep_sst_rsync --role 'joiner' --address '10.10.102.192' --datadir '/var/lib/mysql/'   --parent '8896'  ''  '''
2020-07-17 15:50:48 0 [ERROR] WSREP: Failed to read 'ready <addr>' from: wsrep_sst_rsync --role 'joiner' --address '10.10.102.192' --datadir '/var/lib/mysql/'   --parent '8896'  ''  ''
        Read: ''lsof' not found in PATH'
2020-07-17 15:50:48 0 [ERROR] WSREP: Process completed with error: wsrep_sst_rsync --role 'joiner' --address '10.10.102.192' --datadir '/var/lib/mysql/'   --parent '8896'  ''  '': 2 (No such file or directory)
2020-07-17 15:50:48 2 [ERROR] WSREP: Failed to prepare for 'rsync' SST. Unrecoverable.
2020-07-17 15:50:48 2 [ERROR] Aborting


```



