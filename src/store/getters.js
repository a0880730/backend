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
    return state.user.PersonnelDataList[id]
  },

  // 取得商品名稱
  getSroreProductInfo: state => (id) => {
    return state.product.productDataList[id]
  }

}
export default getters
