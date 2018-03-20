const UserController = require('../controller/user')

module.exports = (router) => {
  // 查询是否可以注册新用户
  router.get('/user', UserController.canRegister)
  // 注册用户
  router.post('/register', UserController.register)
  // 用户登录
  router.post('/login', UserController.login)
  // 修改密码
  router.post('/updatePwd', UserController.updatePwd)
}
