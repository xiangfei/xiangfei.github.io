
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
#ssl off
#tls_reqcert never
tls_cacertfile /etc/ssl/certs/ca-certificates.crt

# The search scope.
#scope sub

```


## 修改 /etc/pam.d/common-password


```bash


# 删除(不存在，直接ignore)

# password [success=1 user_unknown=ignore default=die] pam_ldap.so try_first_pass


# 最后一行增加
session optional pam_mkhomedir.so skel=/etc/skel umask=077


```


## 重启ncsd

```bash

service nscd restart  # database cache

 

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
