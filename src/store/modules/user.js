import { login, getInfo, newUser } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  user_id: '',
  username: '',
  first_name: '',
  last_name: '',
  display_name: '',
  avatar: '',
  status: '',
  roles: [],

  // 管理員資料
  PersonnelDataList: [],

  PersonnelData: {
    'user_id': { label: 'ID', default: null },
    'first_name': { label: 'first_name', default: '' },
    'last_name': { label: 'last_name', default: '' },
    'avatar': { label: '大頭照', default: '' },
    'username': { label: '帳號', list: 0, edit: 0, default: '', search: 1 },
    'password': { label: '密碼', type: 'password', edit: 0, default: '' },
    'role': { label: '權限', list: 3, edit: 2, default: 'admin',
      colType: {
        data: ['admin', 'user']
      }
    },
    'display_name': { label: '名稱', list: 0, edit: 0, default: '', search: 1 },
    'status': { label: '狀態', list: 1, edit: 1, default: 1, search: 2,
      colType: {
        data: {
          // 0: '禁用',
          1: '啟用',
          2: '封鎖'
        },
        typeColor: {
          0: 'danger',
          1: 'success',
          2: 'info'
        }
      }
    }
  },
  rules: {
    username: [{ required: true, message: '帳號為必填', trigger: 'change' }],
    // password: [{ required: true, message: '密碼為必填', trigger: 'change' }],
    display_name: [{ required: true, message: '名稱為必填', trigger: 'change' }],
    status: [{ required: true, message: '狀態為必填', trigger: 'change' }]
  },
  CalendarData: {
    'calendar_event_id': { label: 'id', default: '' },
    'name': { label: '待辦事項', edit: 0, default: '' },
    'assign_for': { label: '指派給', edit: 7, default: '', selectData: '' },
    'color': { label: '底色', edit: 8, default: '#4299e1', colType: {
      data: {
        '#4299e1': '#4299e1',
        '#38b2ac': '#38b2ac',
        '#e53e3e': '#38b2ac',
        '#ed8936': '#ed8936',
        '#ed64a6': '#ed64a6'
      }
    }
    },
    'start_at': { label: '時間', edit: 6, default: '' },
    'end_at': { label: '結束時間', default: '' },
    'notes': { label: '備註', edit: 0, default: '', type: 'textarea' }
  },
  CalendarDataRules: {
    'name': [{ required: true, message: '待辦事項為必填', trigger: 'change' }],
    'assign_for': [{ required: true, message: '人員為必填', trigger: 'change' }],
    'start_at': [{ required: true, message: '時間為必填', trigger: 'change' }]
  },
  // 權限
  PermissionData: {
    permission_tag: { label: '權限標籤', list: 0, edit: 0, default: '' },
    name: { label: '群組名稱', list: 0, edit: 0, default: '' },
    allow_method: { label: '允許權限', list: 0, edit: 0, default: ['GET'] },
    allow_path: { label: '允許權限', list: 0, edit: 0, default: '' },
    notes: { label: '備註', list: 0, edit: 0, default: '' }
  }
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_USER_ID: (state, user_id) => {
    state.user_id = user_id
  },
  SET_USER_DATA: (state, data) => {
    state.username = data.username
    state.first_name = data.first_name
    state.last_name = data.last_name
    state.display_name = data.display_name
    state.avatar = data.avatar
    state.status = data.status
  },
  SET_PERSONNEL_LIST: (state, data) => {
    const personnel = {}
    for (const i in data) {
      personnel[data[i].user_id] = data[i]
    }
    state.PersonnelDataList = personnel
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_USER_ID', data.user_id)
        commit('SET_TOKEN', data.access_token)
        setToken(data.access_token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }, paras) {
    return new Promise((resolve, reject) => {
      getInfo(paras).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { role } = data

        // roles must be a non-empty array
        if (!role || role === '') {
          reject('getInfo: roles must be a non-null array!')
        }

        commit('SET_USER_DATA', data)
        commit('SET_ROLES', [role])
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user list
  getUserList({ commit, state }, paras) {
    return new Promise((resolve, reject) => {
      getInfo(paras).then(response => {
        commit('SET_PERSONNEL_LIST', response.data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // create user
  newUser({ commit, state }, userInfo) {
    return new Promise((resolve, reject) => {
      newUser(userInfo).then(response => {
        // console.log('newUser', userInfo)
        // console.log(response)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    commit('SET_TOKEN', '')
    commit('SET_ROLES', [])
    removeToken()
    resetRouter()
    // reset visited views and cached views
    // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
    dispatch('tagsView/delAllViews', null, { root: true })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'
    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
