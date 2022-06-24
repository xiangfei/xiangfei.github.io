> [!TIP]
> - 索引是一个虚拟的数据集合，索引由多个分片组成
> - 分片存储实际的数据
> - 索引分片数量不限制

## index 查询



### 跨index 查询

- 使用通配符


```bash

GET /index_*/_search
{
  "query" : {
    "match": {
      "test": "data"
    }
  }
}

```


- 直接指定



```bash

GET /index_01,index_02/_search
{
  "query" : {
    "match": {
      "test": "data"
    }
  }
}

```



## index 分片

