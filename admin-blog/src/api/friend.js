import request from '../utils/request'

// 增
export function addFriendLink(payload) {
  return request({
    url: '/friendlink',
    method: 'post',
    data: { ...payload },
  })
}

// 删
export function delFriendLink(payload) {
  return request({
    url: `/friendlink/${payload}`,
    method: 'delete',
  })
}

// 改
export function putFriendLink(_id, payload) {
  return request({
    url: `/friendlink/${_id}`,
    method: 'put',
    data: { ...payload },
  })
}

// 查
export function getFriendLink() {
  return request({
    url: '/friendlink',
    method: 'get',
  })
}
