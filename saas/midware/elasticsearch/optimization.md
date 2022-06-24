## index 优化

[参考](http://t.zoukankan.com/fat-girl-spring-p-14429356.html)

### 设置刷新时间( > 30s)


```bash

curl -XPUT 'http://localhost:9200/_all/_settings?preserve_existing=true' -d '{
  "index.cache.field.type" : "soft",
  "index.merge.scheduler.max_thread_count" : "1",
  "index.number_of_replicas" : "0",
  "index.number_of_shards" : "7",
  "index.refresh_interval" : "45s",
  "index.translog.durability" : "async",
  "index.translog.durability:asyncindex.translog.sync_interval" : "120s",
  "index.translog.flush_threshold_ops" : "500000",
  "index.translog.flush_threshold_size" : "600mb"
}'

```



### 其他

```bash

indices.memory.index_buffer_size: 20%
#同时读取数据文件流线程
indices.recovery.max_concurrent_operations: 2
#indices.store.throttle.type: merge
cluster.routing.allocation.node_initial_primaries_recoveries: 2
# 同时recovery并发数
cluster.routing.allocation.node_concurrent_recoveries: 2




# 搜索线程池大小
thread_pool.search.size: 2
# 队列大小
thread_pool.search.queue_size: 1000
# 取数据线程池大小
thread_pool.get.size: 2
# 队列大小
thread_pool.get.queue_size: 1000

thread_pool.write.queue_size: 1000

```