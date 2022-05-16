

## nvida gpu

### 打开iommu

```bash
root@deqing-gpu-251:~# cat /etc/default/grub
# If you change this file, run 'update-grub' afterwards to update
# /boot/grub/grub.cfg.
# For full documentation of the options in this file, see:
#   info -f grub -n 'Simple configuration'

GRUB_DEFAULT=0
GRUB_TIMEOUT_STYLE=hidden
GRUB_TIMEOUT=0
GRUB_DISTRIBUTOR=`lsb_release -i -s 2> /dev/null || echo Debian`
GRUB_CMDLINE_LINUX_DEFAULT="intel_iommu=on rd.driver.pre=vfio-pci rd.driver.blacklist=nouveau"
GRUB_CMDLINE_LINUX=""

# Uncomment to enable BadRAM filtering, modify to suit your needs
# This works with Linux (no patch required) and with any kernel that obtains
# the memory map information from GRUB (GNU Mach, kernel of FreeBSD ...)
#GRUB_BADRAM="0x01234567,0xfefefefe,0x89abcdef,0xefefefef"

# Uncomment to disable graphical terminal (grub-pc only)
#GRUB_TERMINAL=console

# The resolution used on graphical terminal
# note that you can use only modes which your graphic card supports via VBE
# you can see them in real GRUB with the command `vbeinfo'
#GRUB_GFXMODE=640x480

# Uncomment if you don't want GRUB to pass "root=UUID=xxx" parameter to Linux
#GRUB_DISABLE_LINUX_UUID=true

# Uncomment to disable generation of recovery mode menu entries
#GRUB_DISABLE_RECOVERY="true"

# Uncomment to get a beep at grub start
#GRUB_INIT_TUNE="480 440 1"

```

> [!WARNING] GRUB_CMDLINE_LINUX_DEFAULT="intel_iommu=on rd.driver.pre=vfio-pci rd.driver.blacklist=nouveau"



### Loading VFIO Driver in initrd

```bash
root@deqing-gpu-251:~# cat /etc/dracut.conf.d/local.conf
add_drivers+="vfio vfio_iommu_type1 vfio_pci vfio_virqfd "


initrd 

dracut --force

```

### ADD driver blacklist


```bash
/etc/modprobe.d/blacklist.conf


...
blacklist nouveau
blacklist lbm-nouveau
options nouveau modeset=0
alias nouveau off
alias lbm-nouveau off
...

```

### 增加pci 设备

- nvdia 显卡 都是10de开头

```bash
root@deqing-gpu-251:~# cat /etc/modprobe.d/vfio.conf 
options vfio-pci ids=10de:1eb8

```


### VFIO Device Binding

#### 增加脚本
```bash
/usr/local/bin/vfio-bind:

#!/bin/sh
modprobe vfio-pci
for dev in "$@"; do
        vendor=$(cat /sys/bus/pci/devices/$dev/vendor)
        device=$(cat /sys/bus/pci/devices/$dev/device)
        if [ -e /sys/bus/pci/devices/\$dev/driver ]; then
                echo $dev > /sys/bus/pci/devices/$dev/driver/unbind
        fi
        echo $vendor $device > /sys/bus/pci/drivers/vfio-pci/new_id
done

```

#### 脚本服务

```bash
/etc/systemd/system/vfio-bind.service
[Unit]
Description=Binds devices to vfio-pci
After=syslog.target

[Service]
EnvironmentFile=-/etc/sysconfig/vfio-bind
Type=oneshot
RemainAfterExit=yes
ExecStart=-/usr/local/bin/vfio-bind $DEVICES

[Install]
WantedBy=multi-user.target

```


#### 增加设备
```bash
root@deqing-gpu-251:~# cat /etc/sysconfig/vfio-bind
DEVICES="0000:35:00.0 0000:36:00.0 0000:a0:00.0 0000:a4:00.0"
```


#### 查看显卡设备

>[!WARNING]
>- 10de:1eb8  vfio.conf
>- 35:00.0 对应设备device
```bash
root@deqing-gpu-251:~# lspci  -nn  | grep 10de
35:00.0 3D controller [0302]: NVIDIA Corporation TU104GL [Tesla T4] [10de:1eb8] (rev a1)
36:00.0 3D controller [0302]: NVIDIA Corporation TU104GL [Tesla T4] [10de:1eb8] (rev a1)
a0:00.0 3D controller [0302]: NVIDIA Corporation TU104GL [Tesla T4] [10de:1eb8] (rev a1)
a4:00.0 3D controller [0302]: NVIDIA Corporation TU104GL [Tesla T4] [10de:1eb8] (rev a1)

```



###  QEMU  配置


#### 查看iommu  设备
```bash
root@deqing-gpu-251:~#  find /sys/kernel/iommu_groups/ -type l | grep 35
/sys/kernel/iommu_groups/35/devices/0000:32:0c.0
/sys/kernel/iommu_groups/235/devices/0000:fe:0e.0
/sys/kernel/iommu_groups/135/devices/0000:7f:0b.6
/sys/kernel/iommu_groups/40/devices/0000:35:00.0
```

> [!WARNING] 0000:35:00.0  group 40 <br/>
> 类似方法查找类似的group


#### qemu 配置
```bash
/etc/libvirt/qemu.conf
...
cgroup_device_acl = [
    "/dev/null", "/dev/full", "/dev/zero",
    "/dev/random", "/dev/urandom",
    "/dev/ptmx", "/dev/kvm", "/dev/kqemu",
    "/dev/rtc","/dev/hpet", "/dev/vfio/vfio",
    "/dev/vfio/40", "/dev/vfio/41", "/dev/vfio/182",
    "/dev/vfio/185"
]
...
```

### 驱动配置

- opennebula controller node 


```bash
/var/lib/one/remotes/etc/im/kvm-probes.d/pci.conf

...

:filter:
  - '10de:*'

...

```

### host  查看

```bash
onehost show 2

HOST 1 INFORMATION                                                              
ID                    : 1                   
NAME                  : 10.1.0.251          
CLUSTER               : default             
STATE                 : MONITORED           
IM_MAD                : kvm                 
VM_MAD                : kvm                 
LAST MONITORING TIME  : 05/16 16:25:26      

HOST SHARES                                                                     
RUNNING VMS           : 8                   
MEMORY                                                                          
  TOTAL               : 503.6G              
  TOTAL +/- RESERVED  : 503.6G              
  USED (REAL)         : 458.7G              
  USED (ALLOCATED)    : 452G                
CPU                                                                             
  TOTAL               : 6400                
  TOTAL +/- RESERVED  : 6400                
  USED (REAL)         : 192                 
  USED (ALLOCATED)    : 6000                

LOCAL SYSTEM DATASTORE #0 CAPACITY                                              
TOTAL:                : 6.5T                
USED:                 : 712.6G              
FREE:                 : 5.9T                

MONITORING INFORMATION                                                          
ARCH="x86_64"
CLUSTER_ID="0"
CPUSPEED="1007"
HOSTNAME="deqing-gpu-251"
HYPERVISOR="kvm"
IM_MAD="kvm"
KVM_CPU_MODEL="Broadwell-noTSX-IBRS"
KVM_CPU_MODELS="486 pentium pentium2 pentium3 pentiumpro coreduo n270 core2duo qemu32 kvm32 cpu64-rhel5 cpu64-rhel6 qemu64 kvm64 Conroe Penryn Nehalem Nehalem-IBRS Westmere Westmere-IBRS SandyBridge SandyBridge-IBRS IvyBridge IvyBridge-IBRS Haswell-noTSX Haswell-noTSX-IBRS Haswell Haswell-IBRS Broadwell-noTSX Broadwell-noTSX-IBRS Broadwell Broadwell-IBRS Skylake-Client Skylake-Client-IBRS Skylake-Client-noTSX-IBRS Skylake-Server Skylake-Server-IBRS Skylake-Server-noTSX-IBRS Cascadelake-Server Cascadelake-Server-noTSX Icelake-Client Icelake-Client-noTSX Icelake-Server Icelake-Server-noTSX athlon phenom Opteron_G1 Opteron_G2 Opteron_G3 Opteron_G4 Opteron_G5 EPYC EPYC-IBPB EPYC-Rome EPYC-Milan Dhyana"
KVM_MACHINES="pc-i440fx-focal ubuntu pc-0.15 pc-i440fx-2.12 pc-i440fx-2.0 pc-i440fx-xenial pc-q35-4.2 q35 pc-i440fx-2.5 pc-i440fx-4.2 pc pc-q35-xenial pc-i440fx-1.5 pc-0.12 pc-q35-2.7 pc-q35-eoan-hpb pc-i440fx-disco-hpb pc-i440fx-zesty pc-q35-artful pc-i440fx-trusty pc-i440fx-2.2 pc-i440fx-eoan-hpb pc-q35-focal-hpb pc-1.1 pc-q35-bionic-hpb pc-i440fx-artful pc-i440fx-2.7 pc-i440fx-yakkety pc-q35-2.4 pc-q35-cosmic-hpb pc-q35-2.10 pc-i440fx-1.7 pc-0.14 pc-q35-2.9 pc-i440fx-2.11 pc-q35-3.1 pc-q35-4.1 pc-i440fx-2.4 pc-1.3 pc-i440fx-4.1 pc-q35-eoan pc-i440fx-2.9 pc-i440fx-bionic-hpb isapc pc-i440fx-1.4 pc-q35-cosmic pc-q35-2.6 pc-i440fx-3.1 pc-q35-bionic pc-q35-disco-hpb pc-i440fx-cosmic pc-q35-2.12 pc-i440fx-bionic pc-q35-disco pc-i440fx-cosmic-hpb pc-i440fx-2.1 pc-1.0 pc-i440fx-wily pc-i440fx-2.6 pc-q35-4.0.1 pc-i440fx-1.6 pc-0.13 pc-q35-2.8 pc-i440fx-2.10 pc-q35-3.0 pc-q35-zesty pc-q35-4.0 microvm pc-i440fx-2.3 pc-q35-focal ubuntu-q35 pc-i440fx-disco pc-1.2 pc-i440fx-4.0 pc-i440fx-focal-hpb pc-i440fx-2.8 pc-i440fx-eoan pc-q35-2.5 pc-i440fx-3.0 pc-q35-yakkety pc-q35-2.11"
MODELNAME="Intel(R) Xeon(R) Silver 4314 CPU @ 2.40GHz"
NAME="10.1.0.251"
RESERVED_CPU=""
RESERVED_MEM=""
VERSION="6.2.0"
VM_MAD="kvm"

PCI DEVICES

   VM ADDR    TYPE           NAME                                              
   14 35:00.0 10de:1eb8:0302 TU104GL [Tesla T4]
   15 36:00.0 10de:1eb8:0302 TU104GL [Tesla T4]
   15 a0:00.0 10de:1eb8:0302 TU104GL [Tesla T4]
   15 a4:00.0 10de:1eb8:0302 TU104GL [Tesla T4]

NUMA NODES

  ID CORES                                            USED FREE
   0 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --  0    32
   1 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --  0    32

NUMA MEMORY

 NODE_ID TOTAL    USED_REAL            USED_ALLOCATED       FREE    
       0 251.7G   0K                   0K                   0K
       1 252G     0K                   0K                   0K

```


###  template 创建


```bash
onetemplate show 7
root@deqing-nfs-opennebula-server:/var/lib/one# onetemplate show 7
TEMPLATE 7 INFORMATION                                                          
ID             : 7                   
NAME           : Ubuntu 20.04 135GPU 
USER           : oneadmin            
GROUP          : oneadmin            
LOCK           : None                
REGISTER TIME  : 04/19 19:57:10      

PERMISSIONS                                                                     
OWNER          : um-                 
GROUP          : ---                 
OTHER          : ---                 

TEMPLATE CONTENTS                                                               
CONTEXT=[
  NAME="$NAME",
  NETWORK="YES",
  SSH_PUBLIC_KEY="ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDJfMkr576vHdX8FajdVigrUoe2yi6k7HxOPguFcunCaIXlCQeX2BLKHud2Z7dc5rEpTVAL9EC6xfqYx91YXJCDifKppT+8CSB2zzKlAgK31StynOU6F85xaJrjifHOi/J0LOkMJVWEk0SV8mqVkljJ5HiSk7/KR6GtRmUGbYrL/dTPk35juFqOzPGxT0euURi3gNOVNo26/CcMLxcjk7blhuTIGX4EnKfQjBoEcXItCri2PHCa6eMzph0/JbEtuLEA0Guu1NxpzFasgrFGFB5ZsVcnNAkN3sohKph8wt88NNKUmnPkCXL4Rt0HYHwkBhIT+iBveA0KTHK7X5IRri1Z root@opennebula-master",
  START_SCRIPT_BASE64="aG9zdG5hbWVjdGwgc2V0LWhvc3RuYW1lICROQU1FCnRpbWVkYXRlY3RsIHNldC10aW1lem9uZSBBc2lhL1NoYW5naGFpCgo=" ]
CPU="4"
CPU_MODEL=[
  MODEL="host-passthrough" ]
DISK=[
  IMAGE_ID="1",
  SIZE="10240" ]
GRAPHICS=[
  CLASS="0403",
  DEVICE="10f7",
  LISTEN="0.0.0.0",
  TYPE="VNC",
  VENDOR="10de" ]
HOT_RESIZE=[
  CPU_HOT_ADD_ENABLED="NO",
  MEMORY_HOT_ADD_ENABLED="NO" ]
INFO="Please do not use this VM Template for vCenter VMs. Refer to the documentation https://bit.ly/37NcJ0Y"
INPUTS_ORDER=""
LOGO="images/logos/ubuntu.png"
LXD_SECURITY_PRIVILEGED="true"
MEMORY="8192"
MEMORY_UNIT_COST="MB"
NIC=[
  NETWORK="br-deqing",
  NETWORK_UNAME="oneadmin",
  SECURITY_GROUPS="0" ]
OS=[
  ARCH="x86_64",
  FIRMWARE="",
  FIRMWARE_SECURE="YES" ]
PCI=[
  CLASS="0300",
  DEVICE="1e04",
  VENDOR="10de" ]
PCI=[
  CLASS="0c03",
  DEVICE="1ad6",
  VENDOR="10de" ]
PCI=[
  CLASS="0403",
  DEVICE="10f7",
  VENDOR="10de" ]
SCHED_REQUIREMENTS="ID=\"11\""
VCPU="4"

```


