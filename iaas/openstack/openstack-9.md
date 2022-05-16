---
title: openstack stein 高可用安装(nova)
date: 2020-05-21 08:36:07
author: 相飞
comments:
- true
tags:
- openstack
categories:
- openstack

---


## controller01


### 安装数据库


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

### 创建service endpoint user

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

### 安装nova 


```bash
[root@controller01 ~]# yum install openstack-nova-api openstack-nova-conductor   openstack-nova-novncproxy openstack-nova-scheduler -y

```

### 修改配置文件

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

### 同步数据


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


### 启动
  __nova-consoleauth__ stein版本已经删除了
```bash
[root@controller01 ~]#  systemctl enable openstack-nova-api.service  openstack-nova-scheduler.service openstack-nova-conductor.service openstack-nova-novncproxy.service
[root@controller01 ~]#  systemctl start openstack-nova-api.service  openstack-nova-scheduler.service openstack-nova-conductor.service openstack-nova-novncproxy.service

```
### ERROR

- OperationalError: (pymysql.err.OperationalError) (1040, u'Too many connections')
  - vim /etc/my.cnf.d/mariadb-server.cnf   [mysqld] max_connections=3000

## controller02 , controller03


### 安装nova 


```bash
[root@controller01 ~]# yum install openstack-nova-api openstack-nova-conductor   openstack-nova-novncproxy openstack-nova-scheduler -y

```

### 修改配置文件

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


### 启动
  __nova-consoleauth__ stein版本已经删除了
```bash
[root@controller01 ~]#  systemctl enable openstack-nova-api.service  openstack-nova-scheduler.service openstack-nova-conductor.service openstack-nova-novncproxy.service
[root@controller01 ~]#  systemctl start openstack-nova-api.service  openstack-nova-scheduler.service openstack-nova-conductor.service openstack-nova-novncproxy.service

```



## compute01


### 安装 compute api


```bash
[root@compute01 ~]# yum install openstack-nova-compute -y
```

### 修改配置文件

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

### 启动


```bash
[root@compute01 ~]# systemctl enable libvirtd.service openstack-nova-compute.service
Created symlink from /etc/systemd/system/multi-user.target.wants/openstack-nova-compute.service to /usr/lib/systemd/system/openstack-nova-compute.service.
[root@compute01 ~]#  systemctl start libvirtd.service openstack-nova-compute.service


```

### /etc/hosts


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

### add to controller



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

## error

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

> overcommit


```
root@controller01:~# nova aggregate-set-metadata node108  cpu_allocation_ratio=16.0 

```
