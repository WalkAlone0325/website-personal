/**
 * localStorage 封装
 */
// 设置
export function setStorage({ key, data }) {
  window.localStorage.setItem(key, JSON.stringify(data))
}
// 获取
export function getStorage(key) {
  return window.localStorage.getItem(key)
}
// 移除
export function removeStorage({ key, success }) {
  window.localStorage.removeItem(key)
  success()
}
