# centos7 安装openvswitch


## 升级内核

```bash 
rpm --import https://www.elrepo.org/RPM-GPG-KEY-elrepo.org
yum install -y https://www.elrepo.org/elrepo-release-7.el7.elrepo.noarch.rpm
yum --enablerepo=elrepo-kernel install kernel-ml -y
sed -i s/saved/0/g /etc/default/grub 
grub2-mkconfig -o /boot/grub2/grub.cfg 

```

>[!WARNING] 内核支持至少3.12 以上

## 安装

```bash
yum install centos-release-openstack-train
yum install openvswitch
systemctl enable openvswitch
```
