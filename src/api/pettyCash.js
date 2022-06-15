import request from '@/utils/request'

// 取得零用金
export function getPettyCash(paras) {
  return request({
    url: '/petty-cash/balance',
    method: 'get'
  })
}

// 取得零用金
export function getPettyCashList(paras) {
  var searchId = ''
  var dataQuery = new URLSearchParams(paras).toString()
  searchId += '?' + dataQuery
  return request({
    url: '/petty-cash' + searchId,
    method: 'get'
  })
}

// 取得零用金
export function newPettyCash(data) {
  return request({
    url: '/petty-cash',
    method: 'post',
    data
  })
}
