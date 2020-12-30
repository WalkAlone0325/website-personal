const router = require('koa-router')({
  prefix: '/admin/api',
})

const auth = require('../../middleware/auth')
const Toollink = require('../../models/Toollink')

// 增
router.post('/toollink', auth(), async ctx => {
  if (ctx.request.body) {
    try {
      const data = await new Toollink(ctx.request.body).save()
      ctx.response.status = 200
      ctx.body = {
        code: 200,
        msg: '工具链接添加成功',
        data,
      }
    } catch (error) {
      ctx.response.status = 412
      ctx.body = {
        code: 412,
        msg: '工具链接添加失败',
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
router.delete('/toollink/:id', auth(), async ctx => {
  if (ctx.params.id) {
    try {
      const data = await Toollink.findByIdAndDelete(ctx.params.id)
      ctx.response.status = 200
      ctx.body = {
        code: 200,
        msg: '工具链接删除成功',
        data,
      }
    } catch (error) {
      ctx.response.status = 412
      ctx.body = {
        code: 412,
        msg: '工具链接删除失败',
        data,
      }
    }
  } else {
    ctx.response.status = 416
    ctx.body = {
      code: 416,
      msg: '工具链接id必须传入',
    }
  }
})

// 改
router.put('/toollink/:id', auth(), async ctx => {
  if (ctx.params.id && ctx.request.body) {
    try {
      const data = await Toollink.findByIdAndUpdate(ctx.params.id, ctx.request.body)
      ctx.response.status = 200
      ctx.body = {
        code: 200,
        msg: '工具链接编辑成功',
        data,
      }
    } catch (error) {
      ctx.response.status = 412
      ctx.body = {
        code: 412,
        msg: '工具链接编辑失败',
        data,
      }
    }
  } else {
    ctx.response.status = 416
    ctx.body = {
      code: 416,
      msg: '工具链接id必须传入',
    }
  }
})

// 查
router.get('/toollink', auth(), async ctx => {
  try {
    const data = await Toollink.find()
    ctx.response.status = 200
    ctx.body = {
      code: 200,
      msg: '工具链接查询成功',
      data,
    }
  } catch (error) {
    ctx.response.status = 412
    ctx.body = {
      code: 412,
      msg: '工具链接查询失败',
      data,
    }
  }
})

module.exports = router
