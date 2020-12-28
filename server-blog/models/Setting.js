const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  avator: { type: String, default: '独行' },
  info: { type: String, default: '小小前端开发' },
  home: {
    bg_img: {
      type: String,
      default: 'https://tse2-mm.cn.bing.net/th/id/OIP.t9c0r_B9qQUV2qPqXgXpfwHaCx?pid=Api&rs=1',
    },
    title: { type: String },
    desc: { type: String },
    img_url: { type: String },
  },
  about: {
    content_info: { type: String },
    avator_imgurl: { type: String },
    icons_list: {
      icon: { type: String },
      desc: { type: String },
      link: { type: String },
    },
  },
})

module.exports = mongoose.model('Setting', schema)
