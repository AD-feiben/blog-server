const Router = require('koa-router')
const article = require('./article')
const user = require('./user')

module.exports = (app) => {
  const router = new Router()
  router
    .get('/', (ctx, next) => {
      ctx.body = 'Hello Koa Root'
    })
  article(router)
  user(router)

  app
    .use(router.routes())
    .use(router.allowedMethods())
}
