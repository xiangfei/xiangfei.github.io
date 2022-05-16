

## firewalld 配置  
```bash
firewall-cmd --set-default-zone=public
firewall-cmd --zone=public --add-port=80/tcp --permanent
firewall-cmd --zone=public --add-port=443/tcp --permanent
firewall-cmd --zone=public --add-port=22/tcp --permanent
firewall-cmd --permanent --zone=public --add-rich-rule 'rule family=ipv4 source address=10.0.34.0/24 port port=0-50000 protocol=tcp accept'
firewall-cmd --permanent --zone=public --add-rich-rule 'rule family=ipv4 source address=172.17.0.0/16 port port=0-50000 protocol=tcp accept'
firewall-cmd --permanent --zone=public --add-rich-rule 'rule family=ipv4 source address=10.0.34.0/24 port port=0-50000 protocol=udp accept'
firewall-cmd --permanent --zone=public --add-rich-rule 'rule family=ipv4 source address=172.17.0.0/16 port port=0-50000 protocol=udp accept'
firewall-cmd --permanent --zone=public --add-rich-rule 'rule family=ipv4 source address=10.0.0.0/8 port port=8080 protocol=tcp accept' //仅限 master
firewall-cmd --reload
iptables -D FORWARD -j REJECT --reject-with icmp-host-prohibited
iptables -A FORWARD -i ens160 -j ACCEPT
iptables -A FORWARD -i flannel.1 -j ACCEPT
iptables -A FORWARD -j REJECT --reject-with icmp-host-prohibited
```

## /lib/systemd/system/docker.service 增加参数
```bash
EnvironmentFile=-/run/flannel/docker
DOCKER_OPT_BIP
DOCKER_OPT_IPMASQ
DOCKER_OPT_MTU
DOCKER_NETWORK_OPTIONS
```

## /etc/sysconfig/docker 增加参数
```bash
OPTIONS='--selinux-enabled --log-driver json-file --log-opt max-size=100m --log-opt max-file=3 --graph="/data/docker" --signature-verification=false'
INSECURE_REGISTRY=' --insecure-registry registry.docker.easybao.com'
```

## 批量管理  
```bash
echo "nameserver 10.100.246.10" >> /etc/resolv.conf
echo "10.0.34.23 registry.docker.easybao.com " >> /etc/hosts
yum install -y docker flannel socat conntrack-tools
rpm -ivh  kubernetes-client-1.7.3-1.el7.x86_64.rpm kubernetes-node-1.7.3-1.el7.x86_64.rpm

scp /etc/kubernetes/* 10.0.34.28:/etc/kubernetes/
scp /data/kubernetes*.rpm  10.0.34.28:/data
scp /etc/sysconfig/flannel 10.0.34.28:/etc/sysconfig/flannel
scp /lib/systemd/system/docker.service 10.0.34.28:/lib/systemd/system/docker.service
scp /etc/sysconfig/docker   10.0.34.28:/etc/sysconfig/docker

systemctl enable flanneld.service
systemctl start flanneld.service
systemctl enable dokcer.service
systemctl start dokcer.service

docker pull registry.docker.easybao.com/pause-amd64:3.0
docker tag registry.docker.easybao.com/pause-amd64:3.0 gcr.io/google_containers/pause-amd64:3.0

systemctl enable kubelet
systemctl start kube-proxy
systemctl enable kubelet
systemctl start kube-proxy
```
