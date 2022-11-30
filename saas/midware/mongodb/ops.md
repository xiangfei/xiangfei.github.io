### 启动失败

- ERROR: CHILD PROCESS FAILED, EXITED WITH ERROR NUMBER 14 TO SEE ADDITIONAL INFORMATION IN THIS

```bash

mongod -f /etc/mongod --repair
cd  /var/lib/mongo
chown -R mongod:mongod .

```

[参考](https://blog.csdn.net/ya0ng/article/details/119799982)

> [!WARNING]
> - 如果不是在写磁盘的时候宕掉，可以通过repair命令进行修复，会丢失最后一次写磁盘的时刻到宕掉时刻期间的数据
如果赶上写磁盘的时候进程宕掉，repair也不能恢复数据，很可能会丢失掉全部数据