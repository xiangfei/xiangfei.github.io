

## 一、etcd简介  
### etcd官网  

> https://coreos.com/etcd/  

### etcd官方文档  
> https://coreos.com/etcd/docs/latest/  

### etcd github  
> https://github.com/coreos/etcd  

### 下载地址(Latest release)  
> https://github.com/coreos/etcd/releases  

## 二、etcd安装配置（两节点）  
### 在NODE1（172.16.249.130）执行：
```bash
etcd --name 'etcd1' --initial-advertise-peer-urls=http://172.16.249.130:7001 --data-dir=/data/etcd/ --listen-peer-urls=http://0.0.0.0:7001 --listen-client-urls=http://0.0.0.0:4001 --advertise-client-urls=http://172.16.249.130:4001 --initial-cluster="etcd1=http://172.16.249.130:7001,etcd2=http://172.16.249.129:7001" --initial-cluster-state=new
```  

> [!INFO] IP地址、端口、文件路径可以根据具体情况自行配置。  

### 在NODE2（172.16.249.129）执行：
```bash 
etcd --name 'etcd2' --initial-advertise-peer-urls=http://172.16.249.129:7001 --data-dir=/data/etcd/ --listen-peer-urls=http://0.0.0.0:7001 --listen-client-urls=http://0.0.0.0:4001 --advertise-client-urls=http://172.16.249.129:4001 --initial-cluster="etcd1=http://172.16.249.130:7001,etcd2=http://172.16.249.129:7001" --initial-cluster-state=new
```  
> [!INFO] 其中IP地址、端口、文件路径可以根据具体情况自行配置。  

## 三、etcd常用命令  

### ETCD备份数据：  

```bash

etcdctl backup --data-dir /data/etcd/ --backup-dir /backup/etcd/

```
### ETCD基础命令：  
```bash
etcdctl member list   //列出群集成员
etcdctl member update a8266ecf031671f3 http://172.16.249.5:7001   //更新群集成员ID为a8266ecf031671f3的 peerURLs为http://172.16.249.5:7001
etcdctl member remove a8266ecf031671f3    //删除ID为a8266ecf031671f3的群集成员，如果删除的是 leader 节点，则需要耗费额外的时间重新选举 leader。
etcdctl member add etcd2 http://172.16.249.129:7001     //新加一个节点取名为 etcd2, peerURLs 是 http://172.16.249.129:7001 
etcdctl cluster-health  //检查群集的健康状态
etcd --data-dir=/data/etcd  --force-new-cluster   //直接用/data/etcd的数据启动一个单节点的ETCD服务， --force-new-cluster 会将节点信息和群集信息抹除，用以使用数据重建群集。
```

### ETCD场景演练：  

#### ETCD增加一个新的节点:  

```bash 
etcdctl member add etcd2 http://172.16.249.129:7001
```   

> [!INFO] etcdctl 在注册完新节点后，会返回一段提示，包含3个环境变量。然后在第二部启动新节点的时候，带上这3个环境变量即可。  

```bash
added member 9bf1b35fc7761a23 to cluster

ETCD_NAME="etcd2"
ETCD_INITIAL_CLUSTER="etcd1=http://172.16.249.5:7001,etcd2=http://172.16.249.129:7001"
ETCD_INITIAL_CLUSTER_STATE=existing
```
#### 启动第二个节点  

1、
```bash
/opt/k8s/etcd/etcd --name 'etcd2' --initial-advertise-peer-urls=http://172.16.249.129:7001 --data-dir=/data/etcd/ --listen-peer-urls=http://0.0.0.0:7001 --listen-client-urls=http://0.0.0.0:4001 --advertise-client-urls=http://172.16.249.129:4001 --initial-cluster="etcd1=http://172.16.249.5:7001,etcd2=http://172.16.249.129:7001"  --initial-cluster-state=existing
```   

2、将上述三个环境变量写入etcd.conf里面启动  


### ETCD服务故障恢复：  

首先，从剩余的正常节点中选择一个正常的成员节点， 使用 etcdctl backup 命令备份etcd数据。这个命令会将节点中的用户数据全部写入到指定的备份目录中，但是节点ID,集群ID等信息将会丢失， 并在恢复到目的节点时被重新。这样主要是防止原先的节点意外重新加入新的节点集群而导致数据混乱。  

然后将Etcd数据恢复到新的集群的任意一个节点上， 使用 --force-new-cluster 参数启动Etcd服务。这个参数会重置集群ID和集群的所有成员信息，（不增加--listen-client-urls参数的情况下其中节点的监听地址会被重置为localhost:2379）, 此时该集群中只有一个节点。  
用etcd命令找到当前节点的ID。
```bash
etcdctl member list 
98f0c6bf64240842: name=etcd2 peerURLs=http://172.16.249.129:7001 clientURLs=http://172.16.249.129:4001
```  

由于etcdctl不具备修改成员节点参数的功能， 下面的操作要使用API来完成。  

```bash
curl http://172.16.249.5:4001/v2/members/98f0c6bf64240842 -XPUT -H "Content-Type:application/json" -d '{"peerURLs":["http://172.16.249.5:7001"]}'
```  
)  

最后，在完成第一个成员节点的启动后，可以通过集群扩展的方法使用 etcdctl member add 命令添加其他成员节点进来。




