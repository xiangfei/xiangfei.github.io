
##   ruby xml prc 
```bash
require 'xmlrpc/client'
server = XMLRPC::Client.new("opennebulaserver", "/RPC2", 2633)
server.call("one.system.version", "oneadmin:oneadmin")
```

> java ruby sdk  ,command line 需要在master机器运行 


