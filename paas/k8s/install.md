



## 一、Docker 安装部署  
### 查看Liunx内核版本
`uname -a`  
> Docker requires a 64-bit OS and version 3.10 or higher of the Linux kernel.  

### 安装扩展源
`sudo rpm -ihv http://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm  `
### 安装docker
`sudo yum install -y docker`  
### 启动docker服务
`sudo systemctl enable docker.service`  
`sudo systemctl start docker.service`
### daemon-reload
`sudo systemctl daemon-reload`  
### 配置文件及启动脚本路径
`/etc/sysconfig/docker`  
`/lib/system.d/system/docker.service`  

更多请参考 ：[Docker基础介绍] (Docker基础介绍.md)  

## 二、ETCD 安装部署  
### 下载地址(Latest release)  
> https://github.com/coreos/etcd/releases  

### etcd安装配置（两节点）  

##### 在NODE1（172.16.249.130）执行：
```bash
etcd --name 'etcd1' --initial-advertise-peer-urls=http://172.16.249.130:7001 --data-dir=/data/etcd/ --listen-peer-urls=http://0.0.0.0:7001 --listen-client-urls=http://0.0.0.0:4001 --advertise-client-urls=http://172.16.249.130:4001 --initial-cluster="etcd1=http://172.16.249.130:7001,etcd2=http://172.16.249.129:7001" --initial-cluster-state=new
```  
备注：其中IP地址、端口、文件路径可以根据具体情况自行配置。  

##### 在NODE2（172.16.249.129）执行：
```bash
etcd --name 'etcd2' --initial-advertise-peer-urls=http://172.16.249.129:7001 --data-dir=/data/etcd/ --listen-peer-urls=http://0.0.0.0:7001 --listen-client-urls=http://0.0.0.0:4001 --advertise-client-urls=http://172.16.249.129:4001 --initial-cluster="etcd1=http://172.16.249.130:7001,etcd2=http://172.16.249.129:7001" --initial-cluster-state=new
```  
备注：其中IP地址、端口、文件路径可以根据具体情况自行配置。  

更多请参考 ：[Etcd基础介绍] (Etcd基础介绍.md)  

## 三、Flannel安装部署

### flannel下载(Latest release）
> https://github.com/coreos/flannel/releases  

### flannel安装并应用到docker  

1. 使用etcd创建虚拟网络  
`etcdctl mkdir /coreos.com/network`  
`etcdctl set /coreos.com/network/config '{"Network":"172.17.0.0/16"}`  
2. 运行flannel  
##### NODE1
`flanneld --logtostderr=false --log_dir=/var/log/k8s/flannel/ --etcd-endpoints=http://172.16.249.130:4001`  
##### NODE2
`flanneld --logtostderr=false --log_dir=/var/log/k8s/flannel/ --etcd-endpoints=http://172.16.249.129:4001`  
3. 运行mk-docker-opts.sh脚本  
`sh mk-docker-opts.sh`  
4. 查看/run/docker_opts.env  
`cat /run/docker_opts.env`  
5. 修改/etc/sysconfig/docker文件，将上面文件的DOCKER_OPTS内容添加到docker的启动配置  
`OPTIONS=--selinux-enabled  --graph="/data/docker" --bip=172.17.77.1/24 --mtu=1472`  
6. 重启docker.service  
`systemctl restart docker.service`

更多请参考 ：[Flannel基础介绍](install.md?id=三、flannel安装部署)  

## 四、K8S安装部署  
### K8S下载（latest release）  
> https://github.com/kubernetes/kubernetes/releases  
 备注：github会把一些比较大的数据文件放在AWS公有云，因GWF部分AWS的访问将不可用。  

### 下载最新release后,所需要的核心二进制应用包括：  
1. K8S平台管理接口
```bash
kubernetes/server/kubernetes-server-linux-amd64.tar.gz/server/bin/kube-apiserver
```  

6. K8S平台CLI交互工具，用以进行部署、删除、回滚等操作
```
kubernetes/server/kubernetes-server-linux-amd64.tar.gz/server/bin/kubectl
```  

4. 负责node的管理，基本所有操作都靠它
```bash
kubernetes/server/kubernetes-server-linux-amd64.tar.gz/server/bin/kubelet
```  

5. 每个node里的container都在一个私有网络中，kube-proxy的作用就是做一个反向代理，让访问者访问这个node的时候，可以转发到内部对应的container。
```bash
kubernetes/server/kubernetes-server-linux-amd64.tar.gz/server/bin/kube-proxy
```

2. k8s调度器，容器的启动、迁移、扩容缩减时候，选择哪个node，就看它了  
```bash
kubernetes/server/kubernetes-server-linux-amd64.tar.gz/server/bin/kube-scheduler
```

3. k8s对node的控制行为，比如怎么去调用node启动一个容器
```bash
kubernetes/server/kubernetes-server-linux-amd64.tar.gz/server/bin/kube-controller-manager
```

### Master 节点需要启动的应用：  

##### kube-apiserver  
```bash
nohup kube-apiserver --insecure-bind-address=0.0.0.0 --insecure-port=8080 --cors_allowed_origins=.* --etcd_servers=http://172.16.249.130:4001 --v=1 --logtostderr=false --log_dir=/var/log/k8s/apiserver --service-cluster-ip-range=172.17.200.0/24 > kube-apiserver.log &
```   
备注:端口和etcd接口地址请根据实际情况填写，service-cluster-ip-range 为定义后期部署service所规定的网段，当然也可以不设置，那样会默认从falnnel设置的子网里面随机取值。  

##### kube-scheduler  
```bash
nohup kube-scheduler --master=172.16.249.130:8080 --v=1 --logtostderr=false --log_dir=/var/log/k8s/scheduler > kube-scheduler.log &
```  
备注：master需要填写部署 kube-apiserver 应用的master节点的地址和端口。
##### kube-controller-manager  
```bash
nohup kube-controller-manager --master=172.16.249.130:8080 --enable-hostpath-provisioner=false --v=1 --logtostderr=false --log_dir=/var/log/k8s/controller-manager > kube-controller-manager.log &
```  
备注：master需要填写部署 kube-apiserver 应用的master节点的地址和端口。
### node 节点需要启动的应用：

#####   kubelet  
```bash
nohup kubelet --address=0.0.0.0 --port=10250 --cluster_dns=172.17.100.100 --cluster_domain=cluster.local --v=1 --log_dir=/var/log/k8s/kubelet --hostname_override=172.16.249.129 --api_servers=http://172.16.249.130:8080 --logtostderr=false > kubelet.log &
```  
备注：其中hostname_override为改node节点地址，api_servers需要填写部署 kube-apiserver 应用的master节点的地址和端口，cluster_dns在部署kube-dns服务时会用到（参见[kube-system](../yaml/kube-system)）。  

##### kube-proxy  
```bash
nohup kube-proxy --master=172.16.249.130:8080 --log_dir=/var/log/k8s/proxy --v=1 --logtostderr=false > kube-proxy.log &
```
备注：master需要填写部署 kube-apiserver 应用的master节点的地址和端口。


