const CODE = require('../util/code')

module.exports = () => {
  return async (ctx, next) => {
    try {
      await next()
    } catch (e) {
      if ((e.statusCode || e.status) === CODE.SERVER_ERROR) {
        console.log(e)
        ctx.body = {
          code: CODE.SERVER_ERROR,
          message: '系统异常'
        }
      } else {
        ctx.body = e
      }
    }
  }
}
