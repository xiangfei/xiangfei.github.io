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

### binlog关闭


```bash
vi /etc/my.cnf

...
[mysqld]

skip-log-bin

...

```

### 导入大文件


```bash

vi /etc/my.cnf
...
[mysqld]
max_allowed_packet =  128M
...

```


### 快速dump


```bash
vi /etc/my.cnf
...
[mysqldump]
quick
...
```


### 调整最大连接数


```bash

vi /etc/my.cnf

...
[mysqld]
max_connections                           = 2400
max_connect_errors                        = 2400
...

```

### 设置默认字符集


```bash

vi /etc/my.cnf

...
[mysqld]
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