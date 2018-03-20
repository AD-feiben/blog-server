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
  static async getUserCount (ctx) {
    const users = await UserModel.find().catch(() => { ctx.throw(CODE.SERVER_ERROR) })
    return users.length
  }
  static async canRegister (ctx) {
    const userCount = await UserController.getUserCount(ctx)
    if (userCount === 0) {
      ctx.body = {code: CODE.OK, message: '可以注册管理员账号'}
    } else if (userCount === 1) {
      ctx.body = {code: 201, message: '可以注册普通账号'}
    } else {
      let testUser = await UserModel.findOne({role: 0}).catch(() => { ctx.throw(CODE.SERVER_ERROR) })
      let { account } = testUser
      ctx.body = { code: CODE.UESR_EXIST, message: '已经存在测试账号了，请勿注册！', data: {account} }
    }
  }
  // 注册用户
  static async register (ctx, next) {
    const userCount = await UserController.getUserCount(ctx)
    if (userCount < 2) {
      let { account, pwd } = ctx.request.body
      UserController.checkUser(ctx, ctx.request.body, ['account', 'pwd'])
      // 用户名查重
      let user = await UserModel.findOne({ account }).catch(() => { ctx.throw(CODE.SERVER_ERROR) })
      if (!user) {
        pwd = crypto(userCount === 0 ? pwd : 666666) // 非管理员，密码为固定值
        let createdTime = new Date().format('yyyy-MM-dd HH:mm:ss')
        let role = +!(userCount ^ 0) // 同或
        await UserModel.create({ account, pwd, createdTime, role }).catch(() => { ctx.throw(CODE.SERVER_ERROR) })
        ctx.body = { code: CODE.OK, message: '注册成功！' }
      } else {
        ctx.body = { code: CODE.PARAMS_ERROR, message: '用户名已经存在' }
      }
    } else {
      let testUser = await UserModel.findOne({role: 0}).catch(() => { ctx.throw(CODE.SERVER_ERROR) })
      let { account, pwd } = testUser
      ctx.body = { code: CODE.UESR_EXIST, message: '已经存在测试账号了，请勿注册！', data: { account, pwd } }
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
        createdTime: user.createdTime,
        role: user.role
      }, secret, { expiresIn: '2h' })
      ctx.body = {code: CODE.OK, data: { token, role: user.role }, messag: '登录成功'}
      // 更新登录时间
      await UserModel.findByIdAndUpdate(user._id, { lastLoginTime: new Date().getTime() })
    } else {
      ctx.body = {code: CODE.PARAMS_ERROR, message: '账号或密码错误！'}
    }
  }
  // 修改密码
  static async updatePwd (ctx, next) {
    let { token, pwd, newPwd } = ctx.request.body
    let account = ''
    UserController.checkUser(ctx, ctx.request.body, ['token', 'pwd', 'newPwd'])
    pwd = crypto(pwd)
    newPwd = crypto(newPwd)
    let decode = jwt.decode(token)
    if (decode) {
      account = decode.account
      if (decode.role === 1) {
        let user = await UserModel
          .findOneAndUpdate({account, pwd}, {pwd: newPwd})
          .catch(() => { ctx.throw(CODE.SERVER_ERROR) })
        ctx.body = user ? {code: CODE.OK, message: '密码修改成功'} : {code: CODE.PARAMS_ERROR, message: '账号或密码错误！'}
      } else {
        ctx.body = {code: CODE.PARAMS_ERROR, messag: '普通账号不允许修改密码'}
      }
    } else {
      ctx.body = {code: CODE.PARAMS_ERROR, message: '账号或密码错误！'}
    }
  }
}

module.exports = UserController
