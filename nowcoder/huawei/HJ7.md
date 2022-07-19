## 取近似值

[链接：牛客网](https://www.nowcoder.com/questionTerminal/69ef2267aafd4d52b250a272fd27052c)

## 描述

- 写出一个程序，接受一个正浮点数值，输出该数值的近似整数值。如果小数点后数值大于等于 0.5 ,向上取整；小于 0.5 ，则向下取整。

- 数据范围：保证输入的数字在 32 位浮点数范围内

## 输入描述：
- 输入一个正浮点数值




## 输出描述：
- 输出该数值的近似整数值



## 示例1

```bash
输入：
5.5

输出：
6
说明：
0.5>=0.5，所以5.5需要向上取整为6  

```


 
## 示例2

```bash
输入：
2.499
输出：
2

说明：
0.499<0.5，2.499向下取整为2   
```




## ruby

```ruby 

while (line = STDIN.gets)
    first , last =     line.split("\.")
    if last[0].to_i >= 5
        puts first.to_i + 1
    else
        puts first.to_i
    end
end


```