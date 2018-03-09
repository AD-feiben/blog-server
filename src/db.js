const mongoose = require('mongoose')

const url = 'mongodb://127.0.0.1:27017/blog'

const option = {
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 500
}

mongoose.connect(url, option)

const db = mongoose.connection

db.once('open', () => {
  console.log('数据库连接成功')
})

db.on('error', (err) => {
  console.error('Error in mongodb connection', err)
  mongoose.disconnect()
})

db.on('close', () => {
  console.log('数据库连接断开，正在重连...')
  mongoose.connect(url, option)
})

module.exports = db
