## 数据导出导入
 

### 安装 elasticdump


```bash
yum install npm
npm install elasticdump  -g


```



### 导出数据


```bash
time="2022.06.16"
elasticdump --input=http://elastic:elastic@172.21.187.32:9200/k8s-logs-$time  --output=k8s-$time.json  --typedata

```

> [!TIP]
> - k8s-logs-$time index name

### 导入数据

```bash
time="2022.06.16"
elasticdump --input=k8s-$time.json   --output=http://elastic:elastic@172.21.187.32:9200/k8s-logs-$time  --typedata

```