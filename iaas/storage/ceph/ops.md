
## cephadm 日常维护


### ceph 重装



```bash

cephadm rm-cluster --fs-id  xxx  --force

```



### ceph osd 下线


```bash
ceph osd  down # 下线不接受读写请求,osd 还是存活

```

### ceph  osd 提出集群


```bash
ceph osd out   

```

### mgr 备份

- 使用google leveldb，单节点直接备份目录

```bash

cp  /var/lib/ceph/5d9840b6-64c9-11ed-8010-782bcb3ebe1e/mon.ceph-kvm-8  /backup

```


###  在公司千兆代码导入rbd import 出现 多个osd down

- 修复

```bash

ceph osd  out  osd.1
ceph osd rm osd.1
ceph osd  crush rm osd.0
ceph  auth rm osd.0
ceph orch device zap ceph-kvm-10.ii-ai.tech /dev/sdc --force  #device文件系统需要重置

ceph orch daemon add osd ceph-kvm-10.ii-ai.tech:/dev/sdb

```

- 优化


```bash
ceph osd set noout
ceph osd set nodown
ceph osd set norebalance #osd map 变化
ceph osd set norecover  
ceph osd set nobackfill  #增加删除osd,会导致数据回填, 让数据得到平均，触发数据的迁移
#ceph osd set noscrub
ceph osd set nodeep-scrub


```


```language
osd recovery max active = 3 （default : 15)
osd recovery op priority = 3 (default : 10)
osd max backfills = 1 (default : 10)
```


### node 宕机处理

- 设置维护模式
```bash
ceph osd set noout
ceph osd set norecover
ceph osd set nobackfill
```
- node 恢复取消

```bash
ceph osd unset noout
ceph osd unset norecover
ceph osd unset nobackfill
```


### ceph osd full

- 调整权重

```bash
ceph osd.4 reweight 4 0.85  #手动调整osd权重

ceph osd reweight-by-utilization 110 0.3 10 #自动调整

ceph osd crush reweight osd.11 0.5   #调整WEIGHT


```


###  slow ops

- SLOW_OPS: 1084 slow ops, oldest one blocked for 3619 sec, daemons [osd.0,osd.1,osd.2,osd.3,osd.6,osd.7] have slow ops.

```bash

ceph orch restart mon

```



### OSD_SCRUB_ERRORS

- 
- PG_DAMAGED: Possible data damage: 1 pg inconsistent


```bash


[root@ceph-kvm-8 ~]# ceph health detail

[root@ceph-kvm-8 ~]# rados list-inconsistent-obj  2.1b --format=json-pretty
{
    "epoch": 253,
    "inconsistents": [
        {
            "object": {
                "name": "rbd_data.602c2a9954cb.000000000003f297",
                "nspace": "",
                "locator": "",
                "snap": "head",
                "version": 408567
            },
            "errors": [],
            "union_shard_errors": [
                "read_error"
            ],
            "selected_object_info": {
                "oid": {
                    "oid": "rbd_data.602c2a9954cb.000000000003f297",
                    "key": "",
                    "snapid": -2,
                    "hash": 673269819,
                    "max": 0,
                    "pool": 2,
                    "namespace": ""
                },
                "version": "288'408567",
                "prior_version": "0'0",
                "last_reqid": "client.24620.0:533721",
                "user_version": 408567,
                "size": 4194304,
                "mtime": "2022-11-18T00:33:53.006763+0800",
                "local_mtime": "2022-11-18T00:43:19.197643+0800",
                "lost": 0,
                "flags": [
                    "dirty",
                    "data_digest"
                ],
                "truncate_seq": 0,
                "truncate_size": 0,
                "data_digest": "0x284644c4",
                "omap_digest": "0xffffffff",
                "expected_object_size": 4194304,
                "expected_write_size": 4194304,
                "alloc_hint_flags": 0,
                "manifest": {
                    "type": 0
                },
                "watchers": {}
            },
            "shards": [
                {
                    "osd": 3,
                    "primary": true,
                    "errors": [],
                    "size": 4194304,
                    "omap_digest": "0xffffffff",
                    "data_digest": "0x284644c4"
                },
                {
                    "osd": 6,
                    "primary": false,
                    "errors": [],
                    "size": 4194304,
                    "omap_digest": "0xffffffff",
                    "data_digest": "0x284644c4"
                },
                {
                    "osd": 7,
                    "primary": false,
                    "errors": [
                        "read_error"
                    ],
                    "size": 4194304
                }
            ]
        },


[root@ceph-kvm-8 ~]# ceph pg repair   2.1b

```

> [!WARNING]
> - osd 7 read error



### OSD_TOO_MANY_REPAIRS


```bash

[WRN] OSD_TOO_MANY_REPAIRS: Too many repaired reads on 3 OSDs
    osd.3 had 55 reads repaired
    osd.7 had 40 reads repaired
    osd.6 had 51 reads repaired

ceph tell osd.7 clear_shards_repaired  # not work 

ceph orch restart  osd.7


```


###  ceph osd启动bluefs mount 失败


```bash
debug 2022-11-18T08:34:36.748+0000 7f4a91d40f00  1 bluefs add_block_device bdev 1 path /var/lib/ceph/osd/ceph-0/block size 5.5 TiB
debug 2022-11-18T08:34:36.748+0000 7f4a91d40f00  1 bluefs mount
debug 2022-11-18T08:34:36.748+0000 7f4a91d40f00  1 bluefs _init_alloc id 1 alloc_size 0x10000 size 0x5751fc00000
debug 2022-11-18T08:34:36.819+0000 7f4a91d40f00 -1 bluefs _check_new_allocations invalid extent 1: 0x29e9edc0000~10000: duplicate reference, ino 16
debug 2022-11-18T08:34:36.819+0000 7f4a91d40f00 -1 bluefs mount failed to replay log: (14) Bad address
debug 2022-11-18T08:34:36.819+0000 7f4a91d40f00 -1 bluestore(/var/lib/ceph/osd/ceph-0) _open_bluefs failed bluefs mount: (14) Bad address
debug 2022-11-18T08:34:36.819+0000 7f4a91d40f00  1 bdev(0x563547668000 /var/lib/ceph/osd/ceph-0/block) close
debug 2022-11-18T08:34:37.011+0000 7f4a91d40f00 -1 osd.0 0 OSD:init: unable to mount object store
debug 2022-11-18T08:34:37.011+0000 7f4a91d40f00 -1  ** ERROR: osd init failed: (14) Bad address

```



###  high pg count deviation



```bash

ceph balancer mode crush-compat
ceph  balancer on
ceph  balancer status
ceph balancer off

```



###  active+clean+laggy

- 在osd nodown noout norebalance 出现

```bash

ceph orch ls  # 查看osd 发现osd 启动有error


debug 2022-11-19T09:57:49.542+0000 7fe0fa0d7f00  4 rocksdb: [db/version_set.cc:3757] Recovered from manifest file:db/MANIFEST-000011 succeeded,manifest_file_number is 11, next_file_number is 19, last_sequence is 232780, log_number is 15,prev_log_number is 0,max_column_family is 0,min_log_number_to_keep is 0

debug 2022-11-19T09:57:49.542+0000 7fe0fa0d7f00  4 rocksdb: [db/version_set.cc:3766] Column family [default] (ID 0), log number is 15

debug 2022-11-19T09:57:49.542+0000 7fe0fa0d7f00  4 rocksdb: EVENT_LOG_v1 {"time_micros": 1668851869543867, "job": 1, "event": "recovery_started", "log_files": [12, 15]}
debug 2022-11-19T09:57:49.542+0000 7fe0fa0d7f00  4 rocksdb: [db/db_impl_open.cc:583] Recovering log #12 mode 0
debug 2022-11-19T09:57:49.543+0000 7fe0fa0d7f00  4 rocksdb: [db/db_impl_open.cc:583] Recovering log #15 mode 0
debug 2022-11-19T09:57:49.548+0000 7fe0fa0d7f00  3 rocksdb: [db/db_impl_open.cc:518] db.wal/000015.log: dropping 3655 bytes; Corruption: missing start of fragmented record(2)
debug 2022-11-19T09:57:49.548+0000 7fe0fa0d7f00  4 rocksdb: [db/db_impl.cc:390] Shutdown: canceling all background work
debug 2022-11-19T09:57:49.548+0000 7fe0fa0d7f00  4 rocksdb: [db/db_impl.cc:563] Shutdown complete
debug 2022-11-19T09:57:49.548+0000 7fe0fa0d7f00 -1 rocksdb: Corruption: missing start of fragmented record(2)
debug 2022-11-19T09:57:49.548+0000 7fe0fa0d7f00 -1 bluestore(/var/lib/ceph/osd/ceph-1) _open_db erroring opening db: 
debug 2022-11-19T09:57:49.548+0000 7fe0fa0d7f00  1 bluefs umount
debug 2022-11-19T09:57:49.548+0000 7fe0fa0d7f00  1 bdev(0x55f243a58380 /var/lib/ceph/osd/ceph-1/block) close
debug 2022-11-19T09:57:49.735+0000 7fe0fa0d7f00  1 bdev(0x55f243a58000 /var/lib/ceph/osd/ceph-1/block) close
debug 2022-11-19T09:57:49.982+0000 7fe0fa0d7f00 -1 osd.1 0 OSD:init: unable to mount object store
debug 2022-11-19T09:57:49.982+0000 7fe0fa0d7f00 -1  ** ERROR: osd init failed: (5) Input/output error


```


> ![WARNING]
> - ceph rockdb错误
> - 机器重启，都出现错误,raid卡不支持,在raid卡设置writeback, 进入bios 发现writethrough,改成writethrough,重启正常

### ceph osd down (replace guid)


```bash

 while ! ceph osd safe-to-destroy osd.1 ; do sleep 10 ; done

```



### ceph 备份/恢复

- rbd

```bash

rbd export      xxx

rbd export-diff  xxx 

rbd import

rbd import-diff 

```



### ceph 时间延时


```bash

yum -y install chrony

```



### ceph pg 指定osd

[参考](https://blog.csdn.net/a13568hki/article/details/113787518)

```bash
#ceph osd pg-upmap pgid osdid osdid osdid
#表明pg 1.1需从osd.5重新映射到osd.8

ceph osd pg-upmap-items 1.1 5 8

#表明pg 1.2的osd集合中osd.0重映射到osd.8 ,osd.5重映射到osd.11
ceph osd pg-upmap-items 1.2 0 8 5 11

```


### ceph 恢复
- 备用盘方式


[参考](https://zhuanlan.zhihu.com/p/160893485)

```bash
ceph osd crush add-bucket standby root
ceph osd crush move osd.* root=standby #移动备用盘
ceph osd pg-upmap pgid osdid osdid osdid  #osd 坏掉
ceph osd rm-pg-upmap pgid



```

> [!WARNING]
> - osd_force_pgupmap,该选项默认为fasle。只有当该选项为true时，上述PG映射才能成功。







