# 关于golang by example 学习

- [参考golangbyexample学习](https://golangbyexample.com/variables-in-golang-complete-guide/)
- 自己学习使用，只记录自己的理解。

## 什么是变量
变量是内存位置的名称。该存储位置可以存储任何类型的值。因此，每个变量都有一个相关的类型，它决定了变量的大小和范围，以及在该变量上定义的操作。

## 命名惯例
- 变量名只能以字母或下划线开头。

- 其后可以跟任意数量的字母、数字或下划线

- Go 区分大小写，因此大写字母和小写字母被区别对待。

- 变量名称不能是 Go 中的任何关键字名称

- 变量名的长度没有限制。

- 但最好有最佳长度的变量名。


## 声明变量
在 GO 中，变量是使用var关键字声明的，但是也有其他声明变量的方法，我们将在本教程的后面部分看到。让我们探索声明变量的不同方法

###  无初始值的单变量声明
下面是没有分配初始值的单个变量声明的格式。首先是var关键字，其次是变量名，第三是变量类型。还要注意，当没有提供值时，变量用该类型的默认值初始化，该默认值也称为该类型的零值。在 Go 中int的默认值或零值为零

- var \<var_name\> \<type\>

```golang
package main

import "fmt"

func main() {
    var aaa int
    fmt.Println(aaa)
}

```

> [!TIP]
> - 输出0 , int 默认值为0

### 单变量带初始值声明


- var \<var_name\> \<type\> = \<value\>


```golang
package main

import "fmt"

func main() {
    var aaa int = 8
    fmt.Println(aaa)
}

```



### 多变量无初始值声明

- var \<name1\>, \<name2\>, ..., \<namen\> \<type\>

```golang
package main

import "fmt"

func main() {
    var aaa, bbb int
    fmt.Println(aaa)
    fmt.Println(bbb)
}

```


### 多变量带初始值声明

- var \<name1\>, \<name2\>, ..., \<nameN\> \<type\> = \<value1\>, \<value2\>, ..., \<valueN\>

```golang
package main

import "fmt"

func main() {
    var aaa, bbb int = 8, 9
    fmt.Println(aaa)
    fmt.Println(bbb)
}

```


### 声明不同类型的变量

```golang
package main

import "fmt"

func main() {
    var (
        aaa int
        bbb int    = 8
        ccc string = "a"
    )

    fmt.Println(aaa)
    fmt.Println(bbb)
    fmt.Println(ccc)
}

```

### 无类型或类型推断的变量声明

GO 编译器会根据分配给变量的值计算出类型。所以如果变量有初始值，那么类型可以省略。这也叫类型推断。

- var \<name\> = \<value\>


```golang
package main

import "fmt"

func main() {
    var t = 123      //Type Inferred will be int
    var u = "circle" //Type Inferred will be string
    var v = 5.6      //Type Inferred will be float64
    var w = true     //Type Inferred will be bool
    var x = 'a'      //Type Inferred will be rune
    var y = 3 + 5i   //Type Inferred will be complex128
    var z = sample{name: "test"}  //Type Inferred will be main.Sample

    fmt.Printf("Type: %T Value: %v\n", t, t)
    fmt.Printf("Type: %T Value: %v\n", u, u)
    fmt.Printf("Type: %T Value: %v\n", v, v)
    fmt.Printf("Type: %T Value: %v\n", w, w)
    fmt.Printf("Type: %T Value: %v\n", x, x)
    fmt.Printf("Type: %T Value: %v\n", y, y)
    fmt.Printf("Type: %T Value: %v\n", z, z)
}

type sample struct {
    name string
}

```


### short变量声明

-  \<variable_name\>:= \<value\>

```golang
package main

import "fmt"

func main() {
    t := 123      //Type Inferred will be int
    u := "circle" //Type Inferred will be string
    v := 5.6      //Type Inferred will be float64
    w := true     //Type Inferred will be bool
    x := 'a'      //Type Inferred will be rune
    y := 3 + 5i   //Type Inferred will be complex128
    z := sample{name: "test"}  //Type Inferred will be main.Sample

    fmt.Printf("Type: %T Value: %v\n", t, t)
    fmt.Printf("Type: %T Value: %v\n", u, u)
    fmt.Printf("Type: %T Value: %v\n", v, v)
    fmt.Printf("Type: %T Value: %v\n", w, w)
    fmt.Printf("Type: %T Value: %v\n", x, x)
    fmt.Printf("Type: %T Value: %v\n", y, y)
    fmt.Printf("Type: %T Value: %v\n", z, z)
}

type sample struct {
    name string
}

```

> [!WARNING]
> - :=运算符仅在函数中可用。不允许在函数外使用。
> - 使用:=声明的变量不能使用:=运算符重新声明。所以下面的语句会引发编译器错误“:=左侧没有新的变量”。


```golang
...
a := 8
a := 16  //compile error , 多次声明
...

...
a,b := 1, 2  // ok
...



...
 a, b := 1, 2
 b, c := 3, 4  // ok ,至少有一个变量是新的

...
```



> [!WARNING]
> ### 重要点
> - 未使用的变量将被报告为编译器错误
> - 在内部范围内声明的变量与在外部范围内声明的变量同名，这将隐藏外部范围内的变量
> - 变量一旦用特定类型初始化，以后就不能分配不同类型的值。这对于短手声明是适用的。见下面的例子
> - 在内部范围内声明的变量与在外部范围内声明的变量同名，这将隐藏外部范围内的变量
>   - 外部变量在函数内部被覆盖 
> - 变量表达式–虽然声明变量也可以被赋予表达式或函数调用
> - 变量一旦用特定类型初始化，以后就不能分配不同类型的值

```golang
 package main

func main() {
    var a = 1   //未使用的变量将被报告为编译器错误
}
 ```

```golang
package main

import "fmt"

var a = 123

func main() {
    var a = 456
    fmt.Println(a)  //123 在内部范围内声明的变量与在外部范围内声明的变量同名，这将隐藏外部范围内的变量
}

```



```golang

package main
import (
    "fmt"
    "math"
)
func main() {
    a := 5 + 3  // 变量表达式–虽然声明变量也可以被赋予表达式或函数调用
    b := math.Max(4, 5)
    fmt.Println(a)
    fmt.Println(b)
}
// outpu 8 , 4

```


```golang

package main

func main() {
    var aaa int = 1
    aaa = "atest"

    bbb := 1
    bbb = "btest"
}

// output

// cannot use "atest" (type untyped string) as type int in assignment
// cannot use "btest" (type untyped string) as type int in assignment
```


## 变量范围(局部和全局变量)

变量声明可以在包级、函数级或块级完成。变量的范围定义了该变量可访问的位置以及变量的寿命。Golang 变量可以根据范围分为两类

- 局部变量

- 全局变量


### 局部变量

- 局部变量是在块或函数级中定义的变量

- 块的一个例子是 for 循环或 range 循环等。

- 这些变量只能从它们的块或函数中访问

- 这些变量只存在到声明它们的块或函数的末尾。之后就是垃圾回收。



```golang

package main

import "fmt"

func main() {
    var aaa = "test"
    fmt.Println(aaa)
    for i := 0; i < 3; i++ {
        fmt.Println(i)
    }
    fmt.Println(i)
}

func testLocal() {
    fmt.Println(aaa)
}

// output
// undefined: i
// undefined: aaa  -> scope method
```



### 全局变量
- 如果变量在任何函数或块范围之外的文件顶部声明，那么它在包中就是全局变量。

- 如果这个变量名以小写字母开头，那么可以从包含这个变量定义的包中访问它。

- 如果变量名以大写字母统计，那么可以从不同的包外部访问它，而不是从声明它的包外部。

- 全局变量在程序的整个生命周期中都是可用的



```golang
package main

import "fmt"

var aaa = "test"

func main() {
    testGlobal()
}

func testGlobal() {
    fmt.Println(aaa)
}

//output test

```