import request from '../utils/request'

// 增
export function addArticle(payload) {
  return request({
    url: '/article',
    method: 'post',
    data: { ...payload },
  })
}

// 删
export function delArticle(payload) {
  return request({
    url: `/article/${payload}`,
    method: 'delete',
  })
}

// 改
export function putArticle(_id, payload) {
  return request({
    url: `/article/${_id}`,
    method: 'put',
    data: { ...payload },
  })
}

// 查
export function getArticle(payload) {
  return request({
    url: '/article',
    method: 'get',
    params: { ...payload },
  })
}

// 查详情
export function getArticleItem(payload) {
  return request({
    url: `/article/${payload}`,
    method: 'get',
  })
}
