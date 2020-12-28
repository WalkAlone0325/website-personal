const mongoose = require('mongoose')

const schema = new mongoose.Schema(
  {
    blog_name: { type: String },
    blog_desc: { type: String },
    blog_url: { type: String },
    blog_imgurl: { type: String },
  },
  { timestamps: { createdAt: 'created', updatedAt: 'updated' } },
)

module.exports = mongoose.model('Friendlink', schema)
