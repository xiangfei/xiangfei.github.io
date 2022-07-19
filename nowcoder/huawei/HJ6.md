##  质数因子

[链接：牛客网](https://www.nowcoder.com/questionTerminal/69ef2267aafd4d52b250a272fd27052c)

## 描述

- 输入一个正整数，按照从小到大的顺序输出它的所有质因子（重复的也要列举）（如180的质因子为2 2 3 3 5 ）

- 数据范围： 1  <= n <= 2 * 10 ** 9  + 14 

## 输入描述：
- 输入一个整数


## 输出描述：
- 按照从小到大的顺序输出它的所有质数的因子，以空格隔开。

## 示例

```bash
输入：
180
输出：
2 2 3 3 5

```

### ruby

```ruby 

list = []
while (line = STDIN.gets)
    list << line.chomp
end
 

arr =  list[1].split(" ").map do |x| x.to_i end

# puts arr
index_array =  list[0].split(" ").map do |x| x.to_i end

index = index_array[1] - 1
sort_arr =  arr.sort!

final_array = sort_arr[0..index]

puts  final_array.join(" ")


```