
## k8s singleton 

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: mysql-poc-zhijian
spec:
  capacity:
    storage: 200Gi
  accessModes:
    - ReadWriteMany
  nfs:
    server: 10.4.1.1
    path: /sata/nfs/poc/zhijian/mysql
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mysql-poc-zhijian
  namespace: zhijian
spec:
  accessModes:
    - ReadWriteMany
  volumeName: mysql-poc-zhijian
  resources:
    requests:
      storage: 200Gi


---


apiVersion: apps/v1
kind: Deployment
metadata:
  name: mysql
  labels:
    app: mysql
  namespace: zhijian
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mysql
  template:
    metadata:
      labels:
        app: mysql
    spec:
      containers:
      - name: mysql
        image: registry.ii-ai.tech/tools/ii-mysql-base:8.0.27
        env:
        - name: MYSQL_ROOT_PASSWORD
          value: FjockDaLAq
        - name: TZ
          value: "Asia/Shanghai"
        ports:
          - containerPort: 3306
        imagePullPolicy: IfNotPresent
        volumeMounts:
        - mountPath: /var/lib/mysql
          name: mysql-data
      volumes:
      - name: mysql-data
        persistentVolumeClaim:
          claimName: mysql-poc-zhijian
---
apiVersion: v1
kind: Service
metadata:
  name: mysql
  namespace: zhijian
spec:
  ports:
  - name: http
    port: 3306
    targetPort: 3306
  type: ClusterIP
  selector:
    app: mysql

```