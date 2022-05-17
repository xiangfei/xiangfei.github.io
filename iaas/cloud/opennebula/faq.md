

## 磁盘io 限速

- 创建虚拟机模板选择disk iops

## 资源overcommit

- sunstone 直接调整cpu memory 比例


## windows虚拟机性能cpu上不去


```xml
<!-- template add raw data  -->

<cpu mode='host-model'>
 <model fallback='forbid'/>
 <topology sockets='1' cores='6' threads='1'/>
</cpu>
```