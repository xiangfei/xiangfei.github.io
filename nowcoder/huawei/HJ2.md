## 计算某字符出现次数

[链接：牛客网](https://www.nowcoder.com/practice/a35ce98431874e3a820dbe4b2d0508b1?tpId=37&tqId=21225&rp=1&ru=/exam/oj/ta&qru=/exam/oj/ta&sourceUrl=%2Fexam%2Foj%2Fta%3FtpId%3D37&difficulty=undefined&judgeStatus=undefined&tags=&title=)


## 描述

- 写出一个程序，接受一个由字母、数字和空格组成的字符串，和一个字符，然后输出输入字符串中该字符的出现次数。（不区分大小写字母）
- 数据范围： 1 <= n  <=1000   

## 输入描述：
- 第一行输入一个由字母和数字以及空格组成的字符串，第二行输入一个字符。

## 输出描述：
- 输出输入字符串中含有该字符的个数。（不区分大小写字母）


## 示例
```bash
输入：
ABCabc
A

输出：
2
```




### ruby

```ruby 

array =  []
while (line = STDIN.gets)
    # a, b = line.split(" ").map { |x| x.to_i }
    array << line
end

str= array[0]
char =  array[1].chomp

res = 0

str.each_char do |c|
   res = res  + 1 if c.downcase  == char.downcase    
       
end
puts res


```