---
title: openstack ussuri centos8 高可用安装  ceph 集群安装
date: 2020-08-06 10:53:35
author: 相飞
comments:
- true
tags:
- openstack
- centos8
- ceph
categories:
- openstack
- centos8
- ceph

---


### 结构

```bash
[root@controller02 ~]# cat /etc/hosts 
127.0.0.1   localhost localhost.localdomain localhost4 localhost4.localdomain4
::1         localhost localhost.localdomain localhost6 localhost6.localdomain6
10.10.102.191 controller01
10.10.102.192 controller02
10.10.102.193 controller03
10.10.102.190 controller
10.10.100.191 ceph-controller01
10.10.100.192 ceph-controller02
10.10.100.193 ceph-controller03


```



### all controller 执行


```bash
[root@controller02 ~]# yum -y install ceph ceph-radosgw

```

> 需要拷贝公钥(已经在环境准备中完成)


### ceph-controller01 执行

- 配置monitor manage
 - /etc/ceph/ceph.conf

```bash
[global]
# specify cluster network for monitoring
cluster network = 10.10.100.0/24
# specify public network
public network = 10.10.100.0/24
# specify UUID genarated above
fsid = 38bc3fbb-1752-4cb1-b16c-2e9d5d402891
# specify IP address of Monitor Daemon
mon host = 10.10.100.191,10.10.100.192,10.10.100.193
# specify Hostname of Monitor Daemon
mon initial members = ceph-controller01,ceph-controller02,ceph-controller03
osd pool default crush rule = -1
# mon.(Node name)
[mon.ceph-controller01]
# specify Hostname of Monitor Daemon
host = ceph-controller01
# specify IP address of Monitor Daemon
mon addr = 10.10.100.191
# allow to delete pools
mon allow pool delete = true
# mon.(Node name)
[mon.ceph-controller02]
# specify Hostname of Monitor Daemon
host = ceph-controller02
# specify IP address of Monitor Daemon
mon addr = 10.10.100.192
# allow to delete pools
mon allow pool delete = true

# mon.(Node name)
[mon.ceph-controller03]
# specify Hostname of Monitor Daemon
host = ceph-controller03
# specify IP address of Monitor Daemon
mon addr = 10.10.100.193
# allow to delete pools
mon allow pool delete = true

```

- 创建密钥

```bash
[root@controller01 ~]#  ceph-authtool --create-keyring /etc/ceph/ceph.mon.keyring --gen-key -n mon. --cap mon 'allow *'
creating /etc/ceph/ceph.mon.keyring
```

- 创建adminkey

```bash
[root@controller01 ~]# ceph-authtool --create-keyring /etc/ceph/ceph.client.admin.keyring --gen-key -n client.admin --cap mon 'allow *' --cap osd 'allow *' --cap mds 'allow *' --cap mgr 'allow *'
creating /etc/ceph/ceph.client.admin.keyring

```

- 创建bootstrap key

```bash
[root@controller01 ~]#  ceph-authtool --create-keyring /var/lib/ceph/bootstrap-osd/ceph.keyring --gen-key -n client.bootstrap-osd --cap mon 'profile bootstrap-osd' --cap mgr 'allow r'
creating /var/lib/ceph/bootstrap-osd/ceph.keyring
```

- 导入key

```bash
# 需要导入2个key
[root@controller01 ~]# ceph-authtool /etc/ceph/ceph.mon.keyring --import-keyring /etc/ceph/ceph.client.admin.keyring
importing contents of /etc/ceph/ceph.client.admin.keyring into /etc/ceph/ceph.mon.keyring
[root@controller01 ~]#  ceph-authtool /etc/ceph/ceph.mon.keyring --import-keyring /var/lib/ceph/bootstrap-osd/ceph.keyring
importing contents of /var/lib/ceph/bootstrap-osd/ceph.keyring into /etc/ceph/ceph.mon.keyring

```

- 创建monitor map

```bash
#  cobber覆盖已有的monmaptool
#  fsid  ceph.conf 文件的uuidgen key
[root@controller01 ~]# monmaptool --create --add  ceph-controller01  10.10.100.191    --add ceph-controller02 10.10.100.192  --add ceph-controller03 10.10.100.193 --fsid  38bc3fbb-1752-4cb1-b16c-2e9d5d402891   /etc/ceph/monmap --clobber
monmaptool: monmap file /etc/ceph/monmap
monmaptool: set fsid to 38bc3fbb-1752-4cb1-b16c-2e9d5d402891
monmaptool: writing epoch 0 to /etc/ceph/monmap (3 monitors)


```

-  add ceph monitor daemon 

```bash
[root@controller01 ~]#  mkdir -p /var/lib/ceph/mon/ceph-controller01
[root@controller01 ~]# ceph-mon --cluster ceph --mkfs -i ceph-controller01 --monmap /etc/ceph/monmap --keyring /etc/ceph/ceph.mon.keyring
[root@controller01 ~]# chown ceph. /etc/ceph/ceph.*
[root@controller01 ~]#  chown -R ceph. /var/lib/ceph/mon/ceph-ceph-controller01  /var/lib/ceph/bootstrap-osd
[root@controller01 ~]#  systemctl enable --now ceph-mon@ceph-controller01 # --now 启动ceoh-mon
Created symlink /etc/systemd/system/ceph-mon.target.wants/ceph-mon@ceph-controller01.service → /usr/lib/systemd/system/ceph-mon@.service.

```



### 安装问题

- 启动直接报错
  
```
2020-08-06T11:17:34.411+0800 7f73b8337700  4 rocksdb: [db/db_impl.cc:390] Shutdown: canceling all background work
2020-08-06T11:17:34.412+0800 7f73b8337700  4 rocksdb: [db/db_impl.cc:563] Shutdown complete
2020-08-06T11:17:34.412+0800 7f73b8337700  0 ceph-mon: created monfs at /var/lib/ceph/mon/ceph-ceph-controller01 for mon.ceph-controller01
[root@controller01 ceph]# 

```

- 解决在配置文件增加参数

```bash
[root@controller01 ~]# vim /etc/ceph/ceph.conf 
[global]
osd max object name len = 256
osd max object namespace len = 64

# 重新生成mon文件

[root@controller01 ~]# monmaptool --create --generate -c /etc/ceph/ceph.conf /etc/ceph/monmap --clobber
monmaptool: monmap file /etc/ceph/monmap
monmaptool: set fsid to 38bc3fbb-1752-4cb1-b16c-2e9d5d402891
monmaptool: writing epoch 0 to /etc/ceph/monmap (3 monitors)

```

- 启动报错monmap 不匹配


```bash
2020-08-06T14:36:14.915+0800 7f47ac57e700 -1 WARNING: 'mon addr' config option [v2:10.10.100.191:3300/0,v1:10.10.100.191:6789/0] does not match monmap file
         continuing with monmap configuration


# 日志启用v2
[root@controller01 ceph]# monmaptool --print /etc/ceph/monmap 
monmaptool: monmap file /etc/ceph/monmap
epoch 0
fsid 38bc3fbb-1752-4cb1-b16c-2e9d5d402891
last_changed 2020-08-06T16:44:53.931188+0800
created 2020-08-06T16:44:53.931188+0800
min_mon_release 0 (unknown)
0: v1:10.10.100.191:6789/0 mon.ceph-controller01

# 解决方式

[root@controller01 ~]# monmaptool --clobber  --create   --addv  ceph-controller01  [v2:10.10.100.191:3000,v1:10.10.100.191:6789]  /etc/ceph/monmap 
monmaptool: monmap file /etc/ceph/monmap
monmaptool: generated fsid 1699c718-c714-4140-9967-1604408601e6
monmaptool: writing epoch 0 to /etc/ceph/monmap (1 monitors)
[root@controller01 ~]# 
[root@controller01 ~]# monmaptool  --print /etc/ceph/monmap 
monmaptool: monmap file /etc/ceph/monmap
epoch 0
fsid 1699c718-c714-4140-9967-1604408601e6
last_changed 2020-08-07T14:04:09.285750+0800
created 2020-08-07T14:04:09.285750+0800
min_mon_release 0 (unknown)
0: [v2:10.10.100.191:3000/0,v1:10.10.100.191:6789/0] mon.ceph-controller01


```


