const bodyParser = require('koa-bodyparser')
const json = require('koa-json')
const cors = require('koa2-cors')
const koaJwt = require('koa-jwt')
const logger = require('./logger')
const errorHandler = require('./error-handler')
const secret = require('../../config').secret

module.exports = (app) => {
  app.use(errorHandler())
  app.use(bodyParser())
  app.use(json({pretty: false}))
  app.use(logger())
  app.use(cors())
  app.use(koaJwt({secret}).unless({
    path: [
      /^\/user/,
      /^\/register/,
      /^\/login/,
      /^\/article/,
      /^\/classify/,
      /^\/tags/,
      /^\/pigeonhole/
    ]
  }))
}
