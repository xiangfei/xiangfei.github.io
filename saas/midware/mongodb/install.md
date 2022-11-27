## mongodb 安装

- 安装

```bash 

[root@mongodb-qa yum.repos.d]# cat /etc/yum.repos.d/mongodb-org-4.0.repo 
[mngodb-org]
name=MongoDB Repository
baseurl=http://mirrors.aliyun.com/mongodb/yum/redhat/7Server/mongodb-org/4.2/x86_64/
gpgcheck=0
enabled=1

yum -y install epel-release
yum -y install  mongodb-org
systemctl enable mongod
```

- 配置

```bash

vi /etc/mongod.conf 
...
net:
  port: 27017
  bindIp: 0.0.0.0  # Enter 0.0.0.0,:: to bind to all IPv4 and IPv6 addresses or, alternatively, use the net.bindIpAll setting.

security:
  authorization: enabled
  javascriptEnabled: true
...


```


- 设置用户密码


```bash 
[root@mongodb-qa yum.repos.d]# mongo
MongoDB shell version v4.2.23
connecting to: mongodb://127.0.0.1:27017/?compressors=disabled&gssapiServiceName=mongodb
Implicit session: session { "id" : UUID("d6b4b687-01d9-41f9-9910-d6d98e6511ee") }
MongoDB server version: 4.2.23
> use adminuse admin
switched to db admin
> db.createUser({user:"root",pwd:"Iindeed1008",roles:[{role:"dbAdmin",db:"admin"}]})


Successfully added user: {
        "user" : "root",
        "roles" : [
                {
                        "role" : "root",
                        "db" : "admin"
                }
        ]
}


db.grantRolesToUser("root", [{ role: "dbAdmin", db: "admin" }])
db.updateUser("admin",{pwd:"admin"});

db.createUser({user:"godzilla",pwd:"C0ESWQVaipNj",roles:[{role:"dbAdmin",db:"godzilla"}]})

```


- 备份恢复


```bash
mongodump   --username=godzilla --password=C0ESWQVaipNj  --db=godzilla   --out=godzilla
mongorestore  --username=godzilla --password=C0ESWQVaipNj    --db godzilla   ./godzilla/godzilla

```

