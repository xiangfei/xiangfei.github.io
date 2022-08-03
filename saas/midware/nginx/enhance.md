

## 访问限速

### `ngx_http_limit_conn_module` 和 `ngx_http_limit_req_module` 模块来实现限速的功能。


```bash

{
    ...
    # 根据客户端ip进行限制，区域名称为perip，总容量为10m
    limit_conn_zone $binary_remote_addr zone=perip:10m;
    limit_conn_zone $server_name zone=perserver:10m;
    ...
    server
    {
        ...
        limit_rate_after 512k;
        limit_rate 150k;
        ...  
    }
}

```

### ngx_http_limit_req_module


```bash
limit_req_zone $binary_remote_addr zone=one:10m rate=1r/s;

...
server {
    location /search/ {
        limit_req zone=one burst=5;
    }
}
...
```

## pv uc 计算

- 日志demo
  - 如果需要按照时间段统计，需要加入计算策略


```bash
192.168.40.2 - [02/nov/2016:15:44:35 +0800]  "get /wcm/app/main/refresh.jsp?r=1478072325778 http/1.1"  - 200 "user_cookie:7f00000122a5597c46607b1c0a7ec016"
192.168.40.2 - [02/nov/2016:15:44:35 +0800]  "get /webpic/w0201611/w020161102/w020161102566715167404.jpg http/1.1"  - 200 "user_cookie:7f00000122a5597c46607b1c0a7ec016"
119.255.31.109 - [02/nov/2016:15:44:36 +0800]  "get /wcm/app/main/refresh.jsp?r=1478072510132 http/1.1"  - 200 "user_cookie:7f000001237921be9237838aec65704d"
119.255.31.109 - [02/nov/2016:15:44:36 +0800]  "get /wcm/app/message/message_query_service.jsp?readflag=0&msgtypes=1%2c2%2c3 http/1.1"  - 200 "user_cookie:7f000001237921be9237838aec65704d"
192.168.40.2 - [02/nov/2016:15:44:37 +0800]  "get /wcm/app/message/message_query_service.jsp?readflag=0&msgtypes=1%2c2%2c3 http/1.1"  - 200 "user_cookie:7f00000123d3bf2345115eaac21f71e0"
192.168.40.2 - [02/nov/2016:15:44:37 +0800]  "get /wcm/app/message/message_query_service.jsp?readflag=0&msgtypes=1%2c2%2c3 http/1.1"  - 200 "user_cookie:7f00000123ef73896df98eda9950944e"
192.168.40.2 - [02/nov/2016:15:44:37 +0800]  "get /wcm/app/message/message_query_service.jsp?readflag=0&msgtypes=1%2c2%2c3 http/1.1"  - 200 "user_cookie:7f00000123fe0f9c397e1a8f0c4f044b"
192.168.40.2 - [02/nov/2016:15:44:37 +0800]  "get /wcm/app/main/refresh.jsp?r=1478072511427 http/1.1"  - 200 "user_cookie:7f00000123a465b7ea1de0af0ae671b7"
119.255.31.109 - [02/nov/2016:15:44:38 +0800]  "get /wcm/app/message/message_query_service.jsp?readflag=0&msgtypes=1%2c2%2c3 http/1.1"  - 200 "user_cookie:7f00000123d89b11302df80ae773c900" 

```


- pv统计
  - 可统计单个链接地址访问量：

```bash
[root@localhost logs]# grep index.shtml host.access.log | wc -l
```
- 总pv量：

```bash
[root@localhost logs]# awk '{print $6}' host.access.log | wc -l

```
- 独立ip

```bash
[root@localhost logs]# awk '{print $1}' host.access.log | sort -r |uniq -c | wc -l

```
- uv统计

```bash
[root@localhost logs]# awk '{print $10}' host.access.log | sort -r |uniq -c |wc -l

```

## 服务发现

- consul 集成