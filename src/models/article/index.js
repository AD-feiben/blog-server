const mongoose = require('mongoose')
const Schema = mongoose.Schema

const articleSchema = new Schema({
  id: Number,
  title: String, // 标题
  desc: String, // 描述
  content: String, // 文章内容
  cover: String, // 封面图
  tags: String, // 标签
  classify: String, // 分类
  createdDate: String, // 文章创建日期
  publishedDate: String, // 文章的发布时间
  publishedYear: String, // 文章发布年份，用于归档
  readingQuantity: { // 阅读量
    type: Number,
    default: 0
  },
  state: { // 文章状态 0：草稿 1：发布
    type: Number,
    default: 0
  },
  order: { // 文章入库的时间戳
    type: Number,
    default: new Date().getTime()
  },
  publishOrder: { // 文章发布的时间戳
    type: Number,
    default: new Date().getTime()
  }
})

articleSchema.index({ id: 1 })
const Article = mongoose.model('Article', articleSchema)

module.exports = Article
