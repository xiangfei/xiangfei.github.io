
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
ceph osd set noscrub

```