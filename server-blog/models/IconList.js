const mongoose = require('mongoose')

const schema = new mongoose.Schema(
  {
    // 此处应该在建模
    icon: { type: String },
    name: { type: String },
    link: { type: String },
  },
  { timestamps: { createdAt: 'created', updatedAt: 'updated' } },
)

module.exports = mongoose.model('IconList', schema)
