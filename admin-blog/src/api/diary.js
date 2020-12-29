import request from '../utils/request'

// 增
export function addDiary(payload) {
  return request({
    url: '/diary',
    method: 'post',
    data: { ...payload },
  })
}

// 删
export function delDiary(payload) {
  return request({
    url: `/diary/${payload}`,
    method: 'delete',
  })
}

// 改
export function putDiary(_id, payload) {
  return request({
    url: `/diary/${_id}`,
    method: 'put',
    data: { ...payload },
  })
}

// 查
export function getDiary() {
  return request({
    url: '/diary',
    method: 'get',
  })
}
