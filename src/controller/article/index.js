const ArticleModel = require('../../models/article')
const CODE = require('../../util/code')

const isEmpty = (val) => {
  return (!val || val === '' || val === 'null' || val === 'undefined')
}
const filter = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>~！@#￥……&*（）——|{}【】‘；：”“'。，、？]", 'g') // 过滤敏感字

class ArticleController {
  // 检查必填字段
  static checkArticle (ctx, article = {}, keys = '') {
    keys = typeof keys === 'string' ? new Array(keys) : keys
    let requireKeys = [...new Set([...keys, ...Object.keys(article)])]
    for (let i = 0, len = requireKeys.length; i < len; i++) {
      let key = requireKeys[i]
      // 字段值为空
      if (!article[key]) {
        ctx.throw(CODE.PARAMS_ERROR, {
          code: CODE.PARAMS_ERROR,
          message: `${key}字段不能为空！`
        })
      }
    }
  }
  // 新增或修改文章 无id为新增 有id为修改
  static async saveArticle (ctx, next) {
    const req = ctx.request.body
    // 必填字段
    const required = ['title', 'desc', 'content', 'tags', 'classify']
    ArticleController.checkArticle(ctx, req, required)
    if (req.id) {
      const id = req.id
      delete req.id
      delete req.state
      const article = await ArticleModel
        .findByIdAndUpdate(id, req)
        .catch(() => { ctx.throw(CODE.SERVER_ERROR) })
      ctx.body = article ? {code: CODE.OK, message: '文章修改成功！'} : {code: CODE.NOT_FOUND, message: '无此文章'}
    } else {
      const date = new Date()
      let createdDate = date.format('yyyy-MM-dd HH:mm:ss')
      let order = date.getTime()
      if (req.state) {
        req.publishedDate = createdDate
        req.publishedYear = date.getFullYear()
        req.publishOrder = date.getTime()
      }
      await ArticleModel.create({...req, createdDate, order}).catch(() => { ctx.throw(CODE.SERVER_ERROR) })
      ctx.body = {code: CODE.OK, message: '添加文章成功！'}
    }
  }
  // 根据id修改文章状态
  static async setArticleState (ctx, next) {
    console.log('根据id修改文章状态')
    const req = ctx.request.body
    const required = ['id', 'state']
    ArticleController.checkArticle(ctx, req, required)
    const id = req.id
    const state = req.state
    let date = new Date()
    let publishedDate = +state ? date.format('yyyy-MM-dd HH:mm:ss') : ''
    let publishedYear = +state ? date.getFullYear() : ''
    let publishOrder = +state ? date.getTime() : 0
    await ArticleModel
      .findByIdAndUpdate(id, {state, publishedDate, publishedYear, publishOrder})
      .catch(() => { ctx.throw(CODE.SERVER_ERROR) })
    ctx.body = {code: CODE.OK, message: '修改成功！'}
  }
  // 查询文章列表
  static async getArticle (ctx, next) {
    console.log('查询文章列表')
    let { classify, keyword, state, tag, page = 1, pageSize = 10 } = ctx.query
    page = +page
    pageSize = +pageSize
    const query = {}
    !isEmpty(classify) && (query.classify = classify)
    !isEmpty(state) && (query.state = state)
    if (tag) {
      tag = tag.replace(filter, '')
      const reg = new RegExp(tag, 'i')
      query.tags = {$regex: reg}
    }
    if (keyword) {
      keyword = keyword.replace(filter, '')
      const reg = new RegExp(keyword, 'i')
      query.$or = [
        {tags: {$regex: reg}},
        {title: {$regex: reg}},
        {desc: {$regex: reg}},
        {classify: {$regex: reg}}
      ]
    }
    let skip = page <= 1 ? 0 : (page - 1) * pageSize
    const articles = await ArticleModel
      .find(query, {content: 0, __v: 0, order: 0, publishOrder: 0})
      .limit(pageSize)
      .skip(skip)
      .sort({ publishOrder: -1, order: -1 })
      .exec()
      .catch(() => {
        ctx.throw(CODE.SERVER_ERROR)
      })
    const total = await ArticleModel
      .find(query)
      .count()
      .catch(() => { ctx.throw(CODE.SERVER_ERROR) })

    ctx.body = {
      code: CODE.OK,
      data: {
        articles,
        total
      },
      message: '查询成功'
    }
  }
  // 根据文章id查询文章 阅读量加1
  static async getArticleById (ctx, next) {
    console.log('根据id查询文章')
    const req = ctx.params
    ArticleController.checkArticle(ctx, req, 'id')
    const article = await ArticleModel
      .findById(req.id, {__v: 0, order: 0})
      .catch(() => { ctx.throw(CODE.SERVER_ERROR) })
    console.log(article)
    if (article) {
      if (article.state) { // 已发布的文章，阅读量加1
        article.readingQuantity++
        await ArticleModel
          .findByIdAndUpdate(req.id, article)
          .catch(() => { ctx.thorw(CODE.SERVER_ERROR) })
      }
      ctx.body = {code: CODE.OK, data: article, message: '查询成功！'}
    } else {
      ctx.body = {code: CODE.NOT_FOUND, message: '无此文章'}
    }
  }
  // 删除指定id文章
  static async deleteArticleById (ctx, next) {
    console.log('根据id删除文章')
    const req = ctx.request.body
    ArticleController.checkArticle(ctx, req, 'id')
    await ArticleModel.findByIdAndRemove(req.id)
      .catch(() => { ctx.throw(CODE.SERVER_ERROR) })
    ctx.body = {code: CODE.OK, message: '删除成功！'}
  }
  // 查询所有分类
  static async getClassify (ctx) {
    console.log('查询所有分类')
    const req = ctx.query
    const query = {}
    !isEmpty(req.state) && (query.state = req.state)
    const articles = await ArticleModel
      .find(query)
      .catch(() => { ctx.throw(CODE.SERVER_ERROR) })
    const classifies = []
    for (let article of articles) {
      classifies.push(article.classify)
    }
    ctx.body = {
      code: CODE.OK,
      message: '查询成功',
      data: {
        classify: [...new Set(classifies)] // 去重
      }
    }
  }
  // 查询所有标签
  static async getTags (ctx) {
    console.log('查询所有标签')
    const req = ctx.query
    const query = {}
    !isEmpty(req.state) && (query.state = req.state)
    const articles = await ArticleModel
      .find(query)
      .catch(() => { ctx.throw(CODE.SERVER_ERROR) })
    const tags = []
    for (let article of articles) {
      tags.push(...article.tags.split(','))
    }
    ctx.body = {
      code: CODE.OK,
      message: '查询成功',
      data: {
        tags: [...new Set(tags)] // 去重
      }
    }
  }
  // 归档
  static async getPigeonhole (ctx) {
    console.log('归档')
    const pigeonholes = {}
    const articles = await ArticleModel
      .find({state: 1}, {content: 0, __v: 0, order: 0, publishOrder: 0})
      .sort({publishedYear: -1})
      .catch(() => { ctx.throw(CODE.SERVER_ERROR) })
    for (let article of articles) {
      if (!pigeonholes[article.publishedYear]) {
        pigeonholes[article.publishedYear] = {
          year: article.publishedYear,
          articles: []
        }
      }
      pigeonholes[article.publishedYear].articles.push(article)
    }
    ctx.body = {code: CODE.OK, message: '查询成功！', data: {pigeonholes}}
  }
}

module.exports = ArticleController
