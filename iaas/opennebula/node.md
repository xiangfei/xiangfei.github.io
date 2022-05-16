

## 创建,删除主机

```bash
onehost create host01 --im kvm --vm kvm
onehost delete host01

```

## Showing and Listing Hosts

```bash
onehost list
onehost show host01
```
## enable ,disable , offline

```bash
onehost disable host01
onehost enable host01
onehost offline host01
```

## custom tags

```bash
onehost update -a "TYPE=\"production\""

```

## update driver

```bash
onehost sync host01
```
