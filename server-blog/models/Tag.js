const mongoose = require('mongoose')

const schema = new mongoose.Schema(
  {
    tag_name: { type: String }, // 标签名称
    tag_desc: { type: String }, // 标签描述
  },
  { timestamps: { createdAt: 'created', updatedAt: 'updated' } },
)

module.exports = mongoose.model('Tag', schema)
