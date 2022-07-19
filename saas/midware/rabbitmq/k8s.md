
## k8s 单节点部署



```yaml

apiVersion: v1
kind: PersistentVolume
metadata:
  name: rabbitmq-poc-zhijian
spec:
  capacity:
    storage: 200Gi
  accessModes:
    - ReadWriteMany
  nfs:
    server: 10.4.1.1
    path: /sata/nfs/poc/zhijian/rabbitmq
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: rabbitmq-poc-zhijian
  namespace: zhijian
spec:
  accessModes:
    - ReadWriteMany
  volumeName: rabbitmq-poc-zhijian
  resources:
    requests:
      storage: 200Gi


---


apiVersion: apps/v1
kind: Deployment
metadata:
  name: rabbitmq
  labels:
    app: rabbitmq
  namespace: zhijian
spec:
  replicas: 1
  selector:
    matchLabels:
      app: rabbitmq
  template:
    metadata:
      labels:
        app: rabbitmq
    spec:
      containers:
      - name: rabbitmq
        image: rabbitmq:3.7.15
        imagePullPolicy: IfNotPresent
        ports:
          - containerPort: 5672
        env:
        - name: RABBITMQ_DEFAULT_VHOST
          value: rabbitmq
        - name: RABBITMQ_DEFAULT_USER
          value: admin
        - name: RABBITMQ_DEFAULT_PASS
          value: Iindeed1008
        volumeMounts:
        - mountPath: /var/lib/rabbitmq
          name: rabbitmq-data
      volumes:
      - name: rabbitmq-data
        persistentVolumeClaim:
          claimName: rabbitmq-poc-zhijian
---
apiVersion: v1
kind: Service
metadata:
  name: rabbitmq
  namespace: zhijian
spec:
  ports:
  - name: http
    port: 5672
    targetPort: 5672
  type: ClusterIP
  selector:
    app: rabbitmq

```