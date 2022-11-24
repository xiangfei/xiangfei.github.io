## netplan ovs config

-  ovs bridge config

```bash

network:
  ethernets:
    eno1: {}
    eno2:
      dhcp4: true
    eno3:
      dhcp4: true
    eno4:
      dhcp4: true
  version: 2
  bridges:
    br-int:
      addresses: [10.4.1.10/16]
      gateway4: 10.4.0.1
      dhcp4: false
      interfaces: [en01]
      openvswitch: {}
      nameservers:
        addresses: ["114.114.114.114"]

```