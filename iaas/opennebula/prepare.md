
##  准备
>1. os centos7
2. 存储 ceph
3. 数据库 mysql
4. 虚拟化 kvm
5. 网络划分 192.168.0.0/16(业务) 

## 控制节点安装

ip 192.168.20.2

>1. SELinux on CentOS/RHEL 7

```bash
vi /etc/selinux/config
SELINUX=disabled
systemctl disable firewalld
service firewalld stop
```
>2. Add OpenNebula Repositories

``` 
rpm -ivh https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm
```
>3. Installing the Software

```bash
yum install epel-release
yum install opennebula-server opennebula-sunstone opennebula-ruby opennebula-gate opennebula-flow
```
>4. Ruby Runtime Installation

```bash
#root运行
/usr/share/one/install_gems
```


>5. Enabling MySQL/MariaDB

```bash
yum install centos-release-openstack-rocky #安装数据库
yum install mariadb-server mariadb
systemctl enable mariadb.service
systemctl start mariadb.service
mysql_secure_installation #设置密码
mysql> create databases oneadmin;
mysql> GRANT ALL PRIVILEGES ON opennebula.* TO 'oneadmin' IDENTIFIED BY '<thepassword>';
vi /etc/my.cnf.d/openstack.cnf 
[mysqld]
bind-address = 0.0.0.0 修改bind address
vi /etc/one/oned.conf
DB = [ backend = "mysql",
       server  = "0.0.0.0",
       port    = 0,
       user    = "oneadmin",
       passwd  = "<thepassword>",
       db_name = "opennebula" ]
```
>6. Starting OpenNebula

```bash
#在oneadmin用户下运行,没有密码需要手动设置密码
echo "oneadmin:mypassword" > ~/.one/one_auth
systemctl start opennebula
systemctl start opennebula-sunstone
systemctl enable opennebula-sunstone
systemctl enable opennebula-sunstone
```
## 计算节点安装(KVM)

ip 192.168.20.3

>1. Add OpenNebula Repositories

```
参考控制节点做法
```

>2. Installing the Software

```bash
yum install centos-release-qemu-ev
yum install qemu-kvm-ev
systemctl restart libvirtd
```

>3. SELinux on CentOS/RHEL 7

```bash
参考控制节点做法
```

>4. Configure Passwordless SSH

```bash
#在控制节点运行
ssh-keygen
ssh-keyscan <frontend> <node1> <node2> <node3> ... >> /var/lib/one/.ssh/known_hosts
scp -rp /var/lib/one/.ssh <node1>:/var/lib/one/
```

>5. Networking Configuration

```bash
yum -y install openvswitch
systemctl enable openvswitch
systemctl start openvswitch
#临时方法,重启网卡消失
ovs-vsctl add-br br0
ovs-vsctl add-port br0 eth0
ifconfig br0 192.168.1.2/24 up
ip route add default via 192.168.1.254

```
>6. Storage Configuration

```bash
直接使用filesystem存储
```
>7. Adding a Host to OpenNebula

```bash
onehost create <node01> -i kvm -v kvm
```

>8. Import Currently Running VMs

```bash
instance不能以one-*开头
one host importvm <hostid> <name>
```
