##  linux 磁盘优化


### 文件系统优化

- __动态调整请求队列数来提高效率,默认请求队列数为：128, 可配置512__

```bash
/sys/block/sda/queue/nr_requests

```


- __readahead, 通过数据预读并且记载到随机访问内存方式提高磁盘读操作__


```bash

/sys/block/sda/queue/read_ahead_kb

```

-  __关闭最后一次访问文件(目录)的时间戳__



```bash

mount -t xfs -o defaults,noatime,nodiratime /dev/sda5 /data

```


### io 调度优化


- __调整deadline__

```bash
cat /sys/block/sda/queue/scheduler
noop anticipatory deadline [cfq]

```

> [!WARNINGS]
> - CFQ(完全公平排队I/O调度程序)
>   - CFQ试图均匀地分布对I/O带宽的访问,避免进程被饿死并实现较低的延迟,是deadline和as调度器的折中.
>   - 为所有进程分配等量的带宽,适合于桌面多任务及多媒体应用
> - NOOP(电梯式调度程序)
>   - NOOP倾向饿死读而利于写.
>   - NOOP对于闪存设备,RAM,嵌入式系统是最好的选择.
>   - 适用于SSD盘，有RAID卡，做了READ的盘
> - Deadline(截止时间调度程序)
>   - 通过时间以及硬盘区域进行分类,这个分类和合并要求类似于noop的调度程序.
>   - Deadline确保了在一个截止时间内服务请求,这个截止时间是可调整的,而默认读期限短于写期限.这样就防止了写操作因为不能被读取而饿死的现象.
>   - Deadline对数据库环境(ORACLE RAC,MYSQL等)是最好的选择.
> - AS(预料I/O调度程序)

- __数据不做日志,写入无顺序__

```bash

mount -t xfs -o noatime,nodiratime,nobarrier,data=writeback /dev/sda5 /data

```

- __ssd__


`但实际上是由于 ssd 使用 flash 进行数据保存， 每次数据读写过程都需要将曾经使用过的磁盘数据块抹掉后再重写， 出现重复 Io 增加了系统额外资源， 而机械硬盘不需要把数据抹掉而是直接重写，因此，对于需要进行频繁写操作，(OverWrite 操作) 或者没有 freelists 空间的情况而言， Ssd 会发现产生严重的 Io`



```bash
mount -t xfs -o defaults,noatime,nodiratime,discard /dev/sda5 /data

```