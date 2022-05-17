

## rails c 一直卡着 , rails server 可以启动

> [!TIP]
> - rails spring 进程导致，kill 即可

```
root@autotest:/service/automationtesting-agent# spring  stop
Spring stopped.
root@autotest:/service/automationtesting-agent# rails c
Running via Spring preloader in process 17051
Loading development environment (Rails 5.2.3)


```


## puma 内存过高


> [!TIP]
> - puma 操作系统内存占用, 但会复用已经申请过的内存. 所以会随着每分钟请求量的增加导致内存不断上升. 如果超出某个极限, 则有可能导致内存爆掉


### 解决方法

- 手动kill  worker

> 手动kill puma会自动重启

- puma worker killer


```ruby 
before_fork do
  require 'puma_worker_killer'

  PumaWorkerKiller.start
end

# 设置内存使用

PumaWorkerKiller.config do |config|
  config.ram           = 1024 # mb
  config.frequency     = 5    # seconds
  config.percent_usage = 0.98
  config.rolling_restart_frequency = 12 * 3600 # 12 hours in seconds, or 12.hours if using Rails
  config.reaper_status_logs = true # setting this to false will not log lines like:
  # PumaWorkerKiller: Consuming 54.34765625 mb with master and 2 workers.

  config.pre_term = -> (worker) { puts "Worker #{worker.inspect} being killed" }
end
PumaWorkerKiller.start


```

