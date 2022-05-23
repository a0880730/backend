import { getCompanyInfo, updateData } from '@/api/company'

const state = {
  CompanyData: {
    'company_name': { label: '名稱', list: 0, edit: 0, default: '', search: 1 },
    'email': { label: 'Email', list: 0, edit: 0, default: '' },
    'phone_number': { label: '電話', list: 0, edit: 0, default: '' },
    'fax': { label: '傳真', list: 0, edit: 0, default: '' },
    'tax_id_number': { label: '統一編號', list: 0, edit: 0, default: '' },
    'address': { label: '地址', list: 0, edit: 0, default: '' },
    'person_in_charge': { label: '負責人', list: 0, edit: 0, default: '' },
    'contact_person': { label: '聯絡人', list: 0, edit: 0, default: '' }
  },
  rules: {
  }
}

const mutations = {
}

const actions = {

  // get user info
  getCompanyInfo({ commit, state }, paras) {
    return new Promise((resolve, reject) => {
      getCompanyInfo(paras).then(response => {
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // update Data
  updateData({ commit, state }, paras) {
    return new Promise((resolve, reject) => {
      updateData(paras).then(response => {
        console.log('OKKK', response)
        resolve()
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
