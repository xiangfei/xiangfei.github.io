


##  centos cpu Affinity

- 将程序绑定到cpu运行 , kvm libvirt 模板有设置的方法
- softaffinity仅是一个建议,如果不可避免,调度器还是会把进程调度到其它的CPU上
- hardaffinity是调度器必须遵守的规则
- irqbalance

```bash
[root@compute ~]# ps -e |grep kvm       //我这里列出了一下kvm的进程号
  953 ?        00:00:00 kvm-irqfd-clean
 6852 ?        00:01:55 qemu-kvm
 6859 ?        00:00:00 kvm-pit/6852
 7820 ?        00:00:53 qemu-kvm
 7827 ?        00:00:00 kvm-pit/7820
18943 ?        00:44:56 qemu-kvm
18953 ?        00:00:00 kvm-pit/18943

[root@compute ~]# taskset -h         //这里是关于taskset命令的用法

Usage: taskset [options] [mask | cpu-list] [pid|cmd [args...]]

Options:
 -a, --all-tasks         operate on all the tasks (threads) for a given pid
 -p, --pid               operate on existing given pid
 -c, --cpu-list          display and specify cpus in list format
 -h, --help              display this help
 -V, --version           output version information

The default behavior is to run a new command:
    taskset 03 sshd -b 1024
You can retrieve the mask of an existing task:
    taskset -p 700
Or set it:
    taskset -p 03 700
List format uses a comma-separated list instead of a mask:
    taskset -pc 0,3,7-11 700
Ranges in list format can take a stride argument:
    e.g. 0-31:2 is equivalent to mask 0x55555555

For more information see taskset(1).

[root@compute ~]# cat /proc/7827/status          //查看上面查询的PID进程信息
Name:   kvm-pit/7820
State:  S (sleeping)
Tgid:   7827
Ngid:   0
Pid:    7827
PPid:   2
TracerPid:      0
Uid:    0       0       0       0
Gid:    0       0       0       0
FDSize: 64
Groups:
Threads:        1
SigQ:   0/192346
SigPnd: 0000000000000000
ShdPnd: 0000000000000000
SigBlk: 0000000000000000
SigIgn: ffffffffffffffff
SigCgt: 0000000000000000
CapInh: 0000000000000000
CapPrm: 0000001fffffffff
CapEff: 0000001fffffffff
CapBnd: 0000001fffffffff
Seccomp:        0
Cpus_allowed:   ffff
Cpus_allowed_list:      0-15          //这里表明该进程实在0-15号CPU上
Mems_allowed:   00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000001
Mems_allowed_list:      0
voluntary_ctxt_switches:        158
nonvoluntary_ctxt_switches:     0

[root@compute ~]# taskset  -cp 6-8 7827               //将7827进程绑定到6-8号CPU上。
pid 7827's current affinity list: 0-15
pid 7827's new affinity list: 6-8

[root@compute ~]# cat /proc/7827/status 
Name:   kvm-pit/7820
State:  S (sleeping)
Tgid:   7827
Ngid:   0
Pid:    7827
PPid:   2
TracerPid:      0
Uid:    0       0       0       0
Gid:    0       0       0       0
FDSize: 64
Groups:
Threads:        1
SigQ:   0/192346
SigPnd: 0000000000000000
ShdPnd: 0000000000000000
SigBlk: 0000000000000000
SigIgn: ffffffffffffffff
SigCgt: 0000000000000000
CapInh: 0000000000000000
CapPrm: 0000001fffffffff
CapEff: 0000001fffffffff
CapBnd: 0000001fffffffff
Seccomp:        0
Cpus_allowed:   ffff
Cpus_allowed_list:      6-8              //已更改
Mems_allowed:   00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000001
Mems_allowed_list:      0
voluntary_ctxt_switches:        158
nonvoluntary_ctxt_switches:     0


# irqbalance

[root@autotest-ruby-agent automationtesting-backend]# service irqbalance status
Redirecting to /bin/systemctl status  irqbalance.service
● irqbalance.service - irqbalance daemon
   Loaded: loaded (/usr/lib/systemd/system/irqbalance.service; enabled; vendor preset: enabled)
   Active: active (running) since Thu 2020-01-16 08:36:45 CST; 1 months 18 days ago
 Main PID: 522 (irqbalance)
   CGroup: /system.slice/irqbalance.service
           └─522 /usr/sbin/irqbalance --foreground

```






