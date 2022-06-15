import { getPettyCash, newPettyCash } from '@/api/pettyCash'

const state = {
  // 零用金
  pettyCash: -1,
  // 零用金資料
  PettyCashData: {
    'petty_cash_id': { label: 'ID', default: null },
    'applicant': { label: '申請人', list: 9, default: '', showMethod: null },
    'type': { label: '類型', list: 1, colType: {
      data: {
        1: '儲值',
        2: '出款'
      },
      typeColor: {
        1: 'success',
        2: 'danger'
      }
    }},
    'amount': { label: '金額', list: 0, edit: 0, default: '' },
    'case_id': { label: '案場', list: 9, default: '', showMethod: null },
    'created_at': { label: '新增時間', list: 6, default: '' },
    'notes': { label: '備註', list: 0, edit: 0, default: '' }
  }
}

const mutations = {
  SET_PETTY_CASH: (state, data) => {
    state.pettyCash = data.current_balance
  }
}

const actions = {

  // 取得零用金餘額
  getPettyCash({ commit, state }, paras) {
    return new Promise((resolve, reject) => {
      getPettyCash(paras).then(response => {
        commit('SET_PETTY_CASH', response.data)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 儲值零用金餘額
  newPettyCash({ dispatch }, paras) {
    return new Promise((resolve, reject) => {
      newPettyCash(paras).then(response => {
        dispatch('getPettyCash')
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
