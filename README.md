<center><h1>相飞github运维文档</h1></center>

## 安装


### 安装 nodejs

```bash
yum install epel-release
yum install npm 

```

### 安装docsify


```bash

npm install -g docsify-cli

```


###  启动

```bash
docsify serve .

```

##  文件夹说明


### asset

-  静态资源，手动copy docsify js css 路径。
 - 开始使用cdn资源，本地无网络访问失败

### _sidebar.md
- 导航

### 其他
- markdown 文档


> [!WARNING]
> - 不能访问外网plant uml图片没办法渲染。本地图片除外