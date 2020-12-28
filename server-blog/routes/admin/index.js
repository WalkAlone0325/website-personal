module.exports = app => {
  const article = require('./article')
  const tag = require('./tag')
  const friendlink = require('./friendlink')
  const toollink = require('./toollink')

  app.use(article.routes(), article.allowedMethods())
  app.use(tag.routes(), tag.allowedMethods())
  app.use(friendlink.routes(), friendlink.allowedMethods())
  app.use(toollink.routes(), toollink.allowedMethods())
}
