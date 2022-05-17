## 安装

### 下载 bin 包
 - url http://archive.apache.org/dist/tez/0.9.2/
 - gitlab 下载 0.9.2 source 包编译,会报错

### zip 包放到hadoop filesystem

```bash
[root@hadoop-cluster-2 bin]# ./hadoop fs -mkdir -p /tez
2020-08-25 00:35:33,859 WARN util.NativeCodeLoader: Unable to load native-hadoop library for your platform... using builtin-java classes where applicable
[root@hadoop-cluster-2 bin]# ./hadoop fs -put -f /data/tools/apache-tez-0.9.2-bin.tar.gz  /tez
2020-08-25 00:36:17,090 WARN util.NativeCodeLoader: Unable to load native-hadoop library for your platform... using builtin-java classes where applicable

```


### hive 新增配置文件


```xml
[root@hadoop-cluster-2 conf]# cat tez-site.xml 
<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="configuration.xsl"?>
<configuration>
    <property>
        <name>tez.lib.uris</name>
        <value>${fs.defaultFS}/tez/apache-tez-0.9.2-bin.tar.gz</value>
</property>

    <property>
         <name>tez.use.cluster.hadoop-libs</name>
         <value>true</value>
</property>

    <property>
         <name>tez.history.logging.service.class</name>        
         <value>org.apache.tez.dag.history.logging.ats.ATSHistoryLoggingService</value>
    </property>
</configuration>


```

### hive-env.sh 增加tez 环境变量



```bash
export HIVE_HOME=/data/tools/apache-hive-3.1.2-bin
export HIVE_CONF_DIR=/data/tools/apache-hive-3.1.2-bin/conf
export HADOOP_HOME=/data/tools/hadoop-3.3.0
export HIVE_AUX_JARS_PATH=/data/tools/apache-hive-3.1.2-bin/lib



```

### hadoop 增加配置

```bash
export JAVA_HOME=/usr
export HDFS_NAMENODE_USER=root
export HDFS_DATANODE_USER=root
export HDFS_SECONDARYNAMENODE_USER=root
export HDFS_JOURNALNODE_USER=root
export HDFS_ZKFC_USER=root

export TEZ_CONF_DIR=/data/tools/apache-hive-3.1.2-bin/conf/tez-site.xml 
export TEZ_JARS=/data/tools/apache-tez-0.9.2-bin
export HADOOP_CLASSPATH=${HADOOP_CLASSPATH}:${TEZ_CONF_DIR}:${TEZ_JARS}/*:${TEZ_JARS}/lib/*

```



## 常见问题

 - 没有定位到问题, 可能是hadoop 版本

```bash
2020-08-25T07:01:30,121 ERROR [HiveServer2-Background-Pool: Thread-605] exec.Task: Failed to execute tez graph.
java.lang.IllegalArgumentException: Can not create a Path from an empty string
	at org.apache.hadoop.fs.Path.checkPathArg(Path.java:172) ~[hadoop-common-3.3.0.jar:?]
	at org.apache.hadoop.fs.Path.<init>(Path.java:184) ~[hadoop-common-3.3.0.jar:?]
	at org.apache.hadoop.fs.Path.<init>(Path.java:119) ~[hadoop-common-3.3.0.jar:?]
	at org.apache.hadoop.hive.ql.exec.tez.DagUtils.addTempResources(DagUtils.java:1041) ~[hive-exec-3.1.2.jar:3.1.2]
	at org.apache.hadoop.hive.ql.exec.tez.DagUtils.localizeTempFilesFromConf(DagUtils.java:931) ~[hive-exec-3.1.2.jar:3.1.2]
	at org.apache.hadoop.hive.ql.exec.tez.TezSessionState.ensureLocalResources(TezSessionState.java:610) ~[hive-exec-3.1.2.jar:3.1.2]
	at org.apache.hadoop.hive.ql.exec.tez.TezSessionState.openInternal(TezSessionState.java:287) ~[hive-exec-3.1.2.jar:3.1.2]
	at org.apache.hadoop.hive.ql.exec.tez.TezSessionPoolSession.openInternal(TezSessionPoolSession.java:124) ~[hive-exec-3.1.2.jar:3.1.2]



```
