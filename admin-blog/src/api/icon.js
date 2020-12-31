import request from '../utils/request'

// 增
export function addIconLink(payload) {
  return request({
    url: '/iconlist',
    method: 'post',
    data: { ...payload },
  })
}

// 删
export function delIconLink(payload) {
  return request({
    url: `/iconlist/${payload}`,
    method: 'delete',
  })
}

// 改
export function putIconLink(_id, payload) {
  return request({
    url: `/iconlist/${_id}`,
    method: 'put',
    data: { ...payload },
  })
}

// 查
export function getIconLink() {
  return request({
    url: '/iconlist',
    method: 'get',
  })
}
