const ArticleController = require('../../controller/article')

module.exports = (router) => {
  // 新增或修改文章
  router.post('/article', ArticleController.saveArticle)
  // 查询文章列表
  router.get('/article', ArticleController.getArticle)
  // 通过文章id查询文章
  router.get('/article/:id', ArticleController.getArticleById)
  // 根据id修改文章状态
  router.post('/article/setState', ArticleController.setArticleState)
  // 根据id删除文章
  router.post('/article/delete', ArticleController.deleteArticleById)
  // 查询所有分类
  router.get('/classify', ArticleController.getClassify)
  // 查询所有标签
  router.get('/tags', ArticleController.getTags)
  // 归档
  router.get('/pigeonhole', ArticleController.getPigeonhole)
}
