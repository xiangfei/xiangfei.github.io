##  提取不重复的整数

[链接：牛客网](https://www.nowcoder.com/questionTerminal/69ef2267aafd4d52b250a272fd27052c)

## 描述

- 输入一个 int 型整数，按照从右向左的阅读顺序，返回一个不含重复数字的新的整数。
- 保证输入的整数最后一位不是 0 。
- 数据范围： 1 <=n <= 10 ** 8 
  

## 输入描述：
- 输入一个int型整数




## 输出描述：
- 按照从右向左的阅读顺序，返回一个不含重复数字的新的整数



## 示例

```bash
输入： 9876673

输出： 37689

```

## ruby

```ruby 

class  String
    def to_a
        self.each_char.select do |x|  x end
    end
end
while (line = STDIN.gets)
    line = line.chomp
    a = line.to_a.reverse
    puts a.uniq.join("")
end




```