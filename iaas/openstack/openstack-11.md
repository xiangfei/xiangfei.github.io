---
title: openstack stein 高可用安装horizon
date: 2020-05-21 13:49:49
author: 相飞
comments:
- true
tags:
- openstack
categories:
- openstack

---



### controller01

#### 安装包

```bash
[root@controller01 ~]# yum install openstack-dashboard -y

```


#### 修改文件 __/etc/openstack-dashboard/local_settings__



```bash
OPENSTACK_HOST = "controller"
ALLOWED_HOSTS = ['one.example.com', 'two.example.com' , '*']




SESSION_ENGINE = 'django.contrib.sessions.backends.cache'

CACHES = {
    'default': {
         'BACKEND': 'django.core.cache.backends.memcached.MemcachedCache',
         'LOCATION': 'controller01:11211,controller02:11211,controller03:11211',
    }
}


OPENSTACK_KEYSTONE_URL = "http://%s:5000/v3" % OPENSTACK_HOST

OPENSTACK_KEYSTONE_MULTIDOMAIN_SUPPORT = True


OPENSTACK_API_VERSIONS = {
    "identity": 3,
    "image": 2,
    "volume": 3,
}

OPENSTACK_KEYSTONE_DEFAULT_DOMAIN = "Default"

OPENSTACK_KEYSTONE_DEFAULT_ROLE = "user"

OPENSTACK_NEUTRON_NETWORK = {
    ...
    'enable_router': False,
    'enable_quotas': False,
    'enable_distributed_router': False,
    'enable_ha_router': False,
    'enable_lb': False,
    'enable_firewall': False,
    'enable_vpn': False,
    'enable_fip_topology_check': False,
}

TIME_ZONE = "Asia/Shanghai"

```

#### 修改配置文件  __/etc/httpd/conf.d/openstack-dashboard.conf__



```bash
#不存在 在加 ,当前版本不存在
WSGIApplicationGroup %{GLOBAL}


```


#### 重启

```bash
[root@controller01 ~]# systemctl restart httpd.service memcached.service
```
