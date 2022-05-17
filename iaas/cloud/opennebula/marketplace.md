

## public
+ 默认安装

## private

#### Systems marketplace

```
cat market.conf
NAME = PrivateMarket
MARKET_MAD = one
ENDPOINT = "http://privatemarket.opennebula.org"
```

####  http marketplace

```
cat market.conf
NAME = PrivateMarket
MARKET_MAD = http
BASE_URL = "http://frontend.opennebula.org/"
PUBLIC_DIR = "/var/loca/market-http"
BRIDGE_LIST = "web-server.opennebula.org"
onemarket create market.conf

```
