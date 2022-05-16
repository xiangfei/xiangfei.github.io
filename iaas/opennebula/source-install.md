

## dependency

+ g++ compiler (>= 4.0)
+ xmlrpc-c development libraries (>= 1.06)
+ scons build tool (>= 0.98)
+ sqlite3 development libraries (if compiling with sqlite support) (>= 3.6)
+ mysql client development libraries (if compiling with mysql support) (>= 5.1)
+ libxml2 development libraries (>= 2.7)
+ libvncserver development libraries (>= 0.9)
+ openssl development libraries (>= 0.9.8)
+ ruby interpreter (>= 1.8.7)

## centos

+ gcc-c++
+ java-1.7.0-openjdk-devel
+ libcurl-devel
+ libxml2-devel
+ mysql-devel
+ openssh
+ openssl-devel
+ pkgconfig
+ ruby
+ scons
+ sqlite-devel
+ sqlite-devel
+ systemd-devel
+ xmlrpc-c
+ xmlrpc-c-devel
+ libvncserver-devel

## compile

```bash
scons [OPTION=VALUE]
```

|OPTION |	VALUE|
|----------|:-------------:|
|sqlite_db|	path-to-sqlite-install|
|sqlite|	no if you don’t want to build sqlite support|
|mysql|	yes if you want to build mysql support|
|xmlrpc|	path-to-xmlrpc-install|
|parsers|	yes if you want to rebuild flex/bison files|
|new_xmlrpc|	yes if you have an xmlrpc-c version >= 1.31|
|sunstone|	yes if you want to build sunstone minified files|
|systemd|	yes if you want to build systemd support|
|docker_machine|	yes if you want to build the docker-machine driver|
|svncterm|	no to skip building vnc support for LXD drivers|
