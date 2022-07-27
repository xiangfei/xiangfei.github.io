# 关于golang by example 学习

- [参考golangbyexample学习](https://golangbyexample.com/packages-modules-go-first/)
- 自己学习使用，只记录自己的理解。

## 概述

包是 GO 中代码复用的一种方式。顾名思义，它是将相关代码分组的一种方式。Go modules 是 golang 中处理依赖关系的一种方式。

每个 GO 源文件(。go 文件)中的一个 GO 应用文件属于一个包。这就是为什么每个。go 文件以开始

```golang
package

```

以上称为套餐声明。请注意这个术语，因为它将在本教程中使用。

所有的  .go 文件将属于同一包。关于包的一个很大的误解是包是包含的目录的名称。转到文件。这是不对的。目录只是一个目录，包的名称就是包声明中的内容。那么目录名的重要性是什么？我们将在教程中进行解释。

包可以有两种类型。

- 可执行包
  - 只有main是 GoLang 中的可执行包。 .go 文件可能属于特定目录中的主包。我们将在后面看到这个目录的名称或.go文件名要紧。主包将包含一个表示程序开始的main()函数。在安装主软件包时，它将在 $GOBIN 目录中创建一个可执行文件。

- 实用包
  - 除了主包以外的任何包都是实用包。它不是可自我执行的。它只包含实用函数和其他可由可执行包使用的实用东西。


## 模块



模块是对依赖管理的 go 支持。根据定义，模块是相关包的集合，其根是go.mod, go.mod文件定义了

- 模块导入路径。

- 成功构建的模块的依赖要求。它定义了两个项目的依赖需求，并将它们锁定到正确的版本

将模块视为包含包集合的目录。包也可以嵌套。模块提供

- 依赖性管理

- 有了模块，项目不一定非要放在 $GOPATH/src 文件夹中。

除了`go.mod`文件外，go 还保存了一个`go.sum`文件，该文件包含项目所有相关模块的加密散列。这是为了验证项目的相关模块没有被更改。



有了go.mod和go.sum文件，我们能够安装一个精确版本的依赖关系，而不会破坏任何东西。在本教程的开头，我们已经对这些文件做了简单的介绍。在教程的后面，我们将详细了解它

所有的依赖项都会下载到 $GOPATH/pkg/mod 目录下，并进行版本控制
因此，如果你下载同一个库的不同版本，那么两者将被下载到 GOPATH/pkg/mod** 内的不同目录中，而不会相互覆盖。 **GOPATH/pkg/mod∗∗内的不同目录中，而不会相互覆盖。∗∗GOPATH/pkg/mod 里面会有两样东西


1. 缓存
  - 这是一个文件夹，所有依赖项都将随压缩代码一起下载
2. 所有下载依赖项的压缩代码将从缓存目录中复制过来。

此外，还引入了名为GO111MODULE的新环境

- 当 GO111MODULE=off 时，go get 将按照旧的方式运行

- 当 GO111MODULE=on 时，那么 go get 将以一种新的方式运行
  - 所有模块都将下载到带有版本控制的 $GOPATH/pkg/mod/cache 文件夹中


## 理解包并创建模块



```golang
go mod init code.ii-ai.tech/devops

```

> 生成go.mod & go.sum 文件

`go.mod`

它是模块依赖文件。它会有三样东西

- 顶部模块的导入路径

- 创建模块时使用的 go 版本

- 模块的直接依赖关系。



`go.sum`

该文件列出了版本所需的直接和间接依赖的校验和。需要提到的是go.mod 文件对于成功的构建已经足够了 go.sum文件中的校验和用于验证每个直接和间接依赖项的校验和。

现在的问题是什么是导入 _ 路径。import_path是任何其他模块用来导入您的模块的前缀路径。我们将在教程的第二部分了解更多关于导入路径的信息。

转到$GOPATH/src 文件夹之外的任何目录。假设目录名为学习。


### 创建引用包

- go mod init  code.ii-ai.tech/devops

```bash

cd devops
mkdir  math

```

- devops/math/match.go

```golang

package math

func Add(a, b int) int {
    return a + b
}

func Subtract(a, b int) int {
    return a - b
}

```

- main.go


```golang

package main

import (
    "fmt"
    "code.ii-ai.tech/math"
)

func main() {
    fmt.Println(math.Add(2, 1))
    fmt.Println(math.Subtract(2, 1))
}

```

### 可以被调用/不能被调用的名字


- golang 没有public private  protected 关键字
  - 大写字母开头,可以被外部调用,
  - 小写字母开头, 私有 


`结构体` `结构体方法` `结构体属性` `方法` `变量` 可以被外部调用




### 嵌套包

在 GO 中，可以创建嵌套包。让我们在数学目录中创建一个名为高级的新目录。。该目录将包含方块。转到文件，该文件将打包声明为打包高级


- devops/math/advanced/advanced.go

```golang

package advanced

func Square(a int) int {
    return a * a
}

```


- main.go


```golang

package main

import (
    "fmt"
    "code.ii-ai.tech/math"
    "code.ii-ai.tech/math/advanced"

)

func main() {
    fmt.Println(math.Add(2, 1))
    fmt.Println(math.Subtract(2, 1))
    fmt.Println(advanced.Square(2))

}

```



### 包名相同

- 通过声明别名的方式处理


- devops/advanced/advanced.go

```golang

package advanced

func Square(a int) int {
    return a * a
}

```

- main.go 

```golang
package main

import (
    "fmt"
    "code.ii-ai.tech/math/advanced"
    ad2 "code.ii-ai.tech/advanced"

)

func main() {
    fmt.Println(advanced.Square(2))
    fmt.Println(ad2.Square(2))

}


```


### 导入包中有 _


```golang
import _ "github.com/go-sql-driver/mysql"

```

- 调用  package init() 方法
  -  init()方法在包被引入时执行


### 引用第三方github 包

- 下载第三方包

```bash

export GO111MODULE=on
go get github.com/pborman/uuid 

root@golang-ide-ubuntu:~/devops# cat go.mod 
module sample.com/devops

go 1.17

require (
        github.com/google/uuid v1.0.0 // indirect
        github.com/pborman/uuid v1.2.1 // indirect
)

```

- main.go

```golang
package main

import (
        "fmt"
        "strings"

        "github.com/pborman/uuid"
)

func main() {
        uuidWithHyphen := uuid.NewRandom()
        uuid := strings.Replace(uuidWithHyphen.String(), "-", "", -1)
        fmt.Println(uuid)
        fmt.Println("Hello World")
}


```


### go mod tidy

该命令将下载源文件中所需的所有依赖项，并用该依赖项更新go.mod文件。运行此命令后，现在让我们再次检查go.mod文件的内容。养猫go.mod


### go mod vendor

它将在您的项目目录中创建一个vendor。您也可以将供应商目录签入您的 VCS(版本控制系统)。这在某种意义上变得很有用，因为不需要在运行时下载任何依赖项，因为它已经存在于签入 VCS 的供应商文件夹中

