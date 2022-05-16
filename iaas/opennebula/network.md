
## 8021q网络配置
> 配置和liux vxlan类似
  - ifcfg-eth0.192
  - ip link add link eth0 name eth0.8 type vlan id 8
  - ip -d link show eth0.8
需要内核支持802.1q协议
```bash
[root@master ~]# modinfo 8021q
filename:       /lib/modules/3.10.0-862.14.4.el7.x86_64/kernel/net/8021q/8021q.ko.xz
version:        1.8
license:        GPL
alias:          rtnl-link-vlan
retpoline:      Y
rhelversion:    7.5
srcversion:     A57F0AC30965A554203D4E3
depends:        mrp,garp
intree:         Y
vermagic:       3.10.0-862.14.4.el7.x86_64 SMP mod_unload modversions 
signer:         CentOS Linux kernel signing key
sig_key:        E4:A1:B6:8F:46:8A:CA:5C:22:84:50:53:18:FD:9D:AD:72:4B:13:03
sig_hashalgo:   sha256
```
## ovs 网络配置

#### opennebula 需要手动配置 #
1. 安装ovs
```bash
yum install centos-release-openstack-rocky
yum install openvswitch
```

2. ovs网桥,增加开机自动启动
  - eth0 配置

	```bash
	DEVICE=eth0
	ONBOOT=yes
	DEVICETYPE=ovs
	TYPE=OVSPort
	OVS_BRIDGE=ovsbridge0
	BOOTPROTO=none
	HOTPLUG=no
	```
  - gre  配置
	
	```bash
	DEVICE=ovs-gre0
	ONBOOT=yes
	DEVICETYPE=ovs
	TYPE=OVSTunnel
	OVS_BRIDGE=ovsbridge0
	OVS_TUNNEL_TYPE=gre
	OVS_TUNNEL_OPTIONS="options:remote_ip=A.B.C.D"
	```

  - vxlan 配置
	```bash
	DEVICE=ovs-gre0
	ONBOOT=yes
	DEVICETYPE=ovs
	TYPE=OVSTunnel
	OVS_BRIDGE=ovsbridge0
	OVS_TUNNEL_TYPE=vxlan
	OVS_TUNNEL_OPTIONS="options:remote_ip=A.B.C.D"```
  
  - patch  配置
	```bash
	DEVICE=patch-ovs-0
	ONBOOT=yes
	DEVICETYPE=ovs
	TYPE=OVSPatchPort
	OVS_BRIDGE=ovsbridge0
	OVS_PATCH_PEER=patch-ovs-1
	```
 
  - bound 配置
	```bash
	DEVICE=bond0
	ONBOOT=yes
	DEVICETYPE=ovs
	TYPE=OVSBond
	OVS_BRIDGE=ovsbridge0
	BOOTPROTO=none
	BOND_IFACES="gige-1b-0 gige-1b-1 gige-21-0 gige-21-1"
	OVS_OPTIONS="bond_mode=balance-tcp lacp=active"
	HOTPLUG=no
	```
  - tag 配置
	```bash
	DEVICE=vlan100
	ONBOOT=yes
	DEVICETYPE=ovs
	TYPE=OVSIntPort
	BOOTPROTO=static
	IPADDR=A.B.C.D
	NETMASK=X.Y.Z.0
	OVS_BRIDGE=ovsbridge0
	OVS_OPTIONS="tag=100"
	OVS_EXTRA="set Interface $DEVICE external-ids:iface-id=$(hostname -s)-$DEVICE-vif"
	HOTPLUG=no
	```
  - common
	```bash
	DEVICE=intbr0
	ONBOOT=yes
	DEVICETYPE=ovs
	TYPE=OVSIntPort
	OVS_BRIDGE=ovsbridge0
	BOOTPROTO=static
	IPADDR=A.B.C.D
	NETMASK=X.Y.Z.0
	HOTPLUG=no
	```


> [!WARNING]
> 需要内核支持ovs,最好升级到最新的内核<br/>
> vxlan gre ,需要打开端口<br/>
> a demo set ovs<br/>
>> ovs-vsctl add-br ovs01<br/>
>> ovs-vsctl add-port ovs01 eth2 tag=100<br/>
>> ovs-vsctl add-port ovs01 vxlan0 tag=100 -- set interface vxlan0 type=vxlan options:key=100 options:remote_ip=172.16.100.2<br/>
>> ovs-vsctl add-port ovs01 vxlan0 tag=100 -- set interface vxlan0 type=gre options:key=100 options:remote_ip=172.16.100.2<br/>
>> ovs-vsctl add-port ovs01 vxlan0 tag=100 -- set interface type=internal<br/>







## linux vxlan网络配置

> sunstone 选择vxlan 网络,br可以不用写, vlan id 做网络隔离,指定物理网卡<br/>
> 需要linux 内核支持vxlan<br/>



## linux bridge 网络配置

1. centos 配置bridge网桥
  -  配置网卡
	```bash
vim /etc/sysconfig/network-scripts/ifcfg-enp8s0 
	TYPE=Ethernet
	DEVICE=enp8s0
	NAME=enp8s0
	BOOTPROTO=none
	ONBOOT=yes
	BRIDGE=br0
	```

  - 配置网桥
	```bash
	vim /etc/sysconfig/network-scripts/ifcfg-br0
	TYPE=Bridge
	DEVICE=br0
	BOOTPROTO=static
	ONBOOT=yes
	IPADDR=192.168.1.200
	NETMASK=255.255.255.0
	GATEWAY=192.168.1.1
	DNS1=114.114.114.114
	```

  > sunstone 选择网络bridge,DNS,network mask,gateway 现有网络存在,没有使用dnsmasq<br/>
  > linux 内核不需要升级<br/>

