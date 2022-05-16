

## 一、docker简介  

### docker 官网
>https://www.docker.com/  

### docker 官方文档  
>https://docs.docker.com/  

### 官方docker hub
>https://hub.docker.com  

### Linux内核版本
>Docker requires a 64-bit OS and version 3.10 or higher of the Linux kernel.  


> [!WARNING]
> - docker部分功能需用3.10以上的 linux kernel 才能支持，CENTOS/RHEL6版本的linux内核都低于3.10，所以需要在CENTOS/R
> - HEL6安装docker则需要升级内核版本。

### CENTOS/RHEL 扩展源
>CENTOS/RHEL6：http://dl.fedoraproject.org/pub/epel/epel-release-latest-6.noarch.rpm

>CENTOS/RHEL7：http://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm  

### 部分术语
**images**:  docker镜像（运行docker容器所需要的基础组件，根据自己应用需求构建最小可用的运行环境）  

**container**:  docker容器（可看做为运行着的image，一个image可以运行多个containers）  

**registry**:  docker仓库（用于存储images，可分为官方、第三方和私有）  

**tags**:  docker镜像的版本，根据tags来区分image的版本

## 二、docker安装
### 查看Liunx内核版本
```bash
uname -a
```

### 安装扩展源
```bash
rpm -ihv http://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm

```
### 安装docker

```bash
sudo yum install -y docker  
```
### 启动docker服务
```bash
systemctl enable docker.service  
systemctl start docker.service
```

### daemon-reload

```bash
sudo systemctl daemon-reload
```
### 配置文件及启动脚本路径
```bash
/etc/sysconfig/docker`  
/lib/system.d/system/docker.service
```

## 三、docker 基础应用  

### docker基础命令  
##### 1、查看docker版本   
```bash
docker version
```  

##### 2、查看本地的docker镜像；  
```bash
docker images
```

##### 3、查看运行中的容器，docker ps -a 查看所有容器（包括停止的）；  
```bash
docker ps
```

##### 4、删除image id为$imageid的docker镜像；  
```bash
docker rmi $imageid
```

##### 5、停止container id为$containerid的容器；  
```bash
docker stop $containerid
```

##### 6、删除container id为$containerid的容器（不能删除一个运行中的容器）；  
```bash
docker rm $containerid
```

##### 7、将一个运行中的container id为$containerid的容器打包为image name 为$imagename的镜像,image的版本为$tags；  
```bash
docker commit $containerid $imagename:$tags
```

##### 8、后台运行（-d）一个image名称为$imagename,image版本为$tags的镜像的容器，并且将容器内的80端口映射为宿主机的8080端口，宿主机的/etc目录挂载到容器内的/opt目录内;  
```bash
docker run -d -p 80:8080 -v /opt:/etc $imagename:$tags
```

##### 9、通过Dockerfile生成一个名称为$imagename,image版本为$tags的镜像。Dockerfile的文件夹路径为$dockerfiledir;  
```bash
docker build -t $imagename:$tags $dockerfiledir
```

##### 10、查看image或者container的详细信息;  
```bash
docker inspect $imageid  
docker inspect $containerid
```

##### 11、重命名image的名称和版本;  
```bash
docker tag $imagename1:$tag1 $imagename2:$tag2
```

##### 12、推送或者下载images镜像;  
```bash
docker pull $imagename:$tag  
docker push $imagename:$tag
```


### Dockerfile介绍
Dockerfile的指令是忽略大小写的，建议使用大写，使用 # 作为注释，每一行只支持一条指令，每条指令可以携带多个参数。  

Dockerfile的指令根据作用可以分为两种，构建指令和设置指令。

构建指令用于构建image，其指定的操作不会在运行image的容器上执行；设置指令用于设置image的属性，其指定的操作将在运行image的容器中执行。

**示例：**
```bash
FROM registry.kube-system.svc.cluster.local:5000/tomcat:8.0-jre8-0.1
MAINTAINER daxin
ENV TZ Asia/Shanghai
RUN rm -rf /usr/local/tomcat/webapps/*
ADD cloud-2.8.war /usr/local/tomcat/webapps/cloud.war
RUN mkdir -p /data1
RUN sed -i '2 a\JAVA_OPTS="-server -Xms512m -Xmx1024m  -XX:PermSize=512m -XX:MaxPermSize=1024m"' /usr/local/tomcat/bin/catalina.sh \
    &&  sed -i '2 a\CATALINA_OPTS="-Ddubbo.registry.address=zookeeper://zookeeper:2181"' /usr/local/tomcat/bin/catalina.sh \
    &&  sed -i '70 a\               URIEncoding="UTF-8"' /usr/local/tomcat/conf/server.xml
CMD ["catalina.sh", "run"]
EXPOSE 8080
```
> [!INFO] 
> - FROM：指定基于哪个镜像来生成新的镜像。  
> - ENV：设定环境变量，等同于Linux中export。
> - RUN: 运行bash命令，一般用来修改镜像内文件内容。
> - ADD：添加本地文件/文件夹至镜像相应路径。
> - CMD: 运行image执行的脚本和参数。
> - MAINTAINER：用来标志镜像创建者信息。
> - EXPOSE：暴露需要让宿主机映射的端口信息
> - ENTRYPOINT：类似CMD功能，但运行容器的时候CMD命令可以被外部命令替代ENTRYPOINT不能。  

