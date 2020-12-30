import Cookies from 'js-cookie'

const TokenKey = 'Blog-Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

/**
 * localStorage 封装
 */
// 设置
export function setStorage(key, data) {
  window.localStorage.setItem(key, JSON.stringify(data))
}
// 获取
export function getStorage(key) {
  return window.localStorage.getItem(key)
}
// 移除
export function removeStorage(key) {
  window.localStorage.removeItem(key)
}
