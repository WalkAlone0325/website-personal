const jwt = require('jsonwebtoken')
const config = require('../config/config')
const AdminUser = require('../models/AdminUser')

module.exports = options => async (ctx, next) => {
  const token = String(ctx.request.headers.authorization || '')
    .split(' ')
    .pop()
  if (!token) {
    ctx.response.status = 401
    ctx.body = {
      code: 401,
      msg: '请先登录',
    }
  }
  const { id } = jwt.verify(token, config.JWT_SECRET)
  if (!id) {
    ctx.response.status = 401
    ctx.body = {
      code: 401,
      msg: '请先登录',
    }
  }
  ctx.request.user = await AdminUser.findById(id)
  if (!ctx.request.user) {
    ctx.response.status = 401
    ctx.body = {
      code: 401,
      msg: '请先登录',
    }
  }
  await next()
}
