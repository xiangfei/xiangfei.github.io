

# Kubernetes 开发参考文档  

## Kubernetes  API 接口文档  

[https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.10/](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.10/)  

v1.10 为 Kubernetes 版本号，不同版本号的 API 接口可能有所不同，具体实现参照当前 Kubernetes 平台版本。  

## kubernetes-client  python 参考实现  

[https://github.com/kubernetes-client/python](https://github.com/kubernetes-client/python)  

# Kubernetes 对接自动化运维平台一期功能愿望清单  

## 自动化运维平台（Kubernetes 功能点）——初稿  [XMIND地址](/images/platform-feature.xmind)

![](/images/platform-feature.png)  


#### python demo

```python
from kubernetes import client, config

#这边载入包含授权信息的 config 文件
config.load_kube_config(config_file="/Users/shenlx/.kube/config")

v1 = client.CoreV1Api()

t=v1.list_namespaced_pod(namespace="default")
pods_all_namespaces = v1.list_pod_for_all_namespaces(watch=False)
deployments_all_namespaces = client.ExtensionsV1beta1DeploymentCondition
print("------------kubectl get pods --all-namespaces------------")
for i in t.items:
#for i in pods_all_namespaces.items:
    print(i.status.host_ip , i.status.pod_ip, i.metadata.namespace, i.metadata.name,i.status.phase)
'''
namespace_all=v1.list_namespace()
print("------------kubectl get namespaces------------")
for i in namespace_all.items:
    print(i.metadata.name)
'''

```

#### yaml examples


```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: demo-config
  namespace: demo-namespaces
data:
  LOG_LEVEL: debug
  AUTH_MODE: db_auth


apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: demo
  namespace: demo-namespaces
  labels:
    name: demo
spec:
  replicas: 1
  template:
    metadata:
      labels:
        name: demo
    spec:
      imagePullSecrets:
      - name: registry-docker.jcgroup.key
      nodeSelector:
        nodetype: node-demo
      containers:
      - name: demo
        resources:
          limits:
            cpu: 200m
            memory: 512Mi
          requests:
            cpu: 100m
            memory: 256Mi
        image: registry-docker.jcgroup.com.cn/jcgroup/demo.1.0.0
        imagePullPolicy: IfNotPresent
        env:
          - name: LOG_LEVEL
            valueFrom:
              configMapKeyRef:
                name: demo-config
                key: LOG_LEVEL
        ports:
        - containerPort: 80
          name: local-port
          protocol: TCP
        volumeMounts:
        - name: config
          mountPath: /etc/demo/
        - name: logs
          mountPath: /var/log/demo
      volumes:
      - name: config
        configMap:
          name: demo-config
          items:
          - key: file.name
            path: file.path
      - name: logs
        persistentVolumeClaim:
          claimName: log-pvc 


apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: demo.examples.com
  namespace: demo-namespaces
  annotations:
    kubernetes.io/ingress.class: "nginx"
    ingress.kubernetes.io/ssl-passthrough: "false"
    ingress.kubernetes.io/ssl-redirect: "false"
    ingress.kubernetes.io/secure-backends: "false"  #"if true, use https backends else use http backends"
  labels:
    app: demo.examples.com
spec:
  tls:
  - hosts:
    - demo.examples.com
    secretName: examples.com.key
  rules:
  - host: demo.examples.com
    http:
      paths:
      - path: /
        backend:
          serviceName: demo
          servicePort: 80



apiVersion: v1
data:
  .dockercfg: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
kind: Secret
metadata:
  name: registry-docker.jcgroup.key
  namespace: demo-namespaces
type: kubernetes.io/dockercfg
#kubectl create secret docker-registry registry-docker.jcgroup.key --docker-server=registry-docker.jcgroup.com.cn --docker-username=yourusername --docker-password=yourpassword --docker-email=youremail@jcgroup.com.cn --namespace=demo-namespaces

---
apiVersion: v1
data:
  tls.crt: XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  tls.key: XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
kind: Secret
metadata:
  name: examples.com.key
  namespace: demo-namespaces
type: kubernetes.io/tls

#kubectl create secret tls  examples.com.key --key demo.key --cert demo.crt --namespace=demo-namespaces



apiVersion: v1
kind: Service
metadata:
  name: demo
  namespace: demo-namespaces
  labels:
    app: demo
    kubernetes.io/cluster-service: "true"
    kubernetes.io/name: "demo"
spec:
  selector:
    app: demo
  ports:
  - name: local-port
    port: 80
    protocol: TCP
    targetPort: 80
    nodePort: 32000
  clusterIP: 172.17.200.200
  type: NodePort



apiVersion: v1
kind: PersistentVolume
metadata:
  name: demo-pv
  labels:
    type: log
spec:
  capacity:
    storage: 5Gi
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  nfs:
    server: 10.0.34.23
    path: /data/nfs/Harbor/logs

apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: demo-pvc
  namespace: demo-namespaces
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi
  selector:
    matchLabels:
      type: log


```

####  docker file


```docker
FROM registry-docker.jcgroup.com.cn/public/centos:jdk1.8.0_171
MAINTAINER jcgroup
ENV TZ Asia/Shanghai
ADD start.sh /home/jcy/start.sh
RUN chmod +x /home/jcy/start.sh && \
    chown -R jcy.jcy /home/jcy/start.sh
ADD app/web/service/target/*.jar /home/jcy/
ENTRYPOINT ["su","-","jcy","-c","/home/jcy/start.sh"]FROM registry-docker.jcgroup.com.cn/public/centos:jdk1.8.0_171
MAINTAINER jcgroup
ENV TZ Asia/Shanghai
ADD start.sh /home/jcy/start.sh
RUN chmod +x /home/jcy/start.sh && \
    chown -R jcy.jcy /home/jcy/start.sh
ADD app/web/service/target/*.jar /home/jcy/
ENTRYPOINT ["su","-","jcy","-c","/home/jcy/start.sh"]

#!/bin/bash
/usr/local/java/bin/java -jar -Xms512m -Xmx1024m  /home/jcy/*.jar
```
