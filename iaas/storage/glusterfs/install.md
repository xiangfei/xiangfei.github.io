

# glusterfs centos7高可用安装


| IP          | Description | 
| ----------- | ----------- |
| 10.4.2.110  | vip         |
| 10.4.2.111  | glusterfs-01  keepalived  / 系统盘  /sata 数据盘|
| 10.4.2.112  | glusterfs-02  keepalived / 系统盘  /sata 数据盘 |
| 10.4.2.113  | glusterfs-03  / 系统盘  /sata 数据盘 |


##  安装yum

- 3 台机器执行
  - `需要关闭防火墙selinux`

```bash
yum -y install centos-release-gluster
yum install -y glusterfs glusterfs-server glusterfs-fuse glusterfs-rdma
systemctl enable glusterd
systemctl start glusterd

```

### 增加hostname
- 3台机器

```bash
vi /etc/hosts

...
10.4.2.111 gluster-01
10.4.2.112 gluster-02
10.4.2.113 gluster-03

...

```


## 配置集群
- 选择其中一台机器
  - `gluster-01`  node


```bash
gluster peer probe  gluster-02
gluster peer probe  gluster-03
```


## 配置vip
- gluster-01, gluster-02 执行

```bash
yum -y install keepalived
systemctl enable keepalived

```

###  gluster-01
```bash

global_defs {
 router_id LVS_DEVEL
}

vrrp_instance VI_1 {
   state MASTER
   unicast_src_ip 10.4.2.111
   unicast_peer {
    10.4.2.112
   }
   interface eth0
   virtual_router_id 51
   priority 101
   authentication {
       auth_type PASS
       auth_pass 888888
   }
   virtual_ipaddress {
       10.4.2.110
   }
}

```


###  gluster-02
```bash

global_defs {
 router_id LVS_DEVEL
}

vrrp_instance VI_1 {
   state MASTER
   unicast_src_ip 10.4.2.112
   unicast_peer {
    10.4.2.111
   }
   interface eth0
   virtual_router_id 51
   priority 102
   authentication {
       auth_type PASS
       auth_pass 888888
   }
   virtual_ipaddress {
       10.4.2.110
   }
}

```

### 启动keepalived

-  gluster-02 gluster-01 

```bash
systemctl start keepalived

```