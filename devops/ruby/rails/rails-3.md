---
title: rails consul 微服务 (配置下发)
date: 2020-02-24 09:44:08
tags: rails
author: 相飞
comments:
- true
categories:
- rails
---



### 实现思路
  - 和服务发现一致
  - console , puma  方法需要扩展

```ruby

class AsyncConsul
  include Concurrent::Async

  CACHE ||= Concurrent::Hash.new
  SERVICE_CACHE ||= Concurrent::Map.new
  def reload_const
    loop do
      begin
        Timeout::timeout 2 do
          config = JSON.load Diplomat::Kv.get("xxx") # your key ,value
          database = config["database"]
          redis = config["redis"]
          reset_database database
          reset_redisconfig redis
        end
      rescue => e
      end
      sleep 2
    end
  end

  def reset_database(database)
    CACHE["database"] ||= database
    if CACHE["database"] != database
      CACHE["database"] = database
      ActiveRecord::Base.establish_connection database
    end
  end

  def reset_redisconfig(ldap)
    CACHE["redis"] ||= ldap
    if CACHE["redis"] != ldap
      CACHE["redis"] = ldap
      #LDAP_CONFIG.merge! ldap
    end
  end
end

```
