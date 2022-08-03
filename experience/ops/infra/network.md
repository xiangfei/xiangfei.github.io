## 网络架构

- [参考](https://www.jianshu.com/p/ee783f13d0a7)
- 学习了解,运维可能出现的问题。


`IDC的规划设计和其他网络不一样的地方在于IDC对网络通信模式有着很高的灵活性要求。在同一个IDC内很有可能存在需要直接设置外网IP的服务器、只有内网但需要访问外网的服务器、用F5带集群业务、用RD模式的LVS带业务。所以IDC对灵活性的要求非常高。对于互联网企业，其业务变化的速度相当的高，可能一个月之内要扩展1000台服务器也不一定，也有可能一年也加不了服务器。所以考虑到预算问题，IDC的设计需要一个高度可扩展、高度灵活，同时保证性能、可用性。`



## 直接设置外网IP的通信模型


```plantuml
@startuml
robust "Web 浏览器" as WB
concise "Web 用户" as WU
@0
WU is 空闲
WB is 空闲
@100
WU is 等待中
WB is 处理中
@300
WB is 等待中
@enduml

```




```plantuml
@startuml
title: <size:20><&heart>Use of OpenIconic<&heart></size>
class Wifi
note left
  Click on <&wifi>
end note
@enduml

```



```plantuml
@startuml
nwdiag {
  // define group at outside network definitions
  group {
    color = "#7777FF";

    web01;
    web02;
    db01;
  }

  network dmz {
    color = "pink"

    web01;
    web02;
  }

  network internal {
    web01;
    web02;
    db01 [shape = rack ];
  }

  network internal2 {
    color = "LightBlue";

    web01;
    web02;
    db01;
  }

}
@enduml

```