

## DOKCER 

1. log-driver 通过使用`--log-driver`指定log-driver的类型，可以有`none`、`json-file`、`syslog`、`journald`等，docker version 1.12以前默认的log-driver为`json-file`，1.12以后的默认log-driver为`journald`。  
当log-driver的类型为json-file时，可使用--log-opt命令指定max-size(每个文件的大小)，max-file(最多保存多少个文件)等。设定--log-driver可以在docker engine的配置文件`/etc/sysconfig/dokcer`内进行指定，也可以在单个容器运行的时候通过--log-driver进行单独指定。  
>参考文档：https://docs.docker.com/engine/admin/logging/overview/  

2. 关于指定docker数据存储路径后`/etc/sysconfig/docker: line 4: --graph=/data/docker: No such file or directory`报错的解释：  
在docker engine的配置文件`/etc/sysconfig/docker`内通过`--graph=/data/docker`指定docker数据文件存储位置后会提示`/etc/sysconfig/docker: line 4: --graph=/data/docker: No such file or directory`，原因在于docker对于该参数的配置有格式要求`OPTIONS='--graph="/data/docker"'`该标准可行。  
<br />
3. 关于`docker-storage-setup.service`无法启动，报错`ERROR: No valid volume group found. Exiting.`的原因。---------待跟踪  
<br />
4. docker version 1.12以上的版本，可以通过指定参数(/etc/docker/daemon.json `"live-restore": true` 默认参数) 当docker engine异常终止时(例如崩溃或者kill)，使在运行中的container不受影响。  
<br />
5. 使用docker进行端口映射(-p)时，会写入指定规则到iptables里面，firewalld及iptables在第一次启动初始化文件的时候会重置iptables里面规则，所以如果在docker engine启动后iptables或者firewalld再启动时，docker engine启动创建的iptables链会消失，此时通过`docker run -p `指定端口来启动container时会报错`failed: iptables: No chain/target/match by that name.`。经过个人测试docker version 1.12以下的版本在重启firewalld或者iptables后也会重置docker engine创建的iptables链表，1.12以上则不会。  


## K8S  
1. 关于在K8S上面通过删除pod来使指定`restartPolicy:always`的deployment或者rc重新创建pod，以达到重启pod的效果而造成的宿主机上面该pod相关的container存储目录被删除（如果新的pod还是创建在这台宿主机(node)上面，则K8S会保留上一个pod的备份），但是docker engine并没有释放被删除的空间(可以通过`lsof |grep deleted`查看已删除但是未释放的空间)，此时只能通过重启docker engine来释放这些空间。------需要继续跟踪是否是因为删除pod造成的还是正常通过k8s重新布置pod也会出现该现象。  
<br />
2. K8S及DOCKER怎么解决不同pod之间数据共享及数据持久化？  
使用NFS或者其它分布式文件系统，通过docker或者k8s各自的方式挂载到容器内部，数据持久化系统可用NFS和glusterfs等实现。  
<br />
3. k8s的kube-dns的使用
创建的service会随机分配一个clusterIP和targetport（IP不可ping，端口不可telnet) 当其它服务在访问tcp://clusterip:targetport 时，k8s会负载均衡到各node的pod上面，当发起访问请求的主机/pod和该pod的IP为同一网段时（即分配到的POD在和发起请求的POD在同一台node上面），因为路由寻址问题，将会访问失败。所以引入kube-dns概念。  （错错错，只有pod的node主机访问不了，so why???）
使用flannel搭建的docker网络，不同网段之间互访源地址会转换成该子网的类似192.168.0.0/32这个地址去访问，不会使用正确的源IP地址  
<br />
4. k8s更新或者通过kubernetes-dashboard删除rc(直接使用kubectrl delete rc删除会同时删除pod)后对应的pods没有更新或者删除
k8s在更新rc中的容器的资源时，会立刻更新rc中的数据信息，但是rc却不会触发更新rc中pod的事件，也就是说并不会去更新正在运行中的pod的资源，但是当rc真正的做伸缩扩建（replicas的值增减），才会真正的用现有的rc模板中的数据去创建新的pod。而且在replicas值减小时，去删除对应的pod的机制是根据pod的创建时间顺序去删除的，最先删除最新创建的，让后次之。  
<br />
5. k8s的yaml设置中Containers标签ports标签下clinetport参数的意义，并不会改变容器里面监听的端口,service 中port、targetport和clusterip代表的意义  


## Docker(k8s平台下) 日常使用指南  　


1. 确认Container运行所在Cluster。  
可以通过kubernetes-dashboard界面查看POD的Cluster IP并跟《Cluster IP对照表》比较确认该POD(container)所运行的宿主Cluster。  
例如：  
![cluster ip](/medias/img/clusterIP.png)  
<br />
可知cloud及csclient这个POD(container)分别运行在外网地址为59.110.168.105及59.110.171.3的两台服务器(Cluster)上面。<br />   

2. 确认POD(container)的Container ID。  
通过上面步骤我们可知POD(container)运行所在的Cluster，我们可以登陆服务器，通过POD NAME查出POD(container)的Container ID。<br />   
![POD NAME](/medias/img/pod_name.png)<br />   
通过`docker ps |grep cloud-2694259464-dxjs9`命令查询Container ID。<br />   
![select](/medias/img/select_pod.png)<br />   
PS：我们也可以直接`docker ps |grep cloud`查询在该Cluster运行的名为cloud-XXX的POD，但如果该Cluster运行多个名称为cloud-XXX的pod那结果就不是精确结果，可以通过image的版本号或者查看完整的POD NAME来进行精确确认。  
<br />
3. 查看POD(container)的控制台日志。  
1)、根据步骤2我们可以得到我们所想查看的POD(container)的ID。  
2)、通过`docker logs -f --tail=100 39c5fbe30c33`命令查看Container ID为39c5fbe30c33的最近100行(--tail=100)控制台日志输出，并且持续监控后续日志输出(-f)。  
3)、通过`docker logs > logfile.log`或者`docker logs --tail="all" > logfile.log` 命令打印所有控制台日志到logfile.log文件。  
<br />
4. 通过cluster连接POD(container)。  
1)、根据步骤2我们可以得到我们所想连接的POD(container)的ID。  
2)、通过`docker exec -it 39c5fbe30c33 /bin/bash`命令即可进入Container ID为39c5fbe30c33的POD(container)内部。可使用bash命令查看相关信息。<br />  
PS：`docker exec ` 命令实际是调用container内部的命令，可以是`/bin/bash`也可是`cat`,`ls`等命令，但一般docker images会精简自身镜像，所以只会存放内核级别命令及一些基础命令，我们经常可以发现进入到container内部后一些基础命令类似`ll`,`vi`,'telnet'命令不可用，就是这个原因。  
<br />
5. 通过cluster拷贝POD(container)内外文件。  
1)、根据步骤2我们可以得到我们所想连接的POD(container)的ID。  
2)、通过`dokcer cp /opt/fromfile 39c5fbe30c33:/etc/tofile` 及`docker cp 39c5fbe30c33:/etc/fromfile /opt/tofile`命令，可以很方便的在container内外互相拷贝文件，类似Linux下`cp`,`scp`,`rsyc`命令。<br />  
PS:因为container是一次性，使用即销毁的，所以当容器销毁后通过image重新再次启动一个容器的时候，互相拷贝的数据将会消失。容器内数据会恢复到构建Image时默认的数据，如果我们要将一些数据持久化到container内，需要通过重新构建Image的方式进行,如何构建Image参见上一章。

