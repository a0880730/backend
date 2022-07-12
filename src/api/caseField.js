import request from '@/utils/request'

// 取得
export function getInfo(paras) {
  var searchId = ''
  if (paras.case_id != null) searchId = '/' + paras.case_id
  if (paras.page !== null && paras.page_size !== null) {
    var dataQuery = new URLSearchParams(paras).toString()
    searchId += '?' + dataQuery
  }
  return request({
    url: '/case' + searchId,
    method: 'get'
  })
}

export function newData(data) {
  return request({
    url: '/case',
    method: 'post',
    data
  })
}

export function updateData(data) {
  return request({
    url: '/case/' + data.case_id,
    method: 'patch',
    data
  })
}

// 取得報價單
export function getQuotation(paras) {
  // var searchId = ''
  // 擷取案場ID
  var case_id = ''
  if (paras.case_id != null) {
    case_id = paras.case_id
    delete paras.case_id
  }
  // 擷取報價單ID
  var quotation_id = ''
  if (paras.quotation_id != null) {
    quotation_id = '/' + paras.quotation_id
  }
  return request({
    url: '/case/' + case_id + '/quotation' + quotation_id,
    method: 'get'
  })
}

// 新增報價單
export function newQuotation(paras) {
  // 擷取案場ID
  var case_id = ''
  if (paras.case_id != null) {
    case_id = paras.case_id
    delete paras.case_id
  }
  var data = paras
  return request({
    url: '/case/' + case_id + '/quotation',
    method: 'post',
    data
  })
}

// 取得規格表
export function getBrick(paras) {
  // var searchId = ''
  // 擷取案場ID
  var case_id = ''
  if (paras.case_id != null) {
    case_id = paras.case_id
    delete paras.case_id
  }
  // 擷取報價單ID
  var brick_id = ''
  if (paras.brick_id != null) {
    brick_id = '/' + paras.brick_id
  }
  return request({
    url: '/case/' + case_id + '/brick' + brick_id,
    method: 'get'
  })
}

// 新增石膏磚數量表
export function newBrick(paras) {
  // 擷取案場ID
  var case_id = ''
  if (paras.case_id != null) {
    case_id = paras.case_id
    delete paras.case_id
  }
  var data = paras
  return request({
    url: '/case/' + case_id + '/brick',
    method: 'post',
    data
  })
}

// 刪除石膏磚數量表
export function deleteBrick(paras) {
  // 擷取案場ID
  var case_id = ''
  if (paras.case_id != null) {
    case_id = paras.case_id
    delete paras.case_id
  }
  // 擷取ID
  var brick_id = ''
  if (paras.brick_id != null) {
    brick_id = '/' + paras.brick_id
  }
  var data = paras
  return request({
    url: '/case/' + case_id + '/brick' + brick_id,
    method: 'delete',
    data
  })
}

// 取得案場出貨紀錄
export function getCaseShipping(paras) {
  const case_id = paras.case_id
  delete paras.case_id
  if (case_id == null) return false
  var searchId = ''
  if (paras.page !== null && paras.page_size !== null) {
    var dataQuery = new URLSearchParams(paras).toString()
    searchId += '?' + dataQuery
  }
  return request({
    url: '/case/' + case_id + '/shipping' + searchId,
    method: 'get'
  })
}

// 取得案場出貨紀錄項目 - 未實作
export function getCaseShippingItem(paras) {
  // var data = paras
  // return request({
  //   url: '/product/shipping',
  //   method: 'get',
  //   data
  // })
}

// 新增案場出貨紀錄
export function newCaseShipping(paras) {
  var data = paras
  return request({
    url: '/product/shipping',
    method: 'post',
    data
  })
}

// 取得雜支
export function getMiscList(paras) {
  const case_id = paras.case_id
  delete paras.case_id
  if (case_id == null) return false
  var searchId = ''
  if (paras.page !== null && paras.page_size !== null) {
    var dataQuery = new URLSearchParams(paras).toString()
    searchId += '?' + dataQuery
  }
  return request({
    url: '/case/' + case_id + '/misc' + searchId,
    method: 'get'
  })
}

// 新增雜支紀錄
export function newCaseMisc(paras) {
  const case_id = paras.case_id
  delete paras.case_id
  if (case_id == null) return false
  var data = paras
  return request({
    url: '/case/' + case_id + '/misc',
    method: 'post',
    data
  })
}

// 取得收款紀錄
export function getReceipts(paras) {
  const case_id = paras.case_id
  delete paras.case_id
  if (case_id == null) return false
  var searchId = ''
  if (paras.page !== null && paras.page_size !== null) {
    var dataQuery = new URLSearchParams(paras).toString()
    searchId += '?' + dataQuery
  }
  return request({
    url: '/case/' + case_id + '/receipts' + searchId,
    method: 'get'
  })
}

// 新增收款紀錄
export function newReceipts(paras) {
  const case_id = paras.case_id
  delete paras.case_id
  var data = paras
  return request({
    url: '/case/' + case_id + '/receipts',
    method: 'post',
    data
  })
}

// 刪除收款紀錄
export function deleteReceipt(paras) {
  const case_id = paras.case_id
  delete paras.case_id
  const receipts_id = paras.receipts_id
  return request({
    url: '/case/' + case_id + '/receipts/' + receipts_id,
    method: 'delete'
  })
}
