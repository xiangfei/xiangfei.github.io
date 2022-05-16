---
title: openstack stein 高可用安装(placement)
date: 2020-05-21 08:34:50
author: 相飞
comments:
- true
tags:
- openstack
categories:
- openstack

---


## controller01 


### 创建数据库


```bash
[root@controller01 ~]# mysql
Welcome to the MariaDB monitor.  Commands end with ; or \g.
Your MariaDB connection id is 51
Server version: 10.3.10-MariaDB MariaDB Server

Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

MariaDB [(none)]>  CREATE DATABASE placement;
Query OK, 1 row affected (0.005 sec)

MariaDB [(none)]> GRANT ALL PRIVILEGES ON placement.* TO 'placement'@'localhost'   IDENTIFIED BY 'placement';
Query OK, 0 rows affected (0.007 sec)

MariaDB [(none)]> GRANT ALL PRIVILEGES ON placement.* TO 'placement'@'%' IDENTIFIED BY 'placement';
Query OK, 0 rows affected (0.006 sec)

MariaDB [(none)]> 


```

### 创建用户, endpoint ,service

```bash


[root@controller01 ~]# source openrc 
# password set placement
[root@controller01 ~]#  openstack user create --domain default --password-prompt placement
User Password:
Repeat User Password:
+---------------------+----------------------------------+
| Field               | Value                            |
+---------------------+----------------------------------+
| domain_id           | default                          |
| enabled             | True                             |
| id                  | 285a363d771349abad2aed6ea040f3c0 |
| name                | placement                        |
| options             | {}                               |
| password_expires_at | None                             |
+---------------------+----------------------------------+
[root@controller01 ~]#  openstack role add --project service --user placement admin
[root@controller01 ~]# openstack service create --name placement \
>   --description "Placement API" placement
+-------------+----------------------------------+
| Field       | Value                            |
+-------------+----------------------------------+
| description | Placement API                    |
| enabled     | True                             |
| id          | 0e02955c810b49339a689a09f9eafd84 |
| name        | placement                        |
| type        | placement                        |
+-------------+----------------------------------+
[root@controller01 ~]# openstack endpoint create --region RegionOne \
>   placement public http://controller:8778
+--------------+----------------------------------+
| Field        | Value                            |
+--------------+----------------------------------+
| enabled      | True                             |
| id           | 7bff99341c014979913882f4180a1fef |
| interface    | public                           |
| region       | RegionOne                        |
| region_id    | RegionOne                        |
| service_id   | 0e02955c810b49339a689a09f9eafd84 |
| service_name | placement                        |
| service_type | placement                        |
| url          | http://controller:8778           |
+--------------+----------------------------------+
[root@controller01 ~]# openstack endpoint create --region RegionOne \
>   placement internal http://controller:8778
+--------------+----------------------------------+
| Field        | Value                            |
+--------------+----------------------------------+
| enabled      | True                             |
| id           | 832d68cbc2464e63a0a9b0e12d03cbc2 |
| interface    | internal                         |
| region       | RegionOne                        |
| region_id    | RegionOne                        |
| service_id   | 0e02955c810b49339a689a09f9eafd84 |
| service_name | placement                        |
| service_type | placement                        |
| url          | http://controller:8778           |
+--------------+----------------------------------+
[root@controller01 ~]# openstack endpoint create --region RegionOne \
>   placement admin http://controller:8778
+--------------+----------------------------------+
| Field        | Value                            |
+--------------+----------------------------------+
| enabled      | True                             |
| id           | fd3295547dc1420297786e92624f94fc |
| interface    | admin                            |
| region       | RegionOne                        |
| region_id    | RegionOne                        |
| service_id   | 0e02955c810b49339a689a09f9eafd84 |
| service_name | placement                        |
| service_type | placement                        |
| url          | http://controller:8778           |
+--------------+----------------------------------+
[root@controller01 ~]# 


```


### 安装placement


```bash
[root@controller01 ~]# yum install openstack-placement-api -y
```


### 修改配置
  __/etc/placement/placement.conf__


```bash
[placement_database]
# ...
connection = mysql+pymysql://placement:placement@controller/placement

[api]
# ...
auth_strategy = keystone

[keystone_authtoken]
# ...
auth_url = http://controller:5000/v3
memcached_servers = controller01:11211,controller02:11211,controller03:11211
auth_type = password
project_domain_name = Default
user_domain_name = Default
project_name = service
username = placement
password = placement


```

### 同步数据

```bash
[root@controller01 ~]# su -s /bin/sh -c "placement-manage db sync" placement

```

### 重启httpd

```bash
[root@controller01 ~]# systemctl restart httpd
```

## controller02 , controller03


### 安装placement

```bash

[root@controller01 ~]# yum install openstack-placement-api -y

```





### 修改配置

  __/etc/placement/placement.conf__


```bash

[placement_database]

# ...

connection = mysql+pymysql://placement:placement@controller/placement



[api]

# ...

auth_strategy = keystone



[keystone_authtoken]

# ...

auth_url = http://controller:5000/v3

memcached_servers = controller01:11211,controller02:11211,controller03:11211

auth_type = password

project_domain_name = Default

user_domain_name = Default

project_name = service

username = placement

password = placement



```



### 重启httpd



```bash

[root@controller01 ~]# systemctl restart httpd

```





## vip 



> controller02, controller 03 不需要创建service , endpoint , db .其他的和controller01 一致



## eror

- AH01630: client denied by server configuration: /usr/bin/placement-api


```bash

# 增加directory 
[root@controller01 ~]# vim /etc/httpd/conf.d/00-placement-api.conf 

<VirtualHost *:8778>
  WSGIProcessGroup placement-api
  WSGIApplicationGroup %{GLOBAL}
  WSGIPassAuthorization On
  WSGIDaemonProcess placement-api processes=3 threads=1 user=placement group=placement
  WSGIScriptAlias / /usr/bin/placement-api
  <IfVersion >= 2.4>
    ErrorLogFormat "%M"
  </IfVersion>
  ErrorLog /var/log/placement/placement-api.log
  #SSLEngine On
  #SSLCertificateFile ...
  #SSLCertificateKeyFile ...

  <Directory /usr/bin>
    <IfVersion >= 2.4>
        Require all granted
    </IfVersion>
    <IfVersion < 2.4>
        Order allow,deny
        Allow from all
    </IfVersion>
  </Directory>

</VirtualHost>




```
