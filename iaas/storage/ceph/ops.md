
## cephadm 日常维护




###  在公司千兆代码导入rbd import 出现 多个osd down

- 修复

```bash

ceph osd  out  osd.1
ceph osd rm osd.1
ceph osd  crush rm osd.1
ceph  auth rm osd.1
ceph orch device zap ceph-kvm-10.ii-ai.tech /dev/sdc --force  #device文件系统需要重置

ceph orch daemon add osd ceph-kvm-10.ii-ai.tech:/dev/sdb

```

- 优化


```bash
ceph osd set noout
ceph osd set nodown
ceph osd set norebalance
ceph osd set norecover
ceph osd set nobackfill
ceph osd set noscrub

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


### ceph stuck requests blocked


```bash

ceph orch daemon   restart osd.7

```