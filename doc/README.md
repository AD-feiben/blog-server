# 博客接口文档说明

## 获取文章列表

> 请求方式： GET

> URL： http://ip:port/article

- 请求参数

|     | 字段     | 名称     | 必填 | 数据类型 | 说明                 |
| --- | -------- | -------- | ---- | -------- | -------------------- |
| 1   | classify | 类别     | N    | String   |                      |
| 2   | keyword  | 关键字   | N    | String   |                      |
| 3   | page     | 页码     | N    | Number   | 默认 1               |
| 4   | pageSize | 页大小   | N    | Number   | 默认 10              |
| 3   | state    | 文章状态 | N    | Number   | 0: 草稿<br>1: 已发布 |
| 4   | tag      | 标签     | N    | String   |                      |

- 响应参数

|     | 字段    | 名称         | 说明                           |
| --- | ------- | ------------ | ------------------------------ |
| 1   | code    | 状态码       | 200： 成功<br>其他： 失败        |
| 2   | data    | 文章数据     | articles：文章集合<br>total：文章总数 |
| 3   | message | 接口状态描述 |                                |

- 响应数据示例

```json
{
  "code": 200,
  "data": {
    "articles": [
      {
        "readingQuantity": 0,
        "state": 1,
        "_id": "5aa1fc65ccaf151f778fec36",
        "title": "测试",
        "desc": "测试",
        "tags": "测试1,测试2",
        "classify": "go",
        "publishedDate": "2018-03-09 11:15:49",
        "publishedYear": "2018",
        "createdDate": "2018-03-09 11:15:49"
      }
    ],
    "total": 1
  },
  "message": "查询成功"
}
```

- 响应参数说明

|     | 字段            | 类型   | 说明                       |
| --- | --------------- | ------ | -------------------------- |
| 1   | readingQuantity | Number | 阅读量                     |
| 2   | state           | Number | 文章状态<br>0：草稿<br>1：已发布 |
| 3   | _id             | String | 文章id                     |
| 4   | title           | String | 文章标题                   |
| 5   | desc            | String | 文章描述                   |
| 6   | tags            | String | 文章标签，','分隔          |
| 7   | classify        | String | 文章分类                   |
| 8   | publishedDate   | String | 文章发布日期               |
| 9   | publishedYear   | String | 文章发布的年份             |
| 10  | createdDate     | String | 文章创建日期               |
| 11  | total           | Number | 文章总数                   |

## 通过文章id查询文章

> 请求方式： GET

> URL： http://ip:port/article/:id

- 请求参数说明

|     | 字段 | 名称   | 必填 | 数据类型 | 说明             |
| --- | ---- | ------ | ---- | -------- | ---------------- |
| 1   | id   | 文章id | Y    | String   | 从文章列表中获取 |

- 响应参数

|     | 字段    | 名称     | 说明 |
| --- | ------- | -------- | ---- |
| 1   | code    |          |      |
| 2   | message |          |      |
| 3   | data    | 文章数据 |      |

- 响应数据示例

```json
{
  "code": 200,
  "data": {
    "readingQuantity": 3,
    "state": 1,
    "_id": "5aa1fc65ccaf151f778fec36",
    "title": "测试",
    "desc": "测试",
    "content": "测试",
    "tags": "测试1,测试2",
    "classify": "go",
    "publishedDate": "2018-03-09 11:15:49",
    "publishedYear": "2018",
    "createdDate": "2018-03-09 11:15:49"
  },
  "message": "查询成功！"
}
```

- 响应参数说明

|     | 字段            | 类型   | 说明           |
| --- | --------------- | ------ | -------------- |
| 1   | readingQuantity | Number | 阅读量         |
| 2   | state           | Number | 文章状态       |
| 3   | _id             | String | 文章id         |
| 4   | title           | String | 文章标题       |
| 5   | desc            | String | 文章描述       |
| 6   | content         | String | 文章内容       |
| 7   | tags            | String | 文章标签       |
| 8   | classify        | String | 文章分类       |
| 9   | publishedDate   | String | 文章发布日期   |
| 10  | publishedYear   | String | 文章发布的年份 |
| 11  | createdDate     | String | 文章创建日期   |

## 新增或修改文章

> 请求方式： POST

> URL： http://ip:port/saveArticle

- 请求参数说明

|     | 字段     | 名称     | 必填 | 类型   | 说明                         |
| --- | -------- | -------- | ---- | ------ | ---------------------------- |
| 1   | id       | 文章id   | N    | String | 无：创建文章<br>有：修改文章 |
| 2   | title    | 文章标题 | Y    | String |                              |
| 3   | desc     | 文章描述 | Y    | String |                              |
| 4   | content  | 文章内容 | Y    | String |                              |
| 5   | tags     | 文章标签 | Y    | String | 多个标签使用,隔开            |
| 6   | classify | 文章分类 | Y    | String |                              |
| 7   | cover    | 封面图   | N    | String |                              |
| 8   | state    | 文章状态 | N    | Number | 0：草稿<br>1：发布             |

- 响应参数示例

```json
{
  "code": 200,
  "message": "添加文章成功！"
}
```

## 修改指定id文章的状态

> 请求方式： POST

> URL： http://ip:port/setState

- 请求参数说明

|     | 字段  | 名称     | 必填 | 类型   | 说明               |
| --- | ----- | -------- | ---- | ------ | ------------------ |
| 1   | id    | 文章id   | Y    | String |                    |
| 2   | state | 文章状态 | Y    | Number | 0：草稿<br>1：发布 |

- 响应参数示例

```json
{
  "code": 200,
  "message": "修改成功！"
}
```

## 根据id删除文章

> 请求方式： POST

> URL： http://ip:port/deleteArticle

- 请求参数说明

|     | 字段 | 名称   | 必填 | 类型   | 说明 |
| --- | ---- | ------ | ---- | ------ | ---- |
| 1   | id   | 文章id | Y    | String |      |

- 响应参数示例

```json
{
  "code": 200,
  "message": "删除成功！"
}
```

## 查询所有分类

> 请求方式： GET

> URL： http://ip:port/classify

- 请求参数说明

|     | 字段  | 名称     | 必填 | 类型   | 说明 |
| --- | ----- | -------- | ---- | ------ | ---- |
| 1   | state | 文章状态 | N    | Number | 0：查询草稿的类别<br>1: 查询已发布的类别     |

- 响应参数示例

```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "classify": [
      "koa",
      "go"
    ]
  }
}
```

- 响应参数说明

|     | 字段     | 类型          | 说明 |
| --- | -------- | ------------- | ---- |
| 1   | code     | Number        |      |
| 2   | message  | String        |      |
| 3   | data     | Object        |      |
| 4   | classify | Array[string] | 文章所有分类     |

## 查询所有标签

> 请求方式： GET

> URL： http://ip:port/tags

- 请求参数说明

|     | 字段  | 名称     | 必填 | 类型   | 说明 |
| --- | ----- | -------- | ---- | ------ | ---- |
| 1   | state | 文章状态 | N    | Number | 0：查询草稿的标签<br>1: 查询已发布的标签     |

- 响应参数示例

```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "tags": [
      "测试1",
      "测试2"
    ]
  }
}
```

- 响应参数说明

|     | 字段    | 类型          | 说明         |
| --- | ------- | ------------- | ------------ |
| 1   | code    | Number        |              |
| 2   | message | String        |              |
| 3   | data    | Object        |              |
| 4   | tags    | Array[string] | 文章所有标签 |

## 查询归档

> 请求方式： GET

> URL： http://ip:port/pigeonhole

- 请求参数 -

- 响应参数示例

```json
{
  "code": 200,
  "message": "查询成功！",
  "data": [
    {
      "year": "2018",
      "articles": [
        {
          "readingQuantity": 0,
          "state": 1,
          "_id": "5aa1fb76f093b21f2d70055c",
          "title": "测试2",
          "desc": "测试2",
          "tags": "测试2",
          "classify": "koa",
          "createdDate": "2018-03-09 11:11:50",
          "publishedYear": "2018",
          "publishedDate": "2018-03-09 11:17:25"
        },
        {
          "readingQuantity": 0,
          "state": 1,
          "_id": "5aa1fb57f093b21f2d70055a",
          "title": "测试1",
          "desc": "测试1",
          "tags": "测试1",
          "classify": "go",
          "createdDate": "2018-03-09 11:11:19",
          "publishedYear": "2018",
          "publishedDate": "2018-03-09 11:13:30"
        }
      ]
    }
  ]
}
```
