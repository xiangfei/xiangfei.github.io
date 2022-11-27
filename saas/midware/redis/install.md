## 单节点安装

- docker swarm

```yaml
version: '3.9'
services:
  redis5:
    image: redis:5.0
    command: redis-server --requirepass FjockDaLAq
    deploy:
      replicas: 1
      placement:
        constraints:
        - "node.labels.role_mid==mid"
    ports:
    - "6379:6379"
    volumes:
    - redis5:/data/
    networks:
    - midware_default
      
networks:
  midware_default:
    external: true

volumes:
  redis5:
```


## 主从模式

- 1 master 1 slave


```bash

```


## 哨兵模式(docker-compose 安装)

- 1 master 2 slave  3 sentinel

[参考](https://www.cnblogs.com/Alickx/p/16172264.html)


### structure 

```bash
.
|-- docker-compose.yml
|-- master
|   |-- conf
|   |   `-- redis.conf
|   `-- data
|       |-- dump.rdb
|       `-- nodes.conf
|-- sentinel1
|   |-- conf
|   |   `-- sentinel.conf
|   `-- data
|-- sentinel2
|   |-- conf
|   |   `-- sentinel.conf
|   `-- data
|-- sentinel3
|   |-- conf
|   |   `-- sentinel.conf
|   `-- data
|-- slave1
|   |-- conf
|   |   `-- redis.conf
|   `-- data
|       `-- dump.rdb
`-- slave2
    |-- conf
    |   `-- redis.conf
    `-- data
        `-- dump.rdb

```


### master config

- master/conf/redis.conf

```bash
#设置所有地址访问
bind 0.0.0.0 
#这个是默认开启的，也就是开启安全模式
protected-mode yes
#设置密码
requirepass 123456

```

### slave config

- slave1/conf/redis.conf
- slave1/conf/redis.conf


```bash
#这个配置是从机只能读，不能写
replica-read-only yes
#配置主机的ip和端口 在redis5.0以前则是salveof配置
replicaof 172.20.1.2 6379
#因为主节点设置了密码，必须设置这个，否则会连不上主节点
masterauth 123456

```

### sentiel config

- sentinel1/conf/sentinel.conf
- sentinel1/conf/sentinel.conf
- sentinel1/conf/sentinel.conf

```bash
#这个配置的作用就是设置监听的master节点的信息，mymaster可以换成符合规定的其他名字，后面的2是指当有两个sentinel认为#这个master失效了，才会认为失效，从而进行主从切换
sentinel monitor mymaster 172.20.1.2 6379 2
 
#配置主从的的密码，注意mymaster要对应刚才的配置项
sentinel auth-pass mymaster 123456 
 
#这个配置项指定了需要多少失效时间，一个master才会被这个sentinel主观地认为是不可用的。 单位是毫秒，默认为30秒
sentinel down-after-milliseconds mymaster 30000
 
#这个配置项指定了在发生failover主备切换时最多可以有多少个slave同时对新的master进行 同步，可以通过将这个值设为 1 来保证每次只有一个slave 处于不能处理命令请求的状态。值越大，slave复制的越快，但同时也对主节点的网络和硬盘负载造成压力
sentinel parallel-syncs mymaster 1
 
#定义故障切换超时时间。默认180000，单位秒，即3min。
sentinel failover-timeout mymaster 180000
 
#设置运行期是不能改变notification-script和 client-reconfig-script ，避免一些安全问题
sentinel deny-scripts-reconfig yes

```

### compose example 

```yaml
version: '3'
services:
  master:
    image: redis:latest
    container_name: redis_master  #master节点
    volumes:
      - ./master/conf/redis.conf:/etc/redis/redis.conf
      - ./master/data:/data
    networks:
      redis_network:
        ipv4_address: 172.20.1.2
    command: /bin/bash -c "redis-server /etc/redis/redis.conf"  #这句话就是要加载这个路径下的配置
    environment:
      - TZ=Asia/Shanghai
      - LANG=en_US.UTF-8
    ports:
      - "6379:6379"
 
  slave1:
    image: redis:latest
    container_name: redis_slave_1   #slave1节点
    volumes:
      - ./slave1/conf/redis.conf:/etc/redis/redis.conf
      - ./slave1/data:/data
    networks:
      redis_network:
        ipv4_address: 172.20.1.3
    command: /bin/bash -c "redis-server /etc/redis/redis.conf"
    environment:
      - TZ=Asia/Shanghai
      - LANG=en_US.UTF-8
    ports:
      - "6380:6379"
 
  slave2:
    image: redis:latest
    container_name: redis_slave_2   #slave2节点
    volumes:
      - ./slave2/conf/redis.conf:/etc/redis/redis.conf
      - ./slave2/data:/data
    networks:
      redis_network:
        ipv4_address: 172.20.1.4
    command: /bin/bash -c "redis-server /etc/redis/redis.conf"
    environment:
      - TZ=Asia/Shanghai
      - LANG=en_US.UTF-8
    ports:
      - "6381:6379"
  
  sentinel1:
    image: redis:latest
    container_name: redis_sentinel_1  #sentinel1节点
    ports:
      - "26379:26379"
    volumes:
      - ./sentinel1/conf/sentinel.conf:/usr/local/etc/redis/sentinel.conf
    networks:
      redis_network:
        ipv4_address: 172.20.1.5
    command: /bin/bash -c "redis-sentinel /usr/local/etc/redis/sentinel.conf"
 
  sentinel2:
    image: redis:latest
    container_name: redis_sentinel_2 #sentinel2节点
    ports:
      - "26380:26379"
    volumes:
      - ./sentinel2/conf/sentinel.conf:/usr/local/etc/redis/sentinel.conf
    networks:
      redis_network:
        ipv4_address: 172.20.1.6
    command: /bin/bash -c "redis-sentinel /usr/local/etc/redis/sentinel.conf"
 
  sentinel3:
    image: redis:latest
    container_name: redis_sentinel_3 #sentinel3节点
    ports:
      - "26381:26379"
    volumes:
      - ./sentinel3/conf/sentinel.conf:/usr/local/etc/redis/sentinel.conf
    networks:
      redis_network:
        ipv4_address: 172.20.1.7
    command: /bin/bash -c "redis-sentinel /usr/local/etc/redis/sentinel.conf"
 
networks:
  redis_network:
    driver: bridge
    ipam:
      config:
      - subnet: 172.20.1.0/24

```


## cluster 安装





