---
title: openstack ussuri centos8 高可用安装 env 准备
date: 2020-07-17 10:05:49
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



# 基本信息

|  vip   | 管理ip ens5 | 存储ip ens6| 外网ip(br-ex ens3) | 内部ip (br-int ens4)| host  | OS |
|  ----   | ----  | ---- | ---- | ----  | ---- |  ----  | ---- |
| 10.10.102.190 |  10.10.102.191 | 10.10.100.191  | 192.168.151.191 | - | controller01   |  centos 8  |
| 10.10.102.190 |  10.10.102.192 | 10.10.100.192  | 192.168.151.192 | - | controller02 |  centos 8  |
| 10.10.102.190 |  10.10.102.193 | 10.10.100.193  | 192.168.151.193 | - | controller03 |  centos 8  |
|     |  192.168.151.194 |   |  |  | compute01  |  centos 7  |





### All 节点

- 更新yum 

```
[root@cotroller01 yum.repos.d]# yum upgrade -y
```


- 安装 python client


```
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

### 控制节点

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

