---
title: karafka  返回批处理
date: 2019-10-09 11:37:10
tags: karafka
author: 相飞
comments:
- true
categories:
- karafka


---


```ruby

class KarafkaApp < Karafka::App
  setup do |config|
    config.batch_fetching = true  #批量获取一次处理
 
  end

end

class CollectGatewayConsumer < ApplicationConsumer

  def consume
    params_batch.each do |params|

    end

   end

end

```

