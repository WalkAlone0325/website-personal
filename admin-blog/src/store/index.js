import { createStore } from 'vuex'
const path = require('path')

/**
 * require.context()
 * @params directory  要搜索的文件夹目录
 * @params useSubdirectories  是否还应该搜索它的子目录
 * @params regExp  一个匹配文件的正则表达式。
 */
const files = require.context('./modules', false, /\.js$/)
let modules = {}
files.keys().forEach(key => {
  let name = path.basename(key, '.js')
  modules[name] = files(key).default || files(key)
})

export default createStore({
  modules,
  strict: process.env.NODE_ENV !== 'production',
})
