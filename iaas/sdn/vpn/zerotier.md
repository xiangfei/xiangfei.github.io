## zerotier 安装

`需要有公网IP,稳定性没有验证，学习使用`


[参考](https://cloud.tencent.com/developer/article/1889039)


### 安装
- centos 7 2台
 - master 需要在路由器做公网IP 1对1 NAT
 - client  不需要固定公网ip


####  master

```bash
yum install tinc
mkdir -p /etc/tinc/tincnet/
mkdir  /etc/tinc/tincnet/hosts
cd /etc/tinc/tincnet/
ll

vi tinc.conf
...
Name = Server_Node 
Interface = tinctun 
AddressFamily = ipv4
Mode = switch 
ConnectTo = Slave_Node
Compression=9 
Cipher = aes-256-cbc 
Digest = sha256 
PrivateKeyFile=/etc/tinc/tincnet/rsa_key.priv
...

# tinc 启动
vi tinc-up
#!/bin/sh
# Interface = tinctun 在 tinc.conf 定义
ip link set $INTERFACE up
# 10.254.254.0/24 tunnel 网络
ip addr add 10.254.254.2/24 dev $INTERFACE
ip route add 10.254.254.0/24 dev $INTERFACE

vi tinc-down 
#!/bin/sh
ip route del 10.254.254.0/24 dev $INTERFACE
ip addr del 10.254.254.2/24 dev $INTERFACE
ip link set $INTERFACE down

chmod 755 tinc*


cd /etc/tinc/tincnet/hosts
vi Server_Node

...
Address = 129.211.209.82
Subnet = 10.254.254.2/32
Port = 655

...

# 生成密钥
tincd -n tincnet -K 4096 


vi /etc/tinc/tincnet/hosts/Server_Node
...
Address = 129.211.209.82
Subnet = 10.254.254.2/32
Port = 655

-----BEGIN RSA PUBLIC KEY-----
MIIEpAIBAAKCAQEAyXzJK+e+rx3V/BWo3VYoK1KHtsoupOx8Tj4LhXLpwmiF5QkH
l9gSyh7ndme3XOaxKU1QC/RAusX6mMfdWFyQg4nyqaU/vAkgds8ypQICt9Urcpzl
OhfOcWia44nxzovydCzpDCVVhJNElfJqlZJYyeR4kpO/ykehrUZlBm2Ky/3Uz5N+
Y7hajszxsU9HrlEYt4DTlTaNuvwnDC8XI5O25YbkyBl+BJyn0IwaBHFyLQq4tjxw
munjM6YdPyWxLbixANBrrtTcacxWrIKxRhQeWbFXJzQJDd7KISqYfMLfPDTSlJpz
5Aly+EbdB2B8JAYSE/ogb3gNCkxyu1+SEa4tWQIDAQABAoIBAE4Gf9T7ynEACdS0
Ao+sBKQ6MooLo6KEXeLizg1gobuCRI+cPo+Dwkr5SsMkiPJ195c59EycytBJSLEP
fNzyA5icvBcMAjFsC2FW/ZK+w5Sy/T9GGNK1U2HBk3GYAsbslPh+R8VHU+WiLgYv
OS0w3idYzYRdqQDJWofCYe7qTryNoItg2V7tdFbYcjZKjroD30OyvGny5D2UIh9C
imO2cehNn0oo6EaN6g0uWhghet9j4ECoB67m6gxWY/tMTumDEYldWs45iOJDI4GI
uqmUEyfLIML/aCJnnvaZIgappz6WwhqAyZydbAwcXMdAS8aTR9bR1pFZkJdNE5dh
LydTqjECgYEA5F4xyMf2IOlS4mJtGryf+BMaWzJkHB2ddeR14Po17NT2eA4zn/YB
2IB3opnJ5wSOHiJBgzOwmHJifE3Klya8qbK69tYc2Q5YbWpKN3Lu6F8hi9PWYaxt
U0eAJOjgjzAUzosOmGwvcs4vIhjB8jz5rH3a0Mv5dPbPBDxAIQUJphUCgYEA4d30
fTGS4kJNg8GLsFKSgBSUJLeFKi7xXwrY+rSuQf4W4SdHvOqU9ATLxrTPEydJ9c9w
z8c02BeyKOEiBt+s4oNYPcPn3Xji+3qvirKGwW8YSXkw0L/pQ8mJHhJRmCMkzNaR
O4iQxZftQS9Y6tnLHoByzEXQgHGGa5jTs9IZXzUCgYEAo1T/dGQYFHfskP/mmt3X
6Bz5l8pVsYo46W3qJWuvj+DNGxbFM55GuatAZapqrnEimEjV5Fne71m4OMGGqU7K
VvD/KbX/0fqhojgINtpcJxSLMK/lP9yMIKkd7MgmfCLebs8kND4EPa9cJJ3icTfN
NuKY0wdgNpijfZr+Ht+0g/UCgYBB5hE8KaeSTgfxphmMczr9FYP3hnfay+Fuemq+
EtM4u9qPDHfYvZSB8ZhGvGAiVXc1ubVPWe6oEZnQZYcY/E+jsvCe7LaMnoWTG8N1
swqwCyrJ3QsKDMQRHA7ecDfQLIjDHuM2vGyIyf/V4euOccbael2EDeZ8YyL155v0
vhra9QKBgQCcJw4uh941s2K/u03zeRUA2B2DTTiXVoD5ph7kWLiB3T9b1CfTTGUj
LpL2k+pqPdm2Mfa4OKHaUocbrqmDL0+bpYHNwF9BJ69PNtb78bJRIKkd3lNVsvN7
+tL6gGmQVwj+92cg6x3eoJLiLrLu6hPzEKsSHvbEkRVAXJfJWPFQ6Q==
-----END RSA PUBLIC KEY-----
...


# 配置转发
net.ipv4.ip_forward = 1


#启动

systemctl start tinc@tincnet
```


### 配置互相访问


```bash
route add -net 10.106.0.0/20 dev tinctun

```



### windows 配置

[地址](https://www.tinc-vpn.org/packages/windows/tinc-1.0.36-install.exe)