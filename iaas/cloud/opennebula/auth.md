
# 流程
![](/images/auth_options_350.png)

## CLI/API Authentication
+ Built-in User/Password
+ LDAP
+ SSH

## Sunstone Authentication
+ Built-in User/Password
+ LDAP
+ SSH
+ X509

## Servers Authentication
+ Built-in User/Password
+ LDAP
+ SSH


## Built-in User/Password and token authentication

```bash
cat $HOME/.one/one_auth
oneadmin:opennebula

```


## SSH Authentication

```bash
vi /etc/one/oned.conf 
AUTH_MAD = [
    EXECUTABLE = "one_auth_mad",
    AUTHN = "ssh,x509,ldap,server_cipher,server_x509"
]

ssh-keygen -t rsa
oneuser key
oneuser create newuser --ssh --key /home/newuser/.ssh/id_rsa
oneuser chauth <id|name> ssh
oneuser passwd <id|name> --ssh --key /home/newuser/.ssh/id_rsa
oneuser login newuser --ssh
```

## X509 auth
+ 配置参考ssh认证
+ 测试环境opensssl 成功公钥认证失败,下次有时间在测试


## LDAP auth
+ 配置参考ssh认证

```yaml
# vi /etc/one/auth/ldap_auth.conf
server 2:
    :auth_method: :simple
    :host: localhost
    :port: 389
    :base: 'dc=domain'
    #:group: 'cn=cloud,ou=groups,dc=domain'
    :user_field: 'cn'

# List the order the servers are queried
:order:
    #- server 1
    - server 2


```


## custom auth (xml 认证举例)
  
```xml
<AUTHN>
    <USERNAME>VALUE</USERNAME>
    <PASSWORD>VALUE</PASSWORD>
    <SECRET>VALUE</SECRET>
</AUTHN>
```
```bash

echo '<AUTHN><USERNAME>test</USERNAME><PASSWORD>5</PASSWORD><SECRET>testpassword</SECRET></AUTHN>' |  authenticate

vi /var/lib/one/remotes/auth/length/authenticate
#!/bin/bash

data=$(cat -)

username=$(echo "${data}" | xmllint --xpath '//AUTHN/USERNAME/text()' -)
password=$(echo "${data}" | xmllint --xpath '//AUTHN/PASSWORD/text()' -)
secret=$(echo "${data}" | xmllint --xpath '//AUTHN/SECRET/text()' -)

length=$(echo -n "$secret" | wc -c | tr -d ' ')

if [ $length = $password ]; then
    echo "length $username $secret"
else
    echo "Invalid password"
    exit 255
fi

AUTH_MAD = [
    executable = "one_auth_mad",
    authn = "ssh,x509,ldap,server_cipher,server_x509,length"
]
```
> 可以直接集成自己开发的平台
>> 执行oneuser create 方法
>> 扩展auth认证

```python
#认证内部平台例子
#!/usr/bin/env ruby

require 'net/http'
user   = ARGV[0]
pass   = ARGV[1]
#secret = ARGV[2]
uri = URI('http://192.168.2.1')
params = {name:user, password: pass}
res = Net::HTTP.post_form(uri, params)
if res.body.to_s =~/success/

exit 0

else

exit -1
end



```
