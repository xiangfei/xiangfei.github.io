## k8s 单节点安装



```yaml

apiVersion: v1
kind: PersistentVolume
metadata:
  name: consul-poc-zhijian
spec:
  capacity:
    storage: 20Gi
  accessModes:
    - ReadWriteMany
  nfs:
    server: 10.4.1.1
    path: /sata/nfs/poc/zhijian/consul
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: consul-poc-zhijian
  namespace: zhijian
spec:
  accessModes:
    - ReadWriteMany
  volumeName: consul-poc-zhijian
  resources:
    requests:
      storage: 20Gi

---

apiVersion: apps/v1
kind: Deployment
metadata:
  name: consul
  labels:
    app: consul
  namespace: zhijian
spec:
  replicas: 1
  selector:
    matchLabels:
      app: consul
  template:
    metadata:
      labels:
        app: consul
    spec:
      containers:
      - name: consul
        image: consul:1.5.2
        #command: ["consul","agent","-server"   ,"-bootstrap","-data-dir","/consul","-ui","-bind","127.0.0.1","-client","0.0.0.0"  , "-bootstrap-expect=1"]
        command: ["consul" , "agent" ,  "-server" , "-bootstrap" , "-data-dir" , "/consul" ,  "-ui"  , "-bind" , "0.0.0.0"  , "-client" , "0.0.0.0" , "-bootstrap-expect" ,"1"]
        imagePullPolicy: IfNotPresent
        volumeMounts:
        - mountPath: /consul
          name: consul-data
      volumes:
      - name: consul-data
        persistentVolumeClaim:
          claimName: consul-poc-zhijian
---
apiVersion: v1
kind: Service
metadata:
  name: consul
  namespace: zhijian
spec:
  ports:
  - name: http
    port: 8500
    targetPort: 8500
  type: ClusterIP
  selector:
    app: consul

```

> [!WARNING]
> - 需要在nfs机器上手动创建目录