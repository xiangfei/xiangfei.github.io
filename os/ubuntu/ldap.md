
> [!WARNING]
> - 测试环境 Ubuntu 20.04.3 LTS 
> - 其他环境没有测试不确定,是否好用

# ldap server

- 10.4.2.69

## 源更新

```bash

apt-get update

```
## 安装客户端

```bash
root@ldap-test:~#  apt-get install libnss-ldapd libpam-ldapd -y




```
> [!INFO]
> - 中间配ldap部分可直接回车或随便写，后面调nslcd.conf文件即可


##  修改nsswitch.conf配置

```bash
/etc/nsswitch.conf


# /etc/nsswitch.conf
#
# Example configuration of GNU Name Service Switch functionality.
# If you have the `glibc-doc-reference' and `info' packages installed, try:
# `info libc "Name Service Switch"' for information about this file.


...
passwd:         files systemd ldap
group:          files systemd ldap
shadow:         files ldap
# passwd:         files systemd
# group:          files systemd
# shadow:         files
...


```

## 修改 nslcd.conf


```bash
/etc/nslcd.conf

# /etc/nslcd.conf
# nslcd configuration file. See nslcd.conf(5)
# for details.

# The user and group nslcd should run as.
uid nslcd
gid nslcd

# The location at which the LDAP server(s) should be reachable.
uri ldap://10.4.2.69

# The search base that will be used for all queries.
base dc=i-i,dc=ai

# The LDAP protocol version to use.
#ldap_version 3

# The DN to bind with for normal lookups.
binddn cn=admin,dc=i-i,dc=ai
bindpw Iindeed1008


# filter passwd (&(objectClass=user)(objectClass=person)(!(objectClass=computer)))
filter passwd  ou=people

#default query is  uid , use givenname instead
map passwd uid  givenname

# map    passwd givenname           givenname
# map    passwd uidNumber     objectSid:S-1-5-21-3623811015-3361044348-30300820
# map    passwd gidNumber     objectSid:S-1-5-21-3623811015-3361044348-30300820
map    passwd homeDirectory "/home/$givenname"
map    passwd gecos         displayName
map    passwd loginShell    "/bin/bash"



filter shadow (objectClass=person)
map shadow uid  sAMAccountName



filter group (|(objectClass=group)(objectClass=person))
map    group gidNumber      objectSid:S-1-5-21-3623811015-3361044348-30300820


# The DN used for password modifications by root.
#rootpwmoddn cn=admin,dc=example,dc=com

# SSL options
ssl off
#tls_reqcert never
# tls_cacertfile /etc/ssl/certs/ca-certificates.crt

# The search scope.
#scope sub

```

> [!WARNING]
> - ssl 配置 根据openldap 配置。


## 修改 /etc/pam.d/common-session


```bash



# 最后一行增加 , 自动创建home dir
session optional pam_mkhomedir.so skel=/etc/skel umask=077   


```


## 重启nslcd


```bash

service nslcd restart  # ldap auth


```


## debug


```bash

service nscd stop

service nslcd stop

nscd -d 

nslcd  -d 

```


## 常见问题 


- getent passwd 没有找到用户


> [!WARNING]
> - 查看 systemctl nslcd status -l


```bash

root@ldap-test:~# service nslcd status
● nslcd.service - LSB: LDAP connection daemon
     Loaded: loaded (/etc/init.d/nslcd; generated)
     Active: active (running) since Fri 2022-05-20 11:22:45 CST; 3min 31s ago
       Docs: man:systemd-sysv-generator(8)
    Process: 1457 ExecStart=/etc/init.d/nslcd start (code=exited, status=0/SUCCESS)
      Tasks: 6 (limit: 2277)
     Memory: 6.8M
     CGroup: /system.slice/nslcd.service
             └─1514 /usr/sbin/nslcd

May 20 11:22:45 ldap-test nslcd[1514]: accepting connections
May 20 11:22:45 ldap-test nslcd[1457]:    ...done.
May 20 11:22:45 ldap-test systemd[1]: Started LSB: LDAP connection daemon.
May 20 11:23:35 ldap-test nslcd[1514]: [8b4567] <passwd="nanfeng"> cn=zhuzhenghao,ou=tech,ou=people,dc=i-i,dc=ai: objectSid: missing
May 20 11:23:39 ldap-test nslcd[1514]: [7b23c6] <authc="nanfeng"> cn=zhuzhenghao,ou=tech,ou=people,dc=i-i,dc=ai: Invalid credentials
May 20 11:24:00 ldap-test nslcd[1514]: [5558ec] <authc="nanfeng"> cn=zhuzhenghao,ou=tech,ou=people,dc=i-i,dc=ai: Invalid credentials
May 20 11:24:34 ldap-test nslcd[1514]: [e87ccd] <authc="nanfeng"> cn=zhuzhenghao,ou=tech,ou=people,dc=i-i,dc=ai: Invalid credentials
May 20 11:24:44 ldap-test nslcd[1514]: [1b58ba] <authc="nanfeng"> cn=zhuzhenghao,ou=tech,ou=people,dc=i-i,dc=ai: Invalid credentials
May 20 11:25:46 ldap-test nslcd[1514]: [4fd4a1] <passwd="mengya"> cn=zhanglinlin,ou=tech,ou=people,dc=i-i,dc=ai: objectSid: missing
May 20 11:25:49 ldap-test nslcd[1514]: [9ac241] <authc="mengya"> cn=zhanglinlin,ou=tech,ou=people,dc=i-i,dc=ai: Invalid credentials
root@ldap-test:~# 

```

> [!WARNING]
> - objectSid 怎么创建不清楚，可以通过其他方式避开，比如手动创建用户


-  登录失败


```bash

useradd test

```

> [!WARNING] 
> - 没有增加用户,一直提示认证失败






## nslcd  配置

- [参考](https://www.markturner.net/2019/09/27/ad-ldap-authentication-on-linux-hosts/)


- base 

```bash
base group OU=Groups,dc=example,dc=com
base passwd CN=Users,dc=example,dc=com

```

> [!TIP]
> - nslcd where to find the users and groups lists that Linux expects to have:

-  passwd filter 

```bash
filter passwd (&(Objectclass=user)(!(objectClass=computer)))

```

> [!TIP]
> - The passwd filter is used to specify who counts as a user vs. who is just another AD object. In the case below, we are looking for both a) someone who is a user, and b) someone who is not a computer: