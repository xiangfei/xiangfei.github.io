## xfs 文件系统磁盘扩容

### standand


```bash

fdisk /dev/sda
d  # 删除分区 -> 选择2

n  #创建分区  -> 确保start  number  和删除的分区一致


w # 保存

xfs_grows /dev/sda2 # ingrees  size

```

> [!WARNING]
> - 创建分区  -> 确保start  number  和删除的分区一致

- `demo`

```bash
Disk /dev/sda: 53.7 GB, 53687091200 bytes, 104857600 sectors
Units = sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disk label type: dos
Disk identifier: 0x000c81a1

   Device Boot      Start         End      Blocks   Id  System
/dev/sda1   *        2048     2099199     1048576   83  Linux
/dev/sda2         2099200   104857566    51379183+  83  Linux
```








