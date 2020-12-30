import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'normalize.css/normalize.css' // 重置浏览器样式
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import './assets/styles/common.scss'
import { timeStampFormat } from './utils/filters'
import axios from './utils/request'

const app = createApp(App)

app.config.globalProperties.$axios = axios

app
  .provide('timeFormat', timeStampFormat)
  .use(ElementPlus)
  .use(store)
  .use(router)
  .mount('#app')
