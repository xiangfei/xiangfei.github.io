## k8s operator 开发



### 下载operator-sdk

```bash
wget https://github.com/operator-framework/operator-sdk/releases/download/v1.21.0/operator-sdk_linux_amd64
chmod u+x operator-sdk_linux_amd64
cp operator-sdk_linux_amd64 /usr/bin/operator-sdk

mkdir commander-operator

# domain  --> 域名
#  repo --> 域名/group/project
operator-sdk init --domain ii-ai.tech --repo ii-ai.tech/rpa/commander-operator
```



### 配置 kubelet


```bash
## /etc/kubernetes/kubelet.conf
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUN5RENDQWJDZ0F3SUJBZ0lCQURBTkJna3Foa2lHOXcwQkFRc0ZBREFWTVJNd0VRWURWUVFERXdwcmRXSmwKY201bGRHVnpNQjRYRFRJeU1EUXdOVEE0TlRjeE0xb1hEVE15TURRd01qQTROVGN4TTFvd0ZURVRNQkVHQTFVRQpBeE1LYTNWaVpYSnVaWFJsY3pDQ0FTSXdEUVlKS29aSWh2Y05BUUVCQlFBRGdnRVBBRENDQVFvQ2dnRUJBS25KCjUrVW0xV1hkZHNpbmRCNURBTC9wSStLMWpibStYMTlIV3lpYksxdmw1eTUxM0tRMTQ4Zi9oQ0tEMXVzRERnV2YKZThhUnVDdlFTMU44cFRHUExnRHVpeDBKZCsvaDFFWEt5c2lXY29IaXBsNDBjOHlOV095ZHNqZGhJYU1oUGVqKwoxSlZLajBWRzZtVXFpRUo0dFFLQUNiMzdYazdZWGd3Mm5rMCtKYXJuZ2ptN0tjZy9EZHhCNW4xVDFIc3N5blE0CnV3c1pPZUJ0ZDU4VEdJamNuQm9FM0ZqQkl6WEF1akNUbmlBaHlCZlVPTmVtZ0FpUW1OV0hlOGd2eFQvTVNubmgKbXBYZTl0U0pvRU10T1lXUjQxS21VZHl2cVRFUjR4NUNrdERYWDUwZzRqd3R4ZmV3aTdLTk1ienV1TnQraDRUeApVbnZ6OUErMnRGc2Y5V3dXWkpjQ0F3RUFBYU1qTUNFd0RnWURWUjBQQVFIL0JBUURBZ0trTUE4R0ExVWRFd0VCCi93UUZNQU1CQWY4d0RRWUpLb1pJaHZjTkFRRUxCUUFEZ2dFQkFDYmljV2hqZUdETDdENXVxcEp1NTF0SE1vOXcKSVk5SERQa1N4UW1iRGgwUlVFbmQxZW0yYk52YWJFWUdabGJOR2ttN0FNUkNZbFpHVzdWRWM3L0F4UlI5TCtKcQpNS0x0TFR3TlFWRHlJaHFXRklyK1FZTmNzUVlCd2ljdmRSREFZdmlCY25OZ2xXcUFGc3VPOW1BN2tPTE9UNW9UCmFpTWJnZTJObnZwc0s2YzAzSWZxRmNuL3N5SzJHN1RTN3BlRW85c0pYeEN1a2ZvSGxRRGlUTk80alViVER2dmkKelBKOUtKVSt0bk9BeFB3clFnaExWdWRObkxJU1cvdTRhMEZmSm1ReXJNWXdraVQvWlo2eTgwU25uenIyRGMzUQo4SFFBNmdxa0lrVjZZU0VGdFU0ak8yejJQK2FUZjVyRHlJNFFNeHJDaXpnUE9mYVhGdkJ6QWx1NGZHST0KLS0tLS1FTkQgQ0VSVElGSUNBVEUtLS0tLQo=
    server: https://10.4.0.29:6443
  name: kubernetes
contexts:
- context:
    cluster: kubernetes
    user: system:node:k8s-dev-qa-master01
  name: system:node:k8s-dev-qa-master01@kubernetes
current-context: system:node:k8s-dev-qa-master01@kubernetes
kind: Config
preferences: {}
users:
- name: system:node:k8s-dev-qa-master01
  user:
    client-certificate: /var/lib/kubelet/pki/kubelet-client-current.pem
    client-key: /var/lib/kubelet/pki/kubelet-client-current.pem



```

