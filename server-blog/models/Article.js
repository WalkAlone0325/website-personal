const mongoose = require('mongoose')

const schema = new mongoose.Schema(
  {
    title: { type: String }, // 标题
    avatar: { type: String, default: '独行' }, // 作者
    tags: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Tag' }], // 分类标签
    img_url: { type: String }, // 图片
    desc: { type: String }, // 描述
    status: { type: Number }, // 0 => 存为草稿  1=> 已发表
    content: { type: String }, // 文章内容
  },
  { timestamps: { createdAt: 'created', updatedAt: 'updated' } },
)

module.exports = mongoose.model('Article', schema)
