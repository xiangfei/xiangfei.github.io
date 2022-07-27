#  jenkins 


> [!WARNING]
> - jenkins使用经验

##  部署 

```bash

java -Djava.awt.headless=true -Dfile.encoding=UTF-8 -DJENKINS_HOME=/data/jenkins -jar /usr/lib/jenkins/jenkins_2.332.3.war --logfile=/var/log/jenkins/jenkins.log --webroot=/var/cache/jenkins/war_2.332.3 --httpPort=8080 --debug=5 --handlerCountMax=100 --handlerCountMaxIdle=20
```
### master 节点

- 自动创建jenkins job 

### node 节点

- 执行CI,CD
  - 最好SSD 


##  编译优化

- 使用本地缓存
  - mvn 仓库
  - yarn cache
  - ...
- 在虚拟机编译
  - pod容器编译，创建容器需要时间。
- nexus 服务
  - 搭建本地2级缓存，减少push到多数据中心压力


## 流程优化

- CI/CD 分开
  - 便于权限控制


## 高可用

- 不需要做高可用，对线上数据没影响
- 保证数据备份即可
  - job按时备份到gitlab

## jenkins job 比较

### freestyle job

- 通过job config.xml 创建, 如果jenkins 插件更新，自动创建job 也要更新。
  - 对现有的jenkins job有影响
- 不能原生调用jenkins的runtime environment。
  - 如果jenkins 没有提供API,功能无法实现
- 需要集成插件
  - 插件本身就是一个坑
- 不支持并发构建
  - 需要安装插件处理

### pipeline 

- 可以直接调用jenkins runtime environment
- 集成groovy 脚本，直接写DSL language
  - 可以自定义复杂流程
- 支持并发构建(原生支持)
- 升级对pipeline 没有影响
  - 自动创建job


## 常见问题


### sentry-cli 安装超时

- 使用本地nexus 仓库代理

### java 编译本地缓存没更新

- 强制更新本地缓存
  - 通常是开发的手动导入包流程错误

```bash
mvn clean package -p $ENV -u 

```

### jenkins 升级成功, freestyle project 打开提示文件异常

![jenkins](/images/jenkins.png)


- 删除 webroot



### windows node 编译显示乱码


![windows_node](/images/windows_node.png)

- 修改node 的环境变量

![windows_env](/images/windows_env.png)


### windows 编译提示permission denied

- windows的 node 不是administrator 启动。
