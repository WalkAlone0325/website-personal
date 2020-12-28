const mongoose = require('mongoose')

const schema = new mongoose.Schema(
  {
    tool_name: { type: String },
    tool_desc: { type: String },
    tool_url: { type: String },
    tool_imgurl: { type: String },
  },
  { timestamps: { createdAt: 'created', updatedAt: 'updated' } },
)

module.exports = mongoose.model('Toollink', schema)
