---
title: ruby  zeitwerk
date: 2020-03-17 11:31:54

tags: ruby
author: 相飞
comments:
- true
categories:
- ruby

---



### reload 


#### gem reload


```ruby
require "zeitwerk"
@loader = Zeitwerk::Loader.for_gem
@loader.enable_reloading
@loader.setup
def reload!
  @loader.reload
end

module Teamwork

   include Logger
end

loader.eager_load

```

>teamwork/logger.rb
teamwork.rb



```
[root@autotest-ruby-agent zeitwerk_test]# ruby bin/console 
2.4.5 :001 > reload!
 => true 
2.4.5 :002 > exit

# 修改代码直接reload

```


### FILE Structure



```
lib/my_gem.rb         -> MyGem
lib/my_gem/foo.rb     -> MyGem::Foo
lib/my_gem/bar_baz.rb -> MyGem::BarBaz
lib/my_gem/woo/zoo.rb -> MyGem::Woo::Zoo

```


### manual add file to load


```
loader.push_dir(Rails.root.join("app/models"))
loader.push_dir(Rails.root.join("app/controllers"))

# 在 /app/models , app/controllers目录下查找

app/models/user.rb                        -> User
app/controllers/admin/users_controller.rb -> Admin::UsersController
```


###  Collapsing directories


```

booking.rb                -> Booking
booking/actions/create.rb -> Booking::Create

loader.collapse("booking/actions")


```
