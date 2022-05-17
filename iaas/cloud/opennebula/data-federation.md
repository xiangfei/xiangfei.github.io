


## Master 配置

```bash
vi /etc/one/oned.conf
onezone update 0
FEDERATION = [
    MODE    = "MASTER",
    ZONE_ID = 0
]
```

## Slave 配置
+ Slave: Install OpenNebula on the slave as usual following the installation guide. Start OpenNebula at least once to bootstrap the zone database.
+ Slave: Stop OpenNebula.
+ Master: Create a zone for the slave, and write down the new Zone ID. This can be done via Sunstone, or with the onezone command.
```bash
vim /tmp/zone.tmpl
NAME     = slave-name
ENDPOINT = http://<slave-zone-ip>:2633/RPC2
onezone create /tmp/zone.tmpl
ID: 100
onezone list
   ID NAME
    0 OpenNebula
  100 slave-name
```
+ Master: backup db
```bash
onedb backup --federated -s /var/lib/one/one.db
```
+ Slave: restore db
```bash
onedb restore --federated -s /var/lib/one/one.db /var/lib/one/one.db_federated_2017-6-14_16:0:36.bck
```

