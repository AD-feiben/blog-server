const Koa = require('koa')
const middleWrae = require('./src/middleware')
const router = require('./src/router')
const port = require('./config').port
require('./src/util/time')
require('./src/db')

const app = new Koa()
middleWrae(app)
router(app)

app.listen(port, () => {
  console.log('server is running at http://localhost:', port)
})
