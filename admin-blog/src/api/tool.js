import request from '../utils/request'

// 增
export function addToolLink(payload) {
  return request({
    url: '/toollink',
    method: 'post',
    data: { ...payload },
  })
}

// 删
export function delToolLink(payload) {
  return request({
    url: `/toollink/${payload}`,
    method: 'delete',
  })
}

// 改
export function putToolLink(_id, payload) {
  return request({
    url: `/toollink/${_id}`,
    method: 'put',
    data: { ...payload },
  })
}

// 查
export function getToolLink() {
  return request({
    url: '/toollink',
    method: 'get',
  })
}
