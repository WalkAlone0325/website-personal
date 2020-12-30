import request from '../utils/request'

// 增
export function addAdmin(payload) {
  return request({
    url: '/admin',
    method: 'post',
    data: { ...payload },
  })
}

// 删
export function delAdmin(payload) {
  return request({
    url: `/admin/${payload}`,
    method: 'delete',
  })
}

// 改
export function putAdmin(_id, payload) {
  return request({
    url: `/admin/${_id}`,
    method: 'put',
    data: { ...payload },
  })
}

// 查
export function getAdmin() {
  return request({
    url: '/admin',
    method: 'get',
  })
}

// 登录
export function loginAdmin(payload) {
  return request({
    url: '/login',
    method: 'post',
    data: { ...payload },
  })
}
