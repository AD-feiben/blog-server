const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  id: Number,
  account: {
    type: String,
    unique: true
  },
  pwd: String,
  role: { // 用户角色 管理员： 1， 普通用户： 0
    type: Number,
    default: 0
  },
  lastLoginTime: String, // '上次登录时间戳'
  createdTime: String // 注册日期
})

userSchema.index({ id: 1 })
const User = mongoose.model('User', userSchema)

module.exports = User
