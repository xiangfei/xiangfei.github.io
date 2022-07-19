## k8s 1.18.6 nfs 安装

 - provider.yaml

```yaml
---
kind: ServiceAccount
apiVersion: v1
metadata:
  name: nfs-client-provisioner
  namespace: kube-system
---
kind: ClusterRole
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: nfs-client-provisioner-runner
  namespace: kube-system
rules:
  - apiGroups: [""]
    resources: ["persistentvolumes"]
    verbs: ["get", "list", "watch", "create", "delete"]
  - apiGroups: [""]
    resources: ["persistentvolumeclaims"]
    verbs: ["get", "list", "watch", "update"]
  - apiGroups: ["storage.k8s.io"]
    resources: ["storageclasses"]
    verbs: ["get", "list", "watch"]
  - apiGroups: [""]
    resources: ["events"]
    verbs: ["create", "update", "patch"]
---
kind: ClusterRoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: run-nfs-client-provisioner
subjects:
  - kind: ServiceAccount
    name: nfs-client-provisioner
    # namespace: default

    namespace: kube-system
roleRef:
  kind: ClusterRole
  name: nfs-client-provisioner-runner
  apiGroup: rbac.authorization.k8s.io
---
kind: Role
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: leader-locking-nfs-client-provisioner
  namespace: kube-system
rules:
  - apiGroups: [""]
    resources: ["endpoints"]
    verbs: ["get", "list", "watch", "create", "update", "patch"]
---
kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: leader-locking-nfs-client-provisioner
  namespace: kube-system
subjects:
  - kind: ServiceAccount
    name: nfs-client-provisioner
    # replace with namespace where provisioner is deployed

    # namespace: default

    namespace: kube-system
roleRef:
  kind: Role
  name: leader-locking-nfs-client-provisioner
  apiGroup: rbac.authorization.k8s.io

---
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: managed-nfs-storage
provisioner: fuseim.pri/ifs # or choose another name, must match deployment's env PROVISIONER_NAME'

parameters:
  archiveOnDelete: "false"
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: nfs-client-provisioner
  namespace: kube-system
---
kind: Deployment
apiVersion: apps/v1
# apiVersion: extensions/v1beta1

metadata:
  name: nfs-client-provisioner
  namespace: kube-system
# spec:

#   replicas: 1

#   strategy:

#     type: Recreate

spec:
  replicas: 1
  revisionHistoryLimit: 5
  selector:
    matchLabels:
      app: nfs-client-provisioner  
  template:
    metadata:
      labels:
        app: nfs-client-provisioner
    spec:
      serviceAccountName: nfs-client-provisioner
      containers:
        - name: nfs-client-provisioner
          #image: rkevin/nfs-subdir-external-provisioner:fix-k8s-1.20  ## k8s 1.20使用这个provisioner

          image: quay.io/external_storage/nfs-client-provisioner:latest  ## 这个镜像已经不适用1.20+版本了

          volumeMounts:
            - name: nfs-client-root
              mountPath: /nfs
          env:
            - name: PROVISIONER_NAME
              value: fuseim.pri/ifs
            - name: NFS_SERVER
              value: 10.4.1.1
            - name: NFS_PATH
              value: /sata/nfs

      volumes:
        - name: nfs-client-root
          nfs:
            server: 10.4.1.1
            path: /sata/nfs
```



- pv.yaml


```yaml

apiVersion: v1
kind: PersistentVolume
metadata:
  name: poc-pv
spec:
  capacity:
    storage: 400Gi
  accessModes:
    - ReadWriteMany
  persistentVolumeReclaimPolicy: Retain
  storageClassName: managed-nfs-storage
  nfs:
    path: /sata/nfs
    server: 10.4.1.1

```

- pvc.yaml



```yaml
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: consul-pvc
  namespace: consul
spec:
  accessModes:
    - ReadWriteMany
  resources:
    requests:
      storage: 2Ti
  storageClassName: managed-nfs-storage

```