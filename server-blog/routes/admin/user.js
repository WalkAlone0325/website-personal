const router = require('koa-router')({
  prefix: '/admin/api',
})

const config = require('../../config/config')
const jwt = require('jsonwebtoken')
const auth = require('../../middleware/auth')

const AdminUser = require('../../models/AdminUser')
const Setting = require('../../models/Setting')

// 增
router.post('/admin', auth(), async ctx => {
  if (ctx.request.body) {
    try {
      const { email, username, password } = ctx.request.body
      const user = await AdminUser.findOne({ email })
      if (user === null) {
        const data = await new AdminUser(ctx.request.body).save()
        ctx.response.status = 200
        ctx.body = {
          code: 200,
          msg: '用户添加成功',
          data,
        }
      } else {
        ctx.response.status = 413
        ctx.body = {
          code: 413,
          msg: '用户已存在',
        }
      }
    } catch (error) {
      ctx.response.status = 412
      ctx.body = {
        code: 412,
        msg: '用户添加失败',
      }
    }
  } else {
    ctx.response.status = 416
    ctx.body = {
      code: 416,
      msg: '参数不齐全',
    }
  }
})

// 删
router.delete('/admin/:id', auth(), async ctx => {
  if (ctx.params.id) {
    try {
      const data = await AdminUser.findByIdAndDelete(ctx.params.id)
      ctx.response.status = 200
      ctx.body = {
        code: 200,
        msg: '用户删除成功',
      }
    } catch (error) {
      ctx.response.status = 412
      ctx.body = {
        code: 412,
        msg: '用户删除失败',
      }
    }
  } else {
    ctx.response.status = 416
    ctx.body = {
      code: 416,
      msg: '用户id必须传入',
    }
  }
})

// 改
router.put('/admin/:id', auth(), async ctx => {
  if (ctx.params.id && ctx.request.body) {
    try {
      const data = await AdminUser.findByIdAndUpdate(ctx.params.id, ctx.request.body)
      ctx.response.status = 200
      ctx.body = {
        code: 200,
        msg: '用户编辑成功',
        data,
      }
    } catch (error) {
      ctx.response.status = 412
      ctx.body = {
        code: 412,
        msg: '用户编辑失败',
        data,
      }
    }
  } else {
    ctx.response.status = 416
    ctx.body = {
      code: 416,
      msg: '用户id必须传入',
    }
  }
})

// 查
router.get('/admin', auth(), async ctx => {
  try {
    const data = await AdminUser.find()
    ctx.response.status = 200
    ctx.body = {
      code: 200,
      msg: '用户查询成功',
      data,
    }
  } catch (error) {
    ctx.response.status = 412
    ctx.body = {
      code: 412,
      msg: '用户查询失败',
      data,
    }
  }
})

// 登录
router.post('/login', async ctx => {
  const { email, password } = ctx.request.body
  if (email && password) {
    try {
      const user = await AdminUser.findOne({ email }).select('+password')
      const isVaild = require('bcryptjs').compareSync(password, user.password)
      if (isVaild) {
        // 获取 token
        const token = jwt.sign({ id: user._id, email: user.email }, config.JWT_SECRET, {
          expiresIn: '10h',
        })
        ctx.response.status = 200
        ctx.body = {
          code: 200,
          msg: '登录成功',
          data: {
            email: user.email,
            username: user.username,
            user_img: user.user_img,
          },
          token,
        }
      }
    } catch (error) {
      ctx.response.status = 412
      ctx.body = {
        code: 412,
        msg: '密码错误',
      }
    }
  } else {
    ctx.response.status = 416
    ctx.body = {
      code: 416,
      msg: '用户不存在',
    }
  }
})

module.exports = router
