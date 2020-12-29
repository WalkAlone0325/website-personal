import request from '../utils/request'

// 增
export function addTag(payload) {
  console.log(payload)
  return request({
    url: '/tag',
    method: 'post',
    data: { ...payload },
  })
}

// 删
export function delTag(payload) {
  return request({
    url: `/tag/${payload}`,
    method: 'delete',
  })
}

// 改
export function putTag(_id, payload) {
  return request({
    url: `/tag/${_id}`,
    method: 'put',
    data: { ...payload },
  })
}

// 查
export function getTag() {
  return request({
    url: '/tag',
    method: 'get',
  })
}
