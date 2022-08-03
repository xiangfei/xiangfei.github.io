## 单节点安装


```bash
yum -y install epel-release
yum  install nginx
systemctl enable nginx
systemctl start nginx

```

## 可视化集成 + 动态配置


### confd + etcdkeeper + 自己写脚本

- confd gitlab已经不维护
  - 宕机对业务没影响
- ii-http.conf.tmpl
- 语法参考consul

```bash

[root@nginx-internal confd]# cat /etc/confd/templates/ii-http.conf.tmpl 
{{range gets "/nginx/internal/http/*"}}

  {{ $key := replace  .Key  "/nginx/internal/http/" "" -1  }}
  upstream {{ $key  }} {

    {{ $ip_list := split .Value  ","  }}
    {{ range $ip_list }}
       server {{.}};
    {{ end }}
  }

  server {
      server_name  {{  $key }}.ii-ai.tech;
      location / {
        proxy_pass        http://{{ $key }};
        proxy_redirect    off;
        proxy_set_header  Host             $host;
        proxy_set_header  X-Real-IP        $remote_addr;
        proxy_set_header  X-Forwarded-For  $proxy_add_x_forwarded_for;
     }
  }



{{end}}

```
- ii-http.toml 


```bash
[root@nginx-internal confd]# cat /etc/confd/conf.d/ii-http.toml 
[template]
src = "ii-http.conf.tmpl"
dest = "/usr/local/nginx/conf/conf.d/ii-http.conf"
keys = [
  "/nginx/internal/http/",
]


reload_cmd = "systemctl restart nginx"

```
- 启动confd

```bash
[root@nginx-internal confd]# cat /usr/lib/systemd/system/confd.service
[Unit]
Description=confd
After=network.target

[Service]
Type=simple
#ExecStart=/usr/local/bin/confd -interval=10 -backend etcdv3 -node https://192.168.1.31:2379 -client-cert=/etc/kubernetes/pki/etcd/peer.crt -client-key=/etc/kubernetes/pki/etcd/peer.key -client-ca-keys=/etc/kubernetes/pki/etcd/ca.crt
ExecStart=/usr/local/bin/confd -interval=10 -backend etcdv3 -node http://10.4.2.101:2379
Restart=on-failure
User=root
Group=root

[Install]
WantedBy=multi-user.target

```

### consul template 


-  注册consul 服务


```bash
curl -X PUT http://127.0.0.1:8500/v1/catalog/register -d '{"Datacenter": "dc1","Node": "tomcat1","Address": "127.0.0.1","Service": { "Id": "127.0.0.1:8090", "Service": "api_tomcat1","tags": [ "dev" ],"Port": 8090}}'


```


- 准备启动文件 start_nginx.sh


```bash

#!/bin/sh
ps -ef |grep nginx |grep -v grep |grep -v .sh
if [ $? -ne 0 ]; then
 nginx;
 echo "nginx start"
else
 nginx -s reload;
 echo "nginx reload"
fi

```

- 编写模板文件nginx.conf.ctmpl




```golang
{{range services}} {{$name := .Name}} {{$service := service .Name}}
upstream {{$name}} {
  zone upstream-{{$name}} 64k;
  {{range $service}}server {{.Address}}:{{.Port}} max_fails=3 fail_timeout=60 weight=1;
  {{else}}server 127.0.0.1:65535 down; # force a 502{{end}}
} {{end}}

server {
  listen 80 default_server;

{{range services}} {{$name := .Name}}
  location /{{$name}} {
    proxy_pass http://{{$name}};
  }
{{end}}

}

```

- 创建nginx.hcl


```bash

consul {
  address = "127.0.0.1:8500"
}

template {
  source = "nginx.conf.ctmpl"
  destination = "/etc/nginx/conf.d/test-consul-template.conf"
  command = "./start_nginx.sh"
}

```



- 启动consul-template



```bash
consul-template -config "nginx.hcl"


```

