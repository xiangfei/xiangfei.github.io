---
title: Ruby 注释
date: 2019-08-23 17:26:52
tags: ruby
author: 相飞
comments:
- true
categories:
- ruby
---

### Ruby 注释
注释是在运行时会被忽略的 Ruby 代码内的注释行。单行注释以 # 字符开始，直到该行结束，如下所示：
#### Ruby 单行注解
实例
```
#!/usr/bin/ruby -w
 
# 这是一个单行注释。
 
puts "Hello, Ruby!"
```
{% spoiler 以上实例输出结果为： %}
> Hello, Ruby!
{%endspoiler%}
#### Ruby 多行注释
您可以使用 =begin 和 =end 语法注释多行，如下所示：

实例
```
#!/usr/bin/ruby -w
 
puts "Hello, Ruby!"
 
=begin
这是一个多行注释。
可扩展至任意数量的行。
但 =begin 和 =end 只能出现在第一行和最后一行。 
=end
```
{% spoiler 以上实例输出结果为： %}
Hello, Ruby!
{%endspoiler%}
请确保尾部的注释离代码有足够的距离，以便容易区分注释和代码。如果尾部超过一条注释，请将它们对齐。例如：

实例
```
@counter      # 跟踪页面被点击的次数
@siteCounter  # 跟踪所有页面被点击的次数
```
