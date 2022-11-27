## k8s install



```yaml


```


##  docker compose (单节点伪集群)

- broker 2m 2s 
- nameserver 2


> [!WARNING]
> - 启动先nameserver, 然后broker, 客户端连接nameserver

### 项目结构

```
docker-compose.yaml
config
  broker-a
  broker-a-s
  broker-b
  broker-b-s
store
  ..
logs
  ..

```


###  配置文件  broker-a.conf


```bash
#所属集群名字，同一个集群名字相同
brokerClusterName=rocketmq-cluster
#broker名字
brokerName=broker-a
#0表示master >0 表示slave
brokerId=0
#删除文件的时间点，凌晨4点
deleteWhen=04
#文件保留时间 默认是48小时
fileReservedTime=168
#异步复制Master
brokerRole=ASYNC_MASTER
#刷盘方式，ASYNC_FLUSH=异步刷盘，SYNC_FLUSH=同步刷盘 
flushDiskType=ASYNC_FLUSH
#Broker 对外服务的监听端口
listenPort=10911
# slave master同步
fastListenPort=10909
# ha service 服务
haListenPort=10912 
#nameServer地址，这里nameserver是单台，如果nameserver是多台集群的话，就用分号分割（即namesrvAddr=ip1:port1;ip2:port2;ip3:port3）
namesrvAddr=192.168.0.3:9878;192.168.0.3:9877
#每个topic对应队列的数量，默认为4，实际应参考consumer实例的数量，值过小不利于consumer负载均衡
defaultTopicQueueNums=8
#是否允许 Broker 自动创建Topic，生产建议关闭
autoCreateTopicEnable=true
#是否允许 Broker 自动创建订阅组，生产建议关闭
autoCreateSubscriptionGroup=true
#设置BrokerIP
brokerIP1=192.168.0.3

```

### 配置文件  broker-a-s.conf



```bash
#所属集群名字
brokerClusterName=rocketmq-cluster
#broker名字，注意此处不同的配置文件填写的不一样  例如：在a.properties 文件中写 broker-a  在b.properties 文件中写 broker-b
brokerName=broker-a
#0 表示 Master，>0 表示 Slave
brokerId=1
#删除文件时间点，默认凌晨 4点
deleteWhen=04
#文件保留时间，默认 48 小时
fileReservedTime=168
#Broker 的角色，ASYNC_MASTER=异步复制Master，SYNC_MASTER=同步双写Master，SLAVE=slave节点
brokerRole=SLAVE
#刷盘方式，ASYNC_FLUSH=异步刷盘，SYNC_FLUSH=同步刷盘 
flushDiskType=SYNC_FLUSH
#Broker 对外服务的监听端口
listenPort=12911
# slave master同步
fastListenPort=12909
# ha service 服务
haListenPort=12912 
#nameServer地址，这里nameserver是单台，如果nameserver是多台集群的话，就用分号分割（即namesrvAddr=ip1:port1;ip2:port2;ip3:port3）
namesrvAddr=192.168.0.3:9877;192.168.0.3:9878
#每个topic对应队列的数量，默认为4，实际应参考consumer实例的数量，值过小不利于consumer负载均衡
defaultTopicQueueNums=8
#是否允许 Broker 自动创建Topic，生产建议关闭
autoCreateTopicEnable=true
#是否允许 Broker 自动创建订阅组，生产建议关闭
autoCreateSubscriptionGroup=true
#设置BrokerIP
brokerIP1=192.168.0.3

```

### 配置文件 broker-b.conf


```bash
#所属集群名字
brokerClusterName=rocketmq-cluster
#broker名字，注意此处不同的配置文件填写的不一样  例如：在a.properties 文件中写 broker-a  在b.properties 文件中写 broker-b
brokerName=broker-b
#0 表示 Master，>0 表示 Slave
brokerId=0
#删除文件时间点，默认凌晨 4点
deleteWhen=04
#文件保留时间，默认 48 小时
fileReservedTime=168
#Broker 的角色，ASYNC_MASTER=异步复制Master，SYNC_MASTER=同步双写Master，SLAVE=slave节点
brokerRole=ASYNC_MASTER
#刷盘方式，ASYNC_FLUSH=异步刷盘，SYNC_FLUSH=同步刷盘 
flushDiskType=SYNC_FLUSH
#Broker 对外服务的监听端口
listenPort=11911
# slave master同步
fastListenPort=11909
# ha service 服务
haListenPort=11912 
#nameServer地址，这里nameserver是单台，如果nameserver是多台集群的话，就用分号分割（即namesrvAddr=ip1:port1;ip2:port2;ip3:port3）
namesrvAddr=192.168.0.3:9878;192.168.0.3:9877
#每个topic对应队列的数量，默认为4，实际应参考consumer实例的数量，值过小不利于consumer负载均衡
defaultTopicQueueNums=8
#是否允许 Broker 自动创建Topic，生产建议关闭
autoCreateTopicEnable=true
#是否允许 Broker 自动创建订阅组，生产建议关闭
autoCreateSubscriptionGroup=true
#设置BrokerIP
brokerIP1=192.168.0.3
```


### 配置文件 broker-b-s.conf



```bash
#所属集群名字
brokerClusterName=rocketmq-cluster
brokerName=broker-b
#slave
brokerId=1
deleteWhen=04
fileReservedTime=168
brokerRole=SLAVE
flushDiskType=ASYNC_FLUSH
#Broker 对外服务的监听端口
listenPort=13911
# slave master同步
fastListenPort=13909
# ha service 服务
haListenPort=13912 
#nameServer地址，这里nameserver是单台，如果nameserver是多台集群的话，就用分号分割（即namesrvAddr=ip1:port1;ip2:port2;ip3:port3）
namesrvAddr=192.168.0.3:9877;192.168.0.3:9878
#每个topic对应队列的数量，默认为4，实际应参考consumer实例的数量，值过小不利于consumer负载均衡
defaultTopicQueueNums=8
#是否允许 Broker 自动创建Topic，生产建议关闭
autoCreateTopicEnable=true
#是否允许 Broker 自动创建订阅组，生产建议关闭
autoCreateSubscriptionGroup=true
#设置BrokerIP
brokerIP1=192.168.0.3

```

### docker-compose.yaml


```yaml
version: '3.9'
services:
  rmqnamesrv-01:
    deploy:
      replicas: 1
      placement:
        constraints:
        - "node.labels.role_mid==mid"
    image: registry.ii-ai.tech/rocketmq/rocketmq-arm:4.8.0
    ports:
      - 9877:9876
    volumes:
      - ./logs/nameserver01:/opt/logs
      - ./store/nameserver01:/opt/store
    environment:
        TZ: "Asia/Shanghai"
    command: sh mqnamesrv
    networks:
      - midware_default

  rmqnamesrv-02:
    deploy:
      replicas: 1
      placement:
        constraints:
        - "node.labels.role_mid==mid"
    image: registry.ii-ai.tech/rocketmq/rocketmq-arm:4.8.0
    ports:
      - 9878:9876
    volumes:
      - ./logs/nameserver02:/opt/logs
      - ./store/nameserver02:/opt/store
    environment:
        TZ: "Asia/Shanghai"
    command: sh mqnamesrv
    networks:
      - midware_default



  rmqbroker-a-master:
    deploy:
      replicas: 1
      placement:
        constraints:
        - "node.labels.role_mid==mid"
    image: registry.ii-ai.tech/rocketmq/rocketmq-arm:4.8.0
    ports:
      - 10909:10909
      - 10911:10911
      - 10912:10912
    volumes:
      - ./logs/broker-a-master:/opt/logs
      - ./store/broker-a-master:/opt/store
      - ./config/broker-a.conf:/home/rocketmq/rocketmq-4.8.0/conf/broker.conf
    environment:
        #NAMESRV_ADDR: "rmqnamesrv-01:9876;rmqnamesrv-02:9876"
        JAVA_OPTS: " -Duser.home=/opt"
        JAVA_OPT_EXT: "-server -Xms256m -Xmx256m -Xmn256m"
        TZ: "Asia/Shanghai"
    command: mqbroker -c /home/rocketmq/rocketmq-4.8.0/conf/broker.conf
    depends_on:
      - rmqnamesrv
    networks:
      - midware_default


  rmqbroker-a-slave:
    deploy:
      replicas: 1
      placement:
        constraints:
        - "node.labels.role_mid==mid"
    image: registry.ii-ai.tech/rocketmq/rocketmq-arm:4.8.0
    ports:
      - 12909:12909
      - 12911:12911
      - 12912:12912
    volumes:
      - ./logs/broker-a-slave:/opt/logs
      - ./store/broker-a-slave:/opt/store
      - ./config/broker-a-s.conf:/home/rocketmq/rocketmq-4.8.0/conf/broker.conf
    environment:
        #NAMESRV_ADDR: "rmqnamesrv-01:9876;rmqnamesrv-02:9876"
        JAVA_OPTS: " -Duser.home=/opt"
        JAVA_OPT_EXT: "-server -Xms256m -Xmx256m -Xmn256m"
        TZ: "Asia/Shanghai"
    command: mqbroker -c /home/rocketmq/rocketmq-4.8.0/conf/broker.conf
    depends_on:
      - rmqnamesrv
    networks:
      - midware_default

  rmqbroker-b-master:
    deploy:
      replicas: 1
      placement:
        constraints:
        - "node.labels.role_mid==mid"
    image: registry.ii-ai.tech/rocketmq/rocketmq-arm:4.8.0
    ports:
      - 11909:11909
      - 11911:11911
      - 11912:11912
    volumes:
      - ./logs/broker-b-master:/opt/logs
      - ./store/broker-b-master:/opt/store
      - ./config/broker-b.conf:/home/rocketmq/rocketmq-4.8.0/conf/broker.conf
    environment:
        #NAMESRV_ADDR: "rmqnamesrv-01:9876;rmqnamesrv-02:9876"
        JAVA_OPTS: " -Duser.home=/opt"
        JAVA_OPT_EXT: "-server -Xms256m -Xmx256m -Xmn256m"
        TZ: "Asia/Shanghai"
    command: mqbroker -c /home/rocketmq/rocketmq-4.8.0/conf/broker.conf
    depends_on:
      - rmqnamesrv
    networks:
      - midware_default


  rmqbroker-b-slave:
    deploy:
      replicas: 1
      placement:
        constraints:
        - "node.labels.role_mid==mid"
    image: registry.ii-ai.tech/rocketmq/rocketmq-arm:4.8.0
    ports:
      - 13909:13909
      - 13911:13911
      - 13912:13912
    volumes:
      - ./logs/broker-b-slave:/opt/logs
      - ./store/broker-b-slave:/opt/store
      - ./config/broker-b-s.conf:/home/rocketmq/rocketmq-4.8.0/conf/broker.conf
    environment:
        #NAMESRV_ADDR: "rmqnamesrv-01:9876;rmqnamesrv-02:9876"
        JAVA_OPTS: " -Duser.home=/opt"
        JAVA_OPT_EXT: "-server -Xms256m -Xmx256m -Xmn256m"
        TZ: "Asia/Shanghai"
    command: mqbroker -c /home/rocketmq/rocketmq-4.8.0/conf/broker.conf
    depends_on:
      - rmqnamesrv
    networks:
      - midware_default


  rmqconsole:
    deploy:
      replicas: 1
      placement:
        constraints:
        - "node.labels.role_mid==mid"
    image: registry.ii-ai.tech/rocketmq/rocketmq-console-ng-arm:2.2.0
    ports:
      - 18080:8080
    environment:
        JAVA_OPTS: "-Drocketmq.config.namesrvAddr=192.168.0.3:9878;192.168.0.3:9877 -Drocketmq.config.isVIPChannel=false"
        TZ: "Asia/Shanghai"
    depends_on:
      - rmqnamesrv
    networks:
      - midware_default


networks:
  midware_default:
    external: true

```