##  大数据运维常见问题


```bash
could only be replicated to 0 nodes instead of minReplication (=1).  There are 1 datanode(s) running and no node(s) are excluded in this operation.


在hdfs-site.xml配置增加内存：

dfs.datanode.max.xcievers：该参数限制了datanode所允许同时执行的发送和接受任务的数量，缺省为256，这里设置为4096

<property>  
                <name>dfs.datanode.max.xcievers</name>  
                <value>4096</value>  
 </property>


```




```bash

org.apache.hadoop.hdfs.server.namenode.EditLogInputException: Error replaying edit log at offset 0.  Expected transaction ID was 3217895


...  namenode options
export HADOOP_NAMENODE_OPTS="-Xms2048M -Xmx2048M -Dhadoop.security.logger=${HADOOP_SECURITY_LOGGER:-INFO,RFAS} -Dhdfs.audit.logger=${HDFS_AUDIT_LOGGER:-INFO,NullAppender} $HADOOP_NAMENODE_OPTS"
```



```bash

namenode 格式化影响

```