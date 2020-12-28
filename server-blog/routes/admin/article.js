const router = require('koa-router')({
  prefix: '/admin/api',
})

const Article = require('../../models/Article')

// 增
router.post('/article', async (ctx, next) => {
  if (ctx.request.body) {
    try {
      const data = await new Article(ctx.request.body).save()
      ctx.response.status = 200
      ctx.body = {
        code: 200,
        msg: '文章添加成功',
        data,
      }
    } catch (error) {
      ctx.response.status = 412
      ctx.body = {
        code: 412,
        msg: '文章添加失败',
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
router.delete('/article/:id', async ctx => {
  if (ctx.params.id) {
    try {
      const data = await Article.findByIdAndDelete(ctx.params.id)
      ctx.response.status = 200
      ctx.body = {
        code: 200,
        msg: '文章删除成功',
        data,
      }
    } catch (error) {
      ctx.response.status = 412
      ctx.body = {
        code: 412,
        msg: '文章删除失败',
        data,
      }
    }
  } else {
    ctx.response.status = 416
    ctx.body = {
      code: 416,
      msg: '文章id必须传入',
    }
  }
})

// 改
router.put('/article/:id', async ctx => {
  if (ctx.params.id && ctx.request.body) {
    try {
      const data = await Article.findByIdAndUpdate(ctx.params.id, ctx.request.body)
      ctx.response.status = 200
      ctx.body = {
        code: 200,
        msg: '文章编辑成功',
        data,
      }
    } catch (error) {
      ctx.response.status = 412
      ctx.body = {
        code: 412,
        msg: '文章编辑失败',
        data,
      }
    }
  } else {
    ctx.response.status = 416
    ctx.body = {
      code: 416,
      msg: '文章id必须传入',
    }
  }
})

// 查
router.get('/article', async ctx => {
  try {
    const data = await Article.find().populate('tags')
    ctx.response.status = 200
    ctx.body = {
      code: 200,
      msg: '文章查询成功',
      data,
    }
  } catch (error) {
    ctx.response.status = 412
    ctx.body = {
      code: 412,
      msg: '文章查询失败',
      data,
    }
  }
})

// 查询详情
router.get('/article/:id', async ctx => {
  if (ctx.params.id) {
    try {
      const data = await Article.findById(ctx.params.id)
      ctx.response.status = 200
      ctx.body = {
        code: 200,
        msg: '文章查询成功',
        data,
      }
    } catch (error) {
      ctx.response.status = 412
      ctx.body = {
        code: 412,
        msg: '文章查询失败',
        data,
      }
    }
  } else {
    ctx.response.status = 416
    ctx.body = {
      code: 416,
      msg: '文章id必须传入',
    }
  }
})

module.exports = router
