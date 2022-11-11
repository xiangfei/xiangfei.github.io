# glusterfs volume 配置


| IP          | Description | 
| ----------- | ----------- |
| 10.4.2.110  | vip         |
| 10.4.2.111  | glusterfs-01  keepalived  / 系统盘  /sata 数据盘|
| 10.4.2.112  | glusterfs-02  keepalived / 系统盘  /sata 数据盘 |
| 10.4.2.113  | glusterfs-03  / 系统盘  /sata 数据盘 |


## 配置及启动

```bash

创建 5G 存储
dd if=/dev/zero of=/test.txt count=10 bs=512M 

mkfs.xs /test.txt

mount /test.txt /data

gluster volume create dis-vol replica 3   glusterfs-01:/data glusterfs-01:/data glusterfs-01:/data force

gluster volume start  dis-vol

mkdir /gfs
mount -t glusterfs  10.4.2.110:dis-vol /gfs

10.4.2.110:dis-vol  /gfs glusterfs   defaults,_netdev 0  0


```


> [!WARNING]
> - 临时测试方法,重启挂载会丢失,生产设置自动mount 


# k8s 集成

- k8s service  example

```yaml
apiVersion: v1
kind: Endpoints
metadata:
  name: glusterfs-cluster
subsets:
- addresses:
  - ip: 10.4.2.111
  ports:
  - port: 49152
- addresses:
  - ip: 10.4.2.112
  ports:
  - port: 49152
- addresses:
  - ip: 10.4.2.113
  ports:
  - port: 49152
---
apiVersion: v1
kind: Service
metadata:
  name: glusterfs-cluster
spec:
  ports:
  - port: 49152

```

- k8s pv  example 


```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: glusterfs-pv
spec:
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteMany
  glusterfs:
    endpoints: glusterfs-cluster
    path: dis-vol
    readOnly: false

```

 - k8s pvc example


 ```yaml

apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: glusterfs-pvc
spec:
  accessModes:
  - ReadWriteMany
  resources:
    requests:
      storage: 2Gi
 
 ```

- k8s deployment example



```bash
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      name: nginx
  template:
    metadata:
      labels:
        name: nginx
    spec:
      containers:
        - name: nginx
          image: nginx
          ports:
            - containerPort: 80
          volumeMounts:
            - name: storage001
              mountPath: "/usr/share/nginx/html"
      volumes:
      - name: storage001
        persistentVolumeClaim:
          claimName: glusterfs-pvc

```

> [!WARNING]
> - 49152 通过gluster volume status 查看
> - k8s pv example path `dis-vol` 手动创建的glusterfs volume