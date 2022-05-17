
## Add provider
```bash
 onehost create remote_provider im_provider vmm_provider
```

## Adding the Information Manager

```bash
vi /etc/one/oned.conf

IM_MAD = [
      name       = "im_provider",
      executable = "one_im_sh",
      arguments  = "-t 1 -r 0 provider_name" ]
```
## Populating the Probes
```bash
/var/lib/one/remotes/im/<provider_name>.d

```


## Adding the Virtual Machine Manager
```bash
VM_MAD = [
    name       = "vmm_provider",
    executable = "one_vmm_sh",
    arguments  = "-t 15 -r 0 provider_name",
    type       = "xml" ]
```

## implement
```bash
/var/lib/one/remotes/vmm/provier_name implement

```
