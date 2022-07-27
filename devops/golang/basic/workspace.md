# 关于golang by example 学习

- [参考golangbyexample学习](https://golangbyexample.com/workspace-hello-world-golang/)
- 自己学习使用，只记录自己的理解。

## GOROOT

这是您的 Golang 软件开发工具包的位置。GO 二进制分发假设这个位置对于 Linux/MAC 平台是/usr/local/go，对于 Windows 是 c:\Go。但是 GO SDK 也可以安装在自定义位置。如果它安装在自定义位置，那么 GOROOT 应该指向该目录。只有在将 GO 安装到自定义位置或想要维护不同版本的 GO 时，才应该设置 GOROOT



```bash
export GOROOT=/root/go
export PATH=$PATH:$GOROOT/bin

```

##  GOPATH


关于GOPATH的讨论将围绕您是使用 1.13 版本还是更低版本展开。在 1.13 版本中，GO 引入了一个新的依赖管理特性，称为 GO 模块。让我们首先了解GOPATH的遗留行为，然后我们将讨论 1.13 版本后GOPATH发生了什么变化。

### GO 版本 1.13 之前



goPATH env 变量用于解析 GO 导入语句，它还指定了 GO 工作区的位置。它是 GO 工作空间的根。如果依赖项不在GOPATH中，则无法导入。因此早期版本要求你所有的源代码都在GOPATH里面。所以基本上GOPATH用于

- 解决进口问题。如果依赖项不在GOPATH中，则无法导入。因此，它仍然要求您的代码在GOPATH中

- 软件包安装在目录end-inline-katex-->GOPATH/pkg/GOOS_GOARCH 中。

- 将编译后的应用二进制存储在GOPATH/bin 中(这可以通过将GOPATH/bin中(这可以通过将GOBIN 设置为不同的路径来覆盖)

它包含以下文件夹

- src：

  - 源文件位置。它包含。go 和其他源文件
  - 使用go get安装任何依赖包时，所有包文件都存储在此位置。
- pkg：
  - 存储 src 中实际源代码的编译输出。目录。它包含。文件
  - 基本上，它包含从 src/目录编译的 GO 包。然后在链接时使用它们来创建二进制可执行文件，然后将它们放入 bin/目录中。
  - 一次编译一个包并使用它来创建不同的二进制可执行文件是一个好主意。
  - 每对操作系统和体系结构在 pkg 中都有自己的子目录。(例如:pkg/GOOS_GOARCH)
- bin:
  - Go 构建的可执行文件的位置 

### GO 版本 1.13 之后


在 1.13 版本中， GO 公布了一个名为 GO 模块的依赖管理新特性。我们将在接下来的教程中了解这个特性。现在，您可以想象，有了新功能，Go 不需要将所有 GO 代码放在 GO 工作区或$GOAPTH/src 目录中。您可以在任何地方创建目录，并将您的 Go 程序放在那里。请注意，GOPATH 的所有遗留行为对于版本 1.1.3 和更高版本仍然有效。还要注意的是，有了这个新的 GO 模块功能，GO 程序可以通过两种方式运行。

使用模块：使用模块时，GOPATH不用于解析导入。然而，当使用模块运行 GO 程序时，GOPATH 将用于

将下载源代码存储在$GOPATH/pkg/mod 目录中。
将编译后的应用二进制存储在GOPATH/bin 中(这可以通过将GOPATH/bin中(这可以通过将GOBIN 设置为不同的路径来覆盖)
不使用模块:即使是 1.13 或更高版本，仍然可以用传统方式运行 GO 程序。当运行 GO 程序时不使用模块时，$GOPATH 行为与前面提到的相同的早期版本相同

`设置GOPATH`

如果该环境变量未设置，它在 Unix 系统上默认为$HOME/go，在 Windows 系统上默认为%USERPROFILE%\go。 如果您的工作区位置是\~/Desktop/go, 则在下面输入\~/$HOME/.profile文件。最好始终将GOPATH设置为GOPATH即使引入了模块也能使用



`GOBIN`


GOBIN env 变量指定构建主包后 go 将放置编译后的应用二进制文件的目录。如果没有设置GOPATH环境变量，默认为$GOPATH/bin或$HOME/go/bin。另外，将GOBIN路径添加到PATH env 也是一个好主意，这样安装的二进制文件就可以在不指定二进制文件完整路径的情况下运行。在\~/$HOME/.profile文件中设置GOBIN，并将其添加到路径中。



## Run Hello World

###  workspace

- devops 文件夹

```bash
mkdir devops
cd devops
go mod init sample.com/devops

```
- go.mod 

```bash
root@golang-ide-ubuntu:~/devops# cat go.mod 
module sample.com/devops

go 1.17

```

- main.go 


```bash
root@golang-ide-ubuntu:~/devops# cat main.go 
package main

import "fmt"

func main() {
        fmt.Println("Hello World")
}

```


###  go install

它将编译程序并将二进制文件放在$GOBIN文件夹中。在下面输入命令，确保你在包含hello.go文件的hello目录中。


### go build

它将编译程序并将二进制文件放在当前工作目录中



### go run main.go 

这个命令将编译然后执行二进制文件。键入以下命令。


### demo output

```bash
root@golang-ide-ubuntu:~/devops# go build main.go 
root@golang-ide-ubuntu:~/devops# ll
total 1744
drwxr-xr-x  2 root root      47 Jul 26 15:25 ./
drwx------ 14 root root    4096 Jul 26 15:19 ../
-rw-r--r--  1 root root      34 Jul 26 15:18 go.mod
-rwxr-xr-x  1 root root 1766406 Jul 26 15:25 main*
-rw-r--r--  1 root root      72 Jul 26 15:19 main.go
root@golang-ide-ubuntu:~/devops# go run main.go 
Hello World
root@golang-ide-ubuntu:~/devops# 
```

> [!WARNING]
> - go install -> 类似mvn install  安装
> - go build -> mvn package 编译
> - go run   -> 执行



