---
title: openstack ussuri centos8 高可用安装 yum 替换
date: 2020-07-17 09:31:18
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


## 替换centos 8 源

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

## 安装openstack 源

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


## 替换源文件

- advanced-virtualuzation.repo

```
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


```
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


```
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


```

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


```
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



> 在aliyun能找到这些包
> 手动安装centos8 dns 配置 /etc/resolv.conf ,不存在手动创建
> enabled = 0 禁用,不需要修改配置
