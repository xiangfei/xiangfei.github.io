#  Opennebula 说明


1. 基础架构

opennebula kvm  ovs  ceph部署图


```plantuml
@startuml

cloud Ethernet{

}

node "opennebula-controller" {
 rectangle NIC1  as "public-nic"
 rectangle NIC2  as "business-nic"
 rectangle NIC3  as "storage-nic"

 component  {
 	component  mysql 
 	component  openvswitch 
 	component  opennebula
 	component  controller_ceph as "ceph-common"
 }
}


node "opennebula-compute" {

 rectangle NIC4  as "business-nic"
 rectangle NIC5  as "storage-nic"
 
 component {

 	component "opennebula-node-kvm"
 	component  component_ovs as  "openvswitch"
 	component "ceph-common"
 }

}


node "ceph-controller"  {
   rectangle  NIC6 as "storage-nic" 
   component {
	 component "ceph-mon"
	 component "ceph-mgr"   	
	 component "ceph-mds"   	

   }

}



node "ceph-osd"  {

   rectangle  NIC7 as "storage-nic" 
   component {
	 component  ceph_osd_2  as "ceph-osd"   	

   }
}

Ethernet -[bold]-> NIC1 : 外网vip连接
NIC1 -[bold]-> NIC2 : "ovs patch"
NIC2 -[bold]-> NIC4 : "ovs vxlan"




@enduml

```




2. 控制节点




3. 计算节点




4. 存储节点




