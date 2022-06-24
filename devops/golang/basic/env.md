## golang 环境设置

### 使用国内代理

```bash
...

GOPROXY="https://goproxy.cn,direct"
...

```

### 启动go111moudle

```bash
...
GO111MODULE=on
...

```

### 使用gitlab 仓库


```bash
...
export GOPRIVATE="code.ii-ai.tech"
...
```

### 设置


```bash
git config --global credential.helper store

```

> [TIPS] 第一次需要手动输入