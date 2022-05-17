
# hadoop 集群安装

###  准备

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

- zookeeper
- journalnode
- namenode
- zkfc
- resourcemanager

####  data node
- datanode
- nodemanager



### 安装

#### all cluster node

- 修改hosts

```
cat /etc/hosts
127.0.0.1   localhost localhost.localdomain localhost4 localhost4.localdomain4
::1         localhost localhost.localdomain localhost6 localhost6.localdomain6
192.168.226.63 hadoop-cluster-3
192.168.226.65 hadoop-cluster-2
192.168.226.64 hadoop-cluster-1


```
- 安装openjdk


```bash
[root@hadoop-cluster-1 ~]# yum -y install java-1.8.0-openjdk-devel.x86_64  java-1.8.0-openjdk.x86_64

```

- ssh-keygen
- ssh-copy-id  hadoop-cluster-2/hadoop-cluster-1/hadoop-cluster-3

- 安装 zookeeper 集群

 - 安装包下载

 - 创建数据folder , 输入zookeeper 集群id
  
 ```bash
  [root@hadoop-cluster-3 bin]# mkdir -p  /data/zookeeper_data
  echo 2 > /data/zookeeper_data/myid   # 不同机器的myid 唯一,对应配置文件的id名
 
 ```
 - 修改配置文件
  

```bash
[root@hadoop-cluster-3 bin]# cat ../conf/zoo.cfg
# The number of milliseconds of each tick
tickTime=2000
# The number of ticks that the initial 
# synchronization phase can take
initLimit=10
# The number of ticks that can pass between 
# sending a request and getting an acknowledgement
syncLimit=5
# the directory where the snapshot is stored.
# do not use /tmp for storage, /tmp here is just 
# example sakes.
dataDir=/data/zookeeper_data

# the port at which the clients will connect
clientPort=2181
# the maximum number of client connections.
# increase this if you need to handle more clients
#maxClientCnxns=60
#
# Be sure to read the maintenance section of the 
# administrator guide before turning on autopurge.
#
# http://zookeeper.apache.org/doc/current/zookeeperAdmin.html#sc_maintenance
#
# The number of snapshots to retain in dataDir
#autopurge.snapRetainCount=3
# Purge task interval in hours
# Set to "0" to disable auto purge feature
#autopurge.purgeInterval=1

## Metrics Providers
#
# https://prometheus.io Metrics Exporter
#metricsProvider.className=org.apache.zookeeper.metrics.prometheus.PrometheusMetricsProvider
#metricsProvider.httpPort=7000
#metricsProvider.exportJvmInfo=true
quorumListenOnAllIPs=true
extendedTypesEnabled = true
emulate353TTLNodes = true

server.1 = hadoop-cluster-1:2888:3888
server.2 = hadoop-cluster-2:2888:3888
server.3 = hadoop-cluster-3:2888:3888

```

 - 启动
  - cd zookeeper bin folder

  ```bash
[root@hadoop-cluster-1 bin]# ./zkServer.sh  start
/usr/bin/java
ZooKeeper JMX enabled by default
Using config: /data/tools/apache-zookeeper-3.6.0-bin/bin/../conf/zoo.cfg
Starting zookeeper ... STARTED

  ```
  - status

  ```bash
     [root@hadoop-cluster-1 bin]# ./zkServer.sh  status
     /usr/bin/java
     ZooKeeper JMX enabled by default
     Using config: /data/tools/apache-zookeeper-3.6.0-bin/bin/../conf/zoo.cfg
     Client port found: 2181. Client address: localhost.
     Mode: follower

  ```

- 安装hadoop 集群   
  - 解压hadoop-3.3.0-aarch64.tar.gz安装到到 /data # hadoop-cluster-3 执行 ,ssh-keygen 机器
  - set env

```bash

vim ./etc/hadoop/hadoop-env.sh 

# yum 安装不需要手动配置JAVA_HOME,其他安装需要配置JAVA_HOME
export JAVA_HOME=/usr
export HDFS_NAMENODE_USER=root
export HDFS_DATANODE_USER=root
export HDFS_SECONDARYNAMENODE_USER=root
export HDFS_JOURNALNODE_USER=root
export HDFS_ZKFC_USER=root

```

 - 修改core-site.xml

```xml
[root@hadoop-cluster-3 hadoop-3.3.0]# cat ./etc/hadoop/core-site.xml 
<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="configuration.xsl"?>
<!--
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License. See accompanying LICENSE file.
-->

<!-- Put site-specific property overrides in this file. -->

<configuration>
    <property>
        <name>fs.defaultFS</name>
        <value>hdfs://mycluster</value>
    </property>

    <property>
        <name>hadoop.tmp.dir</name>
        <value>/data/tools/hadoop-3.3.0/tmp</value>
    </property>

    <property>
        <name>ha.zookeeper.quorum</name>
        <value>hadoop-cluster-1:2181,hadoop-cluster-2:2181,hadoop-cluster-3:2181</value>
    </property>

</configuration>

```
 - 修改hdfs-site.xml 

```xml
[root@hadoop-cluster-3 hadoop-3.3.0]# cat ./etc/hadoop/hdfs-site.xml 
<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="configuration.xsl"?>
<!--
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License. See accompanying LICENSE file.
-->

<!-- Put site-specific property overrides in this file. -->

<configuration>

    <property>
        <name>dfs.replication</name>
        <value>3</value>
    </property>
   <property>
        <name>dfs.datanode.data.dir</name>
        <value>/data/tools/hadoop-3.3.0/data</value>
    </property>
   <property>
        <name>dfs.namenode.name.dir</name>
        <value>/data/tools/hadoop-3.3.0/name</value>
    </property>

   <property>
        <name>dfs.nameservices</name>
        <value>mycluster</value>
    </property>
   <property>
     <name>dfs.ha.namenodes.mycluster</name>
     <value>nn1,nn2,nn3</value>
   </property>


    <property>
       <name>dfs.namenode.rpc-address.mycluster.nn1</name>
       <value>hadoop-cluster-1:8020</value>
    </property>
    <property>
       <name>dfs.namenode.rpc-address.mycluster.nn2</name>
       <value>hadoop-cluster-2:8020</value>
    </property>
    <property>
       <name>dfs.namenode.rpc-address.mycluster.nn3</name>
       <value>hadoop-cluster-3:8020</value>
    </property>

<property>
  <name>dfs.namenode.http-address.mycluster.nn1</name>
  <value>hadoop-cluster-1:9870</value>
</property>
<property>
  <name>dfs.namenode.http-address.mycluster.nn2</name>
  <value>hadoop-cluster-2:9870</value>
</property>
<property>
  <name>dfs.namenode.http-address.mycluster.nn3</name>
  <value>hadoop-cluster-3:9870</value>
</property>

<property>
  <name>dfs.namenode.shared.edits.dir</name>
  <value>qjournal://hadoop-cluster-1:8485;hadoop-cluster-2:8485;hadoop-cluster-3:8485/mycluster</value>
</property>

<property>
    <name>dfs.journalnode.edits.dir</name>
    <value>/data/tools/hadoop-3.3.0/journaldata</value>
</property>

<property>
    <name>dfs.ha.automatic-failover.enabled</name>
    <value>true</value>
</property>

<property>
  <name>dfs.client.failover.proxy.provider.mycluster</name>
  <value>org.apache.hadoop.hdfs.server.namenode.ha.ConfiguredFailoverProxyProvider</value>
</property>

<property>
    <name>dfs.ha.fencing.methods</name>
    <value>
        sshfence
    </value>
</property>

<property>
    <name>dfs.ha.fencing.ssh.private-key-files</name>
    <value>/root/.ssh/id_rsa</value>
</property>

<property>
    <name>dfs.ha.fencing.ssh.connect-timeout</name>
    <value>30000</value>
</property>
</configuration>

``` 
 - copy hadoop包到其他机器的文件夹下

 - 启动journal node

```bash
[root@hadoop-cluster-3 hadoop-3.3.0]# ./bin/hdfs --daemon start journalnode

```



 
 - 启动 namenode  cluster-3

  - 格式化

```bash
[root@hadoop-cluster-3 hadoop-3.3.0]# ./bin/hdfs namenode -format

2020-08-10 08:33:52,826 INFO namenode.FSImage: Allocated new BlockPoolId: BP-769463694-192.168.226.64-1597048432826
2020-08-10 08:33:52,851 INFO common.Storage: Storage directory /data/tools/hadoop-3.3.0/tmp/dfs/name has been successfully formatted.  #format 成功
2020-08-10 08:33:53,320 INFO namenode.FSImageFormatProtobuf: Saving image file /data/tools/hadoop-3.3.0/tmp/dfs/name/current/fsimage.ckpt_0000000000000000000 using no compression
2020-08-10 08:33:53,480 INFO namenode.FSImageFormatProtobuf: Image file /data/tools/hadoop-3.3.0/tmp/dfs/name/current/fsimage.ckpt_0000000000000000000 of size 399 bytes saved in 0 seconds .
2020-08-10 08:33:53,503 INFO namenode.NNStorageRetentionManager: Going to retain 1 images with txid >= 0
2020-08-10 08:33:53,546 INFO namenode.FSImage: FSImageSaver clean checkpoint: txid=0 when meet shutdown.
2020-08-10 08:33:53,546 INFO namenode.NameNode: SHUTDOWN_MSG: 
/************************************************************
SHUTDOWN_MSG: Shutting down NameNode at hadoop-cluster-1/192.168.226.64
************************************************************/
[root@hadoop-cluster-1 hadoop-3.3.0]# bin/hdfs --daemon start namenode
[root@hadoop-cluster-1 hadoop-3.3.0]#  bin/hdfs zkfc -formatZK
2020-08-10 08:35:04,689 INFO tools.DFSZKFailoverController: STARTUP_MSG: 

```

  - 启动

```bash

[root@hadoop-cluster-3 hadoop-3.3.0]# bin/hdfs --daemon start namenode

```
 
 - 启动 cluster-2 , cluster-1 namenode 
 

```bash
[root@hadoop-cluster-2 hadoop-3.3.0]# bin/hdfs namenode -bootstrapStandby  #拉取元数据

=====================================================
About to bootstrap Standby ID nn3 from:
           Nameservice ID: mycluster
        Other Namenode ID: nn1
  Other NN's HTTP address: http://hadoop-cluster-1:9870
  Other NN's IPC  address: hadoop-cluster-1/192.168.226.64:9820
             Namespace ID: 1318654867
            Block pool ID: BP-769463694-192.168.226.64-1597048432826
               Cluster ID: CID-601989a3-e419-4ef5-8ae1-1d960eb3c75d
           Layout version: -65
       isUpgradeFinalized: true
=====================================================
2020-08-10 08:34:47,970 INFO common.Storage: Storage directory /data/tools/hadoop-3.3.0/tmp/dfs/name has been successfully formatted.
2020-08-10 08:34:48,056 INFO namenode.FSEditLog: Edit logging is async:true
2020-08-10 08:34:48,177 INFO namenode.TransferFsImage: Opening connection to http://hadoop-cluster-1:9870/imagetransfer?getimage=1&txid=0&storageInfo=-65:1318654867:1597048432826:CID-601989a3-e419-4ef5-8ae1-1d960eb3c75d&bootstrapstandby=true
2020-08-10 08:34:48,217 INFO common.Util: Combined time for file download and fsync to all disks took 0.01s. The file download took 0.00s at 0.00 KB/s. Synchronous (fsync) write to disk of /data/tools/hadoop-3.3.0/tmp/dfs/name/current/fsimage.ckpt_0000000000000000000 took 0.00s.
2020-08-10 08:34:48,217 INFO namenode.TransferFsImage: Downloaded file fsimage.ckpt_0000000000000000000 size 399 bytes.
2020-08-10 08:34:48,233 INFO ha.BootstrapStandby: Skipping InMemoryAliasMap bootstrap as it was not configured


# 启动namenode

[root@hadoop-cluster-2 hadoop-3.3.0]#  bin/hdfs --daemon start namenode

```

 - 格式化ZKFC
  - 在cluster-3执行

```bash
[root@hadoop-cluster-3 hadoop-3.3.0]#  bin/hdfs zkfc -formatZK

2020-08-10 08:35:05,356 INFO zookeeper.ClientCnxn: zookeeper.request.timeout value is 0. feature enabled=
2020-08-10 08:35:05,368 INFO zookeeper.ClientCnxn: Opening socket connection to server hadoop-cluster-1/192.168.226.64:2181. Will not attempt to authenticate using SASL (unknown error)
2020-08-10 08:35:05,377 INFO zookeeper.ClientCnxn: Socket connection established, initiating session, client: /192.168.226.64:41577, server: hadoop-cluster-1/192.168.226.64:2181
2020-08-10 08:35:05,420 INFO zookeeper.ClientCnxn: Session establishment complete on server hadoop-cluster-1/192.168.226.64:2181, sessionid = 0x100007377b50000, negotiated timeout = 10000
2020-08-10 08:35:05,424 INFO ha.ActiveStandbyElector: Session connected.
2020-08-10 08:35:05,480 INFO ha.ActiveStandbyElector: Successfully created /hadoop-ha/mycluster in ZK.
2020-08-10 08:35:05,593 INFO zookeeper.ZooKeeper: Session: 0x100007377b50000 closed
2020-08-10 08:35:05,593 WARN ha.ActiveStandbyElector: Ignoring stale result from old client with sessionId 0x100007377b50000
2020-08-10 08:35:05,594 INFO zookeeper.ClientCnxn: EventThread shut down for session: 0x100007377b50000
2020-08-10 08:35:05,597 INFO tools.DFSZKFailoverController: SHUTDOWN_MSG: 

```

 - 启用 zkfc (all controller nodes)


```bash
[root@hadoop-cluster-2 hadoop-3.3.0]# bin/hdfs --daemon start zkfc
```


 - 配置yarn(all cluster nodes)
  - resourcemanager 
 
```xml
#参考官方最小化配置
[root@hadoop-cluster-2 hadoop-3.3.0]# cat etc/hadoop/yarn-site.xml 
<?xml version="1.0"?>
<!--
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License. See accompanying LICENSE file.
-->
<configuration>

<!-- Site specific YARN configuration properties -->

<property>
  <name>yarn.resourcemanager.ha.enabled</name>
  <value>true</value>
</property>
<property>
  <name>yarn.resourcemanager.cluster-id</name>
  <value>cluster1</value>
</property>
<property>
  <name>yarn.resourcemanager.ha.rm-ids</name>
  <value>rm1,rm2,rm3</value>
</property>
<property>
  <name>yarn.resourcemanager.hostname.rm1</name>
  <value>hadoop-cluster-1</value>
</property>
<property>
  <name>yarn.resourcemanager.hostname.rm2</name>
  <value>hadoop-cluster-2</value>
</property>
<property>
  <name>yarn.resourcemanager.hostname.rm3</name>
  <value>hadoop-cluster-3</value>
</property>
<property>
  <name>yarn.resourcemanager.webapp.address.rm1</name>
  <value>hadoop-cluster-1:8088</value>
</property>
<property>
  <name>yarn.resourcemanager.webapp.address.rm2</name>
  <value>hadoop-cluster-2:8088</value>
</property>
<property>
  <name>yarn.resourcemanager.webapp.address.rm3</name>
  <value>hadoop-cluster-3:8088</value>
</property>
<property>
  <name>hadoop.zk.address</name>
  <value>hadoop-cluster-1:2181,hadoop-cluster-2:2181,hadoop-cluster-3:2181</value>
</property>


</configuration>

```

> 默认是主备模式 , 先配置3个看启动什么结果


```bash
[root@hadoop-cluster-3 hadoop-3.3.0]# ./bin/yarn rmadmin -getServiceState rm1
2020-08-12 03:42:39,832 WARN util.NativeCodeLoader: Unable to load native-hadoop library for your platform... using builtin-java classes where applicable
standby
[root@hadoop-cluster-3 hadoop-3.3.0]# ./bin/yarn rmadmin -getServiceState rm2
2020-08-12 03:42:45,492 WARN util.NativeCodeLoader: Unable to load native-hadoop library for your platform... using builtin-java classes where applicable
active
[root@hadoop-cluster-3 hadoop-3.3.0]# ./bin/yarn rmadmin -getServiceState rm3
2020-08-12 03:42:48,463 WARN util.NativeCodeLoader: Unable to load native-hadoop library for your platform... using builtin-java classes where applicable
standby

```


 - 启动resourcemanage
 ```bash
[root@hadoop-cluster-2 hadoop-3.3.0]# ./bin/yarn --daemon start resourcemanager
 ```



#### data node 

> 配置文件直接copy

- datanode

```bash
[root@hadoop-data-node-2 hadoop-3.3.0]#  ./bin/hdfs --daemon start datanode
```
- nodemanager


```bash
[root@hadoop-data-node-2 hadoop-3.3.0]#  ./bin/yarn --daemon start nodemanager
```


#### 集群状态查看

- yarn


```bash
[root@hadoop-cluster-3 hadoop-3.3.0]# ./bin/yarn  node -all -list
2020-08-13 01:19:46,181 WARN util.NativeCodeLoader: Unable to load native-hadoop library for your platform... using builtin-java classes where applicable
Total Nodes:5
         Node-Id	     Node-State	Node-Http-Address	Number-of-Running-Containers
hadoop-data-node-3:44796	        RUNNING	hadoop-data-node-3:8042	                           0
hadoop-data-node-1:48271	        RUNNING	hadoop-data-node-1:8042	                           0
hadoop-data-node-4:49883	        RUNNING	hadoop-data-node-4:8042	                           0
hadoop-data-node-2:59034	        RUNNING	hadoop-data-node-2:8042	                           0
[root@hadoop-cluster-3 hadoop-3.3.0]# ./bin/yarn rmadmin -getAllServiceState
2020-08-13 01:21:27,869 WARN util.NativeCodeLoader: Unable to load native-hadoop library for your platform... using builtin-java classes where applicable
hadoop-cluster-1:8033                              active    
hadoop-cluster-2:8033                              standby   
hadoop-cluster-3:8033                              standby   
[root@hadoop-cluster-3 hadoop-3.3.0]# 



```

- hdfs


```bash
[root@hadoop-cluster-2 hadoop-3.3.0]# ./bin/hadoop dfsadmin -report
WARNING: Use of this script to execute dfsadmin is deprecated.
WARNING: Attempting to execute replacement "hdfs dfsadmin" instead.

2020-08-13 01:32:27,451 WARN util.NativeCodeLoader: Unable to load native-hadoop library for your platform... using builtin-java classes where applicable
Configured Capacity: 429287014400 (399.80 GB)
Present Capacity: 420413999971 (391.54 GB)
DFS Remaining: 420411299249 (391.54 GB)
DFS Used: 2700722 (2.58 MB)
DFS Used%: 0.00%
Replicated Blocks:
	Under replicated blocks: 0
	Blocks with corrupt replicas: 0
	Missing blocks: 0
	Missing blocks (with replication factor 1): 0
	Low redundancy blocks with highest priority to recover: 0
	Pending deletion blocks: 0
Erasure Coded Block Groups: 
	Low redundancy block groups: 0
	Block groups with corrupt internal blocks: 0
	Missing block groups: 0
	Low redundancy blocks with highest priority to recover: 0
	Pending deletion blocks: 0

-------------------------------------------------
Live datanodes (4):

Name: 192.168.226.66:9866 (hadoop-data-node-2)
Hostname: hadoop-data-node-2
Decommission Status : Normal
Configured Capacity: 107321753600 (99.95 GB)
DFS Used: 868352 (848 KB)
Non DFS Used: 1490026496 (1.39 GB)
DFS Remaining: 105293993621 (98.06 GB)
DFS Used%: 0.00%
DFS Remaining%: 98.11%
Configured Cache Capacity: 0 (0 B)
Cache Used: 0 (0 B)
Cache Remaining: 0 (0 B)
Cache Used%: 100.00%
Cache Remaining%: 0.00%
Xceivers: 9
Last contact: Thu Aug 13 01:32:27 UTC 2020
Last Block Report: Wed Aug 12 21:04:08 UTC 2020
Num of Blocks: 88


Name: 192.168.226.67:9866 (hadoop-data-node-3)
Hostname: hadoop-data-node-3
Decommission Status : Normal
Configured Capacity: 107321753600 (99.95 GB)
DFS Used: 882098 (861.42 KB)
Non DFS Used: 1490025038 (1.39 GB)
DFS Remaining: 105159763059 (97.94 GB)
DFS Used%: 0.00%
DFS Remaining%: 97.99%
Configured Cache Capacity: 0 (0 B)
Cache Used: 0 (0 B)
Cache Remaining: 0 (0 B)
Cache Used%: 100.00%
Cache Remaining%: 0.00%
Xceivers: 11
Last contact: Thu Aug 13 01:32:27 UTC 2020
Last Block Report: Wed Aug 12 21:21:20 UTC 2020
Num of Blocks: 89


Name: 192.168.226.68:9866 (hadoop-data-node-1)
Hostname: hadoop-data-node-1
Decommission Status : Normal
Configured Capacity: 107321753600 (99.95 GB)
DFS Used: 98304 (96 KB)
Non DFS Used: 1987067904 (1.85 GB)
DFS Remaining: 104797718122 (97.60 GB)
DFS Used%: 0.00%
DFS Remaining%: 97.65%
Configured Cache Capacity: 0 (0 B)
Cache Used: 0 (0 B)
Cache Remaining: 0 (0 B)
Cache Used%: 100.00%
Cache Remaining%: 0.00%
Xceivers: 9
Last contact: Thu Aug 13 01:32:27 UTC 2020
Last Block Report: Thu Aug 13 01:05:53 UTC 2020
Num of Blocks: 4


Name: 192.168.226.69:9866 (hadoop-data-node-4)
Hostname: hadoop-data-node-4
Decommission Status : Normal
Configured Capacity: 107321753600 (99.95 GB)
DFS Used: 851968 (832 KB)
Non DFS Used: 1489993728 (1.39 GB)
DFS Remaining: 105159824447 (97.94 GB)
DFS Used%: 0.00%
DFS Remaining%: 97.99%
Configured Cache Capacity: 0 (0 B)
Cache Used: 0 (0 B)
Cache Remaining: 0 (0 B)
Cache Used%: 100.00%
Cache Remaining%: 0.00%
Xceivers: 11
Last contact: Thu Aug 13 01:32:26 UTC 2020
Last Block Report: Wed Aug 12 22:04:37 UTC 2020
Num of Blocks: 86


[root@hadoop-cluster-2 hadoop-3.3.0]# ./bin/hdfs  haadmin  -getAllServiceState
2020-08-13 01:32:35,172 WARN util.NativeCodeLoader: Unable to load native-hadoop library for your platform... using builtin-java classes where applicable
hadoop-cluster-1:8020                              standby   
hadoop-cluster-2:8020                              active    
hadoop-cluster-3:8020                              standby   
[root@hadoop-cluster-2 hadoop-3.3.0]# 


```



## 常见问题

> [!WARNING]  启动失败

```bash
 2020-08-10 06:39:05,583 INFO org.apache.hadoop.util.ExitUtil: Exiting with status -1: java.io.IOException: java.lang.RuntimeException: Could not resolve Kerberos principal name: java.net.UnknownHostException: hadoop-cluster-3.novalocal: hadoop-cluster-3.novalocal: Name or service not known

# 
127.0.0.1   localhost localhost.localdomain localhost4 localhost4.localdomain4
::1         localhost localhost.localdomain localhost6 localhost6.localdomain6
192.168.226.63 hadoop-cluster-3  hadoop-cluster-3.novalocal
192.168.226.65 hadoop-cluster-2   hadoop-cluster-2.novalocal
192.168.226.64 hadoop-cluster-1   hadoop-cluster-1.novalocal

```