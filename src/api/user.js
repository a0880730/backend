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
  var dataQuery = ''
  if (paras.page !== null && paras.page_size !== null) {
    dataQuery = new URLSearchParams(paras).toString()
    searchUser += '?' + dataQuery
  }
  return request({
    url: '/user' + searchUser,
    method: 'get'
  })
}

// 新增管理員
export function newUser(data) {
  return request({
    url: '/user',
    method: 'post',
    data
  })
}

// 修改管理員
export function updateUser(data) {
  if (data.user_id == null) return
  const user_id = data.user_id
  delete data.user_id
  return request({
    url: '/user/' + user_id,
    method: 'patch',
    data
  })
}

// 取得行事曆
export function getCalendar(data) {
  var dataQuery = new URLSearchParams(data).toString()
  return request({
    url: '/calendar?' + dataQuery,
    method: 'get'
  })
}

// 新增行事曆事件
export function postCalendar(data) {
  return request({
    url: '/calendar',
    method: 'post',
    data
  })
}

// 修改行事曆事件
export function updateCalendar(data) {
  const calendar_event_id = data.calendar_event_id
  delete data.calendar_event_id
  return request({
    url: '/calendar/' + calendar_event_id,
    method: 'patch',
    data
  })
}

// 刪除行事曆事件
export function deleteCalendar(data) {
  return request({
    url: '/calendar/' + data.calendar_event_id,
    method: 'delete'
  })
}

// 取得薪水設定
export function getUserSalary(paras) {
  if (paras.user_id == null) return Promise.reject('NO ID')
  const user_id = paras.user_id
  return request({
    url: `/personnel/users/salary/${user_id}`,
    method: 'get'
  })
}

// 更新薪水設定
export function patchUserSalary(data) {
  if (data.user_id == null) return Promise.reject('NO ID')
  const user_id = data.user_id
  delete data.user_id
  return request({
    url: `/personnel/users/salary/${user_id}`,
    method: 'patch',
    data
  })
}


// 取得所有試算薪資
export function getSalary(paras) {
  return request({
    url: '/personnel/salary/trial-balance',
    method: 'get'
  })
}

// 當月試算薪資
export function newSalary(data) {
  return request({
    url: '/personnel/salary/trial-balance',
    method: 'post',
    data
  })
}

// 修改試算薪資
export function patchSalary(data) {
  if (data.trialbalance_id == null) return
  const trialbalance_id = data.trialbalance_id
  delete data.trialbalance_id
  return request({
    url: `/personnel/salary/trial-balance/${trialbalance_id}`,
    method: 'patch',
    data
  })
}

// 刪除試算薪資
export function deleteSalary(data) {
  if (data.salary_trial_balance_id == null) return
  const trialbalance_id = data.salary_trial_balance_id
  return request({
    url: `/personnel/salary/trial-balance/${trialbalance_id}`,
    method: 'delete'
  })
}

// 取得試算薪資詳細
export function getSalaryDetail(data) {
  if (data.salary_trial_balance_id == null) return
  const trialbalance_id = data.salary_trial_balance_id
  return request({
    url: `/personnel/salary/trial-balance/${trialbalance_id}`,
    method: 'get'
  })
}
