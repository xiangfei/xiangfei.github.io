

## arm 安装 opennebula 计算节点


- ubuntu 20 demo



```bash
 wget -q -O- https://downloads.opennebula.io/repo/repo.key | apt-key add -
 echo "deb  [arch=amd64,i386] https://downloads.opennebula.io/repo/6.4/Ubuntu/20.04 stable opennebula" > /etc/apt/sources.list.d/opennebula.list

apt-get update

apt-get install opennebula-node-kvm

```


> [!WARNING]
> - apt 源强制指定arch