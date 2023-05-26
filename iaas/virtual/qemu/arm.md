## ubuntu20.16 qemu 模拟arm架构

### 背景

`公司私有化环境没有arm64测试机器，没有钱买服务器，直接软件模拟`



> [!WARNING]
> - x86 模拟性能会下降


[参考](https://wiki.ubuntu.com/ARM64/QEMU)

### 安装

#### 下载arm服务器文件

- [url](http://cloud-images.ubuntu.com/)
- [focal-server-cloudimg-arm64.img](http://cloud-images.ubuntu.com/focal/20230523/focal-server-cloudimg-arm64.img)


#### 配置本地metadata server


```bash
root@test:~# cat  meta-data 
#cloud-config
chpasswd:
  list: |
     root:password

python3 -m http.server --directory /root

```

#### 安装及启动

```bash
apt-get update

apt-get install qemu-system-arm qemu-efi

cp /usr/share/AAVMF/AAVMF_CODE.fd flash1.img

qemu-system-aarch64 -m 4096 -smp 2 -cpu cortex-a57 -M virt -nographic -pflash /usr/share/AAVMF/AAVMF_CODE.fd -pflash flash1.img -drive if=none,file=focal-server-cloudimg-arm64.img,id=hd0 -device virtio-blk-device,drive=hd0 -netdev user,id=net0,hostfwd=tcp::2222-:22  -device virtio-net-device,netdev=net0,mac=00:16:3e:0c:69:e3 -smbios type=1,serial=ds='nocloud-net;s=http://10.4.2.15:8000/'

```


#### 登录验证



```bash
cloud-init. Use the list format instead.
ci-info: no authorized SSH keys fingerprints found for user ubuntu.
<14>May 26 08:01:18 cloud-init: #############################################################
<14>May 26 08:01:18 cloud-init: -----BEGIN SSH HOST KEY FINGERPRINTS-----
<14>May 26 08:01:18 cloud-init: 1024 SHA256:LSmKqR+Knt4iGs4QfrrgK48m7Swp2Q2+OETi8z21EdA root@ubuntu (DSA)
<14>May 26 08:01:19 cloud-init: 256 SHA256:7qQFNjV9++ZmG2RxzZQtC/+qlg7OMATUIkWX9qaKTa0 root@ubuntu (ECDSA)
<14>May 26 08:01:19 cloud-init: 256 SHA256:4y9wpa1KBI6kBy/OH+psJ/8LwsG/uBGAfot1/MtDnJ8 root@ubuntu (ED25519)
<14>May 26 08:01:20 cloud-init: 3072 SHA256:klTING0YYfYM0qDYLzcwUeDKG3euDr4EOK6GE7AqHNU root@ubuntu (RSA)
<14>May 26 08:01:20 cloud-init: -----END SSH HOST KEY FINGERPRINTS-----
<14>May 26 08:01:20 cloud-init: #############################################################
-----BEGIN SSH HOST KEY KEYS-----
ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBOpDpEZGVowWRLZqPZ1eKR3qw+svd6mdaI406NJYmr81Yadb5F+NZgOJu9QWxXz6QGLa0rdZJpfN2qvb15brH8A= root@ubuntu
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAICpdMq6DDvxYVRohfsOV4wKJKkrqy6yc1Ycmjq8FAmUm root@ubuntu
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDTx5KrRJUmtlbVivCvv+GtNJQq/clZG9furAEHFx3kA8X0nnpfAKHpQOvSmw8al20ra7sO49qX3t1wa+yzO2zWRULk5PqoDV9r7PPLHW0AhlcqsAp1v/2GFcGqt9oRZ56OPZZzQEZRIpfDfsLiIqzLEW5Ed6JJb5zl8wQmGoLHkoCpaB+y5a5dSrkdrtjuXPOd7nw6aa72TAAm266oI7AnSop1eyRIR0fzYJdkbFGCVz40MbWXWdal84D8ygNUKrrab0uOWXR7SB1LQ2FefBdy67hN7+1NCDt6m2zX9cFgktsu2qN/Ib/EcfSn15kov4uh5x5xIcbR0bT0s5dNwx2/a3aaBiN1W6X4b204XLWdvqet9PXNgZyDesot13bn7Q08SyJGOkqXZJ+PgCtHGhr0IiUNgDXDd24HFQ6HCBMswAR/ERN64l/b2bqz9bPJLxBaMq5HPRhBUg5FA2kQMUH3A4lJ7UAYIYWDYT07KW8ufA/CRLJQF6ZLkOS2IS4kom0= root@ubuntu
-----END SSH HOST KEY KEYS-----
[  370.864369] cloud-init[1050]: Cloud-init v. 23.1.2-0ubuntu0~20.04.2 running 'modules:final' at Fri, 26 May 2023 08:01:13 +0000. Up 363.70 seconds.
[  370.882995] cloud-init[1050]: Cloud-init v. 23.1.2-0ubuntu0~20.04.2 finished at Fri, 26 May 2023 08:01:20 +0000. Datasource DataSourceNoCloudNet [seed=dmi,http://10.4.2.15:8000/][dsmode=net].  Up 370.59 seconds

ubuntu login: 
ubuntu login: 
ubuntu login: root
Password: 
You are required to change your password immediately (administrator enforced)
Changing password for root.
Current password: 
New password: 
Retype new password: 
Password unchanged
New password: 
Retype new password: 
Bad: new password is too simple
New password: 
Retype new password: 




Welcome to Ubuntu 20.04.6 LTS (GNU/Linux 5.4.0-149-generic aarch64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

  System information as of Fri May 26 09:37:39 UTC 2023

  System load:           0.15
  Usage of /:            70.7% of 1.97GB
  Memory usage:          4%
  Swap usage:            0%
  Processes:             90
  Users logged in:       0
  IPv4 address for eth0: 10.0.2.15
  IPv6 address for eth0: fec0::216:3eff:fe0c:69e3

Expanded Security Maintenance for Applications is not enabled.

0 updates can be applied immediately.

Enable ESM Apps to receive additional future security updates.
See https://ubuntu.com/esm or run: sudo pro status



The programs included with the Ubuntu system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Ubuntu comes with ABSOLUTELY NO WARRANTY, to the extent permitted by
applicable law.




root@ubuntu:~# 
root@ubuntu:~# 
root@ubuntu:~# 
root@ubuntu:~# 
root@ubuntu:~# 
root@ubuntu:~# 
root@ubuntu:~# 
root@ubuntu:~# ls
snap
root@ubuntu:~# lscpu 
Architecture:                    aarch64
CPU op-mode(s):                  32-bit, 64-bit
Byte Order:                      Little Endian
CPU(s):                          2
On-line CPU(s) list:             0,1
Thread(s) per core:              1
Core(s) per socket:              2
Socket(s):                       1
NUMA node(s):                    1
Vendor ID:                       ARM
Model:                           0
Model name:                      Cortex-A57
Stepping:                        r1p0
BogoMIPS:                        125.00
NUMA node0 CPU(s):               0,1
Vulnerability Itlb multihit:     Not affected
Vulnerability L1tf:              Not affected
Vulnerability Mds:               Not affected
Vulnerability Meltdown:          Not affected
Vulnerability Mmio stale data:   Not affected
Vulnerability Retbleed:          Not affected
Vulnerability Spec store bypass: Vulnerable
Vulnerability Spectre v1:        Mitigation; __user pointer sanitization
Vulnerability Spectre v2:        Vulnerable
Vulnerability Srbds:             Not affected
Vulnerability Tsx async abort:   Not affected
Flags:                           fp asimd evtstrm aes pmull sha1 sha2 crc32 cpui
                                 d
root@ubuntu:~# 

```