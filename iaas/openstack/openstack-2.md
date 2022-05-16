---
title: openstack 存储问题
date: 2020-04-15 09:10:23
author: 相飞
comments:
- true
tags:
- openstack
categories:
- openstack


---


mount 存储 一直pending

> br-aux 网络异常，cinder-volume 进程报错  
> vip 不能访问



存储disk 找不不到

> detach
> 手动创建snapshot ，导出存储
> lvscan 发现inactive ，enable it




