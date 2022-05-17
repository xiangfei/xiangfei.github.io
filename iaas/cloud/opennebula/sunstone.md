
# views

+ Admin view
+ Group Admin view
+ Cloud view
+ User view

## 定义默认视图
```bash
# /etc/one/sunstone-views/{kvm,vcenter,mixed}
vi /etc/one/sunstone-server.conf
:mode: 'mixed'
```


## 自定义视图 

```bash
# file location  /etc/one/sunstone-views/*.yaml
copy  /etc/one/sunstone-views/{kvm,vcenter,mixed}/admin.yaml 

```
