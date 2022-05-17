
## 准备
### 机器
|  vip   | ip   |  host  | OS |
|  ----   | ----  | ---- |  ----  |
| 192.168.151.200 |  192.168.226.64   | hadoop-cluster-1   |  centos 7  |
| 192.168.151.200 |  192.168.226.65    | hadoop-cluster-2 |  centos 7  |
| 192.168.151.200 |  192.168.226.63    | hadoop-cluster-3 |  centos 7  |
|     |  192.168.226.66   |  hadoop-datanode01  |  centos 7  |
|     |  192.168.226.67   |  hadoop-datanode02  |  centos 7  |
|     |  192.168.226.68   |  hadoop-datanode03  |  centos 7  |
|     |  192.168.226.69   |  hadoop-datanode04  |  centos 7  |
|     |  192.168.213.59   |  mariadb-galera-cluster |  centos 7 |
|     |  192.168.213.65   |  mariadb-galera-cluster |  centos 7 |
|     |  192.168.213.58   |  mariadb-galera-cluster |  centos 7 |


### cluster node

- hiveserver2

## 安装

### tar包下载

 - https://mirrors.tuna.tsinghua.edu.cn/apache/hive/hive-3.1.2/apache-hive-3.1.2-bin.tar.gz



### cluster 配置
 
#### add hive_home_path

```bash
# /etc/profile
export HIVE_HOME=/data/tools/apache-hive-3.1.2-bin
export PATH=$HIVE_HOME/bin:$PATH

```
#### 创建hive dir


```bash
[root@hadoop-cluster-2 bin]# ./hadoop  fs -mkdir       /tmp
2020-08-19 07:00:55,671 WARN util.NativeCodeLoader: Unable to load native-hadoop library for your platform... using builtin-java classes where applicable
[root@hadoop-cluster-2 bin]# 
[root@hadoop-cluster-2 bin]# ./hadoop  fs -mkdir          /user/hive/warehouse
2020-08-19 07:01:12,608 WARN util.NativeCodeLoader: Unable to load native-hadoop library for your platform... using builtin-java classes where applicable
mkdir: `hdfs://mycluster/user/hive': No such file or directory
[root@hadoop-cluster-2 bin]# ./hadoop  fs -mkdir       -p   /user/hive/warehouse
2020-08-19 07:01:35,783 WARN util.NativeCodeLoader: Unable to load native-hadoop library for your platform... using builtin-java classes where applicable
[root@hadoop-cluster-2 bin]# ./hadoop  fs  -chmod g+w   /tmp
2020-08-19 07:02:04,907 WARN util.NativeCodeLoader: Unable to load native-hadoop library for your platform... using builtin-java classes where applicable
[root@hadoop-cluster-2 bin]# ./hadoop  fs -chmod g+w   /user/hive/warehouse
2020-08-19 07:02:20,989 WARN util.NativeCodeLoader: Unable to load native-hadoop library for your platform... using builtin-java classes where applicable
[root@hadoop-cluster-2 bin]# 

```

#### 安装 mariadb clint



```bash
[root@hadoop-cluster-2 conf]# yum -y install mariadb mariadb-dev mariadb-server
```

#### 修改hive remote 配置
 - touch apache-hive-3.1.2-bin/conf/hive-site.xml 

```xml
[root@hadoop-cluster-2 apache-hive-3.1.2-bin]# cat conf/hive-site.xml 
<?xml version="1.0" encoding="UTF-8" standalone="no"?><?xml-stylesheet type="text/xsl" href="configuration.xsl"?>
<configuration>
        <property>
                <name>javax.jdo.option.ConnectionURL</name>
                <value>jdbc:mysql://192.168.213.59:3306/hive</value>
        </property>

        <property>
                <name>javax.jdo.option.ConnectionDriverName</name>
                <value>com.mysql.jdbc.Driver</value>
        </property>

        <property>
                <name>javax.jdo.option.ConnectionUserName</name>
                <value>root</value>
        </property>

        <property>
                <name>javax.jdo.option.ConnectionPassword</name>
                <value>123456</value>
        </property>

        <property>
                <name>hive.metastore.schema.verification</name>
                <value>false</value>
        </property>
	<property> 
   		 <name>hive.cli.print.current.db</name>
		 <value>true</value>
	</property>
	<property> 
	         <name>hive.cli.print.header</name>
	         <value>true</value>
	</property>
	<property>
       		 <name>hive.server2.thrift.port</name>
     		 <value>10000</value>
	</property>

    	<property>
       		<name>hive.server2.thrift.bind.host</name>
       		<value>192.168.213.178</value>
     	</property>

</configuration>


```

 - hive-env.sh

```bash
# export HIVE_CONF_DIR=

# Folder containing extra libraries required for hive compilation/execution can be controlled by:
# export HIVE_AUX_JARS_PATH=
export HIVE_HOME=/data/tools/apache-hive-3.1.2-bin
export HIVE_CONF_DIR=/data/tools/apache-hive-3.1.2-bin/conf
export HADOOP_HOME=/data/tools/hadoop-3.3.0
export HIVE_AUX_JARS_PATH=/data/tools/apache-hive-3.1.2-bin/lib
[root@hadoop-cluster-2 apache-hive-3.1.2-bin]# 

```

### 初始化数据


```bash
[root@hadoop-cluster-1 apache-hive-3.1.2-bin]# ./schematool -dbType mysql -initSchema

```


### 启动hiveserver2


```bash
[root@hadoop-cluster-2 bin]# cat start.sh 
nohup ./hiveserver2 2>&1 >/dev/null&
[root@hadoop-cluster-2 bin]# 

```


## 常见问题

- java.lang.NoSuchMethodError: com.google.common.base.Preconditions.checkArgument

```bash
which: no hbase in (/data/tools/apache-hive-3.1.2-bin/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/root/bin)
2020-08-19 15:54:32: Starting HiveServer2
SLF4J: Class path contains multiple SLF4J bindings.
SLF4J: Found binding in [jar:file:/data/tools/apache-hive-3.1.2-bin/lib/log4j-slf4j-impl-2.10.0.jar!/org/slf4j/impl/StaticLoggerBinder.class]
SLF4J: Found binding in [jar:file:/data/tools/hadoop-3.3.0/share/hadoop/common/lib/slf4j-log4j12-1.7.25.jar!/org/slf4j/impl/StaticLoggerBinder.class]
SLF4J: See http://www.slf4j.org/codes.html#multiple_bindings for an explanation.
SLF4J: Actual binding is of type [org.apache.logging.slf4j.Log4jLoggerFactory]
Exception in thread "main" java.lang.NoSuchMethodError: com.google.common.base.Preconditions.checkArgument(ZLjava/lang/String;Ljava/lang/Object;)V
	at org.apache.hadoop.conf.Configuration.set(Configuration.java:1380)
	at org.apache.hadoop.conf.Configuration.set(Configuration.java:1361)
	at org.apache.hadoop.mapred.JobConf.setJar(JobConf.java:536)
	at org.apache.hadoop.mapred.JobConf.setJarByClass(JobConf.java:554)
	at org.apache.hadoop.mapred.JobConf.<init>(JobConf.java:448)
	at org.apache.hadoop.hive.conf.HiveConf.initialize(HiveConf.java:5141)
	at org.apache.hadoop.hive.conf.HiveConf.<init>(HiveConf.java:5099)
	at org.apache.hadoop.hive.common.LogUtils.initHiveLog4jCommon(LogUtils.java:97)


```

> hadoop和hive中guava jar包可能版本冲突，删除低版本使用高版本的jar包



```bash
[root@hadoop-cluster-2 hadoop-3.3.0]# pwd
/data/tools/hadoop-3.3.0
[root@hadoop-cluster-2 hadoop-3.3.0]# cd ../hbase-2.3.0
[root@hadoop-cluster-2 hbase-2.3.0]# find -name \*.jar | grep gu
./lib/jersey-guava-2.25.1.jar
./lib/guice-3.0.jar
./lib/guice-servlet-3.0.jar
./lib/guava-11.0.2.jar
./lib/commons-configuration-1.6.jar
[root@hadoop-cluster-2 hbase-2.3.0]# pwd
/data/tools/hbase-2.3.0
[root@hadoop-cluster-2 hbase-2.3.0]# pwd
/data/tools/hbase-2.3.0
[root@hadoop-cluster-2 hbase-2.3.0]# cd /data/tools/hadoop-3.3.0/
[root@hadoop-cluster-2 hadoop-3.3.0]# find -name \*.jar | grep gua
./share/hadoop/common/lib/listenablefuture-9999.0-empty-to-avoid-conflict-with-guava.jar
./share/hadoop/common/lib/guava-27.0-jre.jar
./share/hadoop/yarn/csi/lib/guava-20.0.jar
./share/hadoop/hdfs/lib/listenablefuture-9999.0-empty-to-avoid-conflict-with-guava.jar
./share/hadoop/hdfs/lib/guava-27.0-jre.jar
[root@hadoop-cluster-2 hadoop-3.3.0]# 
[root@hadoop-cluster-2 hadoop-3.3.0]# pwd
/data/tools/hadoop-3.3.0
[root@hadoop-cluster-2 hadoop-3.3.0]# cd /data/tools/apache-
apache-hive-3.1.2-bin/        apache-hive-3.1.2-bin.tar.gz  apache-zookeeper-3.6.0-bin/   
[root@hadoop-cluster-2 hadoop-3.3.0]# cd /data/tools/apache-hive-3.1.2-bin
[root@hadoop-cluster-2 apache-hive-3.1.2-bin]# mv lib/guava-19.0.jar  lib/guava-19.0.jar.bak
[root@hadoop-cluster-2 apache-hive-3.1.2-bin]# cp /data/tools/hadoop-3.3.0/share/hadoop/yarn/csi/lib/guava-20.0.jar lib/
\[root@hadoop-cluster-2 apache-hive-3.1.2-bin]# 
[root@hadoop-cluster-2 apache-hive-3.1.2-bin]# 
[root@hadoop-cluster-2 apache-hive-3.1.2-bin]# ./hiveserver2 
-bash: ./hiveserver2: No such file or directory
[root@hadoop-cluster-2 apache-hive-3.1.2-bin]# cd bin
[root@hadoop-cluster-2 bin]# ./hiveserver2 
which: no hbase in (/data/tools/apache-hive-3.1.2-bin/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/root/bin)
2020-08-19 16:01:32: Starting HiveServer2
SLF4J: Class path contains multiple SLF4J bindings.
SLF4J: Found binding in [jar:file:/data/tools/apache-hive-3.1.2-bin/lib/log4j-slf4j-impl-2.10.0.jar!/org/slf4j/impl/StaticLoggerBinder.class]
SLF4J: Found binding in [jar:file:/data/tools/hadoop-3.3.0/share/hadoop/common/lib/slf4j-log4j12-1.7.25.jar!/org/slf4j/impl/StaticLoggerBinder.class]
SLF4J: See http://www.slf4j.org/codes.html#multiple_bindings for an explanation.
SLF4J: Actual binding is of type [org.apache.logging.slf4j.Log4jLoggerFactory]
Hive Session ID = edac1d17-208b-4a6e-b79e-af51f84a2d29

```


- 初始化提示mysql jar包 找不到

```
[root@hadoop-cluster-1 bin]# ./schematool -dbType mysql -initSchema
SLF4J: Class path contains multiple SLF4J bindings.
SLF4J: Found binding in [jar:file:/data/tools/apache-hive-3.1.2-bin/lib/log4j-slf4j-impl-2.10.0.jar!/org/slf4j/impl/StaticLoggerBinder.class]
SLF4J: Found binding in [jar:file:/data/tools/hadoop-3.3.0/share/hadoop/common/lib/slf4j-log4j12-1.7.25.jar!/org/slf4j/impl/StaticLoggerBinder.class]
SLF4J: See http://www.slf4j.org/codes.html#multiple_bindings for an explanation.
SLF4J: Actual binding is of type [org.apache.logging.slf4j.Log4jLoggerFactory]
Metastore connection URL:	 jdbc:mysql://192.168.213.59:3306/hive
Metastore Connection Driver :	 com.mysql.jdbc.Driver
Metastore connection User:	 root
org.apache.hadoop.hive.metastore.HiveMetaException: Failed to load driver
Underlying cause: java.lang.ClassNotFoundException : com.mysql.jdbc.Driver
Use --verbose for detailed stacktrace.
*** schemaTool failed ***

```

> 下载 java connector(mysql-connector-java-8.0.21.jar) 放到lib 目录 ,maven repo 下载


- 连接hive 报错

```
Beeline version 3.1.2 by Apache Hive
beeline> 
beeline> 
beeline> !connect jdbc:hive2://192.168.226.64:10000
Connecting to jdbc:hive2://192.168.226.64:10000
Enter username for jdbc:hive2://192.168.226.64:10000: root
Enter password for jdbc:hive2://192.168.226.64:10000: ******
20/08/20 06:43:44 [main]: WARN jdbc.HiveConnection: Failed to connect to 192.168.226.64:10000
Error: Could not open client transport with JDBC Uri: jdbc:hive2://192.168.226.64:10000: Failed to open new session: java.lang.RuntimeException: org.apache.hadoop.ipc.RemoteException(org.apache.hadoop.security.authorize.AuthorizationException): User: root is not allowed to impersonate root (state=08S01,code=0)
beeline> exit

```
 修改 hadoop core-site.xml 文件(需要重启)  改动没效果 

```
[root@hadoop-cluster-1 hadoop-3.3.0]# cat  etc/hadoop/core-site.xml 
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
     <property>
         <name>hadoop.proxyuser.root.hosts</name>
         <value>*</value>
     </property>

    <property>
         <name>hadoop.proxyuser.root.groups</name>
         <value>*</value>
    </property>
</configuration>

```


修改 hive-site.xml 文件
```
[root@hadoop-cluster-1 bin]# cat  ../conf/hive-site.xml 
<?xml version="1.0" encoding="UTF-8" standalone="no"?><?xml-stylesheet type="text/xsl" href="configuration.xsl"?>
<configuration>
 <property>
  <name>hive.server2.enable.doAs</name>
  <value>false</value> 
  </property>
</configuration>

```


- too many connections

```
Unexpected end of file when reading from HS2 server. The root cause might be too many concurrent connections. Please ask the administrator to check the number of active connections, and adjust hive.server2.thrift.max.worker.threads if applicable
```
> 如果启动Hbase thrift server2 需要关闭


- 找不到 org.apache.tez.dag.api.SessionNotRunning


```
2020-08-20T07:34:23,932  INFO [main] server.HiveServer2: Stopped tez session pool manager.
2020-08-20T07:34:23,932  WARN [main] server.HiveServer2: Error starting HiveServer2 on attempt 1, will retry in 60000ms
java.lang.NoClassDefFoundError: org/apache/tez/dag/api/SessionNotRunning
	at org.apache.hadoop.hive.ql.exec.tez.TezSessionPoolSession$AbstractTriggerValidator.startTriggerValidator(TezSessionPoolSession.java:74) ~[hive-exec-3.1.2.jar:3.1.2]
	at org.apache.hadoop.hive.ql.exec.tez.TezSessionPoolManager.initTriggers(TezSessionPoolManager.java:207) ~[hive-exec-3.1.2.jar:3.1.2]
	at org.apache.hadoop.hive.ql.exec.tez.TezSessionPoolManager.startPool(TezSessionPoolManager.java:114) ~[hive-exec-3.1.2.jar:3.1.2]
	at org.apache.hive.service.server.HiveServer2.initAndStartTezSessionPoolManager(HiveServer2.java:839) ~[hive-service-3.1.2.jar:3.1.2]
	at org.apache.hive.service.server.HiveServer2.startOrReconnectTezSessions(HiveServer2.java:822) ~[hive-service-3.1.2.jar:3.1.2]
	at org.apache.hive.service.server.HiveServer2.start(HiveServer2.java:745) ~[hive-service-3.1.2.jar:3.1.2]
	at org.apache.hive.service.server.HiveServer2.startHiveServer2(HiveServer2.java:1037) [hive-service-3.1.2.jar:3.1.2]
	at org.apache.hive.service.server.HiveServer2.access$1600(HiveServer2.java:140) [hive-service-3.1.2.jar:3.1.2]
	at org.apache.hive.service.server.HiveServer2$StartOptionExecutor.execute(HiveServer2.java:1305) [hive-service-3.1.2.jar:3.1.2]
	at org.apache.hive.service.server.HiveServer2.main(HiveServer2.java:1149) [hive-service-3.1.2.jar:3.1.2]
	at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method) ~[?:1.8.0_262]
	at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62) ~[?:1.8.0_262]
	at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43) ~[?:1.8.0_262]
	at java.lang.reflect.Method.invoke(Method.java:498) ~[?:1.8.0_262]
	at org.apache.hadoop.util.RunJar.run(RunJar.java:323) [hadoop-common-3.3.0.jar:?]
	at org.apache.hadoop.util.RunJar.main(RunJar.java:236) [hadoop-common-3.3.0.jar:?]
Caused by: java.lang.ClassNotFoundException: org.apache.tez.dag.api.SessionNotRunning

```

> 需要安装apache-tez ,或者禁用 HS2交互式HA配置

```
<property>
    <name>hive.server2.active.passive.ha.enable</name>
    <value>true</value> # change false to true
</property>

```

- mapred 失败
 - 替换tez 或者spark

```
INFO  : Executing command(queryId=root_20200824075830_35100282-b95f-4c20-bb7d-c90cb11dec8c): select * from hbase_machine_resource_usage  order  by  cpuusage   limit 1
WARN  : Hive-on-MR is deprecated in Hive 2 and may not be available in the future versions. Consider using a different execution engine (i.e. spark, tez) or using Hive 1.X releases.
....
Error: Error while processing statement: FAILED: Execution Error, return code 2 from org.apache.hadoop.hive.ql.exec.mr.MapRedTask (state=08S01,code=2)
0: jdbc:hive2://192.168.212.213:9090> select * from hbase_machine_resource_usage  order  by  cpuusage  desc  limit 1;

```


### 说明

> 配置galera cluster ,其他2 台机器连接自己的thrift2 server 和数据库配置



```
2020-08-20T07:50:28,229  INFO [main] service.AbstractService: Service:HiveServer2 is started.
2020-08-20T07:50:28,230  WARN [main] server.HiveServer2: No policy provider found, skip creating PrivilegeSynchonizer
2020-08-20T07:50:28,232  INFO [main] server.Server: jetty-9.3.20.v20170531
2020-08-20T07:50:28,411  INFO [main] handler.ContextHandler: Started o.e.j.w.WebAppContext@30036a18{/,file:///tmp/jetty-0.0.0.0-10002-hiveserver2-_-any-7344828647128270757.dir/webapp/,AVAILABLE}{jar:file:/data/tools/apache-hive-3.1.2-bin/lib/hive-service-3.1.2.jar!/hive-webapps/hiveserver2}
2020-08-20T07:50:28,413  INFO [main] handler.ContextHandler: Started o.e.j.s.ServletContextHandler@537b3b2e{/static,jar:file:/data/tools/apache-hive-3.1.2-bin/lib/hive-service-3.1.2.jar!/hive-webapps/static,AVAILABLE}
2020-08-20T07:50:28,415  INFO [main] handler.ContextHandler: Started o.e.j.s.ServletContextHandler@1544ded3{/logs,file:///tmp/root/,AVAILABLE}
2020-08-20T07:50:28,427  INFO [main] server.AbstractConnector: Started ServerConnector@305b43ca{HTTP/1.1,[http/1.1]}{0.0.0.0:10002}
2020-08-20T07:50:28,427  INFO [main] server.HiveServer2: Web UI has started on port 10002
2020-08-20T07:50:28,427  INFO [main] server.HiveServer2: HS2 interactive HA enabled. Tez sessions will be started/reconnected by the leader.
2020-08-20T07:50:28,427  INFO [main] server.Server: Started @14561ms
2020-08-20T07:50:28,427  INFO [main] http.HttpServer: Started HttpServer[hiveserver2] on port 10002


```

- 连接数据

```
[root@hadoop-cluster-1 bin]# ./beeline 
SLF4J: Class path contains multiple SLF4J bindings.
SLF4J: Found binding in [jar:file:/data/tools/apache-hive-3.1.2-bin/lib/log4j-slf4j-impl-2.10.0.jar!/org/slf4j/impl/StaticLoggerBinder.class]
SLF4J: Found binding in [jar:file:/data/tools/hadoop-3.3.0/share/hadoop/common/lib/slf4j-log4j12-1.7.25.jar!/org/slf4j/impl/StaticLoggerBinder.class]
SLF4J: See http://www.slf4j.org/codes.html#multiple_bindings for an explanation.
SLF4J: Actual binding is of type [org.apache.logging.slf4j.Log4jLoggerFactory]
SLF4J: Class path contains multiple SLF4J bindings.
SLF4J: Found binding in [jar:file:/data/tools/apache-hive-3.1.2-bin/lib/log4j-slf4j-impl-2.10.0.jar!/org/slf4j/impl/StaticLoggerBinder.class]
SLF4J: Found binding in [jar:file:/data/tools/hadoop-3.3.0/share/hadoop/common/lib/slf4j-log4j12-1.7.25.jar!/org/slf4j/impl/StaticLoggerBinder.class]
SLF4J: See http://www.slf4j.org/codes.html#multiple_bindings for an explanation.
SLF4J: Actual binding is of type [org.apache.logging.slf4j.Log4jLoggerFactory]
Beeline version 3.1.2 by Apache Hive
beeline> !connect jdbc:hive2://192.168.212.157:9090
Connecting to jdbc:hive2://192.168.212.157:9090
Enter username for jdbc:hive2://192.168.212.157:9090: root
Enter password for jdbc:hive2://192.168.212.157:9090: ******
Connected to: Apache Hive (version 3.1.2)
Driver: Hive JDBC (version 3.1.2)
Transaction isolation: TRANSACTION_REPEATABLE_READ
0: jdbc:hive2://192.168.212.157:9090> 
0: jdbc:hive2://192.168.212.157:9090> show databases;
INFO  : Compiling command(queryId=root_20200820075115_b23ea40f-c23c-4eb4-b116-c9726837f61f): show databases
INFO  : Concurrency mode is disabled, not creating a lock manager
INFO  : Semantic Analysis Completed (retrial = false)
INFO  : Returning Hive schema: Schema(fieldSchemas:[FieldSchema(name:database_name, type:string, comment:from deserializer)], properties:null)
INFO  : Completed compiling command(queryId=root_20200820075115_b23ea40f-c23c-4eb4-b116-c9726837f61f); Time taken: 1.406 seconds
INFO  : Concurrency mode is disabled, not creating a lock manager
INFO  : Executing command(queryId=root_20200820075115_b23ea40f-c23c-4eb4-b116-c9726837f61f): show databases
INFO  : Starting task [Stage-0:DDL] in serial mode
INFO  : Completed executing command(queryId=root_20200820075115_b23ea40f-c23c-4eb4-b116-c9726837f61f); Time taken: 0.104 seconds
INFO  : OK
INFO  : Concurrency mode is disabled, not creating a lock manager
+----------------+
| database_name  |
+----------------+
| default        |
+----------------+
1 row selected (2.168 seconds)
0: jdbc:hive2://192.168.212.157:9090> exit



0: jdbc:hive2://hadoop-cluster-2:9090> create external table hbase_machine_resource_usage(id string, ip string, cpuusage float , memoryusage float) STORED BY 'org.apache.hadoop.hive.hbase.HBaseStorageHandler' WITH SERDEPROPERTIES ("hbase.columns.mapping" = ":key,base:ip,base:cpuusage,base:memoryusage") TBLPROPERTIES("hbase.table.name" = "hbase_machine_resource_usage") ;
INFO  : Compiling command(queryId=root_20200824074725_74ad8cf7-0532-4a9c-a945-9b3f85c4667b): create external table hbase_machine_resource_usage(id string, ip string, cpuusage float , memoryusage float) STORED BY 'org.apache.hadoop.hive.hbase.HBaseStorageHandler' WITH SERDEPROPERTIES ("hbase.columns.mapping" = ":key,base:ip,base:cpuusage,base:memoryusage") TBLPROPERTIES("hbase.table.name" = "hbase_machine_resource_usage")
INFO  : Concurrency mode is disabled, not creating a lock manager
INFO  : Semantic Analysis Completed (retrial = false)
INFO  : Returning Hive schema: Schema(fieldSchemas:null, properties:null)
INFO  : Completed compiling command(queryId=root_20200824074725_74ad8cf7-0532-4a9c-a945-9b3f85c4667b); Time taken: 0.275 seconds
INFO  : Concurrency mode is disabled, not creating a lock manager
INFO  : Executing command(queryId=root_20200824074725_74ad8cf7-0532-4a9c-a945-9b3f85c4667b): create external table hbase_machine_resource_usage(id string, ip string, cpuusage float , memoryusage float) STORED BY 'org.apache.hadoop.hive.hbase.HBaseStorageHandler' WITH SERDEPROPERTIES ("hbase.columns.mapping" = ":key,base:ip,base:cpuusage,base:memoryusage") TBLPROPERTIES("hbase.table.name" = "hbase_machine_resource_usage")
INFO  : Starting task [Stage-0:DDL] in serial mode
INFO  : Completed executing command(queryId=root_20200824074725_74ad8cf7-0532-4a9c-a945-9b3f85c4667b); Time taken: 4.29 seconds
INFO  : OK
INFO  : Concurrency mode is disabled, not creating a lock manager
No rows affected (4.588 seconds)
0: jdbc:hive2://hadoop-cluster-2:10000> 



``` 
