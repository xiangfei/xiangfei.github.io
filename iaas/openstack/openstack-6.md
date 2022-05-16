---
title: openstack stein 高可用安装(keystone)
date: 2020-05-20 16:17:02
author: 相飞
comments:
- true
tags:
- openstack
categories:
- openstack

---


## controller01 执行

### 创建vip 只是用来测试,haproxy pcs 需要以后修改

```bash
[root@controller01 ~]# ip address add 192.168.151.170/24 dev  ens37

``` 


### 数据库准备


```bash
[root@controller01 ~]# mysql 
Welcome to the MariaDB monitor.  Commands end with ; or \g.
Your MariaDB connection id is 11
Server version: 10.3.10-MariaDB MariaDB Server

Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

MariaDB [(none)]>  CREATE DATABASE keystone;
Query OK, 1 row affected (0.006 sec)

MariaDB [(none)]>  GRANT ALL PRIVILEGES ON keystone.* TO 'keystone'@'localhost' IDENTIFIED BY 'keystone';
Query OK, 0 rows affected (0.006 sec)

MariaDB [(none)]> GRANT ALL PRIVILEGES ON keystone.* TO 'keystone'@'%' IDENTIFIED BY 'keystone';
Query OK, 0 rows affected (0.006 sec)

MariaDB [(none)]> 


```


### 安装keystone

```bash
[root@controller01 ~]#  yum install openstack-keystone httpd mod_wsgi
#修改配置
[root@controller01 ~]# vim /etc/keystone/keystone.conf

[database]
# ...
connection = mysql+pymysql://keystone:keystone@controller/keystone
[token]
# ...
provider = fernet

```

### 同步数据

```bash
[root@controller01 ~]#  su -s /bin/sh -c "keystone-manage db_sync" keystone
```

### 初始化key仓库

```bash
[root@controller01 ~]# keystone-manage fernet_setup --keystone-user keystone --keystone-group keystone
[root@controller01 ~]# keystone-manage credential_setup --keystone-user keystone --keystone-group keystone

```

### boot 认证

```bash
[root@controller01 ~]#  keystone-manage bootstrap --bootstrap-password ADMIN_PASS \
>   --bootstrap-admin-url http://controller:5000/v3/ \
>   --bootstrap-internal-url http://controller:5000/v3/ \
>   --bootstrap-public-url http://controller:5000/v3/ \
>   --bootstrap-region-id RegionOne
[root@controller01 ~]# 

```

### 配置apache 服务器

```bash
[root@controller01 ~]# vim  /etc/httpd/conf/httpd.conf
#修改ServerName
ServerName controller #不存在需要增加 , controller 为虚拟ip

[root@controller01 ~]# ln -s /usr/share/keystone/wsgi-keystone.conf /etc/httpd/conf.d/

```


### 启动 httpd

```bash
[root@controller01 ~]#  systemctl enable httpd.service
Created symlink from /etc/systemd/system/multi-user.target.wants/httpd.service to /usr/lib/systemd/system/httpd.service.
[root@controller01 ~]#  systemctl start httpd.service

```

### 创建adminrc


```bash

[root@controller01 ~]# cat adminrc 
export OS_PROJECT_DOMAIN_NAME=Default
export OS_USER_DOMAIN_NAME=Default
export OS_PROJECT_NAME=admin
export OS_USERNAME=admin
export OS_PASSWORD=ADMIN_PASS
export OS_AUTH_URL=http://controller:5000/v3
export OS_IDENTITY_API_VERSION=3
export OS_IMAGE_API_VERSION=2
```

### 验证是否安装成功


```bash

[root@controller01 ~]# openstack endpoint list
+----------------------------------+-----------+--------------+--------------+---------+-----------+----------------------------+
| ID                               | Region    | Service Name | Service Type | Enabled | Interface | URL                        |
+----------------------------------+-----------+--------------+--------------+---------+-----------+----------------------------+
| b3e86457b4474ecbbe603b5e67c86e5c | RegionOne | keystone     | identity     | True    | admin     | http://controller:5000/v3/ |
| b944df58864d4805b5a3a1c6aabd66fe | RegionOne | keystone     | identity     | True    | internal  | http://controller:5000/v3/ |
| e2d58415719f4d2a9b3b1463aed3a76b | RegionOne | keystone     | identity     | True    | public    | http://controller:5000/v3/ |
+----------------------------------+-----------+--------------+--------------+---------+-----------+----------------------------+

```

##  controller02 ,controller03 安装

```bash
yum install openstack-keystone httpd mod_wsgi -y

#修改配置 (参考controller01 ,)

vim  /etc/keystone/keystone.conf

```

### Initialize Fernet key repositories
```bash
[root@controller02 ~]# keystone-manage fernet_setup --keystone-user keystone --keystone-group keystone
[root@controller02 ~]# keystone-manage credential_setup --keystone-user keystone --keystone-group keystone


### 配置apache 服务器
 __ /etc/httpd/conf/httpd.conf__

```bash
ServerName controller

```
### link
 __/usr/share/keystone/wsgi-keystone.conf__
```bash
 ln -s /usr/share/keystone/wsgi-keystone.conf /etc/httpd/conf.d/
```

### 启动

```bash
systemctl enable httpd.service
systemctl start httpd.service
```


## vip测试


```bash

#before 

[root@controller01 ~]# openstack endpoint list
+----------------------------------+-----------+--------------+--------------+---------+-----------+----------------------------+
| ID                               | Region    | Service Name | Service Type | Enabled | Interface | URL                        |
+----------------------------------+-----------+--------------+--------------+---------+-----------+----------------------------+
| b3e86457b4474ecbbe603b5e67c86e5c | RegionOne | keystone     | identity     | True    | admin     | http://controller:5000/v3/ |
| b944df58864d4805b5a3a1c6aabd66fe | RegionOne | keystone     | identity     | True    | internal  | http://controller:5000/v3/ |
| e2d58415719f4d2a9b3b1463aed3a76b | RegionOne | keystone     | identity     | True    | public    | http://controller:5000/v3/ |
+----------------------------------+-----------+--------------+--------------+---------+-----------+----------------------------+


# after

[root@controller03 ~]# ip address delete   192.168.151.170/24 dev  ens37
[root@controller02 ~]# ip address add   192.168.151.170/24 dev  ens37
[root@controller01 ~]# openstack endpoint list
+----------------------------------+-----------+--------------+--------------+---------+-----------+----------------------------+
| ID                               | Region    | Service Name | Service Type | Enabled | Interface | URL                        |
+----------------------------------+-----------+--------------+--------------+---------+-----------+----------------------------+
| b3e86457b4474ecbbe603b5e67c86e5c | RegionOne | keystone     | identity     | True    | admin     | http://controller:5000/v3/ |
| b944df58864d4805b5a3a1c6aabd66fe | RegionOne | keystone     | identity     | True    | internal  | http://controller:5000/v3/ |
| e2d58415719f4d2a9b3b1463aed3a76b | RegionOne | keystone     | identity     | True    | public    | http://controller:5000/v3/ |
+----------------------------------+-----------+--------------+--------------+---------+-----------+----------------------------+


```


> controller02 , controller03 配置和controller01一样, 不需要执行初始化数据库操作，其他的操作都要执行

