const router = require('koa-router')({
  prefix: '/admin/api',
})

const Friendlink = require('../../models/Friendlink')

// 增
router.post('/friendlink', async ctx => {
  if (ctx.request.body) {
    try {
      const data = await new Friendlink(ctx.request.body).save()
      ctx.response.status = 200
      ctx.body = {
        code: 200,
        msg: '友链添加成功',
        data,
      }
    } catch (error) {
      ctx.response.status = 412
      ctx.body = {
        code: 412,
        msg: '友链添加失败',
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
router.delete('/friendlink/:id', async ctx => {
  if (ctx.params.id) {
    try {
      const data = await Friendlink.findByIdAndDelete(ctx.params.id)
      ctx.response.status = 200
      ctx.body = {
        code: 200,
        msg: '友链删除成功',
        data,
      }
    } catch (error) {
      ctx.response.status = 412
      ctx.body = {
        code: 412,
        msg: '友链删除失败',
        data,
      }
    }
  } else {
    ctx.response.status = 416
    ctx.body = {
      code: 416,
      msg: '友链id必须传入',
    }
  }
})

// 改
router.put('/friendlink/:id', async ctx => {
  if (ctx.params.id && ctx.request.body) {
    try {
      const data = await Friendlink.findByIdAndUpdate(ctx.params.id, ctx.request.body)
      ctx.response.status = 200
      ctx.body = {
        code: 200,
        msg: '友链编辑成功',
        data,
      }
    } catch (error) {
      ctx.response.status = 412
      ctx.body = {
        code: 412,
        msg: '友链编辑失败',
        data,
      }
    }
  } else {
    ctx.response.status = 416
    ctx.body = {
      code: 416,
      msg: '友链id必须传入',
    }
  }
})

// 查
router.get('/friendlink', async ctx => {
  try {
    const data = await Friendlink.find()
    ctx.response.status = 200
    ctx.body = {
      code: 200,
      msg: '友链查询成功',
      data,
    }
  } catch (error) {
    ctx.response.status = 412
    ctx.body = {
      code: 412,
      msg: '友链查询失败',
      data,
    }
  }
})

module.exports = router
