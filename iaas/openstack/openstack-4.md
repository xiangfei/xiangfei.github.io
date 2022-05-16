---
title: openstack stein 高可用安装 -- 环境准备
date: 2020-05-20 13:54:14
author: 相飞
comments:
- true
tags:
- openstack
categories:
- openstack


---


# 基本信息

|  vip   | 管理ip  | 存储ip | 外网ip |  host  | OS |
|  ----   | ----  | ---- | ---- | ----  | ---- |  ----  |
| 192.168.151.200 |  192.168.151.71 |   |   | controller01   |  centos 7  |
| 192.168.151.200 |  192.168.151.72 |   |   | controller02 |  centos 7  |
| 192.168.151.200 |  192.168.151.73 |   |   | controller03 |  centos 7  |
|     |  192.168.151.74 |   |   | compute01  |  centos 7  |
  


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

