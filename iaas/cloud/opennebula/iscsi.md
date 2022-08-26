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





### opennebula 创建iscsi image


![](/images/opennebula_iscsi_storage.png)



### attack to instance

![](/images/opennebula_iscsi_instance.png)
