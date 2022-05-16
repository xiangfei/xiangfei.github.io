---
title: openstack  stein 高可用安装neutron(ovn)
date: 2020-05-21 10:03:19
author: 相飞
comments:
- true
tags:
- openstack
categories:
- openstack

---





## ovn 准备

gateway node   ovn-central

database node

compute node ovn-host


## controler 01


### 安装neutron 


#### 数据库
```bash
MariaDB [(none)]> CREATE DATABASE neutron;
Query OK, 1 row affected (0.006 sec)

MariaDB [(none)]> GRANT ALL PRIVILEGES ON neutron.* TO 'neutron'@'localhost'  IDENTIFIED BY  'neutron';
Query OK, 0 rows affected (0.007 sec)

MariaDB [(none)]>  GRANT ALL PRIVILEGES ON neutron.* TO 'neutron'@'%'  IDENTIFIED BY  'neutron';
Query OK, 0 rows affected (0.006 sec)

MariaDB [(none)]> exit


```

#### 创建service endpoint

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

#### neutron ovn 安装


```bash
[root@controller01 ~]# yum install openstack-neutron openstack-neutron-ml2   openvswitch-ovn-central openvswitch-ovn-vtep python2-networking-ovn   libibverbs  -y

```

#### 配置ovn sb nb remote 访问port

```bash
[root@controller01 ~]# systemctl enable openvswitch
[root@controller01 ~]# systemctl enable ovn-northd
[root@controller01 ~]#  service ovn-northd start
[root@controller01 ~]# ovn-nbctl set-connection ptcp:6641:0.0.0.0  -- set connection . inactivity_probe=60000
[root@controller01 ~]# ovn-sbctl set-connection ptcp:6642:0.0.0.0  -- set connection . inactivity_probe=60000
[root@controller01 ~]#  ovs-appctl -t ovsdb-server ovsdb-server/add-remote ptcp:6640:0.0.0.0


```

#### 配置文件修改

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

#### 修改配置文件

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

#### mark gateway nodes
```bash
[root@controller01 ~]# ovs-vsctl set open . external-ids:ovn-cms-options=enable-chassis-as-gw

```

#### nova 修改配置
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


#### 同步数据
```bash
[root@controller01 ~]# ln -s /etc/neutron/plugins/ml2/ml2_conf.ini /etc/neutron/plugin.ini
[root@controller01 ~]# su -s /bin/sh -c "neutron-db-manage --config-file /etc/neutron/neutron.conf --config-file /etc/neutron/plugins/ml2/ml2_conf.ini upgrade head" neutron


```

#### 启动

```bash
[root@controller01 ~]# systemctl restart openstack-nova-api.service  openstack-nova-scheduler.service openstack-nova-conductor.service openstack-nova-novncproxy.service
[root@controller01 ~]# systemctl enable neutron-server.service
[root@controller01 ~]# systemctl start neutron-server.service

```

## controller02 , controller03

```bash



```


## compute node


#### 安装 ovn

```bin
[root@compute01 ~]# yum install   openvswitch-ovn-host openvswitch-ovn-vtep python2-networking-ovn   python2-networking-ovn-metadata-agent  libibverbs -y
```
#### add neutron in nova
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


#### 启动

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


#### 查看

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


## 说明

- ovn远程配置的是vip 
- ovsdb vip 是master , controller ip slave ,配置ovsdb server 同步




## ovn cluster 配置



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

## ovn master slave 配置

```bash

[root@controller01 ~]# /usr/share/openvswitch/scripts/ovn-ctl  start_northd     --db-sb-sync-from-addr=192.168.151.170     --db-nb-sync-from-addr=192.168.151.170  --db-sb-create-insecure-remote=yes  --db-nb-create-insecure-remote=yes

[root@controller03 ~]# /usr/share/openvswitch/scripts/ovn-ctl  start_northd     --db-sb-sync-from-addr=192.168.151.170     --db-nb-sync-from-addr=192.168.151.170  --db-sb-create-insecure-remote=yes  --db-nb-create-insecure-remote=yes

[root@controller02 ~]# /usr/share/openvswitch/scripts/ovn-ctl  start_northd     --db-sb-sync-from-addr=192.168.151.170     --db-nb-sync-from-addr=192.168.151.170  --db-sb-create-insecure-remote=yes  --db-nb-create-insecure-remote=yes


# 配置换成 floating ip 
```
