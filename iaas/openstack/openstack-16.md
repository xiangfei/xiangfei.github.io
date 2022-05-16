---
title: openstack ussuri centos8 高可用安装 memache , etcd , ntp
date: 2020-07-17 16:30:00
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


## memache 安装

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

## ntp 服务器

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

## etcd 

```bash
#没用到, 先不安装。等出错在<处理

```


> memcache 官方说明,不需要高可用安装,只是存cache
