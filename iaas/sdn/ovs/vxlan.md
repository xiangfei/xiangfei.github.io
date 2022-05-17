# centos7 ovs vxlan network 


## 安装(controller node)

### 配置网桥
```bash
[root@kvm5 ~]# cat /etc/sysconfig/network-scripts/ifcfg-br-int 
DEVICE=br-int
BOOTPROTO=static
ONBOOT=yes
NM_CONTROLLED=no
IPADDR=10.4.1.5
NETMASK=255.255.0.0
GATEWAY=10.4.0.1
DEVICETYPE=ovs
TYPE=OVSTunnel
OVS_BRIDGE=br-int
OVS_TUNNEL_TYPE=vxlan
OVS_TUNNEL_OPTIONS="options:remote_ip=compute_node_ip_01"
OVS_TUNNEL_OPTIONS="options:remote_ip=compute_node_ip_02"
OVS_TUNNEL_OPTIONS="options:remote_ip=compute_node_ip_03"
OVS_TUNNEL_OPTIONS="options:remote_ip=compute_node_ip_04"

```

### 物理网卡

```bash
[root@kvm5 ~]# cat /etc/sysconfig/network-scripts/ifcfg-em1 
TYPE=Ethernet
PROXY_METHOD=none
BROWSER_ONLY=no
BOOTPROTO=none
DEFROUTE=yes
IPV4_FAILURE_FATAL=no
IPV6INIT=yes
IPV6_AUTOCONF=yes
IPV6_DEFROUTE=yes
IPV6_FAILURE_FATAL=no
IPV6_ADDR_GEN_MODE=stable-privacy
NAME=em1
UUID=0552f789-7f14-4ce4-8575-71165d895cca
DEVICE=em1
ONBOOT=yes
TYPE=OVSPort
DEVICETYPE=ovs
OVS_BRIDGE=br-int

```


### 重启

```bash
service openvswitch restart

```


### 安装(compute node)

- 安装步骤一致，没有区别

#### 配置网桥

```bash
 cat /etc/sysconfig/network-scripts/ifcfg-br-int 
DEVICE=br-int
BOOTPROTO=static
ONBOOT=yes
NM_CONTROLLED=no
IPADDR=10.4.1.6
NETMASK=255.255.0.0
GATEWAY=10.4.0.1
DEVICETYPE=ovs
TYPE=OVSTunnel
OVS_BRIDGE=br-int
OVS_TUNNEL_TYPE=vxlan
OVS_TUNNEL_OPTIONS="options:remote_ip=controller_node_ip"


```