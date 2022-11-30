## mysql8 日常运维


### 查找占用空间最大的表


```sql
SELECT CONCAT( table_schema, '.', table_name ) table_name, 
CONCAT( ROUND( data_length / ( 1024 *1024 ) , 2 ) , 'M' ) data_length, 
CONCAT( ROUND( index_length / ( 1024 *1024 ) , 2 ) , 'M' ) index_length, 
CONCAT( ROUND( ROUND( data_length + index_length ) / ( 1024 *1024 ) , 2 ) , 'M' ) total_size
FROM information_schema.TABLES
ORDER BY data_length DESC;

```




### 设置密码


```bash
cat /var/log/mysqld.log | grep -i password # 查找初始化密码

```


### binlog 清理


```bash
set global binlog_expire_logs_seconds=60*60*24;

flush logs;

```

### mysql binlog关闭


```bash
vi /etc/my.cnf

...
[mysqld]

skip-log-bin

...

```

### mysql 导入大文件


```bash

vi /etc/my.cnf


...
[mysqld]
max_allowed_packet =  128M
...

```


### 最大连接数


```bash
vi  /etc/my.cnf

...
max_connections                           = 2400
max_connect_errors                        = 2400
...

```

### 设置字符集

```bash
vi  /etc/my.cnf

...

character-set-server                      = utf8mb4
collation-server                          = utf8mb4_general_ci

...
```

### 修改lock时间




```bash

vi /etc/my.cnf

...

[mysqld]
lock_wait_timeout = 1800
...

```


### 调整inndb_buffer_size


```bash
vi  /etc/my.cnf

...

...

```


### 关闭bin_log


```bash
...
[mysqld]
#server-id                                 = 1
skip-log-bin
...

```

### undo log 太大



```bash

1.1G    ./undo_001
1.1G    ./undo_002

```


https://egonlin.com/?p=1739
https://www.zhihu.com/column/c_1405966484027494400