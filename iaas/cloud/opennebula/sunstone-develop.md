
## 前端
#### 准备
```bash
requirejs allows you to define blocks of functionality in different modules/files and then load and reuse them in other modules
npm install -g requirejs

Handlebars #模板

handlerbar for requirejs

sudo npm install -g bower
sudo npm install -g grunt
sudo npm install -g grunt-cli
```
#### Adding Custom Tabs
```bash
app/main.js

shim: {
  'app': {
    deps: [
      'tabs/provision-tab',
      'tabs/dashboard-tab',
      'tabs/system-tab',
      ...
      'tabs/mycustom-tab'
    ]
  },

/etc/one/sunstone-views/(admin|user|...).yaml

enabled_tabs:
  - dashboard-tab
  - system-tab
  ...
  - mycustom-tab

```

## 后台

#### routes 配置

```bash
/usr/lib/one/sunstone/routes , add route folder
/etc/one/sunstone-server.conf
:routes:
    - custom
    - other
```
#### Creating Sunstone Server Plugins

```ruby
get '/myplugin/myresource/:id' do
    resource_id = params[:id]
    # code...
end

post '/myplugin/myresource' do
    # code
end

put '/myplugin/myresource/:id' do
    # code
end

del '/myplugin/myresource/:id' do
    # code
end
```
