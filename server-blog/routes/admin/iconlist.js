const router = require('koa-router')({
  prefix: '/admin/api',
})

const auth = require('../../middleware/auth')
const Setting = require('../../models/Setting')
const IconList = require('../../models/IconList')

// 增
router.post('/iconlist', async ctx => {
  if (ctx.request.body) {
    try {
      console.log(ctx.request.body)
      // const data = await new Setting(ctx.request.body).save()
      const data = await new IconList(ctx.request.body).save()
      ctx.response.status = 200
      ctx.body = {
        code: 200,
        msg: '图标添加成功',
        data,
      }
    } catch (error) {
      ctx.response.status = 412
      ctx.body = {
        code: 412,
        msg: '图标添加失败',
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
router.delete('/iconlist/:id', async ctx => {
  if (ctx.params.id) {
    try {
      const data = await IconList.findByIdAndDelete(ctx.params.id)
      ctx.response.status = 200
      ctx.body = {
        code: 200,
        msg: '图标删除成功',
        data,
      }
    } catch (error) {
      ctx.response.status = 412
      ctx.body = {
        code: 412,
        msg: '图标删除失败',
        data,
      }
    }
  } else {
    ctx.response.status = 416
    ctx.body = {
      code: 416,
      msg: '图标id必须传入',
    }
  }
})

// 改
router.put('/iconlist/:id', async ctx => {
  if (ctx.params.id && ctx.request.body) {
    try {
      const data = await IconList.findByIdAndUpdate(ctx.params.id, ctx.request.body)
      ctx.response.status = 200
      ctx.body = {
        code: 200,
        msg: '图标编辑成功',
        data,
      }
    } catch (error) {
      ctx.response.status = 412
      ctx.body = {
        code: 412,
        msg: '图标编辑失败',
        data,
      }
    }
  } else {
    ctx.response.status = 416
    ctx.body = {
      code: 416,
      msg: '图标id必须传入',
    }
  }
})

// 查
router.get('/iconlist', async ctx => {
  try {
    const data = await IconList.find()
    ctx.response.status = 200
    ctx.body = {
      code: 200,
      msg: '图标查询成功',
      data,
    }
  } catch (error) {
    ctx.response.status = 412
    ctx.body = {
      code: 412,
      msg: '图标查询失败',
      data,
    }
  }
})

module.exports = router
