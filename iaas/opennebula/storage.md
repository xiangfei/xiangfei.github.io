## file system

### Datastore Layout
```bash
/var/lib/one/datastores
|-- 0/
|   |-- 0/
|   |   |-- disk.0
|   |   `-- disk.1
|   |-- 2/
|   |   `-- disk.0
|   `-- 7/
|       |-- checkpoint
|       `-- disk.0
`-- 1
    |-- 05a38ae85311b9dbb4eb15a2010f11ce
    |-- 2bbec245b382fd833be35b0b0683ed09
    `-- d0e0df1fb8cfa88311ea54dfbcfc4b0c
0 存放 虚拟机
1 存放镜像
```
> 如果需要修改默认路径, 
```bash
vi /etc/one/oned.conf
DATASTORE_LOCATION = "new location"
```

### Shared & Qcow2 Transfer Mode
![](/images/fs_shared.png)

1. 需要挂载共享存储
2. 如果只是mount一个disk, disk可能出现瓶颈


### SSH Transfer Mode
![](/images/fs_ssh.png)

1. 启动先ssh copy image 在启动


### raw device mapping

##ceph

1. 版本 nautilus

2. 安装

```bash
cat << EOM > /etc/yum.repos.d/ceph.repo
[ceph]
name=ceph
baseurl=http://mirrors.163.com/ceph/rpm-nautilus/el7/x86_64/
gpgcheck=0
[ceph-noarch]
name=ceph-noarch
baseurl=http://mirrors.163.com/ceph/rpm-nautilus/el7/noarch/
gpgcheck=0  

EOM

yum install ceph-deploy ceph
yum install ntp ntpdate ntp-doc
ntpdate  cn.pool.ntp.org

ssh user@ceph-server
sudo useradd -d /home/{username} -m {username}
sudo passwd {username}
echo "{username} ALL = (root) NOPASSWD:ALL" | sudo tee /etc/sudoers.d/{username}
sudo chmod 0440 /etc/sudoers.d/{username}
ssh-keygen
ssh-copy-id {username}@node1,2,3

mkdir my-cluster
cd my-cluster
ceph-deploy new {initial-monitor-node(s)}
ceph-deploy new node1
public network = 10.1.2.0/24
ceph-deploy install node1 node2 node3
ceph-deploy mon create-initial
ceph-deploy admin {ceph-node(s)}
ceph-deploy mgr create node1  *Required only for luminous+ builds, i.e >= 12.x builds*
ceph-deploy osd create --data /dev/vdb node1
ceph-deploy osd create --data /dev/vdb node2
ceph-deploy osd create --data /dev/vdb node3
ceph-deploy mds create node1
ceph-deploy mon add node2 node3
ceph-deploy mgr create node2 node3
ceph-deploy rgw create node1
[client]
rgw frontends = civetweb port=80
```

3. 配置

```bash
controller node
ceph osd pool create one 128
ceph osd lspools
ceph auth get-or-create client.libvirt mon 'profile rbd' osd 'profile rbd pool=one'
#ceph 版本升级需要run ceph auth caps client.libvirt mon 'profile rbd' osd 'profile rbd pool=one'
ceph auth get-key client.libvirt | tee client.libvirt.key
ceph auth get client.libvirt -o ceph.client.libvirt.keyring
ceph.conf
[global]
rbd_default_format = 2

scp ceph.client.libvirt.keyring root@node:/etc/ceph
scp client.libvirt.key oneadmin@node:
UUID=`uuidgen`; echo $UUID
c7bdeabf-5f2a-4094-9413-58c6a9590980
cat > secret.xml <<EOF
<secret ephemeral='no' private='no'>
  <uuid>$UUID</uuid>
  <usage type='ceph'>
          <name>client.libvirt secret</name>
  </usage>
</secret>
EOF
scp secret.xml oneadmin@node:

run in compute node
virsh -c qemu:///system secret-define secret.xml
virsh -c qemu:///system secret-set-value --secret $UUID --base64 $(cat client.libvirt.key)
rm client.libvirt.key
ssh oneadmin@node
rbd ls -p one --id libvirt

```

## iscsi libvirt

```bash
server 
yum -y install scsi-target-utils
dd if=/dev/zero of=storage.img bs=1M count=2000
<target iqn.2010-10.org.opennebula:storage>
    backing-store /root/storage.img
    driver iscsi
    incominguser root 123456
    write-cache on
</target>
systemctl enable tgtd
client
yum -y install iscsi-initiator-utils

iscsiadm  -m discovery  -p 192.168.5.170:3260 --type sendtargets 


iscsiadm  -m node   -T iqn.2010-10.org.opennebula:storage -p 192.168.5.170:3260   -o update   -n node.session.auth.username -v root

iscsiadm  -m node   -T iqn.2010-10.org.opennebula:storage -p 192.168.5.170:3260   -o update   -n node.session.auth.password -v 123456


iscsiadm  -m node   -T iqn.2010-10.org.opennebula:storage -p 192.168.5.170:3260   -l

iscsiadm  -m node   -T iqn.2010-10.org.opennebula:storage -p 192.168.5.170:3260   --logout


```

## lvm
![](/images/fs_shared.png)
未测试

## The Kernels & Files Datastore

RESTRICTED_DIRS, 如果写错会到帐instance创建失败

