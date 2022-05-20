


## I/O 调度算法调优

> [!WARNING]
> - 内核版本5.x 请跳过


```bash

[root@jumpserver ~]#  cat /sys/block/sda/queue/scheduler 
[mq-deadline] kyber bfq none

```

- Linux I/O调度器（Linux I/O Scheduler）Linux内核中的一个组成部分，它介于通用块层和块设备驱动程序之间，用户可以通过调整这个调度器来优化系统性能。

#### I/O调度的4种算法

- CFQ（完全公平调度器。进程平均使用IO带宽）
  - CFQ均匀地分布对I/O带宽的访问,避免进程被饿死并实现较低的延迟,是deadline和as调度器的折中，CFQ对于多媒体应用(video,audio)和桌面系统是最好的选择.CFQ赋予I/O请求一个优先级，而I/O优先级请求独立于进程优先级，高优先级的进程的读写不能自动地继承高的I/O优先级。
原理：CFQ为每个进程/线程,单独创建一个队列来管理该进程所产生的请求，也就是说每个进程一个队列,各队列之间的调度使用时间片来调度，以此来保证每个进程都能被很好的分配到I/O带宽.I/O调度器每次执行一个进程的4次请求。

- NOOP（电梯式调度程序，通常用于内存存储的设备）
  - 在Linux2.4或更早的版本的调度程序,那时只有这一种I/O调度算法，NOOP实现了一个简单的FIFO队列，它像电梯的工作主法一样对I/O请求进行组织，当有一个新的请求到来时,它将请求合并到最近的请求之后,以此来保证请求同一介质。
NOOP倾向饿死读而利于写，NOOP对于闪存设备,RAM,嵌入式系统是最好的选择。
电梯算法饿死读请求的解释：
因为写请求比读请求更容易，写请求通过文件系统cache,不需要等一次写完成,就可以开始下一次写操作，写请求通过合并，堆积到I/O队列中，读请求需要等到它前面所有的读操作完成,才能进行下一次读操作，在读操作之间有几毫秒时间，而写请求在这之间就到来，饿死了后面的读请求。

- Deadline（针对延迟的调度器，每一个 I/O，都有一个最晚执行时间。）
  - 通过时间以及硬盘区域进行分类，这个分类和合并要求类似于noop的调度程序，Deadline确保了在一个截止时间内服务请求，这个截止时间是可调整的，而默认读期限短于写期限，这样就防止了写操作因为不能被读取而饿死的现象，Deadline对数据库环境(ORACLE RAC,MYSQL等)是最好的选择。

- Anticipatory（AS）（启发式调度，类似 Deadline 算法，但是引入预测机制提高性能。）

  - 本质上与Deadline一样，但在最后一次读操作后,要等待6ms，才能继续进行对其它I/O请求进行调度，可以从应用程序中预订一个新的读请求，改进读操作的执行,但以一些写操作为代价，它会在每个6ms中插入新的I/O操作，而会将一些小写入流合并成一个大写入流，用写入延时换取最大的写入吞吐量，AS适合于写入较多的环境，比如文件服务器，AS对数据库环境表现很差。


## demo修改centos 7.X的I/O调度算法


```

[root@controller ~]# cat /sys/block/sda/queue/scheduler          //查看当前系统的 I/O调度算法
[noop] deadline cfq 
[root@controller ~]# dmesg | grep -i scheduler                //查看当前系统支持的IO调度算法
[    1.007667] io scheduler noop registered
[    1.007671] io scheduler deadline registered (default)
[    1.007694] io scheduler cfq registered
	

[root@controller ~]# echo cfq > /sys/block/sda/queue/scheduler        //临时修改I/O调度方法:
[root@controller ~]# cat /sys/block/sda/queue/scheduler        
noop deadline [cfq] 


[root@controller ~]# grubby --update-kernel=ALL --args="elevator=deadline"        //永久的更改I/O调度方法：

[root@controller ~]# reboot

[root@controller ~]# cat /sys/block/sda/queue/scheduler

noop [deadline] cfq 

修改配置文件配置I/O的方法：
[root@controller ~]# vi /etc/default/grub
在 “GRUB_CMDLINE_LINUX=” 后面添加elevator=cfq
例如：
GRUB_CMDLINE_LINUX="crashkernel=auto rhgb quiet elevator=noop numa=off"
[root@controller ~]# grub2-mkconfig -o /boot/grub2/grub.cfg         //重新编译配置文件，BIOS-Based。
[root@controller ~]# grub2-mkconfig -o /boot/efi/EFI/centos/grub.cfg               //UEFI-Based。
[root@controller ~]# reboot    重启后生效

```


## 使用ramdisk


```
mkdir /media/ramdisk
mount -t tmpfs none /media/ramdisk
mount -t ramfs ramfs /media/ramdisk

# 设置大小，通常是物理内存10%到50%

mount -t tmpfs -o size=20% none /media/ramdisk

# 按照大小设置
mount -t tmpfs -o size=200M none /media/ramdisk

# /etc/fstab 开机启动
ramfs   /tmp     ramfs   defaults 0  0


```
