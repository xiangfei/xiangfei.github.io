## opennebula ceph


###  ubuntu cephadmin 安装(单节点测试)


```bash
apt-get update
apt install -y cephadm
cephadm add-repo --release quincy
cephadm install

vi /etc/hosts
...
10.4.2.4 supertext-k8s-privatization
...

cephadm bootstrap --mon-ip 10.4.2.4


```

> [!WARNING]
> - add hosts info
>   - 10.4.2.4 supertext-k8s-privatization
> - disable ufw
> - disable swap

### add osd



```bash

root@supertext-k8s-privatization:~# cephadm  shell --  ceph orch daemon add osd  supertext-k8s-privatization:/dev/sdc


```

### create  ceph pool

-  in ceph machine

```bash

root@supertext-k8s-privatization:~# cephadm  shell --  ceph osd pool create one 128
Inferring fsid db9cb58e-2516-11ed-a6dd-f5511e968379
Inferring config /var/lib/ceph/db9cb58e-2516-11ed-a6dd-f5511e968379/mon.supertext-k8s-privatization/config
Using recent ceph image quay.io/ceph/ceph@sha256:c08064dde4bba4e72a1f55d90ca32df9ef5aafab82efe2e0a0722444a5aaacca
pool 'one' created
root@supertext-k8s-privatization:~# cephadm  shell --  ceph auth get-or-create client.libvirt  mon 'profile rbd' osd 'profile rbd pool=one'
Inferring fsid db9cb58e-2516-11ed-a6dd-f5511e968379
Inferring config /var/lib/ceph/db9cb58e-2516-11ed-a6dd-f5511e968379/mon.supertext-k8s-privatization/config
Using recent ceph image quay.io/ceph/ceph@sha256:c08064dde4bba4e72a1f55d90ca32df9ef5aafab82efe2e0a0722444a5aaacca
[client.libvirt]
        key = AQDJhQhjGuQ3NhAAh0CtOAEn68P/YXsI+8RuIw==

root@supertext-k8s-privatization:~# cephadm  shell  # enter ceph console

root@supertext-k8s-privatization:~#  ceph auth get-key client.libvirt | tee client.libvirt.key
root@supertext-k8s-privatization:~#  ceph auth get client.libvirt -o ceph.client.libvirt.keyring
```


###  create libvirt secrets

-  in ceph machine

```bash
cat > secret.xml <<EOF
<secret ephemeral='no' private='no'>
  <uuid>0c3e8a84-9cd0-4fe2-b30b-1c2d9c427d53</uuid>
  <usage type='ceph'>
          <name>client.libvirt secret</name>
  </usage>
</secret>
EOF

```

### add ceph

- all opennebula nodes


```bash
[oneadmin@opennebula-master ceph]# cat client.libvirt.key 
AQDJhQhjGuQ3NhAAh0CtOAEn68P/YXsI+8RuIw==
[oneadmin@opennebula-master ceph]# cat secrets.xml 
<secret ephemeral='no' private='no'>
  <uuid>0c3e8a84-9cd0-4fe2-b30b-1c2d9c427d53</uuid>
  <usage type='ceph'>
          <name>client.libvirt secret</name>
  </usage>
</secret>

[oneadmin@opennebula-master ceph]# virsh -c qemu:///system secret-define secrets.xml

Secret 0c3e8a84-9cd0-4fe2-b30b-1c2d9c427d53 created

[oneadmin@opennebula-master ceph]# 
[oneadmin@opennebula-master ceph]# 
[oneadmin@opennebula-master ceph]# virsh -c qemu:///system secret-set-value --secret 0c3e8a84-9cd0-4fe2-b30b-1c2d9c427d53 --base64 $(cat client.libvirt.key)
Secret value set


[root@opennebula-master ceph]# yum -y install ceph-common
[root@opennebula-master ceph]# yum -y install ceph-common


root@ceph-master:/etc# scp -r  /etc/ceph/ opennebula-master:/etc/ceph  # in cephadmn  monitor machine run

[root@opennebula-master ceph]# ceph rbd lspools

[oneadmin@opennebula-master ceph] cp /var/lib/one/ceph.client.libvirt.keyring  /etc/ceph  # coy  ceph libvirt config

```

> [!WARNING]
> - 手动copy libsecrets 文件，删除 key = 字段
> - virsh define 使用 oneadmin 用户执行
> - virsh define -c qemu:///system 不增加会有问题
> - 执行  `ceph rbd lspools` 报错
>   - 缺少ceph monitor machine copy ceph config





### create ceph storage

-  opennebula sunstone
  - create storage advanced 

```bash

NAME    = ceph_system
TM_MAD  = ceph
TYPE    = SYSTEM_DS
DISK_TYPE = RBD

POOL_NAME   = one
CEPH_HOST   = "10.4.2.4"
CEPH_USER   = libvirt
CEPH_SECRET = "0c3e8a84-9cd0-4fe2-b30b-1c2d9c427d53"
BRIDGE_LIST = "10.4.1.6"


```

> [!WARNING]
> - BRIDGE_LIST 为opennebula master ip , 如果为cephadm monintor ip list 容量为空



### test


- storage create

![](/images/opennebula_ceph_storage.png)


- image create

![](/images/opennebula_ceph_image.png)


- attach instance

![](/images/opennebula_ceph_instance_attach.png)
