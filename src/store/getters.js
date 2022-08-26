const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  user_id: state => state.user.user_id,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  async_routes: state => state.permission.asyncRoutes,
  errorLogs: state => state.errorLog.logs,

  // 取得資料預設值設定
  defaultData: state => (data) => {
    var defaultData = {}
    for (var i in data) {
      if (typeof data[i].default !== 'undefined') {
        defaultData[i] = data[i].default
      }
    }
    return defaultData
  },

  // 取得會員名稱
  getUserInfo: state => (id) => {
    if (typeof state.user.PersonnelDataList[id] === 'undefined') {
      return { username: '' }
    }
    return state.user.PersonnelDataList[id]
  },

  // 取得商品名稱
  getSroreProductInfo: state => (id) => {
    return state.product.productDataList[id]
  },

  // 時間轉換YYYY-MM-DD HH:II:SS
  timeToFormat: state => (String) => {
    const date = new Date(String)
    const y = date.getFullYear()
    const m = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
    const d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    const hh = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
    const mm = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    const ss = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
  },

  // 時間轉換RFC3339
  timeToRFC: state => (String) => {
    const date = new Date(String)
    const y = date.getFullYear()
    const m = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
    const d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    const hh = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
    const mm = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    const ss = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    let dateString = y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    dateString = dateString.replace(/\s+/g, 'T') + '+08:00'
    return dateString
  }
}
export default getters
