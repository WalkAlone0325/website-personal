import axios from 'axios'
import { ElMessage } from 'element-plus'
import { getToken } from './auth'

const service = axios.create({
  timeout: 5000,
  baseURL: 'http://localhost:3000/admin/api',
})

// 请求拦截
service.interceptors.request.use(
  config => {
    let token = getToken()
    if (token) {
      config.headers.Authorization = 'Bearer ' + token
    }
    return config
  },
  err => Promise.reject(err),
)

// 响应拦截
service.interceptors.response.use(
  response => {
    const res = response.data

    if (response.status !== 200) {
      return Promise.reject(ElMessage({ type: 'error', message: res.msg || 'Error' }))
    } else {
      return res
    }
  },
  err => {
    ElMessage({
      type: 'error',
      message: '请求失败',
    })
    return Promise.reject(err)
  },
)

export default service
