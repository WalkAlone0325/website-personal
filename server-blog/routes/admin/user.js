const router = require('koa-router')({
  prefix: '/admin/api',
})

const AdminUser = require('../../models/AdminUser')

// 增
router.post('/admin', async ctx => {
  if (ctx.request.body) {
    try {
      const data = await new AdminUser(ctx.request.body).save()
      ctx.response.status = 200
      ctx.body = {
        code: 200,
        msg: '用户添加成功',
        data,
      }
    } catch (error) {
      ctx.response.status = 412
      ctx.body = {
        code: 412,
        msg: '用户添加失败',
        data: error,
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
router.delete('/admin/:id', async ctx => {
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
router.put('/admin/:id', async ctx => {
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
router.get('/admin', async ctx => {
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
  const { username, password } = ctx.request.body
  if (username && password) {
    try {
      const user = await AdminUser.findOne({ username }).select('+password')
      console.log(user)
      const isVaild = require('bcryptjs').compareSync(password, user.password)
      console.log(isVaild)
      if (isVaild) {
        // 获取 token
        const jwt = require('jsonwebtoken')
        let JWT_SECRET = 'loner6660325'
        const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, {
          expiresIn: '10h',
        })
        ctx.response.status = 200
        ctx.body = {
          code: 200,
          msg: '登录成功',
          username: user.username,
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
