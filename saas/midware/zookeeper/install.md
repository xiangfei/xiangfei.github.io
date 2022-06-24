## 单节点安装

- ignore

## 集群安装


### 压缩包下载安装

- ignore

### 配置文件修改
- zoo.cfg

```bash

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
dataDir=/opt/zookeeper-3.4.10/data
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

server.3=192.168.1.113:20881:30881
server.2=192.168.1.112:20881:30881
server.1=192.168.1.111:20881:30881


authProvider.1=org.apache.zookeeper.server.auth.SASLAuthenticationProvider
authProvider.2=org.apache.zookeeper.server.auth.SASLAuthenticationProvider
authProvider.3=org.apache.zookeeper.server.auth.SASLAuthenticationProvider
requireClientAuthScheme=sasl

```


### no Auth

#### 启动

```bash

./zkServer.sh restart


```



### plain Auth


#### add path


```bash

create /rpa-kafka ""


```


#### 启动 


```bash

./zkServer.sh restart

```


###  sasl
- zookeeper_jaas.conf

```bash
Server {
  org.apache.zookeeper.server.auth.DigestLoginModule required
  username="kafka"
  password="kafka"
  user_kafka="kafka";
};


Client {
  org.apache.zookeeper.server.auth.DigestLoginModule required
  username="kafka"
  password="kafka"
  user_super="kafka"
  user_kafka="kafka";
};

```

#### 启动文件

-  zk_start_jaas.sh

```bash
cd `dirname $0`
export JVMFLAGS="-Djava.security.auth.login.config=/opt/zookeeper-3.4.10/conf/zookeeper_jaas.conf"
./zkServer.sh restart

```



#### add path


```bash

create /rpa-kafka ""


```


#### plain auth


```bash
add auth digest  kafka kafka_password
setAcl  /rpa-kafka  auth:kafka:cdrwa

```


####  sasl auth


```bash

create /rpa-kafka ""
setAcl  /rpa-kafka sasl:kafka:cdrwa
```




## 密码忘记

- 通过skipACL 的方式重置密码

### zoo.cfg

```
...
skipACL=yes
...
```

### update 
```bash

setAcl  /  world:anyone:cdrwa

```

