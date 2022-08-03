

## 主要功能 

- apt/yum 源
- maven 仓库
- docker 镜像仓库
- npm 源
- helm 仓库
- pypi 
- rubygem
- go
- raw (可以直接上传下载文件-->当作静态文件服务)

## 使用场景

- 离线安装包
- CI/CD 优化(增加2级缓存，提高CI/CD 效率)


> [!WARNING]
> - 需要关闭同步功能(开启可能导致同步meta文件，导致校验失败)


## 高可用

- 没有必要，宕机不影响业务。
  - k8s image 拉取策略IfNotPresent


## nexus docker  https 认证

- 最好只打开http auth
- https 认证通过lb 集群处理

