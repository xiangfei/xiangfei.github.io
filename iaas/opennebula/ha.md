
## 准备
1. 前台需要至少三台机器
192.168.150.1 leader
192.168.150.2 follower
192.168.150.3 follower
2. Sunstone (with or without Apache/Passenger) running on all the nodes
3. 后台共享存储 Shared datastores must be mounted on all the nodes
4. 数据库高可用 ,mysql galera

## 配置
1. 192.168.150.1 add zone  

```bash
onezone server-add 0 --name server-0 --rpc http://192.168.150.1:2633/RPC2

```

2. 192.168.150.1 修改zone

```bash
FEDERATION = [
	MODE          = "STANDALONE",
	ZONE_ID       = 0,
	SERVER_ID     = 0, # changed from -1 to 0 (as 0 is the server id)
	MASTER_ONED   = ""
]
```

3. 192.168.150.2 / 192.168.150.3 修改 zone

```bash
FEDERATION = [
	    MODE          = "STANDALONE",
	    ZONE_ID       = 0,
	    SERVER_ID     = 1, # changed from -1 to 0 (as 0 is the server id)
	    MASTER_ONED   = ""
]
```

4. 192.168.150.1 add zone  

```	bash
onezone server-add 0 --name server-1 --rpc http://192.168.150.2:2633/RPC2
onezone server-add 0 --name server-2 --rpc http://192.168.150.3:2633/RPC2
```

5. 数据库高可用

```bash
mysql galera
```
6. 使用vip (optional)

```bash
# Executed when a server transits from follower->leader
RAFT_LEADER_HOOK = [
     COMMAND = "raft/vip.sh",
     ARGUMENTS = "leader eth0 10.3.3.2/24"
]
# Executed when a server transits from leader->follower
RAFT_FOLLOWER_HOOK = [
    COMMAND = "raft/vip.sh",
    ARGUMENTS = "follower eth0 10.3.3.2/24"
]
#也可用pacemaker + corosync 实现(4.x的方式)

```

> [!WARNING]
``` bash
onezone server-del  0 server-1
```
