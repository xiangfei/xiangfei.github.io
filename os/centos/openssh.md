## openssh 升级


```bash
yum group install 'Development Tools'
yum install -y openssl-devel  zlib-devel  pam-devel
wget -c https://cdn.openbsd.org/pub/OpenBSD/OpenSSH/portable/openssh-9.0p1.tar.gz     
tar -xzf openssh-9.0p1.tar.gz
cd openssh-9.0p1/
./configure --with-md5-passwords --with-pam --with-selinux --with-privsep-path=/var/lib/sshd/ --sysconfdir=/etc/ssh
make
make install
```



## 常见问题

### 找不到 libcrypto 

> [!WARNING]
> - 需要安装openssl-devel


### No pam headers

> [!WARNING]
> - 需要安装pam-devel