
## AWS
```bash
/etc/one/ec2_driver.conf
proxy_uri:
state_wait_timeout_seconds: 300
instance_types:
    c1.medium:
    cpu: 2
    memory: 1.7
    ...

onehost create ec2 -t ec2 --im ec2 --vm ec2



echo 'EC2_ACCESS = "xXxXXxx"' >  ec2host.tpl
echo 'EC2_SECRET = "xXXxxXx"' >> ec2host.tpl
echo 'REGION_NAME= "xXXxxXx"' >> ec2host.tpl

onehost create ec2 -t ec2 ec2host.tpl --im ec2 --vm ec2


CPU      = 0.5
MEMORY   = 128

# KVM template machine, this will be use when submitting this VM to local resources
DISK     = [ IMAGE_ID = 3 ]
NIC      = [ NETWORK_ID = 7 ]

# PUBLIC_CLOUD template, this will be use wen submitting this VM to EC2
PUBLIC_CLOUD = [ TYPE="EC2",
                 AMI="ami-00bafcb5",
                 KEYPAIR="gsg-keypair",
                 INSTANCETYPE=m1.small]

#Add this if you want to use only EC2 cloud
#SCHED_REQUIREMENTS = 'HOSTNAME = "ec2"'


```

## AZURE

```bash
IM_MAD = [
      name       = "az",
      executable = "one_im_sh",
      arguments  = "-c -t 1 -r 0 az" ]

VM_MAD = [
    name       = "az",
    executable = "one_vmm_sh",
    arguments  = "-t 15 -r 0 az",
    type       = "xml" ]

onehost create azure_host -t az -i az -v az
CPU      = 0.5
MEMORY   = 128

# KVM template machine, this will be use when submitting this VM to local resources
DISK     = [ IMAGE_ID = 3 ]
NIC      = [ NETWORK_ID = 7 ]

# Azure template machine, this will be use wen submitting this VM to Azure
PUBLIC_CLOUD = [
  TYPE=AZURE,
  INSTANCE_TYPE=ExtraSmall,
  IMAGE=b39f27a8b8c64d52b05eac6a62ebad85__Ubuntu-14_04-LTS-amd64-server-20140606.1-en-us-30GB,
  VM_USER="azuser",
  VM_PASSWORD="myr@nd0mPass9",
  WIN_RM="https",
  TCP_ENDPOINTS="80",
  SSHPORT=2222
]
```


## opennebula
```bash
enable
IM_MAD = [
    NAME          = "one",
    SUNSTONE_NAME = "OpenNebula",
    EXECUTABLE    = "one_im_sh",
    ARGUMENTS     = "-c -t 1 -r 0 one" ]


VM_MAD = [
    NAME           = "one",
    SUNSTONE_NAME  = "OpenNebula",
    EXECUTABLE     = "one_vmm_sh",
    ARGUMENTS      = "-t 15 -r 0 one",
    TYPE           = "xml",
    KEEP_SNAPSHOTS = "no"
]
onehost create <name> -i one -v one

onehost update <hostid>

ONE_USER = <remote_username>

ONE_PASSWORD = <remote_password>
ONE_ENDPOINT = <remote_endpoint>
ONE_CAPACITY = [
    CPU    = 0,
    MEMORY = 0
]
onetemplate list --endpoint http://<hybrid_OpenNebula_cloud>:2633/RPC2 --user <username> --password <pass>

cat template.txt
NAME = "hybrid-template"

CPU    = 0.1
MEMORY = 128

PUBLIC_CLOUD = [
    TEMPLATE_ID = "0",
    TYPE        = "opennebula"
]

CONTEXT=[
    NETWORK="yes"
]
```
