

# openstack ussuri centos8 高可用安装



## 部署架构



|  vip   | 管理ip ens5 | 存储ip ens6| 外网ip(br-ex ens3) | 内部ip (br-int ens4)| host  | OS |
|  :----:  | :----:  | :----: | :----: | :----:  | :----: |  :----:  | 
| 10.10.102.190 |  10.10.102.191 | 10.10.100.191  | 192.168.151.191 | - | controller01   |  centos 8  |
| 10.10.102.190 |  10.10.102.192 | 10.10.100.192  | 192.168.151.192 | - | controller02 |  centos 8  |
| 10.10.102.190 |  10.10.102.193 | 10.10.100.193  | 192.168.151.193 | - | controller03 |  centos 8  |
|     |  192.168.151.194 |   |  |  | compute01  |  centos 8  |



## 环境准备

###  替换centos 8 源

- 删除 /etc/yum.repos.d/*.repo 文件
- 下载 centos-8 阿里云mirror
 - http://mirrors.aliyun.com/repo/Centos-8.repo
 - rename to Centos-Base.repo





```bash
[root@cotroller01 yum.repos.d]# cat CentOS-Base.repo 
# CentOS-Base.repo
#
# The mirror system uses the connecting IP address of the client and the
# update status of each mirror to pick mirrors that are updated to and
# geographically close to the client.  You should use this for CentOS updates
# unless you are manually picking other mirrors.
#
# If the mirrorlist= does not work for you, as a fall back you can try the 
# remarked out baseurl= line instead.
#
#
 
[base]
name=CentOS-$releasever - Base - mirrors.aliyun.com
failovermethod=priority
baseurl=https://mirrors.aliyun.com/centos/$releasever/BaseOS/$basearch/os/
gpgcheck=1
gpgkey=https://mirrors.aliyun.com/centos/RPM-GPG-KEY-CentOS-Official
 
#additional packages that may be useful
[extras]
name=CentOS-$releasever - Extras - mirrors.aliyun.com
failovermethod=priority
baseurl=https://mirrors.aliyun.com/centos/$releasever/extras/$basearch/os/
gpgcheck=1
gpgkey=https://mirrors.aliyun.com/centos/RPM-GPG-KEY-CentOS-Official
 
#additional packages that extend functionality of existing packages
[centosplus]
name=CentOS-$releasever - Plus - mirrors.aliyun.com
failovermethod=priority
baseurl=https://mirrors.aliyun.com/centos/$releasever/centosplus/$basearch/os/
gpgcheck=1
enabled=0
gpgkey=https://mirrors.aliyun.com/centos/RPM-GPG-KEY-CentOS-Official
 
[PowerTools]
name=CentOS-$releasever - PowerTools - mirrors.aliyun.com
failovermethod=priority
baseurl=https://mirrors.aliyun.com/centos/$releasever/PowerTools/$basearch/os/
gpgcheck=1
enabled=1
gpgkey=https://mirrors.aliyun.com/centos/RPM-GPG-KEY-CentOS-Official
[AppStream]
name=CentOS-$releasever - AppStream - mirrors.aliyun.com
failovermethod=priority
baseurl=https://mirrors.aliyun.com/centos/$releasever/AppStream/$basearch/os/
gpgcheck=1
gpgkey=https://mirrors.aliyun.com/centos/RPM-GPG-KEY-CentOS-Official


[root@cotroller01 yum.repos.d]# yum clean all
[root@cotroller01 yum.repos.d]# yum makecache
 
```

### 安装openstack 源

```bash

[root@cotroller01 yum.repos.d]# yum -y install  centos-release-openstack-ussuri 
[root@cotroller01 yum.repos.d]# yum config-manager --set-enabled PowerTools
```
> 生成文件


```bash
[root@cotroller01 yum.repos.d]# ll
total 28
-rw-r--r--. 1 root root  381 Jul  9 22:36 advanced-virtualization.repo
-rw-r--r--. 1 root root 1781 Jul 13 11:46 CentOS-Base.repo
-rw-r--r--. 1 root root  956 May 19 03:10 CentOS-Ceph-Nautilus.repo
-rw-r--r--. 1 root root  957 Apr 14 22:32 CentOS-Messaging-rabbitmq.repo
-rw-r--r--. 1 root root 4588 Jul  9 22:38 CentOS-OpenStack-ussuri.repo
-rw-r--r--. 1 root root  353 Mar 19 22:25 CentOS-Storage-common.repo

```


### 替换源文件

- advanced-virtualuzation.repo

```bash
[advanced-virtualization]
name=CentOS-8 - Advanced Virtualization
#baseurl=http://mirror.centos.org/centos/$releasever/virt/$basearch/advanced-virtualization
#mirrorlist=http://mirrorlist.centos.org/?release=$releasever&arch=$basearch&repo=virt-advanced-virtualization
baseurl=https://mirrors.aliyun.com/centos/$releasever/virt/$basearch/advanced-virtualization
gpgcheck=1
enabled=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-SIG-Virtualization-RDO
module_hotfixes=1


```

-  CentOS-Ceph-Nautilus.repo


```bash
[root@cotroller01 yum.repos.d]# cat CentOS-Ceph-Nautilus.repo 
# CentOS-Ceph-Nautilus.repo
#
# Please see https://wiki.centos.org/SpecialInterestGroup/Storage for more
# information

[centos-ceph-nautilus]
name=CentOS-$releasever - Ceph Nautilus
#mirrorlist=http://mirrorlist.centos.org/?release=$releasever&arch=$basearch&repo=storage-ceph-nautilus
#baseurl=http://mirror.centos.org/$contentdir/$releasever/storage/$basearch/ceph-nautilus/
baseurl=https://mirrors.aliyun.com/$contentdir/$releasever/storage/$basearch/ceph-nautilus/
gpgcheck=1
enabled=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-SIG-Storage

[centos-ceph-nautilus-test]
name=CentOS-$releasever - Ceph Nautilus Testing
baseurl=https://buildlogs.centos.org/centos/$releasever/storage/$basearch/ceph-nautilus/
gpgcheck=0
enabled=0
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-SIG-Storage

[centos-ceph-nautilus-source]
name=CentOS-$releasever - Ceph Nautilus Source
baseurl=http://vault.centos.org/$contentdir/$releasever/storage/Source/ceph-nautilus/
gpgcheck=1
enabled=0
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-SIG-Storage


```


-  CentOS-Messaging-rabbitmq.repo


```bash
[root@cotroller01 yum.repos.d]# cat CentOS-Messaging-rabbitmq.repo 
[centos-rabbitmq-38]
name=CentOS-8 - RabbitMQ 38
#baseurl=http://mirror.centos.org/centos/$releasever/messaging/$basearch/rabbitmq-38
#mirrorlist=http://mirrorlist.centos.org/?release=$releasever&arch=$basearch&repo=messaging-rabbitmq-38
baseurl=https://mirrors.aliyun.com/centos/$releasever/messaging/$basearch/rabbitmq-38

gpgcheck=1
enabled=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-SIG-Messaging

[centos-rabbitmq-38-test]
name=CentOS-8 - RabbitMQ 38 Testing
baseurl=https://buildlogs.centos.org/centos/$releasever/messaging/$basearch/rabbitmq-38/
gpgcheck=0
enabled=0

[centos-rabbitmq-38-debuginfo]
name=CentOS-8 - RabbitMQ 38 - Debug
baseurl=http://debuginfo.centos.org/centos/$releasever/messaging/$basearch/
gpgcheck=1
enabled=0
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-SIG-Messaging

[centos-rabbitmq-38-source]
name=CentOS-8 - RabbitMQ 38 - Source
baseurl=http://vault.centos.org/centos/$releasever/messaging/Source/rabbitmq-38/
gpgcheck=1
enabled=0
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-SIG-Messaging


```


- CentOS-OpenStack-ussuri.repo


```bash

[root@cotroller01 yum.repos.d]# cat CentOS-OpenStack-ussuri.repo 
# CentOS-OpenStack-ussuri.repo
#
# Please see http://wiki.centos.org/SpecialInterestGroup/Cloud for more
# information

[centos-openstack-ussuri]
name=CentOS-$releasever - OpenStack ussuri
#baseurl=http://mirror.centos.org/$contentdir/$releasever/cloud/$basearch/openstack-ussuri/
#mirrorlist=http://mirrorlist.centos.org/?release=$releasever&arch=$basearch&repo=cloud-openstack-ussuri
baseurl=https://mirrors.aliyun.com/$contentdir/$releasever/cloud/$basearch/openstack-ussuri/
gpgcheck=1
enabled=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-SIG-Cloud
exclude=sip,PyQt4
module_hotfixes=1

[centos-openstack-ussuri-test]
name=CentOS-$releasever - OpenStack ussuri Testing
baseurl=https://buildlogs.centos.org/centos/$releasever/cloud/$basearch/openstack-ussuri/
gpgcheck=0
enabled=0
exclude=sip,PyQt4
module_hotfixes=1

[centos-openstack-ussuri-debuginfo]
name=CentOS-$releasever - OpenStack ussuri - Debug
baseurl=http://debuginfo.centos.org/centos/$releasever/cloud/$basearch/
gpgcheck=1
enabled=0
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-SIG-Cloud
exclude=sip,PyQt4
module_hotfixes=1

[centos-openstack-ussuri-source]
name=CentOS-$releasever - OpenStack ussuri - Source
baseurl=http://vault.centos.org/centos/$releasever/cloud/Source/openstack-ussuri/
gpgcheck=1
enabled=0
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-SIG-Cloud
exclude=sip,PyQt4
module_hotfixes=1

[rdo-trunk-ussuri-tested-component-baremetal]
name=rdo-trunk-ussuri-tested-component-baremetal
baseurl=https://trunk.rdoproject.org/centos8-ussuri/component/baremetal/current-tripleo-rdo
enabled=0
gpgcheck=0
module_hotfixes=1

[rdo-trunk-ussuri-tested-component-cinder]
name=rdo-trunk-ussuri-tested-component-cinder
baseurl=https://trunk.rdoproject.org/centos8-ussuri/component/cinder/current-tripleo-rdo
enabled=0
gpgcheck=0
module_hotfixes=1

[rdo-trunk-ussuri-tested-component-clients]
name=rdo-trunk-ussuri-tested-component-clients
baseurl=https://trunk.rdoproject.org/centos8-ussuri/component/clients/current-tripleo-rdo
enabled=0
gpgcheck=0
module_hotfixes=1

[rdo-trunk-ussuri-tested-component-cloudops]
name=rdo-trunk-ussuri-tested-component-cloudops
baseurl=https://trunk.rdoproject.org/centos8-ussuri/component/cloudops/current-tripleo-rdo
enabled=0
gpgcheck=0
module_hotfixes=1

[rdo-trunk-ussuri-tested-component-common]
name=rdo-trunk-ussuri-tested-component-common
baseurl=https://trunk.rdoproject.org/centos8-ussuri/component/common/current-tripleo-rdo
enabled=0
gpgcheck=0
module_hotfixes=1

[rdo-trunk-ussuri-tested-component-compute]
name=rdo-trunk-ussuri-tested-component-compute
baseurl=https://trunk.rdoproject.org/centos8-ussuri/component/compute/current-tripleo-rdo
enabled=0
gpgcheck=0
module_hotfixes=1

[rdo-trunk-ussuri-tested-component-glance]
name=rdo-trunk-ussuri-tested-component-glance
baseurl=https://trunk.rdoproject.org/centos8-ussuri/component/glance/current-tripleo-rdo
enabled=0
gpgcheck=0
module_hotfixes=1

[rdo-trunk-ussuri-tested-component-manila]
name=rdo-trunk-ussuri-tested-component-manila
baseurl=https://trunk.rdoproject.org/centos8-ussuri/component/manila/current-tripleo-rdo
enabled=0
gpgcheck=0
module_hotfixes=1

[rdo-trunk-ussuri-tested-component-network]
name=rdo-trunk-ussuri-tested-component-network
baseurl=https://trunk.rdoproject.org/centos8-ussuri/component/network/current-tripleo-rdo
enabled=0
gpgcheck=0
module_hotfixes=1

[rdo-trunk-ussuri-tested-component-octavia]
name=rdo-trunk-ussuri-tested-component-octavia
baseurl=https://trunk.rdoproject.org/centos8-ussuri/component/octavia/current-tripleo-rdo
enabled=0
gpgcheck=0
module_hotfixes=1

[rdo-trunk-ussuri-tested-component-security]
name=rdo-trunk-ussuri-tested-component-security
baseurl=https://trunk.rdoproject.org/centos8-ussuri/component/security/current-tripleo-rdo
enabled=0
gpgcheck=0
module_hotfixes=1

[rdo-trunk-ussuri-tested-component-swift]
name=rdo-trunk-ussuri-tested-component-swift
baseurl=https://trunk.rdoproject.org/centos8-ussuri/component/swift/current-tripleo-rdo
enabled=0
gpgcheck=0
module_hotfixes=1

[rdo-trunk-ussuri-tested-component-tempest]
name=rdo-trunk-ussuri-tested-component-tempest
baseurl=https://trunk.rdoproject.org/centos8-ussuri/component/tempest/current-tripleo-rdo
enabled=0
gpgcheck=0
module_hotfixes=1

[rdo-trunk-ussuri-tested-component-tripleo]
name=rdo-trunk-ussuri-tested-component-tripleo
baseurl=https://trunk.rdoproject.org/centos8-ussuri/component/tripleo/current-tripleo-rdo
enabled=0
gpgcheck=0
module_hotfixes=1

[rdo-trunk-ussuri-tested-component-ui]
name=rdo-trunk-ussuri-tested-component-ui
baseurl=https://trunk.rdoproject.org/centos8-ussuri/component/ui/current-tripleo-rdo
enabled=0
gpgcheck=0
module_hotfixes=1


```


- CentOS-Storage-common.repo


```bash
[root@cotroller01 yum.repos.d]# cat CentOS-Storage-common.repo 
# CentOS-Storage.repo
#
# Please see http://wiki.centos.org/SpecialInterestGroup/Storage for more
# information

[centos-storage-debuginfo]
name=CentOS-$releasever - Storage SIG - debuginfo
#baseurl=http://debuginfo.centos.org/$contentdir/$releasever/storage/$basearch/
baseurl=https://mirrors.aliyun.com/$contentdir/$releasever/storage/$basearch/
gpgcheck=1
enabled=0
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-SIG-Storage


```


###  更新yum包

- all node

> [!WARNING]
> - 在aliyun能找到这些包
> - 手动安装centos8 dns 配置 /etc/resolv.conf ,不存在手动创建
> - enabled = 0 禁用,不需要修改配置


```
[root@cotroller01 yum.repos.d]# yum upgrade -y
```


- 安装 python client


```bash
[root@cotroller01 yum.repos.d]#  yum install python3-openstackclient -y
```

- 安装openstack selinux

```
[root@cotroller01 yum.repos.d]# yum install openstack-selinux -y
```

- disable firewall


```bash
[root@cotroller01 yum.repos.d]# service firewalld stop
[root@cotroller01 yum.repos.d]# systemctl disable firewalld
```
###  hostname 修改
#### 控制节点

-  修改hostname 


```bash
hostnamectl set-hostname controller02  controller03  controller01

```

- 修改hosts配置 

```bash
# /etc/hosts
10.10.102.191 controller01
10.10.102.192 controller02
10.10.102.193 controller03
10.10.102.190 controller


```


- copy ssh-key

```bash
ssh-keygen # 一直回车

ssh-copy-id  root@controller01  root@controller02 root@controller03
```

#### 计算节点

__方法和控制节点一致__




## 安装基础服务

### mysql galera 集群

#### 在控制节点运行




- 安装mariadb all node


```bash
[root@cotroller01 yum.repos.d]# yum install mariadb-server mariadb galera xinetd rsync lsof -y
[root@cotroller01 yum.repos.d]# yum -y install  python3-PyMySQL
```

- 安装galera server
 - only controller 01

```bash
[root@cotroller01 yum.repos.d]# yum -y install mariadb-galera-server
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

#### 安装错误

> [!WARNING] 需要关闭防火墙

```bash
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

> [!WARNING] 安装lsof


```bash
2020-07-17 15:50:48 0 [Note] WSREP: Running: 'wsrep_sst_rsync --role 'joiner' --address '10.10.102.192' --datadir '/var/lib/mysql/'   --parent '8896'  ''  '''
2020-07-17 15:50:48 0 [ERROR] WSREP: Failed to read 'ready <addr>' from: wsrep_sst_rsync --role 'joiner' --address '10.10.102.192' --datadir '/var/lib/mysql/'   --parent '8896'  ''  ''
        Read: ''lsof' not found in PATH'
2020-07-17 15:50:48 0 [ERROR] WSREP: Process completed with error: wsrep_sst_rsync --role 'joiner' --address '10.10.102.192' --datadir '/var/lib/mysql/'   --parent '8896'  ''  '': 2 (No such file or directory)
2020-07-17 15:50:48 2 [ERROR] WSREP: Failed to prepare for 'rsync' SST. Unrecoverable.
2020-07-17 15:50:48 2 [ERROR] Aborting


```



### rabbitmq 集群


#### 安装 

- all  controller nodes

```bash
[root@controller03 ~]#  yum install rabbitmq-server -y
[root@controller03 ~]#  systemctl enable rabbitmq-server.service

```

#####  controller01 执行

```bash
[root@controller01 ~]# service rabbitmq-server start   # 启动完成生成文件 /var/lib/rabbitmq/.erlang.cookie
# copy文件到controller02 , controller03

[root@controller01 ~]# scp /var/lib/rabbitmq/.erlang.cookie root@controller03:/var/lib/rabbitmq/.erlang.cookie

```



##### controller02 ,controller03 执行
- 修改文件权限 

```bash
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

#### 创建用户,配置权限


```bash
[root@controller01 ~]#  rabbitmqctl add_user openstack openstack
Creating user "openstack"
[root@controller01 ~]# rabbitmqctl set_permissions openstack ".*" ".*" ".*"
Setting permissions for user "openstack" in vhost "/"


```



### memache 安装

- 安装

```bash
## all nodes执行
[root@controller02 ~]# yum install memcached python3-memcached -y
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


- test



```bash
[root@controller01 ~]# telnet controller01 11211
Trying 10.10.102.191...
Connected to controller01.
Escape character is '^]'.
^]
telnet> q
Connection closed.
[root@controller01 ~]# 


```

### ntp 服务器

- 安装

```bash
# all nodes include compute nodes
# centos 8 安装安装了?
[root@controller03 ~]#  yum install chrony -y
[root@controller03 ~]# systemctl enable chronyd.service
[root@controller03 ~]# vim /etc/chrony.conf 

#pool 2.centos.pool.ntp.org iburst
pool  ntp1.aliyun.com  iburst
pool ntp2.aliyun.com  iburst


# enable
[root@controller03 ~]# timedatectl set-ntp yes
[root@controller03 ~]# systemctl restart chronyd.service
[root@controller03 ~]# systemctl enable chronyd
```

- test



```bash
[root@controller02 ~]#  tcpdump port 123 -i ens3
tcpdump: verbose output suppressed, use -v or -vv for full protocol decode
listening on ens3, link-type EN10MB (Ethernet), capture size 262144 bytes


16:43:08.041038 IP controller02.50622 > 120.25.115.20.ntp: NTPv4, Client, length 48
16:43:08.066173 IP 120.25.115.20.ntp > controller02.50622: NTPv4, Server, length 48
16:43:08.656191 IP controller02.35652 > 203.107.6.88.ntp: NTPv4, Client, length 48
16:43:08.679818 IP 203.107.6.88.ntp > controller02.35652: NTPv4, Server, length 48
^C
4 packets captured
4 packets received by filter
0 packets dropped by kernel
[root@controller02 ~]# ping  ntp1.aliyun.com
PING ntp1.aliyun.com (120.25.115.20) 56(84) bytes of data.
64 bytes from 120.25.115.20 (120.25.115.20): icmp_seq=1 ttl=49 time=25.6 ms
^C
--- ntp1.aliyun.com ping statistics ---
1 packets transmitted, 1 received, 0% packet loss, time 0ms
rtt min/avg/max/mdev = 25.591/25.591/25.591/0.000 ms

[root@controller03 ~]# chronyc sources
210 Number of sources = 2
MS Name/IP address         Stratum Poll Reach LastRx Last sample               
===============================================================================
^* 120.25.115.20                 2   6    17     5   +237us[ -224us] +/-   16ms
^- 203.107.6.88                  2   6    17     5  -2159us[-2159us] +/-   21ms


```

### etcd 

```bash
#没用到, 先不安装。等出错在<处理

```


> [!WARNING] memcache 官方说明,不需要高可用安装,只是存cache



## keystone 安装


### 创建vip 

 - 用来安装, 手动创建vip  

```bash
[root@controller01 ~]# ip address add dev ens5 10.10.102.190/24

```

### controller01 操作

#### 初始化数据库

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

#### 安装keystone

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

#### 同步数据

```bash
[root@controller01 ~]# su -s /bin/sh -c "keystone-manage db_sync" keystone
```

#### 初始化key仓库

```bash
[root@controller01 ~]# keystone-manage fernet_setup --keystone-user keystone --keystone-group keystone
[root@controller01 ~]# keystone-manage credential_setup --keystone-user keystone --keystone-group keystone



```
#### boot 认证



```
[root@controller01 ~]# keystone-manage bootstrap --bootstrap-password admin  --bootstrap-admin-url http://controller:5000/v3/  --bootstrap-internal-url http://controller:5000/v3/   --bootstrap-public-url http://controller:5000/v3/ --bootstrap-region-id RegionOne

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
export OS_USERNAME=admin
export OS_PASSWORD=admin
export OS_PROJECT_NAME=admin
export OS_USER_DOMAIN_NAME=Default
export OS_PROJECT_DOMAIN_NAME=Default
export OS_AUTH_URL=http://controller:5000/v3
export OS_IDENTITY_API_VERSION=3



```

#### 验证是否安装成功

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


###  controller02 , controller03 安装配置
 - controller01一样, 不需要执行初始化数据库操作，其他的操作都要执行



### 高可用测试


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



## glance 安装


### controller01 

#### 环境准备

##### 初始化数据库


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

##### create project


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

##### create user



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

##### Add the admin role to the glance user and service project

```
[root@controller01 ~]# openstack role add --project service --user glance admin
[root@controller01 ~]# 

```

#####  Create the glance service entity:


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

##### Create the Image service API endpoints


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


> [!WARNING] centos rdo 安装 cli 缺少创建项目



#### 安装glance 


##### Install the packages

```bash
[root@controller02 ~]# yum install openstack-glance -y

```



##### Edit the /etc/glance/glance-api.conf 

```bash
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


##### Populate the Image service database:

```bash
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


#####  start

```bash
[root@controller01 ~]#  systemctl enable openstack-glance-api.service
Created symlink /etc/systemd/system/multi-user.target.wants/openstack-glance-api.service → /usr/lib/systemd/system/openstack-glance-api.service.
[root@controller01 ~]# systemctl start openstack-glance-api.service
[root@controller01 ~]# 


```


## nova

- [参考centos7 nova 安装](/iaas/cloud/openstack/centos7_install?id=nova-高可用安装)
## neutron

- [参考centos7 neturon 安装](/iaas/cloud/openstack/centos7_install?id=高可用安装neutronovn)

## horizon

- [参考centos7 horizon 安装](/iaas/cloud/openstack/centos7_install?id=horizon-高可用安装)

