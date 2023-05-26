##  k8s fluentd 常见问题


### 发送消息提示retry many times

- 调整 retry times，修改timeout时间

  -  request_timeout    60s


```bash
    <match **>
      @id elasticsearch
      @type elasticsearch
      @log_level info
      include_tag_key true
      hosts 10.0.20.208:9200,10.0.20.209:9200,10.0.20.210:9200
      logstash_format true
      logstash_prefix k8s-logs  # 设置 index 前缀为 k8s
      request_timeout    60s
      reload_connections false
      reconnect_on_error false
      reload_on_failure false
      <buffer>
        @type file
        path /var/log/fluentd-buffers/kubernetes.system.fluent.buffer
        flush_mode interval
        retry_type exponential_backoff
        flush_thread_count 2
        flush_interval 5s
        #retry_forever
        retry_timeout 15
        retry_max_times  3
        retry_max_interval 15
        chunk_limit_size 2048M
        queue_limit_length 8
        overflow_action drop_oldest_chunk
      </buffer>
    </match>

```

### 发送消息提示 buffer flush took longer time than slow_flush_log_threshold

- 

