---
title: openstack stein 高可用安装(glance)
date: 2020-05-20 17:02:58
author: 相飞
comments:
- true
tags:
- openstack
categories:
- openstack


---


## controller01

### 初始化数据库


```bash
[root@controller01 ~]# mysql -u root 
Welcome to the MariaDB monitor.  Commands end with ; or \g.
Your MariaDB connection id is 20
Server version: 10.3.10-MariaDB MariaDB Server

Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

MariaDB [(none)]>  CREATE DATABASE glance;
Query OK, 1 row affected (0.006 sec)

MariaDB [(none)]>  GRANT ALL PRIVILEGES ON glance.* TO 'glance'@'localhost' IDENTIFIED BY 'glance';
Query OK, 0 rows affected (0.006 sec)

MariaDB [(none)]> GRANT ALL PRIVILEGES ON glance.* TO 'glance'@'%' IDENTIFIED BY 'glance';
Query OK, 0 rows affected (0.006 sec)

MariaDB [(none)]> 


```

### 创建 服务认证

```bash
# enter glance for password
[root@controller01 ~]# source adminrc 
[root@controller01 ~]# openstack user create --domain default --password-prompt glance
User Password:
Repeat User Password:
+---------------------+----------------------------------+
| Field               | Value                            |
+---------------------+----------------------------------+
| domain_id           | default                          |
| enabled             | True                             |
| id                  | da19f706c9fa4393ae68f91d6f58edf4 |
| name                | glance                           |
| options             | {}                               |
| password_expires_at | None                             |
+---------------------+----------------------------------+
[root@controller01 ~]# 

[root@controller01 ~]#  openstack project create service
[root@controller01 ~]#  openstack role add --project service --user glance admin 
No project with a name or ID of 'service' exists.
#  如果不存在 project service 需要手动创建


[root@controller01 ~]# openstack service create --name glance \
>   --description "OpenStack Image" image
+-------------+----------------------------------+
| Field       | Value                            |
+-------------+----------------------------------+
| description | OpenStack Image                  |
| enabled     | True                             |
| id          | ebf8aaebb6b8477caceb2b904ea7a966 |
| name        | glance                           |
| type        | image                            |
+-------------+----------------------------------+
[root@controller01 ~]# openstack endpoint create --region RegionOne \
>   image public http://controller:9292
+--------------+----------------------------------+
| Field        | Value                            |
+--------------+----------------------------------+
| enabled      | True                             |
| id           | e4e8bc80055e4b65bd27f35d026762af |
| interface    | public                           |
| region       | RegionOne                        |
| region_id    | RegionOne                        |
| service_id   | ebf8aaebb6b8477caceb2b904ea7a966 |
| service_name | glance                           |
| service_type | image                            |
| url          | http://controller:9292           |
+--------------+----------------------------------+
[root@controller01 ~]#  openstack endpoint create --region RegionOne \
>   image internal http://controller:9292

+--------------+----------------------------------+
| Field        | Value                            |
+--------------+----------------------------------+
| enabled      | True                             |
| id           | 0fcc8b28920c40ee94250f3f6db6df68 |
| interface    | internal                         |
| region       | RegionOne                        |
| region_id    | RegionOne                        |
| service_id   | ebf8aaebb6b8477caceb2b904ea7a966 |
| service_name | glance                           |
| service_type | image                            |
| url          | http://controller:9292           |
+--------------+----------------------------------+
[root@controller01 ~]# 
[root@controller01 ~]# openstack endpoint create --region RegionOne \
>   image admin http://controller:9292
+--------------+----------------------------------+
| Field        | Value                            |
+--------------+----------------------------------+
| enabled      | True                             |
| id           | 69ed03fee23b48eab6c6b10dc8e31226 |
| interface    | admin                            |
| region       | RegionOne                        |
| region_id    | RegionOne                        |
| service_id   | ebf8aaebb6b8477caceb2b904ea7a966 |
| service_name | glance                           |
| service_type | image                            |
| url          | http://controller:9292           |
+--------------+----------------------------------+


```

### glance 安装



```bash
[root@controller01 ~]# yum install openstack-glance -y

```

### 修改配置文件 I
  __/etc/glance/glance-api.conf__


```bash
[database]
# ...
connection = mysql+pymysql://glance:glance@controller/glance

# ...
www_authenticate_uri  = http://controller:5000
auth_url = http://controller:5000
memcached_servers = controller01:11211,controller02:11211,controller03:11211
auth_type = password
project_domain_name = Default
user_domain_name = Default
project_name = service
username = glance
password = glance


[paste_deploy]
# ...
flavor = keystone


[glance_store]
# ...
stores = file,http
default_store = file
filesystem_store_datadir = /var/lib/glance/images/



```

### 修改配置文件 II
  __/etc/glance/glance-registry.conf__


```bash
[database]
# ...
connection = mysql+pymysql://glance:glance@controller/glance


[keystone_authtoken]
# ...
www_authenticate_uri = http://controller:5000
auth_url = http://controller:5000
memcached_servers = controller01:11211,controller02:11211,controller03:11211
auth_type = password
project_domain_name = Default
user_domain_name = Default
project_name = service
username = glance
password = glance

[paste_deploy]
# ...
flavor = keystone

```

### 同步数据
```bash
[root@controller01 ~]# su -s /bin/sh -c "glance-manage db_sync" glance


```

### 启动


```bash

[root@controller01 ~]# systemctl enable openstack-glance-api.service \
>   openstack-glance-registry.service
Created symlink from /etc/systemd/system/multi-user.target.wants/openstack-glance-api.service to /usr/lib/systemd/system/openstack-glance-api.service.
Created symlink from /etc/systemd/system/multi-user.target.wants/openstack-glance-registry.service to /usr/lib/systemd/system/openstack-glance-registry.service.
[root@controller01 ~]# systemctl start openstack-glance-api.service \
>   openstack-glance-registry.service

```


## controller02  controller03

### glance 安装



```bash
[root@controller01 ~]# yum install openstack-glance -y

```

### 修改配置文件 I
  __/etc/glance/glance-api.conf__


```bash
[database]
# ...
connection = mysql+pymysql://glance:glance@controller/glance

# ...
www_authenticate_uri  = http://controller:5000
auth_url = http://controller:5000
memcached_servers = controller01:11211,controller02:11211,controller03:11211
auth_type = password
project_domain_name = Default
user_domain_name = Default
project_name = service
username = glance
password = glance


[paste_deploy]
# ...
flavor = keystone


[glance_store]
# ...
stores = file,http
default_store = file
filesystem_store_datadir = /var/lib/glance/images/



```

### 修改配置文件 II
  __/etc/glance/glance-registry.conf__


```bash
[database]
# ...
connection = mysql+pymysql://glance:glance@controller/glance


[keystone_authtoken]
# ...
www_authenticate_uri = http://controller:5000
auth_url = http://controller:5000
memcached_servers = controller01:11211,controller02:11211,controller03:11211
auth_type = password
project_domain_name = Default
user_domain_name = Default
project_name = service
username = glance
password = glance

[paste_deploy]
# ...
flavor = keystone

```

### 启动


```bash

[root@controller01 ~]# systemctl enable openstack-glance-api.service \
>   openstack-glance-registry.service
Created symlink from /etc/systemd/system/multi-user.target.wants/openstack-glance-api.service to /usr/lib/systemd/system/openstack-glance-api.service.
Created symlink from /etc/systemd/system/multi-user.target.wants/openstack-glance-registry.service to /usr/lib/systemd/system/openstack-glance-registry.service.
[root@controller01 ~]# systemctl start openstack-glance-api.service \
>   openstack-glance-registry.service

```


## vip 测试


```bash
# 准备upload image 
[root@controller01 ~]# openstack image create "cirros"   --file cirros-0.5.1-x86_64-disk.img    --disk-format qcow2  --container-format bare  --public  

[root@controller01 ~]# openstack image list
+--------------------------------------+--------+--------+
| ID                                   | Name   | Status |
+--------------------------------------+--------+--------+
| aa06441f-024b-46ef-96c7-d7a9b6459363 | cirros | active |
+--------------------------------------+--------+--------+

# 本地存储

[root@controller01 ~]# ll /var/lib/glance/images/
total 15956
-rw-r----- 1 glance glance 16338944 May 20 18:15 aa06441f-024b-46ef-96c7-d7a9b6459363


#切换vip

[root@controller02 ~]#  ip address add   192.168.151.170/24 dev  ens37
[root@controller01 ~]#  ip address delete   192.168.151.170/24 dev  ens37

[root@controller01 ~]# openstack image create "cirros-2"   --file cirros-0.5.1-x86_64-disk.img    --disk-format qcow2  --container-format bare  --public  


[root@controller01 ~]# openstack image list
+--------------------------------------+----------+--------+
| ID                                   | Name     | Status |
+--------------------------------------+----------+--------+
| aa06441f-024b-46ef-96c7-d7a9b6459363 | cirros   | active |
| 6c8e4250-ead4-42b9-ba92-e8210df2c65a | cirros-2 | active |
+--------------------------------------+----------+--------+

[root@controller02 ~]# ll /var/lib/glance/images/
total 15956
-rw-r----- 1 glance glance 16338944 May 20 18:18 6c8e4250-ead4-42b9-ba92-e8210df2c65a

# image上传到了controller02


```

## 高可用
- 存储
  - ceph ,共享disk, rsync都可以实现
- 数据
  - 数据库已经实现

> controller02 controller03 不需要创建服务,初始化数据 ,其他和controller01 一致
