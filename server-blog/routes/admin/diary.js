const router = require('koa-router')({
  prefix: '/admin/api',
})

const auth = require('../../middleware/auth')
const Diary = require('../../models/Diary')

// 增
router.post('/diary', auth(), async ctx => {
  if (ctx.request.body) {
    try {
      const data = await new Diary(ctx.request.body).save()
      ctx.response.status = 200
      ctx.body = {
        code: 200,
        msg: '日记添加成功',
        data,
      }
    } catch (error) {
      ctx.response.status = 412
      ctx.body = {
        code: 412,
        msg: '日记添加失败',
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
router.delete('/diary/:id', auth(), async ctx => {
  if (ctx.params.id) {
    try {
      const data = await Diary.findByIdAndDelete(ctx.params.id)
      ctx.response.status = 200
      ctx.body = {
        code: 200,
        msg: '日记删除成功',
        data,
      }
    } catch (error) {
      ctx.response.status = 412
      ctx.body = {
        code: 412,
        msg: '日记删除失败',
        data,
      }
    }
  } else {
    ctx.response.status = 416
    ctx.body = {
      code: 416,
      msg: '日记id必须传入',
    }
  }
})

// 改
router.put('/diary/:id', auth(), async ctx => {
  if (ctx.params.id && ctx.request.body) {
    try {
      const data = await Diary.findByIdAndUpdate(ctx.params.id, ctx.request.body)
      ctx.response.status = 200
      ctx.body = {
        code: 200,
        msg: '日记编辑成功',
        data,
      }
    } catch (error) {
      ctx.response.status = 412
      ctx.body = {
        code: 412,
        msg: '日记编辑失败',
        data,
      }
    }
  } else {
    ctx.response.status = 416
    ctx.body = {
      code: 416,
      msg: '日记id必须传入',
    }
  }
})

// 查
router.get('/diary', auth(), async ctx => {
  try {
    const data = await Diary.find()
    ctx.response.status = 200
    ctx.body = {
      code: 200,
      msg: '日记查询成功',
      data,
    }
  } catch (error) {
    ctx.response.status = 412
    ctx.body = {
      code: 412,
      msg: '日记查询失败',
      data,
    }
  }
})

module.exports = router
