module.exports = app => {
  const article = require('./article')
  const tag = require('./tag')
  const friendlink = require('./friendlink')
  const toollink = require('./toollink')
  const user = require('./user')

  app.use(article.routes(), article.allowedMethods())
  app.use(tag.routes(), tag.allowedMethods())
  app.use(friendlink.routes(), friendlink.allowedMethods())
  app.use(toollink.routes(), toollink.allowedMethods())
  app.use(user.routes(), user.allowedMethods())
}
