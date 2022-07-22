## k8s secrets 

[参考](https://www.jianshu.com/p/0bc73854a006)

### Opaque：
- base64 编码格式的 Secret，用来存储密码、密钥等；但数据也可以通过base64 –decode解码得到原始数据，所以加密性很弱


```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
data:
  username: YWRtaW4=  
  password: YWRtaW4zMjE=

```

> [!TIP]
> - 数据base64 加密

### kubernetes.io/dockerconfigjson

- 用来存储私有docker registry的认证信息


```bash
kubectl create secret docker-registry myregistry --docker-server=10.8.13.85 --docker-username=admin --docker-password=Harbor123 --docker-email=qienda@chinanews.com.cn


```

### kubernetes.io/service-account-token
- 用于被serviceaccount引用，serviceaccout 创建时Kubernetes会默认创建对应的secret。Pod如果使用了serviceaccount，对应的secret会自动挂载到Pod目录/run/secrets/kubernetes.io/serviceaccount中。
