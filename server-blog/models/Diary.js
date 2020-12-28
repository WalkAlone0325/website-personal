const mongoose = require('mongoose')

const schema = new mongoose.Schema(
  {
    diary_title: { type: String }, // 日记名称
    diary_content: { type: String }, // 日记内容
    weather: { type: String }, // 天气
  },
  { timestamps: { createdAt: 'created', updatedAt: 'updated' } },
)

module.exports = mongoose.model('Diary', schema)
