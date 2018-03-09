const Router = require('koa-router')
const article = require('./article')

module.exports = (app) => {
  const router = new Router()
  router
    .get('/', (ctx, next) => {
      ctx.body = 'Hello Koa Root'
    })
  article(router)

  app
    .use(router.routes())
    .use(router.allowedMethods())
}
