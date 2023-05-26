## glusterfs 集成


[参考](https://docs.opennebula.io/4.12/administration/storage/gluster_ds.html#configuration)

- change gluster volume uid gid

```bash
vi /etc/glusterfs/glusterd.vol
...
option rpc-auth-allow-insecure on
...

gluster volume set <volume> server.allow-insecure on

gluster  volume  set one storage.owner-uid 9869
gluster  volume  set one storage.owner-gid 9869
# gluster volume set <volume> storage.owner-uid=<oneadmin uid> 
# gluster volume set <volume> storage.owner-gid=<oneadmin gid>


# 最新的gluster 安装默认够virt group
vi /var/lib/glusterd/groups/virt   
quick-read=off
read-ahead=off
io-cache=off
stat-prefetch=on
eager-lock=enable
remote-dio=enable
quorum-type=auto
server.allow-insecure=on
server-quorum-type=server


gluster volume set  one  group virt

root@glusterfs-kvm-2:~# cat /var/lib/glusterd/groups/virt 
performance.quick-read=off
performance.read-ahead=off
performance.io-cache=off
performance.low-prio-threads=32
network.remote-dio=enable
cluster.eager-lock=enable
cluster.quorum-type=auto
cluster.server-quorum-type=server
cluster.data-self-heal-algorithm=full
cluster.locking-scheme=granular
cluster.shd-max-threads=8
cluster.shd-wait-qlength=10000
features.shard=on
user.cifs=off
cluster.choose-local=off
client.event-threads=4
server.event-threads=4
performance.client-io-threads=on

root@glusterfs-kvm-2:~# cat /var/lib/glusterd/groups/distributed-virt 
performance.quick-read=off
performance.read-ahead=off
performance.io-cache=off
performance.low-prio-threads=32
network.remote-dio=enable
features.shard=on
user.cifs=off
client.event-threads=4
server.event-threads=4
performance.client-io-threads=on
root@glusterfs-kvm-2:~# 
root@glusterfs-kvm-2:~# gluster volume set  one  group distributed-virt 
volume set: success



gluster volume set one  performance.cache-size 16GB
```

- change system datastore

```bash
mkdir -p /var/lib/one/datastores/0
mount -t glusterfs server:/volume /var/lib/one/datastores/0
chown oneadmin:oneadmin /var/lib/one/datastores/0
ln -s /var/lib/one/datastores/0 /var/lib/one/datastores/1

```

- create image datastore

```bash
NAME = "glusterds"
DS_MAD = fs
TM_MAD = shared

# the following line *must* be preset
DISK_TYPE = GLUSTER

GLUSTER_HOST = gluster_server:24007
GLUSTER_VOLUME = one_vol

CLONE_TARGET="SYSTEM"
LN_TARGET="NONE"

```


