

## 概念  
**Docker**: 根据[Docker基础介绍] (Docker基础介绍.md) 内部分说明，可以理解为把一个个应用程序以及它运行所需要的基础环境进行打包并运行的工具。  

**images(镜像)**: 应用程序以及它运行所需要的基础环境构成的package。

**containers(容器)**: image的一个运行状态，一个image可以运行多个containers。  

**pods(胖次)**: 是K8S最基本的部署调度单元，可以包含一个或者多个containers，逻辑上表示某种应用的一个实例。(如果一个POD包含多个containers,则需要处理好多个containers的端口冲突)  

**service**: 是pod的路由代理抽象，用于解决pod之间的服务发现问题。因为pod 和container都作为一种使用即消除的存在，而且pod及container分配到的IP有随机性这一特点，在进行应用访问时可能发现原有的pod的IP及端口失效了，service用来解决这些问题的，可以看做是service反向代理了后面的pods。  

**namespace**: k8s及docker的命名空间，同一命名空间下资源的共享使用会比较便利，也用于区分各命名空间内应用的用途。  

**pause-amd64**: 全称gcr.io/google_containers/pause-amd64:3.0 是k8s平台启动POD所**必须**的一个image，但是google的images仓库又因为GWF不能访问,所以刚开始调试k8s平台的时候一般都会遇到image下载超时这个错误。常用的几种做法是，在国内的一些第三方registry平台（比如时速云、阿里云）上面搜索名为pause-amd64的镜像，看是否满足。如果介意安全问题可以直接翻墙下载，然后传到私有registry或者国内的一些第三方registry平台。还有一点需要注意的是，在不论master或者其它node节点上面，该image一定要被正确命名为gcr.io/google_containers/pause-amd64:3.0 ，否则k8s平台仍会继续去下载。

## CLI工具使用（Kubectl）  
在k8s平台安装部署过程中不论master节点还是其他node节点都没有使用到kubectl这个工具，该工具为直接在master节点上面使用通过命令行来管理整个k8s平台。  

在正式使用kubectl工具时先来解决一个疑问：为什么要用kubectl这个CLI工具，我们不是可以使用K8S的dashboard来进行管理么？ 这个问题的答案是：1、按照[K8S平台安装部署手册](K8S平台安装部署手册.md)部署完毕后，整个平台其实只是通过kube-api在8080端口提供了一个api接口，你可以通过http://IP:8080/api/ 接口地址按照K8S的标准API接口文档进行相应的操作，K8S的dashboard平台是google官方出具的基于该API的B/S架构的管理平台，同样kubectl则是官方出具的基于CLI的管理平台。dashboard需要在K8S平台部署完成后进行PODS和service部署，所以在没有了解整个K8S平台的机制前，我们需要先熟悉kubectl的使用。2、dashboard提供的功能要比kubectl少。  

### kubectl常用命令  
`kubectl -h` 查看完整的kubectl命令帮助  

`kubectl get` 查看命令  

`kubectl get namespace`  查看所有namespace  

`kubectl get pod`  查看namespace为默认(default)内的所有pods信息。  

`kubectl get pod --namespace=test ` 查看namespace为test内的所有pods信息。  

`kubectl get pod --all-namespaces `   查看所有pods信息。  

`kubectl get svc(service) --namespace=test` 查看namespace为test内的所有service信息。  

`kubectl get svc mysql --namespace=test -o yaml`  以yaml文档形式查看namespace为test内的service名称为mysql的信息。  

`kubectl create` 创建命令  

`kubectl create -f test.yaml`  通过test-pod.yaml文件创建一个pod/service/rc/configmap等，具体需要看yaml文件内容而定。  

`kubectl create configmap nginx-template --from-file=nginx.tmpl --namespace=test ` 在namesapce test中创建一个configmap，名字为nginx-template,配置文件为nginx.tmpl   

`kubectl describe`  描述命令  

`kubectl describe svc mysql --namespace=test ` 描述查看namespace为test内的service名称为mysql的运行状态。  

`kubectl replace` 替换  

`kubectl replace -f test.yaml` 替换test.yaml配置文件  

`kubectl edit ` 编辑  

`kubectl edit svc mysql --namespace=test -o yaml ` 以yaml文档形式编辑namespace为test内的service名称为mysql的信息。  

`kubectl logs ` 查看pod的日志  

其它请参照`kubectl -h`  

# 使用kubectl创建kubernetes-dashboard服务  
### yaml文件  
yaml文件请参考[kubernetes-dashboard yaml文件](../yaml/kube-system/kubernetes-dashboard.yaml)  

该yaml文件包括了kubernetes-dashboard 的Deployment创建及service的创建。  

其中kubernetes-dashboard 默认使用的image为gcr.io/google_containers/kubernetes-dashboard-amd64:v1.4.2, 因为GWF原因所以引用了第三方（阿里云）的镜像，可以根据实际情况镜像调整。具体YAML文件编写方法，请查考yaml相关章节。  

### 使用kubectl命令创建服务  
```
kubectl -f kubernetes-dashboard.yaml
```  
平台即自动创建了Deployment及service的创建,同时根据Deployment策略将会启动相应的pod。  

### 访问kubernetes-dashboard  
> http://masterip:8080/ui  


# dashboard的使用  
### 平台界面如下图所示：  
![dashboard](/images/dashboard.png)  

### 通过test.yaml创建pod/service/rc/configmap等实现等同于kubectl -f test.yaml的功能  

通过点击右上角`CREATE`按钮 `upload a yaml or json`来上传你的yaml或者json配置文件。  

![dashboard](/images/upload.png)  

备注:`CREATE`里可以通过`specify app details below`进行在线定义配置，但是该配置可实现的参数过少，所以不用该功能。  

### 查看、删除、修改pod/service/rc/configmap等  

选中左侧边栏目你想查看或者删除的配置文件类型，在右侧点击delte\view,可以对该配置文件进行删除及查看或者修改  

![dashboard](/images/delview.png)   

查看：可以查看所有类型的配置文件。

删除: 可以删除所有类型的配置文件，需要注意的是rc/Deployments/Replica Sets被删除后，使用其配置产生的pod不会同时被删除，如需同时删除pod需要在删除前在配置里面把启动pod的数量缩减到0。Replica Sets一般是由Deployments创建的，也能单独创建。Deployments被删除后，使用其配置产生的Replica Sets不会同时被删除。

修改：可以修改所有类型的配置文件。不建议修改由rc/Deployments/Replica Sets生成的pod配置以及由Deployments生成的Replica Sets配置，因为下次启动会恢复为默认。对于Deployments/service/Replica Sets的修改会即时生效，pod会自动重新部署，对于rc的修改pod不会自动重新部署。configmap/secret配置修改过后按照你的配置使用规则，一般需要重启pod。  

# kube-dns  
待填坑  

# kube-registry
待填坑  

# Ingress  
 
ingress 是除了 hostport  nodeport  clusterIP以及云环境专有的负载均衡器外的访问方式,官方提供了Nginx ingress controller。  

## **nginx-ingress-controller**
### Documents  
>https://github.com/kubernetes/ingress/tree/master/controllers/nginx  

### Examples  
>https://github.com/kubernetes/ingress/tree/master/examples  

### Yaml  
nginx-ingress-controller 部署所用yaml文件参见：[nginx-ingress](../yaml/nginx-ingress-controller)  
ingress配置文件参见：[your-namespace](../yaml/your-namespace/loadbalancer)

### 一般使用  
1. 创建Default backend server  
在部署ingress之前需要先部署Default backend server，实现了简单的ingress作为默认返回值，做了两件事：1).提供默认404页面 2).在/healthz返回200。注意：yaml文件内的image由google提供，由于GWF会造成image无法下载，所以需要自己提前准备该image上传到自己/第三方registry。  
`kubectl create -f default-http-backend-rc.yaml`  
`kubectl create -f default-http-backend-svc.yaml`  

2. 创建ingress controller server  
通过nginx-ingress-controller的yaml创建ingress controller server 。注意：yaml文件内的image由google提供，由于GWF会造成image无法下载，所以需要自己提前准备该image上传到自己/第三方registry。  
`kubectl create -f nginx-dep.yaml`  
`kubectl create -f nginx-load-balancer-conf.yaml`  
`kubectl create configmap nginx-template --from-file=nginx.tmpl --namespace=lb`  

3. 创建Ingress  
使用yaml创建自己需要域名则ingress，若需要使用https协议，则需预先定义证书至secret。  
`kubectl create secret tls youdomain-secret --key /tmp/tls.key --cert /tmp/tls.crt --namespace=lb`(证书自备)  
`kubectl create -f wwww-tls-ingress.yaml`  

### Ingress相关配置说明  
1. nginx-dep.yaml 文件内包含了两个configmap的使用：1). nginx-template (该文件为nginx的模板文件，通过文件映射至/etc/nginx/template/nginx.tmpl，这样container启动时会使用nginx-temlpate内的模板启动，当然也可以不定义该模板)。2).  nginx-load-balancer-conf (该文件为container启动参数内一项arg，container启动时会读取configmap里面配置写入nginx.conf文件内) 详细可配置参数参见：[可配置参数](https://github.com/kubernetes/ingress/blob/master/controllers/nginx/configuration.md#allowed-parameters-in-configuration-configmap)   

2. 使用https服务所需要的证书文件可以跟证书提供商申请正式证书，可以通过openssl工具生成临时证书（未认证证书），生成方式参考：[TLS证书](https://github.com/kubernetes/ingress/blob/master/examples/PREREQUISITES.md#tls-certificates)  

3. ingress配置文件(wwww-tls-ingress.yaml)内有一个参数`annotations`该参数下的配置，可以在nginx-ingress-controller内热生效，包含的配置有`kubernetes.io/ingress.class: "nginx"`使用nginx作为控制器（有多个控制器的情况下） `ingress.kubernetes.io/ssl-passthrough: "false"` 是否将http会话跳转到https `    ingress.kubernetes.io/proxy-body-size: "20m"` 设置nginx中proxy-body-size的参数。更多可定义参数参见：[annotations](https://github.com/kubernetes/ingress/blob/master/controllers/nginx/configuration.md#annotations)  

4. To be continue ...

