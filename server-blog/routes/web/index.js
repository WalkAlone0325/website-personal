const router = require('koa-router')({
  prefix: '/web/api',
})

const Article = require('../../models/Article')
const Diary = require('../../models/Diary')
const Friendlink = require('../../models/Friendlink')
const IconList = require('../../models/IconList')
const Setting = require('../../models/Setting')
const Tag = require('../../models/Tag')
const Toollink = require('../../models/Toollink')

router.get('/article', async ctx => {
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

router.get('/diary', async ctx => {
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

router.get('/setting', async ctx => {
  try {
    const data = await Setting.find()
    ctx.response.status = 200
    ctx.body = {
      code: 200,
      msg: '设置查询成功',
      data,
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

router.get('/toollink', async ctx => {
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
