# 关于golang by example 学习

- [参考golangbyexample学习](https://golangbyexample.com/golang-installation/)
- 自己学习使用，只记录自己的理解。

## Linux 安装

### 下载 go1.17.8.linux-amd64.tar.gz

```bash
tar - xf  go1.17.8.linux-amd64.tar.gz
```

- 设置环境变量
- 使用gitlab  仓库

```bash
export GO111MODULE=on
export GOPROXY="https://goproxy.cn,direct"  # 国内代理
export GOPRIVATE="code.ii-ai.tech"          # 私有仓库
export PATH=/root/go/bin:$PATH  

```


- gitlab 仓库配置免密码登录



```bash
git config --global credential.helper store

git push http://code.ii-ai.tech/devops.git 
```

