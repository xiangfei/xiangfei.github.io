


## config
#### cofig file  /etc/one/onegate-server.conf

```bash

################################################################################
# Server Configuration
################################################################################

# OpenNebula sever contact information
#
:one_xmlrpc: http://localhost:2633/RPC2

# Server Configuration
#
:host: 127.0.0.1
:port: 5030

:oneflow_server: http://localhost:2474
```
#### Start OneGate

```bash
systemctl start opennebula-gate

```
####  use , update /etc/one/oned.conf

```bash
ONEGATE_ENDPOINT = "http://192.168.0.5:5030"

```

### usage

#### vm template

```bash
CPU     = "0.5"
MEMORY  = "1024"

DISK = [
  IMAGE_ID = "0" ]
NIC = [
  NETWORK_ID = "0" ]

CONTEXT = [
  TOKEN = "YES" ]
```
#### OneGate Client Usage

```bash
 onegate vm show
```
