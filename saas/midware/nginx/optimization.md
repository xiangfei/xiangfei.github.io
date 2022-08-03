
## 内核参数优化

内核参数的优化，主要是在Linux系统中针对Nginx应用而进行的系统内核参数优化。

下面给出一个优化实例以供参考。

```bash


net.ipv4.tcp_max_tw_buckets = 6000 
net.ipv4.ip_local_port_range = 1024 65000  
net.ipv4.tcp_tw_recycle = 1 
net.ipv4.tcp_tw_reuse = 1 
net.ipv4.tcp_syncookies = 1 
net.core.somaxconn = 262144 
net.core.netdev_max_backlog = 262144 
net.ipv4.tcp_max_orphans = 262144 
net.ipv4.tcp_max_syn_backlog = 262144 
net.ipv4.tcp_synack_retries = 1 
net.ipv4.tcp_syn_retries = 1 
net.ipv4.tcp_fin_timeout = 1 
net.ipv4.tcp_keepalive_time = 30 

```

将上面的内核参数值加入/etc/sysctl.conf文件中，然后执行如下命令使之生效：


```bash


[root@ localhost home]#/sbin/sysctl -p 

下面对实例中选项的含义进行介绍：

net.ipv4.tcp_max_tw_buckets选项用来设定timewait的数量，默认是180 000，这里设为6000。

net.ipv4.ip_local_port_range选项用来设定允许系统打开的端口范围。

net.ipv4.tcp_tw_recycle选项用于设置启用timewait快速回收。

net.ipv4.tcp_tw_reuse选项用于设置开启重用，允许将TIME-WAIT sockets重新用于新的TCP连接。

net.ipv4.tcp_syncookies选项用于设置开启SYN Cookies，当出现SYN等待队列溢出时，启用cookies进行处理。

net.core.somaxconn选项的默认值是128， 这个参数用于调节系统同时发起的tcp连接数，在高并发的请求中，默认的值可能会导致链接超时或者重传，因此，需要结合并发请求数来调节此值。

net.core.netdev_max_backlog选项表示当每个网络接口接收数据包的速率比内核处理这些包的速率快时，允许发送到队列的数据包的最大数目。

net.ipv4.tcp_max_orphans选项用于设定系统中最多有多少个TCP套接字不被关联到任何一个用户文件句柄上。如果超过这个数 字，孤立连接将立即被复位并打印出警告信息。这个限制只是为了防止简单的DoS攻击。不能过分依靠这个限制甚至人为减小这个值，更多的情况下应该增加这个 值。

net.ipv4.tcp_max_syn_backlog选项用于记录那些尚未收到客户端确认信息的连接请求的最大值。对于有128MB内存的系统而言，此参数的默认值是1024，对小内存的系统则是128。

net.ipv4.tcp_synack_retries参数的值决定了内核放弃连接之前发送SYN+ACK包的数量。

net.ipv4.tcp_syn_retries选项表示在内核放弃建立连接之前发送SYN包的数量。

net.ipv4.tcp_fin_timeout选项决定了套接字保持在FIN-WAIT-2状态的时间。默认值是60秒。正确设置这个值非常重要，有时即使一个负载很小的Web服务器，也会出现大量的死套接字而产生内存溢出的风险。

net.ipv4.tcp_syn_retries选项表示在内核放弃建立连接之前发送SYN包的数量。

如果发送端要求关闭套接字，net.ipv4.tcp_fin_timeout选项决定了套接字保持在FIN-WAIT-2状态的时间。接收端可以出错并永远不关闭连接，甚至意外宕机。

net.ipv4.tcp_fin_timeout的默认值是60秒。需要注意的是，即使一个负载很小的Web服务器，也会出现因为大量的死套接字 而产生内存溢出的风险。FIN-WAIT-2的危险性比FIN-WAIT-1要小，因为它最多只能消耗1.5KB的内存，但是其生存期长些。

net.ipv4.tcp_keepalive_time选项表示当keepalive启用的时候，TCP发送keepalive消息的频度。默认值是2（单位是小时）。

```


## nginx.conf 优化

- nginx.conf

```bash

user  lsmpusr lsmpusr;

worker_processes  12;

error_log  logs/error.log  error;

worker_rlimit_nofile 65535;

events {

    worker_connections  102400;

}

 

http {

    include       mime.types;

    default_type  application/octet-stream;

    access_log  off;

    sendfile        on;

    #tcp_nopush     on;

    tcp_nodelay     on;

    keepalive_timeout  65;

    gzip               on;

    gzip_min_length    1k;

    gzip_buffers       16 64k;

    gzip_http_version  1.1;

    gzip_types         text/plain application/x-javascript text/css application/xml;

    gzip_comp_level    9;

    gzip_vary          on;

    client_header_buffer_size 4k;

    client_max_body_size 8m;

    open_file_cache max=102400 inactive=20s;

    fastcgi_connect_timeout 300;

    fastcgi_send_timeout 300;

    fastcgi_read_timeout 300;

    fastcgi_buffer_size 32k;

    fastcgi_buffers 8 32k;

 

    # HTTPS server

    server {

        listen       443;

        server_name  server1;

        location / {

            proxy_pass http://127.0.0.1:9080;

            proxy_set_header  X-Real-IP  $remote_addr;

        }

        ssl                  on;

        ssl_certificate      /usr/local/nginx/conf/cfcanewco.cer;

        ssl_certificate_key  /usr/local/nginx/conf/ca.key;

        ssl_session_timeout  5m;

        ssl_protocols  SSLv2 SSLv3 TLSv1;

        ssl_ciphers  HIGH:!aNULL:!MD5;

        ssl_prefer_server_ciphers   on;

        error_page   500 502 503 504  /50x.html;

        location = /50x.html {

            root   html;

        }

    }

}

```