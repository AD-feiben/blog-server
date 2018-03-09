const bodyParser = require('koa-bodyparser')
const json = require('koa-json')
const logger = require('./logger')
const errorHandler = require('./error-handler')

module.exports = (app) => {
  app.use(errorHandler())
  app.use(bodyParser())
  app.use(json({pretty: false}))
  app.use(logger())
}
