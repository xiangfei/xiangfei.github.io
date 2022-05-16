

## K8S简介  
### K8S官网  
> http://kubernetes.io/  

### K8S官方指导文档  
> http://kubernetes.io/docs/user-guide/  

### Google docker registry  
> gcr.io/google_containers/  

> [!NOTE] GWF的缘故国内不能直接访问，下载相关镜像需要翻墙或者其它方式下载后转存。  

### K8S下载（latest release）  
> https://github.com/kubernetes/kubernetes/releases  
 备注：github会把一些比较大的数据文件放在AWS公有云，因GWF部分AWS的访问将不可用。  

## K8S安装

> [!NOTE] 所有安装基于CENTOS7 AMD64  

### 下载最新release后,所需要的核心二进制应用包括：  
1. K8S平台管理接口
```bash
kubernetes/server/kubernetes-server-linux-amd64.tar.gz/server/bin/kube-apiserver
```  

6. K8S平台CLI交互工具，用以进行部署、删除、回滚等操作
```bash
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
> [!NOTE] 端口和etcd接口地址请根据实际情况填写，service-cluster-ip-range 为定义后期部署service所规定的网段，当然也可以不设置，那样会默认从falnnel设置的子网里面随机取值。  

##### kube-scheduler  
```bash
nohup kube-scheduler --master=172.16.249.130:8080 --v=1 --logtostderr=false --log_dir=/var/log/k8s/scheduler > kube-scheduler.log &
```  
> [!NOTE] master需要填写部署 kube-apiserver 应用的master节点的地址和端口。

##### kube-controller-manager  
```bash
nohup kube-controller-manager --master=172.16.249.130:8080 --enable-hostpath-provisioner=false --v=1 --logtostderr=false --log_dir=/var/log/k8s/controller-manager > kube-controller-manager.log &
```  
> [!NOTE] master需要填写部署 kube-apiserver 应用的master节点的地址和端口。

### node 节点需要启动的应用：

#####   kubelet  
```bash
nohup kubelet --address=0.0.0.0 --port=10250 --cluster_dns=172.17.100.100 --cluster_domain=cluster.local --v=1 --log_dir=/var/log/k8s/kubelet --hostname_override=172.16.249.129 --api_servers=http://172.16.249.130:8080 --logtostderr=false > kubelet.log &
```  

> [!NOTE] 其中hostname_override为改node节点地址，api_servers需要填写部署 kube-apiserver 应用的master节点的地址和端口，cluster_dns在部署kube-dns服务时会用到（参见[kube-system](yaml/kube-system)）。  

##### kube-proxy  
```
nohup kube-proxy --master=172.16.249.130:8080 --log_dir=/var/log/k8s/proxy --v=1 --logtostderr=false > kube-proxy.log &
```

> [!NOTE] master需要填写部署 kube-apiserver 应用的master节点的地址和端口。

# K8S各模块功能图  
![k8s3](/images/k8s3.png)

