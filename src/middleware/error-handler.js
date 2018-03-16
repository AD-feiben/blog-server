const CODE = require('../util/code')

module.exports = () => {
  return async (ctx, next) => {
    try {
      await next()
    } catch (e) {
      if ((e.statusCode || e.status) === CODE.SERVER_ERROR) {
        ctx.body = {
          code: CODE.SERVER_ERROR,
          message: '系统异常'
        }
      } else if ((e.statusCode || e.status) === CODE.TOKEN_EXPIRED) {
        ctx.body = {
          code: CODE.TOKEN_EXPIRED,
          message: '验签失败，请重新登录'
        }
      } else {
        ctx.body = e
      }
    }
  }
}
