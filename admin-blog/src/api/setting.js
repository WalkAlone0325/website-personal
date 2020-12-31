import request from '../utils/request'

// 增
export function addSetting(payload) {
  return request({
    url: '/setting',
    method: 'post',
    data: { ...payload },
  })
}

// 删
export function delSetting(payload) {
  return request({
    url: `/setting/${payload}`,
    method: 'delete',
  })
}

// 改
export function putSetting(_id, payload) {
  return request({
    url: `/setting/${_id}`,
    method: 'put',
    data: { ...payload },
  })
}

// 查
export function getSetting() {
  return request({
    url: '/setting',
    method: 'get',
  })
}
