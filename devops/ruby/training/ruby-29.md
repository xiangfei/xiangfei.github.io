---
title: ruby  agent 内存增长
date: 2020-04-16 15:24:49
tags: ruby
author: 相飞
comments:
- true
categories:
- ruby

---



#### ruby collect 内存一直增加

reason ruby 申请的内存不会释放,需要自己去解决


- 代码启动过高的线程
- 代码可能导致内存泄露


解决方式

1.  god  killer 

2. 线程换成进程处理


```ruby
require 'timeout'

servers.each do |server|
    pid = fork do
        puts "Forking #{server}."
        output = "doing stuff here"
        puts output
    end

    begin
        Timeout.timeout(20) do
            Process.wait
        end
    rescue Timeout::Error
        Process.kill 9, pid
        # collect status so it doesn't stick around as zombie process
        Process.wait pid
    end
    puts "#{server} child exited, pid = #{pid}"
end

```








