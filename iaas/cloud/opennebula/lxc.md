

## lxc 安装

```bash
yum -y install opennebula-node-lxc

```

> [!WARNING] 需要先安装opennebula repository


## 配置 password

> 和kvm node 安装一样


## 存储支持

> ceph , iscsi , filesystem shared


## 加入集群

```bash
 onehost create <node01> -i lxc -v lxc

```

