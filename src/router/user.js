const UserController = require('../controller/user')

module.exports = (router) => {
  // 查询是否有用户
  router.get('/user', UserController.isExistUser)
  // 注册用户
  router.post('/register', UserController.register)
  // 用户登录
  router.post('/login', UserController.login)
}
