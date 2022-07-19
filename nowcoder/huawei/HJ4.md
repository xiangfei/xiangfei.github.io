## 字符串分隔

[链接：牛客网](https://www.nowcoder.com/questionTerminal/69ef2267aafd4d52b250a272fd27052c)

## 描述

- 输入一个字符串，请按长度为8拆分每个输入字符串并进行输出；
- 长度不是8整数倍的字符串请在后面补数字0，空字符串不处理。

## 输入描述：
- 连续输入字符串(每个字符串长度小于等于100)

## 输出描述：
- 依次输出所有分割后的长度为8的新字符串



```bash

输入：
abc
输出：
abc00000

```

### ruby

```ruby 
list = []
while (line = STDIN.gets)
    list << line.chomp
end
 
list = list[0].each_char.map do |x| x end

result =  []


while   list.length > 8
   result << list.shift(8).join("") 
    
end

xx  = ""
    
8.times do 
   if  not list.empty?
       
   xx = xx + list.shift
   else
      xx = xx +  "0"
   end  
end

result << xx

puts result


```



```ruby
result = []
while (line = STDIN.gets)
    
    result <<  line.chomp
end

class String
    def to_a
        result = []
        self.each_char do |x|
            result << x
        end
        result
    end
    
    def fillzero
       a =self
       return if a.length == 0
       fill_times =  8 -  self.length
       if  fill_times > 0
           fill_times.times do 
               a = a + "0"
           end
       end
       puts a
    end
end
def cut_arr  array , di_arr = []
     temp_a = []
     if array.empty?
         return di_arr
     end
     if array.length > 8
         8.times do
             temp_a << array.shift
         end
         cut_arr  array , di_arr
     else
         di_arr <<  array
     end
     di_arr << temp_a
     
end

def cut_str   str
    result =  []
    cut_arr str.to_a , result
    result.reverse.each do |a|
        b = a.join("")
        b.fillzero
    end
end
result.each do |s|
    cut_str s
end

```