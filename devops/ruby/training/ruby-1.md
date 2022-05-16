---
title: ruby 第一个程序
date: 2019-05-22 15:17:58
tags: ruby
author: 相飞
comments:
- true
categories:
- ruby

---

### 交互式ruby
- irb

```
[root@autotest-ruby-agent ~]# irb
2.4.5 :001 > 
```
- 最简单的ruby程序

```
2.4.5 :001 > puts "hello world"
hello world
 => nil 
2.4.5 :002 > 
```

- 函数

```
2.4.5 :002 > def s 
2.4.5 :003?>   return "ssss"
2.4.5 :004?>   end
 => :s 
2.4.5 :005 > puts s
ssss
 => nil 
```

- 离开 irb

```
2.4.5 :006 > exit
[root@autotest-ruby-agent ~]# 

```

### 命令行执行

```
ruby hello_world.rb
```
