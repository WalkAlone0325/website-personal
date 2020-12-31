const router = require('koa-router')({
  prefix: '/admin/api',
})

const auth = require('../../middleware/auth')
const Article = require('../../models/Article')
const Tag = require('../../models/Tag')

// 增
router.post('/article', auth(), async (ctx, next) => {
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
router.delete('/article/:id', auth(), async ctx => {
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
router.put('/article/:id', auth(), async ctx => {
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
router.get('/article', auth(), async ctx => {
  try {
    // 文章总数
    const total = await Article.countDocuments()
    const reqParam = ctx.query
    const title = reqParam.title
    const page = Number(reqParam.page) // 当前第几页
    const size = Number(reqParam.size) // 每页显示的记录条数
    // 显示符合前端分页请求的列表查询
    const reg = new RegExp(title, 'i')
    const data = await Article.find({
      $or: [
        { title: { $regex: reg } },
        // { resource: { $in: resource } }
      ],
    })
      .populate('tags')
      .sort({ updated: -1 })
      .skip((page - 1) * size)
      .limit(size)

    //是否还有更多
    const hasMore = total - (page - 1) * size > size ? true : false
    ctx.response.type = 'application/json'
    ctx.response.status = 200
    ctx.body = {
      code: 200,
      msg: '文章查询成功',
      data,
      hasMore,
      total,
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
router.get('/article/:id', auth(), async ctx => {
  if (ctx.params.id) {
    try {
      const data = await Article.findById(ctx.params.id).populate('tags')
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
