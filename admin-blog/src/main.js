import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'normalize.css/normalize.css' // 重置浏览器样式
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import './assets/styles/common.scss'
import { timeStampFormat } from './utils/filters'
import service from './utils/request'
import { getToken } from './utils/auth'

const app = createApp(App)

const getAuthHeader = () => {
  return {
    Authorization: 'Bearer ' + getToken() || '',
  }
}

app.config.globalProperties.$axios = service

app
  .provide('timeFormat', timeStampFormat)
  .provide('getAuthHeader', getAuthHeader)
  .use(ElementPlus)
  .use(store)
  .use(router)
  .mount('#app')
