

## 常用配置

### 桥接

```bash
cat private.txt
NAME    = "bridged_net"
VN_MAD  = "fw"
BRIDGE  = vbr1

# 网桥需要手动配置

#ebtables 

# Drop packets that don't match the network's MAC Address
-s ! <mac_address>/ff:ff:ff:ff:ff:0 -o <tap_device> -j DROP
# Prevent MAC spoofing
-s ! <mac_address> -i <tap_device> -j DROP

```



### 8021q
```bash
NAME    = "Private"
VN_MAD  = "802.1Q"
PHYDEV  = "eth0"

AR=[
    TYPE = "IP4",
    IP   = "10.0.0.150",
    SIZE = "51"
]

DNS     = "10.0.0.23"
GATEWAY = "10.0.0.1"
#网卡限速
OUTBOUND_AVG_BW = "1000" 
OUTBOUND_PEAK_BW = "1500"
OUTBOUND_PEAK_KB = "2048"

DESCRIPTION = "A private network for VM inter-communication"

```

### vxlan
```bash
NAME    = "vxlan_net"
VN_MAD  = "vxlan"
PHYDEV  = "eth0"
VLAN_ID = 50        # optional
BRIDGE  = "vxlan50" # optional
#在centos测试，多租户隔离不起作用?
```
### openvswitch
```bash
NAME    = "ovswitch_net"
VN_MAD  = "ovswitch"
BRIDGE  = vbr1
VLAN_ID = 50 # optional

#VLAN ID 做多租户网络隔离 ,桥接需要strip vlan id
```


## 常用命令
```
onevnet create config.file

onevnet delete  name_or_id

onevnet show id

#Adding and Removing Address Ranges
onevnet addar Private --ip 10.0.0.200 --size 20

onevnet rmar Private 2

#Hold and Release Leases
onevnet hold "Private Network" 10.0.0.120

```

### 定义路由器

```bash
onemarketapp export 'alpine-vrouter (KVM)' vrouter_alpine --datastore default --vmname vrouter_alpine

cat myvr.txt
NAME = my-vr
NIC = [
  NETWORK="blue-net",
  IP="192.168.30.5" ]
NIC = [
  NETWORK="red-net",
  IP="192.168.20.5"  ]

#路由器的ip, 虚拟机的gateway需要写成 192.168.x.5

$ onevrouter create myvr.txt

```

### 定义安全组

```bash
  $ cat ./sg.txt

  NAME = test

  RULE = [
      PROTOCOL = TCP,
      RULE_TYPE = inbound,
      RANGE = 1000:2000
  ]

  RULE = [
      PROTOCOL= TCP,
      RULE_TYPE = outbound,
      RANGE = 1000:2000
  ]

  RULE = [
      PROTOCOL = ICMP,
      RULE_TYPE = inbound,
      NETWORK_ID = 0
  ]

  $ onesecgroup create ./sg.txt
#默认允许全部通过


```
### 定义防火墙

```bash
vyos ,marketplace 提供的kvm image下载不了,需要手动安装
```

参考 [文章](https://opennebula.org/create-a-context-ready-vyos-image-for-opennebula)
![](/images/Captura-de-pantalla-de-2015-05-04-180522.png)
![](/images/Captura-de-pantalla-de-2015-05-04-201849.png)


```bash
#只是一个demo 
git clone https://github.com/n40lab/vyos-onecontext.git
cd vyos-onecontext
scp vyatta-vmcontext.sh vyos@192.168.4.14:/tmp/
scp vyatta-postconfig-bootup.script vyos@192.168.4.14:/tmp/
ssh vyos@192.168.4.14
sudo mv /tmp/vyatta-postconfig-bootup.script /opt/vyatta/etc/config/scripts/vyatta-postconfig-bootup.script
sudo mv /tmp/vyatta-vmcontext.sh /opt/vyatta/sbin/
delete service ssh
delete interfaces ethernet eth0
```

