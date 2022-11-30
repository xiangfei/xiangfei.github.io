### mysql8 优化

- 服务器大量的写等待



```bash
Device:         rrqm/s   wrqm/s     r/s     w/s    rkB/s    wkB/s avgrq-sz avgqu-sz   await r_await w_await  svctm  %util
vda               0.00     0.00    0.00   69.00     0.00   390.00    11.30     2.23   18.77    0.00   18.77  13.93  96.10
scd0              0.00     0.00    0.00    0.00     0.00     0.00     0.00     0.00    0.00    0.00    0.00   0.00   0.00

vi /etc/my.cnf

...
# 1 代表每一次事务提交或事务外的指令都需要把日志写入（flush）硬盘
# 2 不写入硬盘而是写入系统缓存。日志仍然会每秒flush到硬盘
# 0 会快一点，但安全方面比较差，即使MySQL挂了也可能会丢失事务的数据
innodb_flush_log_at_trx_commit            = 2
# 当每进行500次事务提交之后，MySQL将进行一次fsync之类的磁盘同步指令来将binlog_cache中的数据强制写入磁盘。
sync_binlog                            = 500 
...

```






