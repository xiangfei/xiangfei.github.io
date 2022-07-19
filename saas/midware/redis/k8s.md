## k8s 单节点安装


```yaml

apiVersion: v1
kind: PersistentVolume
metadata:
  name: redis-poc-zhijian
spec:
  capacity:
    storage: 20Gi
  accessModes:
    - ReadWriteMany
  nfs:
    server: 10.4.1.1
    path: /sata/nfs/poc/zhijian/redis
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: redis-poc-zhijian
  namespace: zhijian
spec:
  accessModes:
    - ReadWriteMany
  volumeName: redis-poc-zhijian
  resources:
    requests:
      storage: 10Gi


---


apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis
  labels:
    app: redis
  namespace: zhijian
spec:
  replicas: 1
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
    spec:
      containers:
      - name: redis-container
        image: redis:5.0
        command: ["redis-server" , "--requirepass"  ,  "FjockDaLAq"]
        imagePullPolicy: IfNotPresent
        volumeMounts:
        - mountPath: /data/
          name: redis-data
      volumes:
      - name: redis-data
        persistentVolumeClaim:
          claimName: redis-poc-zhijian
---
apiVersion: v1
kind: Service
metadata:
  name: redis
  namespace: zhijian
spec:
  ports:
  - name: http
    port: 6379
    targetPort: 6379
  type: ClusterIP
  selector:
    app: redis

```