const router = require('koa-router')({
  prefix: '/admin/api',
})

const Tag = require('../../models/Tag')
const Article = require('../../models/Article')

// 增
router.post('/tag', async ctx => {
  if (ctx.request.body) {
    try {
      const data = await new Tag(ctx.request.body).save()
      ctx.response.status = 200
      ctx.body = {
        code: 200,
        msg: '标签添加成功',
        data,
      }
    } catch (error) {
      ctx.response.status = 412
      ctx.body = {
        code: 412,
        msg: '标签添加失败',
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
router.delete('/tag/:id', async ctx => {
  if (ctx.params.id) {
    try {
      const data = await Tag.findByIdAndDelete(ctx.params.id)
      ctx.response.status = 200
      ctx.body = {
        code: 200,
        msg: '标签删除成功',
        data,
      }
    } catch (error) {
      ctx.response.status = 412
      ctx.body = {
        code: 412,
        msg: '标签删除失败',
        data,
      }
    }
  } else {
    ctx.response.status = 416
    ctx.body = {
      code: 416,
      msg: '标签id必须传入',
    }
  }
})

// 改
router.put('/tag/:id', async ctx => {
  if (ctx.params.id && ctx.request.body) {
    try {
      const data = await Tag.findByIdAndUpdate(ctx.params.id, ctx.request.body)
      ctx.response.status = 200
      ctx.body = {
        code: 200,
        msg: '标签编辑成功',
        data,
      }
    } catch (error) {
      ctx.response.status = 412
      ctx.body = {
        code: 412,
        msg: '标签编辑失败',
        data,
      }
    }
  } else {
    ctx.response.status = 416
    ctx.body = {
      code: 416,
      msg: '标签id必须传入',
    }
  }
})

// 查
router.get('/tag', async ctx => {
  try {
    const data = await Tag.find()
    const arr = [{ $unwind: '$tags' }, { $group: { _id: '$tags', count: { $sum: 1 } } }]
    const articlenumlist = await Article.aggregate(arr)
    ctx.response.status = 200
    ctx.body = {
      code: 200,
      msg: '标签查询成功',
      data,
      articlenumlist,
    }
  } catch (error) {
    ctx.response.status = 412
    ctx.body = {
      code: 412,
      msg: '标签查询失败',
      data,
    }
  }
})

module.exports = router
