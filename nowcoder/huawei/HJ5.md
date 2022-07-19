## 进制转换

[链接：牛客网](https://www.nowcoder.com/questionTerminal/69ef2267aafd4d52b250a272fd27052c)

## 描述

- 写出一个程序，接受一个十六进制的数，输出该数值的十进制表示。
- 数据范围：保证结果在 1 <=n  <= 2 ** 31 - 1 

## 输入描述：
- 输入一个十六进制的数值字符串。


## 输出描述：
- 输出该数值的十进制字符串。不同组的测试用例用\n隔开。




```bash
输入：
0xAA
输出：
170


```

### ruby

```ruby 

list = []
while (line = STDIN.gets)
    list << line.chomp
end

puts eval(list[0])


```



```ruby
result = []
while (line = STDIN.gets)
    result << line.chomp
end


def  str_to_number str
    str.each do |s|
    puts eval(s)
    end
rescue
    puts 0
    
end


str_to_number  result


```