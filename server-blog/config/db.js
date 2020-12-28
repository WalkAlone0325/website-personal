module.exports = app => {
  const mongoose = require('mongoose')
  mongoose
    .connect('mongodb://127.0.0.1:27017/blog-website', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('Mongodb Connected...')
    })
    .catch(err => {
      console.log(err)
    })
}
