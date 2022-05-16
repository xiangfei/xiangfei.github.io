---
title: karafka  客户端假死
date: 2020-04-09 15:58:47
author: 相飞
comments:
- true
categories:
- karafka

---



#### 现象

客户端处理,突然member 下线


#### 原因

代码问题batch处理queue过多, 单条处理时间长, 被踢下线

#### 解决方式

- 优化代码



```ruby


```


