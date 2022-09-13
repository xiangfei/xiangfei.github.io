## opennebula iscsi 集成


> [!WARNING]
> - 只能使用image存储
> - 管理员挂载
>   - 有安全风险
> - 创建好默认大小1M
>   - 这个是正常现象



### iscsi 安装

- demo 


```bash

[root@kvm3 ~]# ip r
default via 10.4.0.1 dev br-int 
10.4.0.0/16 dev br-int proto kernel scope link src 10.4.1.3 
169.254.0.0/16 dev em1 scope link metric 1002 
169.254.0.0/16 dev br-int scope link metric 1009 
[root@kvm3 ~]# 
[root@kvm3 ~]# 
[root@kvm3 ~]# cat /etc/tgt/conf.d/storage.conf 
<target iqn.2008-09.com.example:server.target>
    direct-store /sata/storage.img
</target>
[root@kvm3 ~]# tgtadm --lld  iscsi --mode target --op show
Target 1: iqn.2008-09.com.example:server.target
    System information:
        Driver: iscsi
        State: ready
    I_T nexus information:
    LUN information:
        LUN: 0
            Type: controller
            SCSI ID: IET     00010000
            SCSI SN: beaf10
            Size: 0 MB, Block size: 1
            Online: Yes
            Removable media: No
            Prevent removal: No
            Readonly: No
            SWP: No
            Thin-provisioning: No
            Backing store type: null
            Backing store path: None
            Backing store flags: 
        LUN: 1
            Type: disk
            SCSI ID: IET     00010001
            SCSI SN: beaf11
            Size: 2097152 MB, Block size: 512
            Online: Yes
            Removable media: No
            Prevent removal: No
            Readonly: No
            SWP: No
            Thin-provisioning: No
            Backing store type: rdwr
            Backing store path: /sata/storage.img
            Backing store flags: 
    Account information:
    ACL information:
        ALL
[root@kvm3 ~]# 

```


### opennebula 创建iscsi storage


![](/images/iscsi_datastores.png)


```bash
[root@opennebula-master iscsi]# onedatastore show 140
DATASTORE 140 INFORMATION                                                       
ID             : 140                 
NAME           : iscsi_nexus         
USER           : oneadmin            
GROUP          : oneadmin            
CLUSTERS       : 0                   
TYPE           : IMAGE               
DS_MAD         : iscsi_libvirt       
TM_MAD         : iscsi_libvirt       
BASE PATH      : /sata/datastores/140
DISK_TYPE      :                     
STATE          : READY               

DATASTORE CAPACITY                                                              
TOTAL:         : 1M                  
FREE:          : 1M                  
USED:          : 0M                  
LIMIT:         : -                   

PERMISSIONS                                                                     
OWNER          : um-                 
GROUP          : u--                 
OTHER          : ---                 

DATASTORE TEMPLATE                                                              
ALLOW_ORPHANS="NO"
CLONE_TARGET="SELF"
DISK_TYPE="ISCSI"
DRIVER="raw"
DS_MAD="iscsi_libvirt"
ISCSI_HOST="10.4.1.6"
LN_TARGET="NONE"
RESTRICTED_DIRS="/"
SAFE_DIRS="/var/tmp"
TM_MAD="iscsi_libvirt"

IMAGES         
167            

```



### opennebula 创建iscsi image



![](/images/opennebula_iscsi_storage.png)


```bash

[root@opennebula-master iscsi]# oneimage show 167
IMAGE 167 INFORMATION                                                           
ID             : 167                 
NAME           : iscsi_nexus         
USER           : oneadmin            
GROUP          : oneadmin            
LOCK           : None                
DATASTORE      : iscsi_nexus         
TYPE           : OS                  
REGISTER TIME  : 09/13 15:40:43      
PERSISTENT     : Yes                 
SOURCE         : iqn.2008-09.com.example:server.target2/1
PATH           : iqn.2008-09.com.example:server.target2/1
FORMAT         : raw                 
SIZE           : 0M                  
STATE          : used                
RUNNING_VMS    : 1                   

PERMISSIONS                                                                     
OWNER          : um-                 
GROUP          : ---                 
OTHER          : ---                 

IMAGE TEMPLATE                                                                  
DEV_PREFIX="sd"
ISCSI_HOST="10.4.1.6"

VIRTUAL MACHINES

  ID USER     GROUP    NAME                                                                                   STAT  CPU     MEM HOST                                                             TIME
 335 componen componen nexus3-systemd                                                                         runn    4      8G 10.4.1.5                                                   242d 00h15
[root@opennebula-master iscsi]# 

```

### attack to instance

![](/images/opennebula_iscsi_instance.png)


```bash
[root@opennebula-master iscsi]# tgtadm --lld  iscsi --mode target --op show
Target 1: iqn.2008-09.com.example:server.target2
    System information:
        Driver: iscsi
        State: ready
    I_T nexus information:
        I_T nexus: 1
            Initiator: iqn.2008-11.org.linux-kvm:077513a4-4690-4ece-ba87-1f9019732d6b alias: none
            Connection: 0
                IP Address: 10.4.1.5
    LUN information:
        LUN: 0
            Type: controller
            SCSI ID: IET     00010000
            SCSI SN: beaf10
            Size: 0 MB, Block size: 1
            Online: Yes
            Removable media: No
            Prevent removal: No
            Readonly: No
            SWP: No
            Thin-provisioning: No
            Backing store type: null
            Backing store path: None
            Backing store flags: 
        LUN: 1
            Type: disk
            SCSI ID: IET     00010001
            SCSI SN: beaf11
            Size: 0 MB, Block size: 512
            Online: Yes
            Removable media: No
            Prevent removal: No
            Readonly: No
            SWP: No
            Thin-provisioning: No
            Backing store type: rdwr
            Backing store path: /sata/datastores/iscsi/nexus_iscsi.qcow2
            Backing store flags: 
    Account information:
    ACL information:
        ALL
[root@opennebula-master iscsi]# 

```