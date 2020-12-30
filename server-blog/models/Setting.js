const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  avator: { type: String, default: '独行' },
  info: { type: String, default: '小小前端开发' },
  home: {
    bg_img: {
      type: String,
      default: 'https://tse2-mm.cn.bing.net/th/id/OIP.t9c0r_B9qQUV2qPqXgXpfwHaCx?pid=Api&rs=1',
    },
    title: { type: String, default: '' },
    desc: { type: String, default: '' },
    img_url: { type: String, default: '' },
  },
  about: {
    content_info: { type: String, default: '' },
    avator_imgurl: { type: String, default: '' },
  },
})

module.exports = mongoose.model('Setting', schema)
