---
title: openstack ussuri centos8 高可用安装 glance
date: 2020-07-20 09:15:28
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



## controller01 

### 环境准备

#### 初始化数据库


```
[root@controller01 ~]# mysql -u root
Welcome to the MariaDB monitor.  Commands end with ; or \g.
Your MariaDB connection id is 17
Server version: 10.3.17-MariaDB MariaDB Server

Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

MariaDB [(none)]> CREATE DATABASE glance;
Query OK, 1 row affected (0.082 sec)

MariaDB [(none)]> GRANT ALL PRIVILEGES ON glance.* TO 'glance'@'localhost' IDENTIFIED BY 'glance';
Query OK, 0 rows affected (0.053 sec)

MariaDB [(none)]> GRANT ALL PRIVILEGES ON glance.* TO 'glance'@'%' IDENTIFIED BY 'glance';
Query OK, 0 rows affected (0.046 sec)

MariaDB [(none)]> 

```

#### create project


```
[root@controller01 ~]# source openrc 
[root@controller01 ~]# openstack project create service
+-------------+----------------------------------+
| Field       | Value                            |
+-------------+----------------------------------+
| description |                                  |
| domain_id   | default                          |
| enabled     | True                             |
| id          | acd60c0b03784f07a3c3a9b36b4b0515 |
| is_domain   | False                            |
| name        | service                          |
| options     | {}                               |
| parent_id   | default                          |
| tags        | []                               |
+-------------+----------------------------------+


```

#### create user



```
[root@controller01 ~]# openstack user create --domain default --password-prompt glance
User Password:
Repeat User Password:
+---------------------+----------------------------------+
| Field               | Value                            |
+---------------------+----------------------------------+
| domain_id           | default                          |
| enabled             | True                             |
| id                  | 9130a16d1c054d4398d92903c448b0a1 |
| name                | glance                           |
| options             | {}                               |
| password_expires_at | None                             |
+---------------------+----------------------------------+
[root@controller01 ~]# 

# set default user glance

```

#### Add the admin role to the glance user and service project

```
[root@controller01 ~]# openstack role add --project service --user glance admin
[root@controller01 ~]# 

```

####  Create the glance service entity:


```
[root@controller01 ~]# openstack service create --name glance  --description "OpenStack Image" image
+-------------+----------------------------------+
| Field       | Value                            |
+-------------+----------------------------------+
| description | OpenStack Image                  |
| enabled     | True                             |
| id          | 15091ede7e0e48e7ba8af5f3c7d99c34 |
| name        | glance                           |
| type        | image                            |
+-------------+----------------------------------+
[root@controller01 ~]# 

```

#### Create the Image service API endpoints


```
[root@controller01 ~]# openstack endpoint create --region RegionOne image public http://controller:9292
+--------------+----------------------------------+
| Field        | Value                            |
+--------------+----------------------------------+
| enabled      | True                             |
| id           | 0c14e0bee5f54753a2ce7a72250ce628 |
| interface    | public                           |
| region       | RegionOne                        |
| region_id    | RegionOne                        |
| service_id   | 15091ede7e0e48e7ba8af5f3c7d99c34 |
| service_name | glance                           |
| service_type | image                            |
| url          | http://controller:9292           |
+--------------+----------------------------------+
[root@controller01 ~]# openstack endpoint create --region RegionOne image internal http://controller:9292
+--------------+----------------------------------+
| Field        | Value                            |
+--------------+----------------------------------+
| enabled      | True                             |
| id           | d520f35f49e34ca2add11059ca63687a |
| interface    | internal                         |
| region       | RegionOne                        |
| region_id    | RegionOne                        |
| service_id   | 15091ede7e0e48e7ba8af5f3c7d99c34 |
| service_name | glance                           |
| service_type | image                            |
| url          | http://controller:9292           |
+--------------+----------------------------------+
[root@controller01 ~]# openstack endpoint create --region RegionOne  image admin http://controller:9292
+--------------+----------------------------------+
| Field        | Value                            |
+--------------+----------------------------------+
| enabled      | True                             |
| id           | a9fe6e376f5746c09b4be06ca8cfa7d2 |
| interface    | admin                            |
| region       | RegionOne                        |
| region_id    | RegionOne                        |
| service_id   | 15091ede7e0e48e7ba8af5f3c7d99c34 |
| service_name | glance                           |
| service_type | image                            |
| url          | http://controller:9292           |
+--------------+----------------------------------+


#### admin internal  public 

```


> centos rdo 安装 cli 缺少创建项目



### 安装glance 


#### Install the packages

```
[root@controller02 ~]# yum install openstack-glance -y

```



#### Edit the /etc/glance/glance-api.conf 

```
[database]
connection = mysql+pymysql://glance:glance@controller/glance


[keystone_authtoken]
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
flavor = keystone


[glance_store]
stores = file,http
default_store = file
filesystem_store_datadir = /var/lib/glance/images/


```


#### Populate the Image service database:

```
[root@controller01 ~]# su -s /bin/sh -c "glance-manage db_sync" glance
INFO  [alembic.runtime.migration] Context impl MySQLImpl.
INFO  [alembic.runtime.migration] Will assume non-transactional DDL.
INFO  [alembic.runtime.migration] Running upgrade  -> liberty, liberty initial
INFO  [alembic.runtime.migration] Running upgrade liberty -> mitaka01, add index on created_at and updated_at columns of 'images' table
INFO  [alembic.runtime.migration] Running upgrade mitaka01 -> mitaka02, update metadef os_nova_server
INFO  [alembic.runtime.migration] Running upgrade mitaka02 -> ocata_expand01, add visibility to images
INFO  [alembic.runtime.migration] Running upgrade ocata_expand01 -> pike_expand01, empty expand for symmetry with pike_contract01
INFO  [alembic.runtime.migration] Running upgrade pike_expand01 -> queens_expand01
INFO  [alembic.runtime.migration] Running upgrade queens_expand01 -> rocky_expand01, add os_hidden column to images table
INFO  [alembic.runtime.migration] Running upgrade rocky_expand01 -> rocky_expand02, add os_hash_algo and os_hash_value columns to images table
INFO  [alembic.runtime.migration] Running upgrade rocky_expand02 -> train_expand01, empty expand for symmetry with train_contract01
INFO  [alembic.runtime.migration] Running upgrade train_expand01 -> ussuri_expand01, empty expand for symmetry with ussuri_expand01
INFO  [alembic.runtime.migration] Context impl MySQLImpl.
INFO  [alembic.runtime.migration] Will assume non-transactional DDL.
Upgraded database to: ussuri_expand01, current revision(s): ussuri_expand01
INFO  [alembic.runtime.migration] Context impl MySQLImpl.
INFO  [alembic.runtime.migration] Will assume non-transactional DDL.
INFO  [alembic.runtime.migration] Context impl MySQLImpl.
INFO  [alembic.runtime.migration] Will assume non-transactional DDL.
Database migration is up to date. No migration needed.
INFO  [alembic.runtime.migration] Context impl MySQLImpl.
INFO  [alembic.runtime.migration] Will assume non-transactional DDL.
INFO  [alembic.runtime.migration] Context impl MySQLImpl.
INFO  [alembic.runtime.migration] Will assume non-transactional DDL.
INFO  [alembic.runtime.migration] Running upgrade mitaka02 -> ocata_contract01, remove is_public from images
INFO  [alembic.runtime.migration] Running upgrade ocata_contract01 -> pike_contract01, drop glare artifacts tables
INFO  [alembic.runtime.migration] Running upgrade pike_contract01 -> queens_contract01
INFO  [alembic.runtime.migration] Running upgrade queens_contract01 -> rocky_contract01
INFO  [alembic.runtime.migration] Running upgrade rocky_contract01 -> rocky_contract02
INFO  [alembic.runtime.migration] Running upgrade rocky_contract02 -> train_contract01
INFO  [alembic.runtime.migration] Running upgrade train_contract01 -> ussuri_contract01
INFO  [alembic.runtime.migration] Context impl MySQLImpl.
INFO  [alembic.runtime.migration] Will assume non-transactional DDL.
Upgraded database to: ussuri_contract01, current revision(s): ussuri_contract01
INFO  [alembic.runtime.migration] Context impl MySQLImpl.
INFO  [alembic.runtime.migration] Will assume non-transactional DDL.
Database is synced successfully.


```


####  start

```
[root@controller01 ~]#  systemctl enable openstack-glance-api.service
Created symlink /etc/systemd/system/multi-user.target.wants/openstack-glance-api.service → /usr/lib/systemd/system/openstack-glance-api.service.
[root@controller01 ~]# systemctl start openstack-glance-api.service
[root@controller01 ~]# 


```
