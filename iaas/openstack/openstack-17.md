---

title:  openstack ussuri centos8 高可用安装 keystone
date: 2020-07-17 16:52:02
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


## 创建vip 

 - 用来安装, 手动创建vip  

```bash
[root@controller01 ~]# ip address add dev ens5 10.10.102.190/24

```

## controller01 操作

### 初始化数据库

```
[root@controller01 ~]#  mysql -u root
Welcome to the MariaDB monitor.  Commands end with ; or \g.
Your MariaDB connection id is 11
Server version: 10.3.17-MariaDB MariaDB Server

Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

MariaDB [(none)]>  CREATE DATABASE keystone;
Query OK, 1 row affected (0.008 sec)

MariaDB [(none)]> GRANT ALL PRIVILEGES ON keystone.* TO 'keystone'@'localhost'  IDENTIFIED BY 'keystone';
Query OK, 0 rows affected (0.088 sec)

MariaDB [(none)]> GRANT ALL PRIVILEGES ON keystone.* TO 'keystone'@'%'   IDENTIFIED BY 'keystone';
Query OK, 0 rows affected (0.102 sec)

MariaDB [(none)]> exit

```

### 安装keystone

```bash
[root@controller01 ~]#  yum -y install openstack-keystone httpd  python3-mod_wsgi 

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
[root@controller01 ~]# su -s /bin/sh -c "keystone-manage db_sync" keystone
```

### 初始化key仓库

```bash
[root@controller01 ~]# keystone-manage fernet_setup --keystone-user keystone --keystone-group keystone
[root@controller01 ~]# keystone-manage credential_setup --keystone-user keystone --keystone-group keystone



```
### boot 认证



```
[root@controller01 ~]# keystone-manage bootstrap --bootstrap-password admin  --bootstrap-admin-url http://controller:5000/v3/  --bootstrap-internal-url http://controller:5000/v3/   --bootstrap-public-url http://controller:5000/v3/ --bootstrap-region-id RegionOne

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
export OS_USERNAME=admin
export OS_PASSWORD=admin
export OS_PROJECT_NAME=admin
export OS_USER_DOMAIN_NAME=Default
export OS_PROJECT_DOMAIN_NAME=Default
export OS_AUTH_URL=http://controller:5000/v3
export OS_IDENTITY_API_VERSION=3



```

### 验证是否安装成功

```

[root@controller01 ~]# openstack endpoint list
+----------------------------------+-----------+--------------+--------------+---------+-----------+----------------------------+
| ID                               | Region    | Service Name | Service Type | Enabled | Interface | URL                        |
+----------------------------------+-----------+--------------+--------------+---------+-----------+----------------------------+
| 115e38b57d564564bdb489a8a4d2f6cb | RegionOne | keystone     | identity     | True    | public    | http://controller:5000/v3/ |
| 402941d7edb94479ae33557cbe3c3282 | RegionOne | keystone     | identity     | True    | admin     | http://controller:5000/v3/ |
| 6754c0bfd7274d43b615b8b242e09abf | RegionOne | keystone     | identity     | True    | internal  | http://controller:5000/v3/ |
+----------------------------------+-----------+--------------+--------------+---------+-----------+----------------------------+


```


##  controller02 , controller03 安装配置
 - controller01一样, 不需要执行初始化数据库操作，其他的操作都要执行



## 高可用测试


``` 

vip controller01 漂移到 controller02
[root@controller02 ~]#  ip address add dev ens5 10.10.102.190/24
[root@controller01 ~]#  ip address  delete dev  ens5 10.10.102.190/24

[root@controller01 ~]# openstack endpoint list
+----------------------------------+-----------+--------------+--------------+---------+-----------+----------------------------+
| ID                               | Region    | Service Name | Service Type | Enabled | Interface | URL                        |
+----------------------------------+-----------+--------------+--------------+---------+-----------+----------------------------+
| 115e38b57d564564bdb489a8a4d2f6cb | RegionOne | keystone     | identity     | True    | public    | http://controller:5000/v3/ |
| 402941d7edb94479ae33557cbe3c3282 | RegionOne | keystone     | identity     | True    | admin     | http://controller:5000/v3/ |
| 6754c0bfd7274d43b615b8b242e09abf | RegionOne | keystone     | identity     | True    | internal  | http://controller:5000/v3/ |
+----------------------------------+-----------+--------------+--------------+---------+-----------+----------------------------+

# id 相同

```
