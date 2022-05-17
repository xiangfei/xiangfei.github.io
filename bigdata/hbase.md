


##  准备

#### 机器
|  vip   | ip   |  host  | OS |
|  ----   | ----  | ---- |  ----  |
| 192.168.151.200 |  192.168.226.64   | hadoop-cluster-1   |  centos 7  |
| 192.168.151.200 |  192.168.226.65    | hadoop-cluster-2 |  centos 7  |
| 192.168.151.200 |  192.168.226.63    | hadoop-cluster-3 |  centos 7  |
|     |  192.168.226.66   |  hadoop-datanode01  |  centos 7  |
|     |  192.168.226.67   |  hadoop-datanode02  |  centos 7  |
|     |  192.168.226.68   |  hadoop-datanode03  |  centos 7  |
|     |  192.168.226.69   |  hadoop-datanode04  |  centos 7  |


#### cluster node  

- hmaster

####  data node

- hregionserver


> 官方介绍hmaster是主备模式, hregionserver部署在datanoe 节点

### 安装

#### cluster node

- 解压/data/hbase-2.3.0

- 修改env 文件  hbase-env.sh 

```bash
# addd
export JAVA_HOME=/usr
export HBASE_MANAGES_ZK=false

```
- 修改hbase-site.xml 文件

```xml
<configuration>
  <!--
    The following properties are set for running HBase as a single process on a
    developer workstation. With this configuration, HBase is running in
    "stand-alone" mode and without a distributed file system. In this mode, and
    without further configuration, HBase and ZooKeeper data are stored on the
    local filesystem, in a path under the value configured for `hbase.tmp.dir`.
    This value is overridden from its default value of `/tmp` because many
    systems clean `/tmp` on a regular basis. Instead, it points to a path within
    this HBase installation directory.

    Running against the `LocalFileSystem`, as opposed to a distributed
    filesystem, runs the risk of data integrity issues and data loss. Normally
    HBase will refuse to run in such an environment. Setting
    `hbase.unsafe.stream.capability.enforce` to `false` overrides this behavior,
    permitting operation. This configuration is for the developer workstation
    only and __should not be used in production!__

    See also https://hbase.apache.org/book.html#standalone_dist
  -->
  <property>
    <name>hbase.cluster.distributed</name>
    <value>true</value>
  </property>
  <property>
     <name>hbase.rootdir</name>
     <value>hdfs://mycluster/hbase</value>
  </property>
  <property>
    <name>hbase.tmp.dir</name>
    <value>./tmp</value>
  </property>
  <property>
    <name>hbase.zookeeper.quorum</name>
    <value>hadoop-cluster-3,hadoop-cluster-1,hadoop-cluster-2</value>
  </property>
  <property>
    <name>hbase.unsafe.stream.capability.enforce</name>
    <value>false</value>
  </property>
</configuration>

```

- copy hdfs-site.xml 到 conf 目录

- 启动

```bash
[root@hadoop-cluster-2 hbase-2.3.0]# ./bin/hbase-daemon.sh start master

```

>  master-backup 命令找不到,直接启动master,看日志是standby 模式 

- 启动 rest api

```bash
[root@hadoop-cluster-2 bin]# cat restart_web.sh 
nohup ./hbase rest start -p 4444 2>&1 >/dev/null&

```

- 启动thrift2

```bash
[root@hadoop-cluster-2 bin]# cat restart_thrift.sh
nohup ./hbase thrift2  start -p 9090 2>&1 >/dev/null&



```

> all cluster node 启动

#### data node

```bash
[root@hadoop-data-node-1 hbase-2.3.0]# ./bin/hbase-daemon.sh  start regionserver
```





### 最终安装状态


```bash
2020-08-13 01:14:18,218 WARN  [main] util.NativeCodeLoader: Unable to load native-hadoop library for your platform... using builtin-java classes where applicable
HBase Shell
Use "help" to get list of supported commands.
Use "exit" to quit this interactive shell.
For Reference, please visit: http://hbase.apache.org/2.0/book.html#shell
Version 2.3.0, re0e1382705c59d3fb3ad8f5bff720a9dc7120fb8, Mon Jul  6 22:27:43 UTC 2020
hbase(main):001:0> 
hbase(main):002:0* 
hbase(main):003:0* status
1 active master, 2 backup masters, 3 servers, 0 dead, 0.6667 average load
Took 1.0644 seconds                                                                                                                                                        
hbase(main):004:0> 

```


