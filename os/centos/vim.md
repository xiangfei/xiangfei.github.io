## centos7 安装 vim8


> [!WARNING]
> 不建议在centos7 安装ycp golang ruby python 集成环境


```bash
 yum -y install git ncurses-devel ruby ruby-devel lua lua-devel perl perl-devel python3 python3-devel python2-devel perl-ExtUtils-Embed lrzsz cmake wget gcc gcc-c++ unzip

git clone https://github.com/vim/vim.git

cd vim-master/src

./configure --with-features=huge --enable-multibyte --enable-rubyinterp=yes --enable-pythoninterp=yes --enable-python3interp=yes --prefix=/usr/local/vim8

make 

make install
```


## 插件安装

### YouCompleteMe


```bash
yum install clang cmake glibc-static libstdc++-static -y

```
> [!WARNING]
> - cmake 版本 at least 3.14
> - c++ at least C++17


```bash
wget https://github.com/Kitware/CMake/releases/download/v3.23.2/cmake-3.23.2-linux-x86_64.sh
sh cmake-3.23.2-linux-x86_64.sh
## 一键编译完成，需要accept license
## 配置环境变量

```



### NerdTree


### ToggleBar



