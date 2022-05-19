
## ubuntu 


## centos

### openldap

#### 安装 
```bash
yum install epel-release
yum install  openldap compat-openldap openldap-clients openldap-servers openldap-servers-sql openldap-devel migrationtools -y
cp /usr/share/openldap-servers/DB_CONFIG.example /var/lib/ldap/DB_CONFIG
chown ldap:ldap -R /var/lib/ldap
chmod 700 -R /var/lib/ldap
slaptest -u
systemctl start slapd 
systemctl enable slapd 
systemctl stop firewalld
systemctl disable firewalld  
```

#### 创建密码

```bash
[root@ldap ~]# slappasswd -s 123456
{SSHA}0q09pI6KBFpl4fNPvOVQJcsRzDqnfgVy

```

#### 修改配置


```bash

[root@ldap cn=config]# cat /etc/openldap/slapd.d/cn\=config/olcDatabase\=\{2\}hdb.ldif 
# AUTO-GENERATED FILE - DO NOT EDIT!! Use ldapmodify.
# CRC32 5a997263
dn: olcDatabase={2}hdb
objectClass: olcDatabaseConfig
objectClass: olcHdbConfig
olcDatabase: {2}hdb
olcDbDirectory: /var/lib/ldap
#olcSuffix: dc=my-domain,dc=com
#olcRootDN: cn=Manager,dc=my-domain,dc=com
olcSuffix: dc=i-i,dc=ai
olcRootDN: cn=admin,dc=i-i,dc=ai
olcRootPW: {SSHA}0q09pI6KBFpl4fNPvOVQJcsRzDqnfgVy
olcDbIndex: objectClass eq,pres
olcDbIndex: ou,cn,mail,surname,givenname eq,pres,sub
structuralObjectClass: olcHdbConfig
entryUUID: 11080aea-28ba-103c-9c2d-b7eccd076aed
creatorsName: cn=config
createTimestamp: 20220223060329Z
entryCSN: 20220223060329.240717Z#000000#000#000000
modifiersName: cn=config
modifyTimestamp: 20220223060329Z
[root@ldap cn=config]# 
# 导入配置
ldapadd -Y EXTERNAL -H ldapi:/// -f /etc/openldap/slapd.d/cn\=config/olcDatabase\=\{2\}hdb.ldif 
# schema 导入
# 文件夹
/etc/openldap/schema/

```
### phpldapadmin

#### 安装

```bash
yum install -y phpldapadmin

```


#### 配置


```bash
 /etc/phpldapadmin/config.php 


...

$servers->setValue('login','attr','dn');
// $servers->setValue('login','attr','uid');
...


```


```bash

[root@ldap cn=config]# cat    /etc/httpd/conf.d/phpldapadmin.conf 
#
#  Web-based tool for managing LDAP servers
#

Alias /phpldapadmin /usr/share/phpldapadmin/htdocs
Alias /ldapadmin /usr/share/phpldapadmin/htdocs

<Directory /usr/share/phpldapadmin/htdocs>
  <IfModule mod_authz_core.c>
    # Apache 2.4
 
    # Require local
    Require all granted
    
  </IfModule>
  <IfModule !mod_authz_core.c>
    # Apache 2.2
    Order Deny,Allow
    Deny from all
    Allow from 192.168.66.205
    Allow from ::1
    #Allow from all
  </IfModule>
</Directory>

```
## docker

### openldap 

```yaml
[root@ldap-server srv]# cat /srv/openldap/docker-compose.yml
version: '2'
services:
  openldap:
    image: osixia/openldap:1.2.3
    container_name: ii-openldap
    environment:
      LDAP_LOG_LEVEL: "256"
      LDAP_ORGANISATION: "Intelligence Indeed"
      LDAP_DOMAIN: "i-i.ai"
      LDAP_BASE_DN: ""
      LDAP_ADMIN_PASSWORD: "Shizai.admin.2019"
      LDAP_CONFIG_PASSWORD: "Shizai.config.2019"
      LDAP_READONLY_USER: "false"
      #LDAP_READONLY_USER_USERNAME: "readonly"
      #LDAP_READONLY_USER_PASSWORD: "readonly"
      LDAP_RFC2307BIS_SCHEMA: "false"
      LDAP_BACKEND: "hdb"
      LDAP_TLS: "true"
      LDAP_TLS_CRT_FILENAME: "ldap.crt"
      LDAP_TLS_KEY_FILENAME: "ldap.key"
      LDAP_TLS_DH_PARAM_FILENAME: "dhparam.pem"
      LDAP_TLS_CA_CRT_FILENAME: "ca.crt"
      LDAP_TLS_ENFORCE: "false"
      LDAP_TLS_CIPHER_SUITE: "SECURE256:-VERS-SSL3.0"
      LDAP_TLS_PROTOCOL_MIN: "3.1"
      LDAP_TLS_VERIFY_CLIENT: "demand"
      LDAP_REPLICATION: "true"
      #LDAP_REPLICATION_CONFIG_SYNCPROV: "binddn="cn=admin,cn=config" bindmethod=simple credentials=$LDAP_CONFIG_PASSWORD searchbase="cn=config" type=refreshAndPersist retry="60 +" timeout=1 starttls=critical"
      #LDAP_REPLICATION_DB_SYNCPROV: "binddn="cn=admin,$LDAP_BASE_DN" bindmethod=simple credentials=$LDAP_ADMIN_PASSWORD searchbase="$LDAP_BASE_DN" type=refreshAndPersist interval=00:00:00:10 retry="60 +" timeout=1 starttls=critical"
      #LDAP_REPLICATION_HOSTS: "#PYTHON2BASH:['ldap://ldap.example.org','ldap://ldap2.example.org']"
      KEEP_EXISTING_CONFIG: "true"
      LDAP_REMOVE_CONFIG_AFTER_SETUP: "true"
      LDAP_SSL_HELPER_PREFIX: "ldap"
    tty: true
    stdin_open: true
    volumes:
      - ./data/slapd/database:/var/lib/ldap
      - ./data/slapd/config:/etc/ldap/slapd.d
      - ./data/slapd/certs/:/container/service/slapd/assets/certs/
    ports:
      - "389:389"
      - "636:636"
    domainname: "i-i.ai" # important: same as hostname
    hostname: "i-i.ai"
  phpldapadmin:
    image: osixia/phpldapadmin:latest
    container_name: phpldapadmin
    environment:
      PHPLDAPADMIN_LDAP_HOSTS: "openldap"
      PHPLDAPADMIN_HTTPS: "true"
    ports:
      - "8083:80"
      - "8443:443"
    depends_on:
      - openldap

```