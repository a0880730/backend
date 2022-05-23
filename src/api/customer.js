import request from '@/utils/request'

export function getCustomerInfo(paras) {
  var searchId = ''
  if (paras.customer_id != null && paras.customer_id !== '') searchId = '/' + paras.customer_id
  if (paras.page !== null && paras.page_size !== null) {
    var dataQuery = new URLSearchParams(paras).toString()
    searchId += '?' + dataQuery
  }
  return request({
    url: '/customer' + searchId,
    method: 'get'
  })
}

export function newData(data) {
  return request({
    url: '/customer',
    method: 'post',
    data
  })
}

export function updateData(data) {
  return request({
    url: '/customer/' + data.customer_id,
    method: 'patch',
    data
  })
}
