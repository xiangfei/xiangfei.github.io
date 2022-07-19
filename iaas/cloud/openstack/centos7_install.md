
# centos7  openstack stein 高可用安装


> [!WARNING] 最好使用centos stream 安装 openstack


## 部署机器

| vip | 管理ip | 存储ip | 外网ip | host | OS |
| :----: | :----: | :----: | :----: | :----: | :----: |
| 192.168.151.200 |  192.168.151.71 | -  |  - | controller01   |  centos 7  |
| 192.168.151.200 |  192.168.151.72 |  - |  - | controller02 |  centos 7  |
| 192.168.151.200 |  192.168.151.73 |  - | -  | controller03 |  centos 7  |
|  -   |  192.168.151.74 | -  | -  | compute01  |  centos 7  |

## 准备工作

### 内核升级(all node)

```bash
[root@localhost ~]# yum install https://www.elrepo.org/elrepo-release-7.el7.elrepo.noarch.rpm
[root@localhost ~]# yum --disablerepo="*" --enablerepo=elrepo-kernel install -y kernel-ml
[root@localhost ~]# grub2-set-default 0

```

### 修改hostname (only controller node)

```bash

hostnamectl set-hostname controller02  controller03  controller01


```

### copy公钥 (only controller node)

```bash
ssh-keygen # 一直回车

ssh-copy-id  root@controller01  root@controller02 root@controller03

```

### 修改hosts配置(all node)

```bash
# /etc/hosts
192.168.151.71 controller01
192.168.151.72 controller02
192.168.151.73 controller03
192.168.151.170 controller

```


### 准备安装包(all node)

```bash
[root@controller01 ~]# yum -y install centos-release-openstack-stein
[root@controller01 ~]# yum upgrade  # 内核如果开始安装会被替换,需要重新替换回去
[root@controller01 ~]# yum -y install openstack-selinux # 或者关闭防火墙, selinux
# 本人测试安装selinux 后关闭防火墙

[root@controller01 ~]# service firewalld stop
[root@controller01 ~]# cat /etc/selinux/config 

# This file controls the state of SELinux on the system.
# SELINUX= can take one of these three values:
#     enforcing - SELinux security policy is enforced.
#     permissive - SELinux prints warnings instead of enforcing.
#     disabled - No SELinux policy is loaded.
SELINUX=disabled
# SELINUXTYPE= can take one of three two values:
#     targeted - Targeted processes are protected,
#     minimum - Modification of targeted policy. Only selected processes are protected. 
#     mls - Multi Level Security protection.
SELINUXTYPE=targeted 


```

### 安装python client(controller node)


```bash
[root@controller01 ~]# yum -y install python-openstackclient

```



## 安装基础服务


### mariadb galera 安装

#### controller node 执行

```bash
# controller01 
[root@controller01 ~]# yum install mariadb mariadb-server python2-PyMySQL  galera mariadb-galera-server rsync   -y
# controller02 , controller03
[root@controller03 ~]# yum install mariadb mariadb-server python2-PyMySQL  galera  rsync  -y


```


#### 修改配置文件(all node)

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


#### 启动

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


#### 测试


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


### rabbitmq 安装

#### 依赖

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


#### 检查


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

#### 创建用户,配置权限


```
[root@controller01 ~]#  rabbitmqctl add_user openstack openstack
Creating user "openstack"
[root@controller01 ~]# rabbitmqctl set_permissions openstack ".*" ".*" ".*"
Setting permissions for user "openstack" in vhost "/"


```


### memach 安装


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



### ntp 服务器

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


### etcd 

```bash
#没用到, 先不安装。等出错在<处理

```

## keystone 高可用安装


### controller01 执行

#### 创建vip 只是用来测试,haproxy pcs 需要以后修改

```bash
[root@controller01 ~]# ip address add 192.168.151.170/24 dev  ens37

``` 


#### 数据库准备


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


#### 安装keystone

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

#### 同步数据

```bash
[root@controller01 ~]#  su -s /bin/sh -c "keystone-manage db_sync" keystone
```

#### 初始化key仓库

```bash
[root@controller01 ~]# keystone-manage fernet_setup --keystone-user keystone --keystone-group keystone
[root@controller01 ~]# keystone-manage credential_setup --keystone-user keystone --keystone-group keystone

```

#### boot 认证

```bash
[root@controller01 ~]#  keystone-manage bootstrap --bootstrap-password ADMIN_PASS \
>   --bootstrap-admin-url http://controller:5000/v3/ \
>   --bootstrap-internal-url http://controller:5000/v3/ \
>   --bootstrap-public-url http://controller:5000/v3/ \
>   --bootstrap-region-id RegionOne
[root@controller01 ~]# 

```

#### 配置apache 服务器

```bash
[root@controller01 ~]# vim  /etc/httpd/conf/httpd.conf
#修改ServerName
ServerName controller #不存在需要增加 , controller 为虚拟ip

[root@controller01 ~]# ln -s /usr/share/keystone/wsgi-keystone.conf /etc/httpd/conf.d/

```


#### 启动 httpd

```bash
[root@controller01 ~]#  systemctl enable httpd.service
Created symlink from /etc/systemd/system/multi-user.target.wants/httpd.service to /usr/lib/systemd/system/httpd.service.
[root@controller01 ~]#  systemctl start httpd.service

```

#### 创建adminrc


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

#### 验证是否安装成功


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

###  controller02 ,controller03 安装

```bash
yum install openstack-keystone httpd mod_wsgi -y

#修改配置 (参考controller01 ,)

vim  /etc/keystone/keystone.conf

```

#### Initialize Fernet key repositories
```bash
[root@controller02 ~]# keystone-manage fernet_setup --keystone-user keystone --keystone-group keystone
[root@controller02 ~]# keystone-manage credential_setup --keystone-user keystone --keystone-group keystone


### 配置apache 服务器
 __ /etc/httpd/conf/httpd.conf__

```bash
ServerName controller

```
#### link
 __/usr/share/keystone/wsgi-keystone.conf__
```bash
 ln -s /usr/share/keystone/wsgi-keystone.conf /etc/httpd/conf.d/
```

#### 启动

```bash
systemctl enable httpd.service
systemctl start httpd.service
```


### vip测试


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


> [!WARNING]controller02 , controller03 配置和controller01一样, 不需要执行初始化数据库操作，其他的操作都要执行



## glance 高可用安装


### controller01

#### 初始化数据库


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

#### 创建 服务认证

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

#### glance 安装



```bash
[root@controller01 ~]# yum install openstack-glance -y

```

#### 修改配置文件 I
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

#### 修改配置文件 II
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

#### 同步数据
```bash
[root@controller01 ~]# su -s /bin/sh -c "glance-manage db_sync" glance


```

#### 启动


```bash

[root@controller01 ~]# systemctl enable openstack-glance-api.service \
>   openstack-glance-registry.service
Created symlink from /etc/systemd/system/multi-user.target.wants/openstack-glance-api.service to /usr/lib/systemd/system/openstack-glance-api.service.
Created symlink from /etc/systemd/system/multi-user.target.wants/openstack-glance-registry.service to /usr/lib/systemd/system/openstack-glance-registry.service.
[root@controller01 ~]# systemctl start openstack-glance-api.service \
>   openstack-glance-registry.service

```


### controller02  controller03

#### glance 安装



```bash
[root@controller01 ~]# yum install openstack-glance -y

```

#### 修改配置文件 I
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

#### 修改配置文件 II
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

#### 启动


```bash

[root@controller01 ~]# systemctl enable openstack-glance-api.service \
>   openstack-glance-registry.service
Created symlink from /etc/systemd/system/multi-user.target.wants/openstack-glance-api.service to /usr/lib/systemd/system/openstack-glance-api.service.
Created symlink from /etc/systemd/system/multi-user.target.wants/openstack-glance-registry.service to /usr/lib/systemd/system/openstack-glance-registry.service.
[root@controller01 ~]# systemctl start openstack-glance-api.service \
>   openstack-glance-registry.service

```


### vip 测试


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

### 高可用
- 存储
  - ceph ,共享disk, rsync都可以实现
- 数据
  - 数据库已经实现

> [!WARNING] controller02 controller03 不需要创建服务,初始化数据 ,其他和controller01 一致


## placement 高可用安装

### controller01 


#### 创建数据库


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

#### 创建用户, endpoint ,service

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


#### 安装placement


```bash
[root@controller01 ~]# yum install openstack-placement-api -y
```


#### 修改配置
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

#### 同步数据

```bash
[root@controller01 ~]# su -s /bin/sh -c "placement-manage db sync" placement

```

#### 重启httpd

```bash
[root@controller01 ~]# systemctl restart httpd
```

### controller02 , controller03


#### 安装placement

```bash

[root@controller01 ~]# yum install openstack-placement-api -y

```





#### 修改配置

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



#### 重启httpd



```bash

[root@controller01 ~]# systemctl restart httpd

```





### vip 



>[!WARNING] controller02, controller 03 不需要创建service , endpoint , db .其他的和controller01 一致



### eror

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

## nova 高可用安装





### controller01


#### 安装数据库


```bash
MariaDB [(none)]> CREATE DATABASE nova_api;
Query OK, 1 row affected (0.005 sec)

MariaDB [(none)]> CREATE DATABASE nova;
Query OK, 1 row affected (0.006 sec)

MariaDB [(none)]>  CREATE DATABASE nova_cell0;
Query OK, 1 row affected (0.005 sec)

MariaDB [(none)]> GRANT ALL PRIVILEGES ON nova_api.* TO 'nova'@'localhost'  IDENTIFIED BY 'nova';
Query OK, 0 rows affected (0.006 sec)

MariaDB [(none)]> GRANT ALL PRIVILEGES ON nova_api.* TO 'nova'@'%' IDENTIFIED BY 'nova';
Query OK, 0 rows affected (0.005 sec)

MariaDB [(none)]> GRANT ALL PRIVILEGES ON nova.* TO 'nova'@'localhost'  IDENTIFIED BY 'nova';
Query OK, 0 rows affected (0.007 sec)

MariaDB [(none)]> GRANT ALL PRIVILEGES ON nova.* TO 'nova'@'%' IDENTIFIED BY 'nova';
Query OK, 0 rows affected (0.005 sec)

MariaDB [(none)]> GRANT ALL PRIVILEGES ON nova_cell0.* TO 'nova'@'localhost' IDENTIFIED BY 'nova';
Query OK, 0 rows affected (0.005 sec)

MariaDB [(none)]>  GRANT ALL PRIVILEGES ON nova_cell0.* TO 'nova'@'%' IDENTIFIED BY 'nova';
Query OK, 0 rows affected (0.005 sec)

MariaDB [(none)]> 


```

#### 创建service endpoint user

```bash
[root@controller01 ~]# openstack user create --domain default --password-prompt nova
User Password:
Repeat User Password:
+---------------------+----------------------------------+
| Field               | Value                            |
+---------------------+----------------------------------+
| domain_id           | default                          |
| enabled             | True                             |
| id                  | 11344c9ddbee42b99c1c69ff0f919d80 |
| name                | nova                             |
| options             | {}                               |
| password_expires_at | None                             |
+---------------------+----------------------------------+
[root@controller01 ~]# openstack role add --project service --user nova admin
[root@controller01 ~]# openstack service create --name nova \
>   --description "OpenStack Compute" compute

+-------------+----------------------------------+
| Field       | Value                            |
+-------------+----------------------------------+
| description | OpenStack Compute                |
| enabled     | True                             |
| id          | 034397010f37488abbd7c79e2b1d6605 |
| name        | nova                             |
| type        | compute                          |
+-------------+----------------------------------+
[root@controller01 ~]# 
[root@controller01 ~]# openstack endpoint create --region RegionOne \
>   compute public http://controller:8774/v2.1
+--------------+----------------------------------+
| Field        | Value                            |
+--------------+----------------------------------+
| enabled      | True                             |
| id           | 8a1c8cad05944282997dbc386d447a8d |
| interface    | public                           |
| region       | RegionOne                        |
| region_id    | RegionOne                        |
| service_id   | 034397010f37488abbd7c79e2b1d6605 |
| service_name | nova                             |
| service_type | compute                          |
| url          | http://controller:8774/v2.1      |
+--------------+----------------------------------+
[root@controller01 ~]# openstack endpoint create --region RegionOne \
>   compute internal http://controller:8774/v2.1

+--------------+----------------------------------+
| Field        | Value                            |
+--------------+----------------------------------+
| enabled      | True                             |
| id           | 160277d666e24100acccadb7c5f73315 |
| interface    | internal                         |
| region       | RegionOne                        |
| region_id    | RegionOne                        |
| service_id   | 034397010f37488abbd7c79e2b1d6605 |
| service_name | nova                             |
| service_type | compute                          |
| url          | http://controller:8774/v2.1      |
+--------------+----------------------------------+
[root@controller01 ~]# 
[root@controller01 ~]# openstack endpoint create --region RegionOne \
>   compute admin http://controller:8774/v2.1
+--------------+----------------------------------+
| Field        | Value                            |
+--------------+----------------------------------+
| enabled      | True                             |
| id           | 59fe7621bf874982b5936ab531ac4b5f |
| interface    | admin                            |
| region       | RegionOne                        |
| region_id    | RegionOne                        |
| service_id   | 034397010f37488abbd7c79e2b1d6605 |
| service_name | nova                             |
| service_type | compute                          |
| url          | http://controller:8774/v2.1      |
+--------------+----------------------------------+
[root@controller01 ~]# 


```

#### 安装nova 


```bash
[root@controller01 ~]# yum install openstack-nova-api openstack-nova-conductor   openstack-nova-novncproxy openstack-nova-scheduler -y

```

#### 修改配置文件

  __ /etc/nova/nova.conf__


```bash
[DEFAULT]
# ...
enabled_apis = osapi_compute,metadata
transport_url = rabbit://openstack:openstack@controller
my_ip = 192.168.151.71 # controller01
use_neutron = true
firewall_driver = nova.virt.firewall.NoopFirewallDriver

[api_database]
# ...
connection = mysql+pymysql://nova:nova@controller/nova_api

[database]
# ...
connection = mysql+pymysql://nova:nova@controller/nova

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
username = nova
password = nova


[vnc]
enabled = true
# ...
server_listen = $my_ip
server_proxyclient_address = $my_ip


[glance]
# ...
api_servers = http://controller:9292


[oslo_concurrency]
# ...
lock_path = /var/lib/nova/tmp



[placement]
# ...
region_name = RegionOne
project_domain_name = Default
project_name = service
auth_type = password
user_domain_name = Default
auth_url = http://controller:5000/v3
username = placement
password = placement


```

#### 同步数据


```bash
[root@controller01 ~]# su -s /bin/sh -c "nova-manage api_db sync" nova
[root@controller01 ~]# su -s /bin/sh -c "nova-manage cell_v2 map_cell0" nova
[root@controller01 ~]# su -s /bin/sh -c "nova-manage cell_v2 create_cell --name=cell1 --verbose" nova
[root@controller01 ~]#  su -s /bin/sh -c "nova-manage db sync" nova
[root@controller01 ~]# su -s /bin/sh -c "nova-manage cell_v2 list_cells" nova
+-------+--------------------------------------+------------------------------------+-------------------------------------------------+----------+
|  Name |                 UUID                 |           Transport URL            |               Database Connection               | Disabled |
+-------+--------------------------------------+------------------------------------+-------------------------------------------------+----------+
| cell0 | 00000000-0000-0000-0000-000000000000 |               none:/               | mysql+pymysql://nova:****@controller/nova_cell0 |  False   |
| cell1 | 63a4f248-1e14-48fb-98f6-52434dd926f5 | rabbit://openstack:****@controller |    mysql+pymysql://nova:****@controller/nova    |  False   |
+-------+--------------------------------------+------------------------------------+-------------------------------------------------+----------+

```


#### 启动
  __nova-consoleauth__ stein版本已经删除了
```bash
[root@controller01 ~]#  systemctl enable openstack-nova-api.service  openstack-nova-scheduler.service openstack-nova-conductor.service openstack-nova-novncproxy.service
[root@controller01 ~]#  systemctl start openstack-nova-api.service  openstack-nova-scheduler.service openstack-nova-conductor.service openstack-nova-novncproxy.service

```
#### ERROR

- OperationalError: (pymysql.err.OperationalError) (1040, u'Too many connections')
  - vim /etc/my.cnf.d/mariadb-server.cnf   [mysqld] max_connections=3000

### controller02 , controller03


#### 安装nova 


```bash
[root@controller01 ~]# yum install openstack-nova-api openstack-nova-conductor   openstack-nova-novncproxy openstack-nova-scheduler -y

```

#### 修改配置文件

  __ /etc/nova/nova.conf__


```bash
[DEFAULT]
# ...
enabled_apis = osapi_compute,metadata
transport_url = rabbit://openstack:openstack@controller
my_ip =   192.168.151.72, 192.168.151.73   #controller02 , controller03
use_neutron = true
firewall_driver = nova.virt.firewall.NoopFirewallDriver

[api_database]
# ...
connection = mysql+pymysql://nova:nova@controller/nova_api

[database]
# ...
connection = mysql+pymysql://nova:nova@controller/nova

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
username = nova
password = nova


[vnc]
enabled = true
# ...
server_listen = $my_ip
server_proxyclient_address = $my_ip


[glance]
# ...
api_servers = http://controller:9292


[oslo_concurrency]
# ...
lock_path = /var/lib/nova/tmp



[placement]
# ...
region_name = RegionOne
project_domain_name = Default
project_name = service
auth_type = password
user_domain_name = Default
auth_url = http://controller:5000/v3
username = placement
password = placement


```


#### 启动
  __nova-consoleauth__ stein版本已经删除了
```bash
[root@controller01 ~]#  systemctl enable openstack-nova-api.service  openstack-nova-scheduler.service openstack-nova-conductor.service openstack-nova-novncproxy.service
[root@controller01 ~]#  systemctl start openstack-nova-api.service  openstack-nova-scheduler.service openstack-nova-conductor.service openstack-nova-novncproxy.service

```



### compute01


#### 安装 compute api


```bash
[root@compute01 ~]# yum install openstack-nova-compute -y
```

#### 修改配置文件

  __/etc/nova/nova.conf__


```bash
[DEFAULT]
# ...
enabled_apis = osapi_compute,metadata
transport_url = rabbit://openstack:openstack@controller
my_ip = 192.168.151.74 # MANAGEMENT_INTERFACE_IP_ADDRESS  , /etc/hosts 设置
use_neutron = true
firewall_driver = nova.virt.firewall.NoopFirewallDriver
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
username = nova
password = nova

[vnc]
# ...
enabled = true
server_listen = 0.0.0.0
server_proxyclient_address = $my_ip
novncproxy_base_url = http://controller:6080/vnc_auto.html


[glance]
# ...
api_servers = http://controller:9292


[oslo_concurrency]
# ...
lock_path = /var/lib/nova/tmp

[placement]
# ...
region_name = RegionOne
project_domain_name = Default
project_name = service
auth_type = password
user_domain_name = Default
auth_url = http://controller:5000/v3
username = placement
password = placement


[libvirt]
# ...
virt_type = qemu  #  or kvm   ,不支持虚拟化qemu
```

#### 启动


```bash
[root@compute01 ~]# systemctl enable libvirtd.service openstack-nova-compute.service
Created symlink from /etc/systemd/system/multi-user.target.wants/openstack-nova-compute.service to /usr/lib/systemd/system/openstack-nova-compute.service.
[root@compute01 ~]#  systemctl start libvirtd.service openstack-nova-compute.service


```

#### /etc/hosts


```bash
[root@compute01 ~]# cat /etc/hosts
127.0.0.1   localhost localhost.localdomain localhost4 localhost4.localdomain4
::1         localhost localhost.localdomain localhost6 localhost6.localdomain6
192.168.151.71 controller01
192.168.151.72 controller01
192.168.151.73 controller01
192.168.151.170 controller
192.168.151.74 compute01


```

#### add to controller



```bash
[root@controller01 ~]# openstack compute service list --service nova-compute

[root@controller01 ~]#  su -s /bin/sh -c "nova-manage cell_v2 discover_hosts --verbose" nova
Found 2 cell mappings.
Skipping cell0 since it does not contain hosts.
Getting computes from cell 'cell1': 63a4f248-1e14-48fb-98f6-52434dd926f5
Found 0 unmapped computes in cell: 63a4f248-1e14-48fb-98f6-52434dd926f5
[root@controller01 ~]# openstack compute service list --service nova-compute

[root@controller01 ~]# nova-manage cell_v2 discover_hosts 
[root@controller01 ~]# openstack compute service list --service nova-compute


```

### error

 - unicode error

```bash
[root@compute01 ~]# /usr/bin/nova-compute 
Traceback (most recent call last):
  File "/usr/lib64/python2.7/logging/__init__.py", line 851, in emit
    msg = self.format(record)
  File "/usr/lib64/python2.7/logging/__init__.py", line 724, in format
    return fmt.format(record)
  File "/usr/lib/python2.7/site-packages/oslo_log/formatters.py", line 511, in format
    return logging.Formatter.format(self, record)
  File "/usr/lib64/python2.7/logging/__init__.py", line 467, in format
    s = self._fmt % record.__dict__
UnicodeDecodeError: 'ascii' codec can't decode byte 0xe8 in position 229: ordinal not in range(128)
Logged from file log.py, line 203
[root@compute01 ~]# LANG
-bash: LANG: command not found
[root@compute01 ~]# export LANG=zh_CN.UTF-8
[root@compute01 ~]# 
[root@compute01 ~]# /usr/bin/nova-compute 



```

 - boot  error



```bash
  2020-05-22 09:28:56.484 45716 ERROR vif_plug_ovs.ovsdb.impl_vsctl [req-e74f469c-e7bc-4384-9837-817ac34341f5 3c83286e81b846cfb9634474afd33cfd f5d7d248c2d748cb82fc3f8ce871aa75 - default default] Unable to execute ['ovs-vsctl', '--timeout=120', '--oneline', '--format=json', '--db=tcp:127.0.0.1:6640', '--', '--may-exist', 'add-br', u'br-int', '--', 'set', 'Bridge', u'br-int', 'datapath_type=system']. Exception: Unexpected error while running command.
Command: ovs-vsctl --timeout=120 --oneline --format=json --db=tcp:127.0.0.1:6640 -- --may-exist add-br br-int -- set Bridge br-int datapath_type=system
Exit code: 1
Stdout: u''
Stderr: u'ovs-vsctl: tcp:127.0.0.1:6640: database connection failed (Connection refused)\n': ProcessExecutionError: Unexpected error while running comma

[root@compute01 ~]# ovs-appctl -t ovsdb-server ovsdb-server/add-remote ptcp:6640:0.0.0.0
 
```

### overcommit

```
root@controller01:~# nova aggregate-set-metadata node108  cpu_allocation_ratio=16.0 

```




## 高可用安装neutron(ovn)


### ovn 准备

gateway node   ovn-central

database node

compute node ovn-host


### controler 01


#### 安装neutron 


##### 数据库
```bash
MariaDB [(none)]> CREATE DATABASE neutron;
Query OK, 1 row affected (0.006 sec)

MariaDB [(none)]> GRANT ALL PRIVILEGES ON neutron.* TO 'neutron'@'localhost'  IDENTIFIED BY  'neutron';
Query OK, 0 rows affected (0.007 sec)

MariaDB [(none)]>  GRANT ALL PRIVILEGES ON neutron.* TO 'neutron'@'%'  IDENTIFIED BY  'neutron';
Query OK, 0 rows affected (0.006 sec)

MariaDB [(none)]> exit


```

##### 创建service endpoint

```bash
[root@controller01 ~]#  openstack user create --domain default --password-prompt neutron
User Password:
Repeat User Password:
+---------------------+----------------------------------+
| Field               | Value                            |
+---------------------+----------------------------------+
| domain_id           | default                          |
| enabled             | True                             |
| id                  | e019ae46781445b9b0a99bed55dcebe7 |
| name                | neutron                          |
| options             | {}                               |
| password_expires_at | None                             |
+---------------------+----------------------------------+
[root@controller01 ~]# openstack role add --project service --user neutron admin
[root@controller01 ~]#  openstack service create --name neutron \
>   --description "OpenStack Networking" network

+-------------+----------------------------------+
| Field       | Value                            |
+-------------+----------------------------------+
| description | OpenStack Networking             |
| enabled     | True                             |
| id          | 488c02fc43fb41a2a573cb1ea3beeed0 |
| name        | neutron                          |
| type        | network                          |
+-------------+----------------------------------+
[root@controller01 ~]# 
[root@controller01 ~]# openstack endpoint create --region RegionOne \
>   network public http://controller:9696
+--------------+----------------------------------+
| Field        | Value                            |
+--------------+----------------------------------+
| enabled      | True                             |
| id           | 96c74ccbd7e74e468784ad38a7b5dcb8 |
| interface    | public                           |
| region       | RegionOne                        |
| region_id    | RegionOne                        |
| service_id   | 488c02fc43fb41a2a573cb1ea3beeed0 |
| service_name | neutron                          |
| service_type | network                          |
| url          | http://controller:9696           |
+--------------+----------------------------------+
[root@controller01 ~]# openstack endpoint create --region RegionOne \
>   network internal http://controller:9696
+--------------+----------------------------------+
| Field        | Value                            |
+--------------+----------------------------------+
| enabled      | True                             |
| id           | fe9f7fbdcd114224ac07f8c103d35ad8 |
| interface    | internal                         |
| region       | RegionOne                        |
| region_id    | RegionOne                        |
| service_id   | 488c02fc43fb41a2a573cb1ea3beeed0 |
| service_name | neutron                          |
| service_type | network                          |
| url          | http://controller:9696           |
+--------------+----------------------------------+
[root@controller01 ~]# openstack endpoint create --region RegionOne \
>   network admin http://controller:9696
+--------------+----------------------------------+
| Field        | Value                            |
+--------------+----------------------------------+
| enabled      | True                             |
| id           | d97eb77e74004613ad58bb59afae2ae1 |
| interface    | admin                            |
| region       | RegionOne                        |
| region_id    | RegionOne                        |
| service_id   | 488c02fc43fb41a2a573cb1ea3beeed0 |
| service_name | neutron                          |
| service_type | network                          |
| url          | http://controller:9696           |
+--------------+----------------------------------+


```

##### neutron ovn 安装


```bash
[root@controller01 ~]# yum install openstack-neutron openstack-neutron-ml2   openvswitch-ovn-central openvswitch-ovn-vtep python2-networking-ovn   libibverbs  -y

```

##### 配置ovn sb nb remote 访问port

```bash
[root@controller01 ~]# systemctl enable openvswitch
[root@controller01 ~]# systemctl enable ovn-northd
[root@controller01 ~]#  service ovn-northd start
[root@controller01 ~]# ovn-nbctl set-connection ptcp:6641:0.0.0.0  -- set connection . inactivity_probe=60000
[root@controller01 ~]# ovn-sbctl set-connection ptcp:6642:0.0.0.0  -- set connection . inactivity_probe=60000
[root@controller01 ~]#  ovs-appctl -t ovsdb-server ovsdb-server/add-remote ptcp:6640:0.0.0.0


```

##### 配置文件修改

   __ /etc/neutron/neutron.conf__

```bash
[database]
# ...
connection = mysql+pymysql://neutron:neutron@controller/neutron

[DEFAULT]
# ...
allow_overlapping_ips = true
transport_url = rabbit://openstack:openstack@controller
auth_strategy = keystone
notify_nova_on_port_status_changes = true
notify_nova_on_port_data_changes = true
core_plugin = neutron.plugins.ml2.plugin.Ml2Plugin
service_plugins = networking_ovn.l3.l3_ovn.OVNL3RouterPlugin


[keystone_authtoken]
# ...
www_authenticate_uri = http://controller:5000
auth_url = http://controller:5000
memcached_servers = controller01:11211,controller02:11211,controller03:11211
auth_type = password
project_domain_name = Default
user_domain_name = Default
project_name = service
username = neutron
password = neutron

[nova]
# ...
auth_url = http://controller:5000
auth_type = password
project_domain_name = Default
user_domain_name = Default
region_name = RegionOne
project_name = service
username = nova
password = nova


[oslo_concurrency]
# ...
lock_path = /var/lib/neutron/tmp



```

##### 修改配置文件

  __/etc/neutron/plugins/ml2/ml2_conf.ini__



```bash
[ml2]
...
mechanism_drivers = ovn
type_drivers = local,flat,vlan,geneve
tenant_network_types = geneve
extension_drivers = port_security
overlay_ip_version = 4


[ml2_type_geneve]
...
vni_ranges = 1:65536
max_header_size = 38

[securitygroup]
...
enable_security_group = true



[ovn]
...
ovn_nb_connection = tcp:192.168.151.170:6641 #vip 
ovn_sb_connection = tcp:192.168.151.170:6642
ovn_l3_scheduler = leastloaded   


```

##### mark gateway nodes
```bash
[root@controller01 ~]# ovs-vsctl set open . external-ids:ovn-cms-options=enable-chassis-as-gw

```

##### nova 修改配置
  __/etc/nova/nova.conf__

```bash
[neutron]
url = http://controller:9696
auth_url = http://controller:5000
auth_type = password
project_domain_name = Default
user_domain_name = Default
region_name = RegionOne
project_name = service
username = neutron
password = neutron
service_metadata_proxy = true
metadata_proxy_shared_secret = METADATA_SECRET  # 暂时没用,看ovn的metadata server 怎么做


```


##### 同步数据
```bash
[root@controller01 ~]# ln -s /etc/neutron/plugins/ml2/ml2_conf.ini /etc/neutron/plugin.ini
[root@controller01 ~]# su -s /bin/sh -c "neutron-db-manage --config-file /etc/neutron/neutron.conf --config-file /etc/neutron/plugins/ml2/ml2_conf.ini upgrade head" neutron


```

##### 启动

```bash
[root@controller01 ~]# systemctl restart openstack-nova-api.service  openstack-nova-scheduler.service openstack-nova-conductor.service openstack-nova-novncproxy.service
[root@controller01 ~]# systemctl enable neutron-server.service
[root@controller01 ~]# systemctl start neutron-server.service

```

### controller02 , controller03

```bash



```


### compute node


#### 安装 ovn

```bin
[root@compute01 ~]# yum install   openvswitch-ovn-host openvswitch-ovn-vtep python2-networking-ovn   python2-networking-ovn-metadata-agent  libibverbs -y
```
##### add neutron in nova
  __/etc/nova/nova.conf__

```bash

[neutron]

url = http://controller:9696
auth_url = http://controller:5000
auth_type = password
project_domain_name = Default
user_domain_name = Default
region_name = RegionOne
project_name = service
username = neutron
password = neutron
service_metadata_proxy = true
metadata_proxy_shared_secret = METADATA_SECRET



```


##### 启动

```bash
[root@compute01 ~]# systemctl enable openvswitch
Created symlink from /etc/systemd/system/multi-user.target.wants/openvswitch.service to /usr/lib/systemd/system/openvswitch.service.
[root@compute01 ~]# systemctl start openvswitch
[root@compute01 ~]#  ovs-vsctl set open . external-ids:ovn-remote=tcp:192.168.151.170:6642
[root@compute01 ~]# ovs-vsctl set open . external-ids:ovn-encap-type=geneve,vxlan
[root@compute01 ~]# ovs-vsctl set open . external-ids:ovn-encap-ip=192.168.151.74
[root@compute01 ~]# systemctl enable ovn-controller
Created symlink from /etc/systemd/system/multi-user.target.wants/ovn-controller.service to /usr/lib/systemd/system/ovn-controller.service.
[root@compute01 ~]# systemctl start ovn-controller

[root@compute01 ~]# service  systemctl enable networking-ovn-metadata-agent
The service command supports only basic LSB actions (start, stop, restart, try-restart, reload, force-reload, status). For other actions, please try to use systemctl.
[root@compute01 ~]# systemctl start networking-ovn-metadata-agent



```


##### 查看

```bash

[root@controller01 ~]# ovn-sbctl show
Chassis "b2ed9734-2f21-4fac-b8de-8abf0a265186"
    hostname: "compute01"
    Encap vxlan
        ip: "192.168.151.74"
        options: {csum="true"}
    Encap geneve
        ip: "192.168.151.74"
        options: {csum="true"}
[root@controller01 ~]# ovn-nbctl show

```


### 说明

- ovn远程配置的是vip 
- ovsdb vip 是master , controller ip slave ,配置ovsdb server 同步




#### ovn cluster 配置



```bash
[root@controller01 ~]# /usr/share/openvswitch/scripts/ovn-ctl --db-nb-addr=192.168.151.71  --db-nb-create-insecure-remote=yes         --db-sb-addr=192.168.151.71 --db-sb-create-insecure-remote=yes --db-nb-cluster-local-addr=192.168.151.71         --db-sb-cluster-local-addr=192.168.151.71         --ovn-northd-nb-db=tcp:192.168.151.71:6641,tcp:192.168.151.72:6641,tcp:192.168.151.73:6641         --ovn-northd-sb-db=tcp:192.168.151.71:6642,tcp:192.168.151.72:6642,tcp:192.168.151.73:6642         start_northd

[root@controller02 ml2]# /usr/share/openvswitch/scripts/ovn-ctl --db-nb-addr=192.168.151.72           --db-nb-create-insecure-remote=yes           --db-nb-cluster-local-addr=192.168.151.72           --db-sb-addr=192.168.151.72           --db-sb-create-insecure-remote=yes           --db-sb-cluster-local-addr=192.168.151.72           --db-nb-cluster-remote-addr=192.168.151.71           --db-sb-cluster-remote-addr=192.168.151.71           --ovn-northd-nb-db=tcp:192.168.151.71:6641,tcp:192.168.151.72:6641,tcp:192.168.151.73:6641           --ovn-northd-sb-db=tcp:192.168.151.71:6642,tcp:192.168.151.72:6642,tcp:192.168.151.73:6642           start_northd


[root@controller03 ~]# /usr/share/openvswitch/scripts/ovn-ctl --db-nb-addr=192.168.151.73           --db-nb-create-insecure-remote=yes           --db-nb-cluster-local-addr=192.168.151.73           --db-sb-addr=192.168.151.73           --db-sb-create-insecure-remote=yes           --db-sb-cluster-local-addr=192.168.151.73           --db-nb-cluster-remote-addr=192.168.151.71           --db-sb-cluster-remote-addr=192.168.151.71           --ovn-northd-nb-db=tcp:192.168.151.71:6641,tcp:192.168.151.72:6641,tcp:192.168.151.73:6641           --ovn-northd-sb-db=tcp:192.168.151.71:6642,tcp:192.168.151.72:6642,tcp:192.168.151.73:6642           start_northd


#neutron config
[ovn]
#ovn_nb_connection = tcp:192.168.151.170:6641
#ovn_sb_connection = tcp:192.168.151.170:6642
ovn_nb_connection = tcp:192.168.151.71:6641,tcp:192.168.151.72:6641,tcp:192.168.151.73:6641
ovn_sb_connection = tcp:192.168.151.71:6642,tcp:192.168.151.72:6642,tcp:192.168.151.73:6642
ovn_l3_scheduler = leastloaded




[root@compute01 ~]# ovs-vsctl set open . external-ids:ovn-remote=tcp:192.168.151.71:6642,tcp:192.168.151.72:6642,tcp:192.168.151.73:6642

# ss 监听71 6642 port 如果 71 6642 down 会开始监听 72 6642

```

#### ovn master slave 配置

```bash

[root@controller01 ~]# /usr/share/openvswitch/scripts/ovn-ctl  start_northd     --db-sb-sync-from-addr=192.168.151.170     --db-nb-sync-from-addr=192.168.151.170  --db-sb-create-insecure-remote=yes  --db-nb-create-insecure-remote=yes

[root@controller03 ~]# /usr/share/openvswitch/scripts/ovn-ctl  start_northd     --db-sb-sync-from-addr=192.168.151.170     --db-nb-sync-from-addr=192.168.151.170  --db-sb-create-insecure-remote=yes  --db-nb-create-insecure-remote=yes

[root@controller02 ~]# /usr/share/openvswitch/scripts/ovn-ctl  start_northd     --db-sb-sync-from-addr=192.168.151.170     --db-nb-sync-from-addr=192.168.151.170  --db-sb-create-insecure-remote=yes  --db-nb-create-insecure-remote=yes


# 配置换成 floating ip 
```


## horizon 高可用安装




### controller01

#### 安装包

```bash
[root@controller01 ~]# yum install openstack-dashboard -y

```


#### 修改文件 __/etc/openstack-dashboard/local_settings__



```bash
OPENSTACK_HOST = "controller"
ALLOWED_HOSTS = ['one.example.com', 'two.example.com' , '*']




SESSION_ENGINE = 'django.contrib.sessions.backends.cache'

CACHES = {
    'default': {
         'BACKEND': 'django.core.cache.backends.memcached.MemcachedCache',
         'LOCATION': 'controller01:11211,controller02:11211,controller03:11211',
    }
}


OPENSTACK_KEYSTONE_URL = "http://%s:5000/v3" % OPENSTACK_HOST

OPENSTACK_KEYSTONE_MULTIDOMAIN_SUPPORT = True


OPENSTACK_API_VERSIONS = {
    "identity": 3,
    "image": 2,
    "volume": 3,
}

OPENSTACK_KEYSTONE_DEFAULT_DOMAIN = "Default"

OPENSTACK_KEYSTONE_DEFAULT_ROLE = "user"

OPENSTACK_NEUTRON_NETWORK = {
    ...
    'enable_router': False,
    'enable_quotas': False,
    'enable_distributed_router': False,
    'enable_ha_router': False,
    'enable_lb': False,
    'enable_firewall': False,
    'enable_vpn': False,
    'enable_fip_topology_check': False,
}

TIME_ZONE = "Asia/Shanghai"

```

#### 修改配置文件  __/etc/httpd/conf.d/openstack-dashboard.conf__



```bash
#不存在 在加 ,当前版本不存在
WSGIApplicationGroup %{GLOBAL}


```


#### 重启

```bash
[root@controller01 ~]# systemctl restart httpd.service memcached.service
```




