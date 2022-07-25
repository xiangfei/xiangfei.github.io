## ubuntu20.16 LXD 安装

### 背景

`公司在GPU训练服务器资源不够,需要解决GPU资源浪费的问题`



> [!WARNING]
> - 使用的技术框架有问题，只是单纯记录一下经验
> - 解决GPU 资源不够，有更好的解决方案,  tensflow 支持分布式训练,可以直接改流程


### 要求

- GPU , memory , disk 资源共享。
  - 现有环境disk 不够，使用NFS存储。
- 不改变现在的开发模式
  - 单机器训练，GPU。 训练在环境同步
  - 训练完成模型发布通过gitlab ci 打包成image , push 到image仓库,生产环境使用

## 准备

### disable nouevau

- /etc/modprobe.d/blacklist.conf

```bash

...

blacklist nouevau
options nouevau modeset=0 
...

```
### 更新grub2

```bash
update-init-ramfs -u  #reboot


```
### 启动nvdia 驱动
- 编译时需要ignore  gcc 版本错误

```bash
./NVIDA-Linux-x86_64-$version.run
# 安装成功
nvidia-smi

```

### 安装脚本



```bash
apt install lxc lxd-client zfsutils-linux bridge-utils
lxd init
....
Would you like to use LXD clustering? (yes/no) [default=no]: 
Do you want to configure a new storage pool? (yes/no) [default=yes]: 
Name of the new storage pool [default=default]: 
Name of the storage backend to use (btrfs, dir, lvm, zfs) [default=zfs]:
Create a new ZFS pool? (yes/no) [default=yes]:
Would you like to use an existing block device? (yes/no) [default=no]: 
# 这里我们把默认的存储池设置为 128G，应该足够使用
# 如果根分区的文件系统是 btrfs/zfs，这里会直接跳过，不会有设置．
# 即默认可以使用根分区的全部容量．
# 其他文件系统的话，这里要创建 loopback 设备，所以才需要指定大小．
Size in GB of the new loop device (1GB minimum) [default=91GB]: 100G
Would you like to connect to a MAAS server? (yes/no) [default=no]: 
# 网络设置部分
Would you like to create a new local network bridge? (yes/no) [default=yes]: 
What should the new bridge be called? [default=lxdbr0]: 
What IPv4 address should be used? (CIDR subnet notation, “auto” or “none”) [default=auto]: 
What IPv6 address should be used? (CIDR subnet notation, “auto” or “none”) [default=auto]: 
Would you like LXD to be available over the network? (yes/no) [default=no]: yes
Address to bind LXD to (not including port) [default=all]: 
Port to bind LXD to [default=8443]: 
Trust password for new clients: 
Again: 
# 最后打印输出配置的内容，以便检查是否有误
Would you like a YAML "lxd init" preseed to be printed? (yes/no) [default=no]: yes
....


lxc remote add tuna-images https://mirrors.tuna.tsinghua.edu.cn/lxc-images/ --protocol=simplestreams --public
lxc image copy tuna-images:ubuntu/20.04 local: --alias ubuntu/20.04 --copy-aliases --public

```


### 启动容器


```bash
lxc launch tuna-images:ubuntu/20.04  tf
lxc config set tf security.privileged true  # 特权模式
lxc config device add tf  shared_disk  source=/data/share   path=/data #共享目录,如果是NFS目录，需要先mount在本地，然后共
lxc config  device add  tf  gpu gpu 

```

### 默认需要增加

> [!TIP]
> - 网络需要创建网桥,
> - 需要开启特权模式,资源不够