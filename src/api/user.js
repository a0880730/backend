import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(paras) {
  var searchUser = ''
  if (paras.userId != null && paras.userId !== '') searchUser = '/' + paras.userId
  var data = {}
  if (paras.page !== null && paras.page_size !== null) {
    var dataQuery = new URLSearchParams(paras).toString()
    searchUser += '?' + dataQuery
  }
  return request({
    url: '/user' + searchUser,
    method: 'get',
    data
  })
}

export function newUser(data) {
  return request({
    url: '/user',
    method: 'post',
    data
  })
}

