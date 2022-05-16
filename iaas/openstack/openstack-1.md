---
title: openstack IDC 问题 网络
date: 2020-04-15 09:02:41
author: 相飞
comments:
- true
tags:
- openstack
categories:
- openstack

---


####  br-aux 网络问题

不能访问外网 , 内部ip互通

> br-aux 网卡 off line
> 重启网卡,失败，去机房换网线

```bash
<46>Apr 13 17:55:41 controller01 horizon_access - - - [13/Apr/2020:17:55:34 +0800] "OPTIONS / HTTP/1.0" 301 240 194 "-" "-"
<46>Apr 13 17:55:41 controller01 horizon_access - - - [13/Apr/2020:17:55:36 +0800] "OPTIONS / HTTP/1.0" 301 240 187 "-" "-"
<46>Apr 13 17:55:41 controller01 horizon_access - - - [13/Apr/2020:17:55:38 +0800] "OPTIONS / HTTP/1.0" 301 240 191 "-" "-"
<46>Apr 13 17:55:41 controller01 horizon_access - - - [13/Apr/2020:17:55:40 +0800] "OPTIONS / HTTP/1.0" 301 240 164 "-" "-"
<6>Apr 13 17:55:42 controller01 kernel: [96277.132056] tg3 0000:02:00.1 eno4: Link is down
<6>Apr 13 17:55:42 controller01 kernel: [96277.132179] br-aux: port 1(eno4) entered disabled state

```


####  compute00 dhcp 异常

compute00 内网ip 不能分配到floating ip , 其他compute节点可以


> compute00 交换机上联口， 网卡插错



####  vip 访问失败

可以telnet物理 ip port   , vip telnet 报错

> packemaker 导致，停止pacemaker





