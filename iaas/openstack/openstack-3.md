---
title: openstack  存储 iscsi
date: 2020-04-15 09:28:09
author: 相飞
comments:
- true
tags:
- openstack
categories:
- openstack


---



```
 tgtadm --lld iscsi --op show --mode target

 iscsiadm -m node -T targetname -p ipaddress -l
  iscsiadm -m node -o show

iscsiadm   -m node   -T   iqn.2010-10.org.openstack:volume-feb085f0-5055-4dbf-afe8-6810077fd821   -p 192.168.50.3:3260   -o update  -n node.session.auth.username -v Qz9gqHQnqN92zzj22JsU
iscsiadm   -m node   -T   iqn.2010-10.org.openstack:volume-feb085f0-5055-4dbf-afe8-6810077fd821   -p 192.168.50.3:3260   -o update  -n node.session.auth.password -v vfbNFdJYBFuA66hR
server 

yum -y install scsi-target-utils


dd if=/dev/zero of=storage.img bs=1M count=2000

<target iqn.2010-10.org.opennebula:storage>
    backing-store /root/storage.img
    driver iscsi
    incominguser root 123456
    write-cache on
</target>





```
