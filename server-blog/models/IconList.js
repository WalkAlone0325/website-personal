const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  // 此处应该在建模
  icon: { type: String },
  name: { type: String },
  link: { type: String },
})

module.exports = mongoose.model('IconList', schema)
