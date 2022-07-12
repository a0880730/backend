import request from '@/utils/request'

export function getPermission() {
  return request({
    url: '/permission',
    method: 'get'
  })
}

export function addPermission(data) {
  return request({
    url: '/permission',
    method: 'post',
    data
  })
}

export function updatePermission(paras) {
  const permission_id = paras.permission_id
  delete paras.permission_id
  const data = paras
  return request({
    url: `/permission/${permission_id}`,
    method: 'patch',
    data
  })
}

export function deletePermission(paras) {
  const permission_id = paras.permission_id
  return request({
    url: `/permission/${permission_id}`,
    method: 'delete'
  })
}

export function getRole() {
  return request({
    url: '/role',
    method: 'get'
  })
}

export function addRole(data) {
  return request({
    url: '/role',
    method: 'post',
    data
  })
}

export function updateRole(paras) {
  const role_id = paras.role_id
  delete paras.role_id
  const data = paras
  return request({
    url: `/role/${role_id}`,
    method: 'patch',
    data
  })
}

export function deleteRole(paras) {
  const role_id = paras.role_id
  return request({
    url: `/role/${role_id}`,
    method: 'delete'
  })
}
