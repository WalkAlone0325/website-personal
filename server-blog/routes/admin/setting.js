const router = require('koa-router')({
  prefix: '/admin/api',
})

const auth = require('../../middleware/auth')
const Setting = require('../../models/Setting')
const IconList = require('../../models/IconList')

// 增
router.post('/setting', async ctx => {
  if (ctx.request.body) {
    try {
      console.log(ctx.request.body)
      // const data = await new Setting(ctx.request.body).save()
      // const icons_list = await new IconList(ctx.request.body).save()
      ctx.response.status = 200
      ctx.body = {
        code: 200,
        msg: '设置添加成功',
        data,
      }
    } catch (error) {
      ctx.response.status = 412
      ctx.body = {
        code: 412,
        msg: '设置添加失败',
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
router.delete('/setting/:id', async ctx => {
  if (ctx.params.id) {
    try {
      const data = await Setting.findByIdAndDelete(ctx.params.id)
      ctx.response.status = 200
      ctx.body = {
        code: 200,
        msg: '设置删除成功',
        data,
      }
    } catch (error) {
      ctx.response.status = 412
      ctx.body = {
        code: 412,
        msg: '设置删除失败',
        data,
      }
    }
  } else {
    ctx.response.status = 416
    ctx.body = {
      code: 416,
      msg: '设置id必须传入',
    }
  }
})

// 改
router.put('/setting/:id', async ctx => {
  if (ctx.params.id && ctx.request.body) {
    try {
      const data = await Setting.findByIdAndUpdate(ctx.params.id, ctx.request.body)
      ctx.response.status = 200
      ctx.body = {
        code: 200,
        msg: '设置编辑成功',
        data,
      }
    } catch (error) {
      ctx.response.status = 412
      ctx.body = {
        code: 412,
        msg: '设置编辑失败',
        data,
      }
    }
  } else {
    ctx.response.status = 416
    ctx.body = {
      code: 416,
      msg: '设置id必须传入',
    }
  }
})

// 查
router.get('/setting', async ctx => {
  try {
    const setting = await Setting.find()
    const iconList = await IconList.find()
    console.log(iconList)
    ctx.response.status = 200
    ctx.body = {
      code: 200,
      msg: '设置查询成功',
      data: {
        setting,
        iconList,
      },
    }
  } catch (error) {
    ctx.response.status = 412
    ctx.body = {
      code: 412,
      msg: '设置查询失败',
      data,
    }
  }
})

module.exports = router
