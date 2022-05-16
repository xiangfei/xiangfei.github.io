

## User

### Adding and Deleting Users

```bash
oneuser create otheradmin password
oneuser chgrp otheradmin oneadmin

oneuser create publicuser password
oneuser chauth publicuser public

oneuser create serveruser password
oneuser chauth serveruser server_cipher

oneuser delete server_cipher

```

### token

```bash
oneuser token-create
oneuser token-set --token b6
export ONE_AUTH=/var/lib/one/.one/5ad20d96-964a-4e09-b550-9c29855e6457.token; export ONE_EGID=-1
oneuser token-delete b6
```

## Group

###  add
```bash
onegroup create "new group"

```
### add user

```bash
oneuser chgrp -v regularuser "new group"

```

### manage Virtual Machine Templates ,images, service, instance 

```bash
在sunstone 页面直接操作
```

## permission

###

```bash
onetemplate chmod 0 607 -v
```

## ACL

### 创建

```bash
oneacl create "@106 IMAGE/#31 USE"
```

## quota

###  创建

```bash
oneuser batchquota userA,userB,35
onegroup batchquota 100..104
oneuser defaultquota
```


## account

```bash
oneacct -s 05/01 -e 06/01
```
