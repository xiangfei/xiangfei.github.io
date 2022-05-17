
# rvm

> [!INFO]
> -  ruby版本管理工具

## 安装 


### 在线安装
- gpg --keyserver hkp://keys.gnupg.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3
- curl -sSL https://get.rvm.io | bash -s stable

### 离线安装
- wget https://codeload.github.com/rvm/rvm/tar.gz/1.29.9
- tar -xf 
- cd tar_folder
- sh install

### 安装ruby

- rvm install 2.4.5

### 安装成功

```bash
[root@autotest-ruby-agent ~]# rvm use 2.4.5
Using /usr/local/rvm/gems/ruby-2.4.5
[root@autotest-ruby-agent ~]# 
[root@autotest-ruby-agent ~]# ruby --version
ruby 2.4.5p335 (2018-10-18 revision 65137) [x86_64-linux]

```


### ri 安装说明 

- 不安装 api 文档

>  rvm docs generate 安装api 文档
