## 字符串最后一个单词的长度

[链接：牛客网](https://www.nowcoder.com/practice/8c949ea5f36f422594b306a2300315da?tpId=37&tqId=21224&rp=1&ru=/exam/oj/ta&qru=/exam/oj/ta&sourceUrl=%2Fexam%2Foj%2Fta%3FtpId%3D37&difficulty=undefined&judgeStatus=undefined&tags=&title=)

## 描述
- 计算字符串最后一个单词的长度，单词以空格隔开，字符串长度小于5000。（注：字符串末尾不以空格为结尾）
## 输入描述：
- 输入一行，代表要计算的字符串，非空，长度小于5000。

## 输出描述：
- 输出一个整数，表示输入字符串最后一个单词的长度。


## 示例
```bash
输入：hello nowcoder
输出：8
# 最后一个单词为nowcoder，长度为8

```



## ruby

```ruby 
while (line = STDIN.gets)
    #a, b = line.split(" ").map { |x| x.to_i }
    #puts (a + b)
    puts line.split.last.length
end

```