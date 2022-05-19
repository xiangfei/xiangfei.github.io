

## centos 安装


### 安装JDK
...

### 解压jar包

...

### 调整 环境变量

```bash
export INSTALL4J_JAVA_HOME=/opt/jdk1.8.0_291
export JAVA_HOME=/opt/jdk1.8.0_291
export NEXUS_HOME=/opt/nexus-3.37.3-02
export PATH=$JAVA_HOME/bin:$NEXUS_HOME/bin:$PATH
export INSTALL4J_ADD_VM_PARAMS="-Xms8000m -Xmx8000m -XX:MaxDirectMemorySize=2g -Djava.util.prefs.userRoot=/nexus-data/javaprefs"
```

### 调整jvm 参数
```bash
cat /opt/nexus-3.37.3-02/etc/nexus-default.properties
## DO NOT EDIT - CUSTOMIZATIONS BELONG IN $data-dir/etc/nexus.properties
##
# Jetty section
application-port=8081
application-host=0.0.0.0
nexus-args=${jetty.etc}/jetty.xml,${jetty.etc}/jetty-http.xml,${jetty.etc}/jetty-requestlog.xml
nexus-context-path=/

# Nexus section
nexus-edition=nexus-pro-edition
nexus-features=\
 nexus-pro-feature

nexus.hazelcast.discovery.isEnabled=true

```

### 启/停

```bash
nexus start 
nexus stop

```


## docker-compose 安装


## k8s 安装


## 数据迁移

### java 应用启动， 直接copy 文件夹就可以


## 2级缓存


> [!WARNING]
> - 默认同步时间是1440 分钟
> - Docker group 是收费功能



