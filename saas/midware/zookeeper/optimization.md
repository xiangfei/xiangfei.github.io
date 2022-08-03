# zookeeper 优化

[参考](http://t.zoukankan.com/LiuChang-blog-p-15127157.html)

## 建议



- 将zookeeper与其他应用分开部署，避免相互影响。

- 尽量避免内存与磁盘空间的交换，确保设置一个合理的JVM堆大小。

- 将数据文件和事务日志分开存放，提高zookeeper性能。




## zookeeper优化参数

 - conf/zoo.cfg

 - 工作节点瞬间压力大，导致和集群通信出现延迟，被踢出节点，瞬间释放的连接立即又连接到另外节点，最终集群挂掉。加了一些延迟配置后，集群稳定。

| 参数名称 | 参数值 | 说明 |
| ---- | ---- | ---- |
| tickTime| 2000 | Zookeeper服务器之间或客户端与服务器之间维持心跳的时间间隔，也就是每个 tickTime时间就会发送一个心跳。tickTime以毫秒为单位。 |
|initLimit | 10 | 集群中的follower服务器(F)与leader服务器(L)之间初始连接时能容忍的最多心跳数(tickTime的数量)。 | 
| syncLimit | 5 | 集群中的follower服务器与leader服务器之间请求和应答之间能容忍的最多心跳数(tickTime的数量)。 |
| dataDir | /usr/local/zookeeper/data | ZooKeeper存放内存数据结构的snapshot，便于快速恢复。 |
| dataLogDir | /usr/local/zookeeper/datalog | 事务日志文件目录，对磁盘性能要求高，ZooKeeper在响应客户端事务请求之前，需要将请求的事务日志写到磁盘上，事务日志的写入性能直接影响ZooKeeper服务器处理请求的吞吐，dataLogDir如果没提供的话使用的则是dataDir目录。 |
| clientPort | 2181 | 客户端连接Zookeeper服务器的端口，Zookeeper会监听这个端口，接受客户端的访问请求。|
| maxClientCnxns | 1000 | 在socket级别限制单个客户端到ZooKeeper集群中单台服务器的并发连接数量，可以通过IP地址来区分不同的客户端，默认是60，设置为0表示不限制并发连接数。 |
| minSessionTimeout | 30000 | 服务器允许客户端会话的最小超时时间，以毫秒为单位。默认值是2倍的tickTime |
| maxSessionTimeout | 60000 | 服务器允许客户端会话的最大超时时间，以毫秒为单位。默认值是20倍的tickTime |
| autopurge.snapRetainCount | 10 | 当启用自动清理功能后，ZooKeeper将只保留autopurge.snapRetainCount个最近的数据快照(dataDir)和对应的事务日志文件(dataLogDir)，其余的将会删除掉。默认值是3,最小值也是3。 |
| autopurge.purgeInterval |  1 | 用于配置触发清理任务的时间间隔，以小时为单位。要启用自动清理，可以将其值设置为一个正整数(比如1)，默认值是0。|
| globalOutstandingLimit | 200 | 客户端提交请求的速度可能比ZooKeeper处理的速度快得多，特别是当客户端的数量非常多的时候。为了防止ZooKeeper因为排队的请求而耗尽内存，ZooKeeper将会对客户端进行限流，即限制系统中未处理的请求数量不超过globalOutstandingLimit设置的值，默认的限制是1000。 |
| preAllocSize | 131072 | 单位KB，用于配置ZooKeeper事务日志文件预分配的磁盘空间大小。默认的块大小是64MB。改变块大小的其中一个原因是当数据快照文件生成比较频繁时可以适当减少块大小。比如1000次事务会新产生一个快照(参数为snapCount)，新产生快照后会用新的事务日志文件，假设一个事务信息大小100B，那么事务日志预分配的磁盘空间大小为100kB会比较好。|
| snapCount | 300000 | ZooKeeper将事务记录到事务日志中。当snapCount个事务被写到一个日志文件后，启动一个快照并创建一个新的事务日志文件。snapCount的默认值是100000。 |
leaderServes | yes | leader是否接受client请求,默认为yes即leader可以接受client的连接，当节点数为>3时，建议关闭。在ZooKeeper中，Leader服务器主要协调事务更新请求。对于事务更新请求吞吐很高而读取请求吞吐很低的情况可以配置Leader不接受客户端连接，这样就可以专注于协调工作。|
| forceSync | no | 这个对写请求的性能提升很有帮助，是指每次写请求的数据都要从pagecache中固化到磁盘上，才算是写成功返回。当写请求数量到达一定程度的时候，后续写请求会等待前面写请求的forceSync操作，造成一定延时 forceSync=yes，为yes可以设置`fsync.warningthresholdms=50`  |

## jvm 调优

- zkEnv.sh

```bash
export JAVA_HOME=/usr/local/jdk

export JVMFLAGS="-Xms2048m -Xmx3072m $JVMFLAGS"

```