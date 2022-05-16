
# centos7 为例
## image

```bash
需要安装one-context
wget https://github.com/OpenNebula/addon-context-linux/releases/download/v6.4.0/one-context-6.4.0-1.el7.noarch.rpm

```
## Set Up the Virtual Machine Template
```bash
CONTEXT = [
    TOKEN = "YES",
    NETWORK = "YES",
    SSH_PUBLIC_KEY = "$USER[SSH_PUBLIC_KEY]",
    START_SCRIPT = "yum install -y ntpdate"
]
```
>+ Set OneGate token and onegate information in the context
+ Add network configuration to the Virtual Machine
+ Enable login into the Virtual Machine using ssh with the value of the user’s parameter SSH_PUBLIC_KEY
+ On Virtual Machine boot execute the command yum install -y ntpdate


## OneGate Token

+ Token: vm rest 接口认证
> 需要在oned.conf 配置endpoint

## Network Configuration

```bash
CONTEXT = [
  NIC = [ NETWORK = "Network", IP = 10.0.0.153 ]
]
```

## User Credentials

```bash
ssh-keygen 
手动在template copy公钥 or
CONTEXT = [
  SSH_PUBLIC_KEY="ssh-rsa MYPUBLICKEY..."
]

```

## Execute Scripts on Boot

```bash
CONTEXT = [
    START_SCRIPT = "#!/bin/bash
yum update
yum install -y ntpdate
ntpdate 0.pool.ntp.org"
]

```



