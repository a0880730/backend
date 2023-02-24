import { asyncRoutes, constantRoutes } from '@/router'
import { getPermission } from '@/api/role'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(permissions, route) {
  if (route.name) {
    return permissions.some(permission => route.name === permission)
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, permission) {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(permission, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, permission)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: [],
  permissions: [],
  asyncRoutes: asyncRoutes
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  // 紀錄權限(判斷是否有權限時使用) - Jerry
  SET_PERMISSIONS: (state, permissions) => {
    state.permissions = permissions
  },
}

const actions = {
  getPermission({ commit }, roles) {
    return new Promise((resolve, reject) => {
      let permission = []
      if (roles.includes('admin')) {
        permission.push('*')
        resolve(permission)
      } else {
        getPermission({ 'permission_tag': roles }).then(response => {
          if (response.code === 200) {
            permission = [...response.data[0].allow_path]
            resolve(permission)
          }
        }).catch(error => {
          reject(error)
        })
      }
    })
  },
  generateRoutes({ commit }, permissions) {
    return new Promise(resolve => {
      let accessedRoutes
      if (permissions.includes('*')) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, permissions)
      }
      commit('SET_PERMISSIONS', permissions)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
