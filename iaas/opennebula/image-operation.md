

## disk类型

+ os ,可以启动的镜像
+ cd-rom , read only data 通常是iso文件
+ datalock, 数据文件, 通常是empty drive

### file类型

+ kernel A plain file to be used as kernel (VM attribute OS/KERNEL_DS)
+ ramdisk  A plain file to be used as ramdisk (VM attribute OS/INITRD_DS)
+ context A plain file to be included in the context CD-ROM (VM attribute CONTEXT/FILES_DS)

生命周期
![persistent](/images/image-persistent.png)
![nopersistent](/images/image-nonpersistent.png)

> 只能在file datastore注册


## 基础命令

```bash
cat ubuntu_img.one
NAME          = "Ubuntu"
PATH          = "/home/cloud/images/ubuntu-desktop/disk.0"
TYPE          = "OS"
DESCRIPTION   = "Ubuntu desktop for students."

oneimage create ubuntu_img.one --datastore default
oneimage clone Ubuntu new_image
#share image
oneimage chmod 0 664
```


### 制作镜像

+ boot a vm instance
+ 安装 one context
+ onevm disk-saveas centos-installation 0 centos-contextualized

