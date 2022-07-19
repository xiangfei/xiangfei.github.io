## operator sdk 开发

- 开发commander 私有化部署operator

### 创建项目

- operator-sdk init  --domain ai-indeed.com  --repo=code.ii-ai.tech/devops/commander-operator

```bash

root@golang-ide-ubuntu:/commander-operator# operator-sdk init  --domain ai-indeed.com  --repo=code.ii-ai.tech/devops/commander-operator
Writing kustomize manifests for you to edit...
Writing scaffold for you to edit...
Get controller runtime:
$ go get sigs.k8s.io/controller-runtime@v0.11.2
Update dependencies:
$ go mod tidy
Next: define a resource with:
$ operator-sdk create api

```

### 创建api

-  operator-sdk create api --group cache --version v1 --kind  Redis --resource=true --controller=true

```bash

root@golang-ide-ubuntu:/commander-operator# operator-sdk create api --group cache --version v1 --kind  Redis --resource=true --controller=true
Writing kustomize manifests for you to edit...
Writing scaffold for you to edit...
api/v1/redis_types.go
controllers/redis_controller.go
Update dependencies:
$ go mod tidy
Running make:
$ make generate
mkdir -p /commander-operator/bin
GOBIN=/commander-operator/bin go install sigs.k8s.io/controller-tools/cmd/controller-gen@v0.8.0
go: downloading sigs.k8s.io/controller-tools v0.8.0
go: downloading github.com/spf13/cobra v1.2.1
go: downloading github.com/gobuffalo/flect v0.2.3
go: downloading k8s.io/apiextensions-apiserver v0.23.0
go: downloading k8s.io/apimachinery v0.23.0
go: downloading golang.org/x/tools v0.1.6-0.20210820212750-d4cc65f0b2ff
go: downloading github.com/fatih/color v1.12.0
go: downloading k8s.io/api v0.23.0
go: downloading k8s.io/utils v0.0.0-20210930125809-cb0fa318a74b
go: downloading sigs.k8s.io/structured-merge-diff/v4 v4.1.2
go: downloading github.com/mattn/go-colorable v0.1.8
go: downloading github.com/mattn/go-isatty v0.0.12
go: downloading golang.org/x/sys v0.0.0-20210831042530-f4d43177bf5e
go: downloading golang.org/x/mod v0.4.2
go: downloading golang.org/x/net v0.0.0-20210825183410-e898025ed96a
/commander-operator/bin/controller-gen object:headerFile="hack/boilerplate.go.txt" paths="./..."
Next: implement your new API and generate the manifests (e.g. CRDs,CRs) with:
$ make manifests

```


### 构建img

-  make docker-build IMG=commander/redis-operator:v1


```bash
root@golang-ide-ubuntu:/commander-operator# make docker-build IMG=commander/redis-operator:v1
/commander-operator/bin/controller-gen rbac:roleName=manager-role crd webhook paths="./..." output:crd:artifacts:config=config/crd/bases
/commander-operator/bin/controller-gen object:headerFile="hack/boilerplate.go.txt" paths="./..."
go fmt ./...
go vet ./...
GOBIN=/commander-operator/bin go install sigs.k8s.io/controller-runtime/tools/setup-envtest@latest
go: downloading sigs.k8s.io/controller-runtime v0.12.3
go: downloading sigs.k8s.io/controller-runtime/tools/setup-envtest v0.0.0-20220706151251-15154aaa6767
KUBEBUILDER_ASSETS="/root/.local/share/kubebuilder-envtest/k8s/1.23.5-linux-amd64" go test ./... -coverprofile cover.out
?       code.ii-ai.tech/devops/commander-operator       [no test files]
?       code.ii-ai.tech/devops/commander-operator/api/v1        [no test files]
ok      code.ii-ai.tech/devops/commander-operator/controllers   8.323s  coverage: 0.0% of statements
docker build -t commander/redis-operator:v1 .
Sending build context to Docker daemon    191kB
Step 1/14 : FROM golang:1.17 as builder
1.17: Pulling from library/golang
1339eaac5b67: Downloading [=>                                                 ]  1.621MB/55.01MB
4c78fa1b9799: Download complete 
14f0d2bd5243: Downloading [===========>                                       ]  2.415MB/10.88MB
76e5964a957d: Waiting 
0f00f9da9be9: Waiting 
9ba886546062: Waiting 
1c731399e420: Waiting 


```