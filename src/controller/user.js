const UserModel = require('../models/user')
const CODE = require('../util/code')
const crypto = require('../util/encrypt')
const secret = require('../../config').secret
const jwt = require('jsonwebtoken')

class UserController {
  // 检查必填字段
  static checkUser (ctx, user = {}, keys = '') {
    keys = typeof keys === 'string' ? new Array(keys) : keys
    let requireKeys = [...new Set([...keys, ...Object.keys(user)])]
    for (let i = 0, len = requireKeys.length; i < len; i++) {
      let key = requireKeys[i]
      // 字段值为空
      if (!user[key]) {
        ctx.throw(CODE.PARAMS_ERROR, {
          code: CODE.PARAMS_ERROR,
          message: `${key}字段不能为空！`
        })
      }
    }
  }
  // 检查是否有用户
  static async isNoUser (ctx) {
    const users = await UserModel.find().catch(() => { ctx.throw(CODE.SERVER_ERROR) })
    return !users.length
  }
  static async isExistUser (ctx) {
    ctx.body = await UserController.isNoUser(ctx) ? { code: CODE.OK, message: '暂无用户存在' } : { code: CODE.UESR_EXIST, message: '已有用户存在' }
  }
  // 注册用户
  static async register (ctx, next) {
    if (await UserController.isNoUser(ctx)) {
      let { account, pwd } = ctx.request.body
      UserController.checkUser(ctx, ctx.request.body, ['account', 'pwd'])
      pwd = crypto(pwd)
      let createdTime = new Date().format('yyyy-MM-dd HH:mm:ss')
      await UserModel.create({ account, pwd, createdTime }).catch(() => { ctx.throw(CODE.SERVER_ERROR) })
      ctx.body = { code: CODE.OK, message: '注册成功！' }
    } else {
      ctx.body = { code: CODE.UESR_EXIST, message: '已有用户存在，请直接登录！' }
    }
  }
  // 用户登录
  static async login (ctx, next) {
    let { account, pwd } = ctx.request.body
    UserController.checkUser(ctx, ctx.request.body, ['account', 'pwd'])
    pwd = crypto(pwd)
    let user = await UserModel.findOne({ account, pwd }).catch(() => { ctx.throw(CODE.SERVER_ERROR) })
    if (user) {
      const token = jwt.sign({
        id: user._id,
        account,
        lastLoginTime: user.lastLoginTime || '',
        createdTime: user.createdTime
      }, secret, { expiresIn: '2h' })
      ctx.body = {code: CODE.OK, data: { token }, messag: '登录成功'}
      // 更新登录时间
      await UserModel.findByIdAndUpdate(user._id, { lastLoginTime: new Date().getTime() })
    } else {
      ctx.body = {code: CODE.PARAMS_ERROR, message: '账号或密码错误！'}
    }
  }
}

module.exports = UserController
