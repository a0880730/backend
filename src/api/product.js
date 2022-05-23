import request from '@/utils/request'

// 取得商品
export function getProductInfo(paras) {
  var searchId = ''
  if (paras.userId != null && paras.userId !== '') searchId = '/' + paras.userId
  if (paras.page !== null && paras.page_size !== null) {
    var dataQuery = new URLSearchParams(paras).toString()
    searchId += '?' + dataQuery
  }
  return request({
    url: '/product' + searchId,
    method: 'get'
  })
}

// 新增商品
export function newData(data) {
  return request({
    url: '/product',
    method: 'post',
    data
  })
}

// 修改商品
export function updateData(data) {
  return request({
    url: '/product/' + data.product_id,
    method: 'patch',
    data
  })
}

// 取得商品類型及規格
export function getTypeInfo(paras) {
  var searchId = ''
  if (paras.userId != null && paras.userId !== '') searchId = '/' + paras.userId
  if (paras.page !== null && paras.page_size !== null) {
    var dataQuery = new URLSearchParams(paras).toString()
    searchId += '?' + dataQuery
  }
  return request({
    url: '/product/type' + searchId,
    method: 'get'
  })
}

// 新增商品類型及規格
export function newTypeData(data) {
  return request({
    url: '/product/type',
    method: 'post',
    data
  })
}

// 修改商品類型及規格
export function updateTypeData(data) {
  return request({
    url: '/product/type/' + data.type_id,
    method: 'patch',
    data
  })
}

// 新增商品進貨紀錄 (簡易進貨模式)
export function purchaseProduct(data) {
  var productId = data.product_id
  if (productId == null) return false
  delete data.product_id
  return request({
    url: '/product/' + productId + '/purchase',
    method: 'post',
    data
  })
}

// 取得商品庫存紀錄
export function getProductRecord(paras) {
  var searchId = ''
  if (paras.page !== null && paras.page_size !== null) {
    var dataQuery = new URLSearchParams(paras).toString()
    searchId += '?' + dataQuery
  }
  return request({
    url: '/product/record' + searchId,
    method: 'get'
  })
}
