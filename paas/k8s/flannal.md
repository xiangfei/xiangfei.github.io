


## 一、flannel简介

### flannel官网  
> https://coreos.com/flannel/  

### flannel官方文档  
> https://coreos.com/flannel/docs/latest/  

### flannel github  
> https://github.com/coreos/flannel    

### flannel下载(Latest release）
> https://github.com/coreos/flannel/releases  

## 二、flannel安装并应用到docker  
1. 使用etcd创建虚拟网络  
```bash
etcdctl mkdir /coreos.com/network
etcdctl set /coreos.com/network/config '{"Network":"172.17.0.0/16"}
```

2. 运行flannel  
##### NODE1
```bash 
flanneld --logtostderr=false --log_dir=/var/log/k8s/flannel/ --etcd-endpoints=http://172.16.249.130:4001

```  
##### NODE2
```bash 
flanneld --logtostderr=false --log_dir=/var/log/k8s/flannel/ --etcd-endpoints=http://172.16.249.129:4001
``` 
3. 运行mk-docker-opts.sh脚本  

```bash 
sh mk-docker-opts.sh
```

4. 查看/run/docker_opts.env  

``` bash 
cat /run/docker_opts.env

``` 

5. 修改/etc/sysconfig/docker文件，将上面文件的DOCKER_OPTS内容添加到docker的启动配置  

`OPTIONS=--selinux-enabled  --graph="/data/docker" --bip=172.17.77.1/24 --mtu=1472`  

6. 重启docker.service  

```bash 
systemctl restart docker.service
```

### flannel网络Type中UDP和xvlan的性能对比  
1、性能测试工具选用qperf，选择另外一台主机运行 `qperf &`用以接受测试。  
2、分配测试原生网络、docker + flannel type类型为xvlan的网络以及docker + flannel type类型为UDP的网络的网络传输速度(tcp_bw)及延迟(tcp_lat)。  
3、分别测试不同传输大小的十组数据。  

1. 原生网络  
`qperf 101.201.65.159 -oo msg_size:1:64k:*2 tcp_bw tcp_lat`  

2. docker + flannel xvlan 网络  
`docker run -it registry.cn-hangzhou.aliyuncs.com/cheyang/centos-qperf 101.201.65.159 -oo msg_size:1:64k:*2 tcp_bw tcp_lat`  

3. docker + flannel udp 网络  
`docker run -it registry.cn-hangzhou.aliyuncs.com/cheyang/centos-qperf 101.201.65.159 -oo msg_size:1:64k:*2 tcp_bw tcp_lat`

4. 测试结果  

| 数据 |xvlan 网络|原生网络|udp 网络|
|:-:|:-:|:-:|:-:|
|1|bw=184 KB/sec ; latency=15.4 ms|bw=184 KB/sec ; latency=15.4 ms|bw=185 KB/sec ; latency=17.9 ms|
|2|bw=127 KB/sec ; latency=18.2 ms|bw=127 KB/sec ; latency=15.4 ms|bw=120 KB/sec ; latency=18.9 ms|
|3|bw=127 KB/sec ; latency=18.5 ms|bw=130 KB/sec ; latency=14.9 ms|bw=141 KB/sec ; latency=15.4 ms|
|4|bw=131 KB/sec ; latency=18.9 ms|bw=130 KB/sec ; latency=17.7 ms|bw=130 KB/sec ; latency=14.9 ms|
|4|bw=129 KB/sec ; latency=18.2 ms|bw=128 KB/sec ; latency=15.4 ms|bw=130 KB/sec ; latency=15.4 ms|
|5|bw=131 KB/sec ; latency=15.4 ms|bw=127 KB/sec ; latency=18.2 ms|bw=128 KB/sec ; latency=15.6 ms|
|6|bw=129 KB/sec ; latency=15.6 ms|bw=130 KB/sec ; latency=15.6 ms|bw=125 KB/sec ; latency=14.9 ms|
|7|bw=132 KB/sec ; latency=17.9 ms|bw=129 KB/sec ; latency=15.6 ms|bw=133 KB/sec ; latency=14.5 ms|
|8|bw=131 KB/sec ; latency=18.5 ms|bw=133 KB/sec ; latency=18.9 ms|bw=130 KB/sec ; latency=14.9 ms|
|9|bw=129 KB/sec ; latency=15.4 ms|bw=130 KB/sec ; latency=18.5 ms|bw=124 KB/sec ; latency=15.2 ms|
|10|bw=132 KB/sec ; latency=14.7 ms|bw=132 KB/sec ; latency=18.9 ms|bw=126 KB/sec ; latency=15.2 ms|
|11|bw=130 KB/sec ; latency=17.9 ms|bw=130 KB/sec ; latency=18.9 ms|bw=128 KB/sec ; latency=18.7 ms|
|12|bw=131 KB/sec ; latency=18.2 ms|bw=129 KB/sec ; latency=18 ms|bw=129 KB/sec ; latency=14.7 ms|
|13|bw=127 KB/sec ; latency=23.8 ms|bw=131 KB/sec ; latency=22.7 ms|bw=131 KB/sec ; latency=23.8 ms|
|14|bw=123 KB/sec ; latency=62.5 ms|bw=131 KB/sec ; latency=71.4 ms|bw=123 KB/sec ; latency=62.5 ms|
|15|bw=115 KB/sec ; latency=167 ms|bw=115 KB/sec ; latency=125 ms|bw=131 KB/sec ; latency=105 ms|  


