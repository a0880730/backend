import request from '@/utils/request'

export function getCompanyInfo(paras) {
  return request({
    url: '/company',
    method: 'get'
  })
}

export function updateData(data) {
  return request({
    url: '/company',
    method: 'patch',
    data
  })
}
