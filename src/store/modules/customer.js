import { newData, updateData } from '@/api/customer'

const state = {
  CustomerData: {
    'customer_id': { label: 'ID', default: null },
    'company_name': { label: '名稱', list: 0, edit: 0, default: '', search: 1 },
    'email': { label: 'Email', list: 0, edit: 0, default: '' },
    'fax': { label: '傳真', list: 0, edit: 0, default: '' },
    'tax_id_number': { label: '統一編號', list: 0, edit: 0, default: '' },
    'address': { label: '地址', list: 0, edit: 0, default: '' },
    'phone_number': { label: '電話', list: 0, edit: 0, default: '' },
    'contact_person': { label: '聯絡人', list: 0, edit: 0, default: '' },
    'notes': { label: '備註', list: 0, edit: 0, default: '' }
  },
  rules: {
    company_name: [{ required: true, message: '客戶名稱為必填', trigger: 'change' }],
    address: [{ required: true, message: '地址為必填', trigger: 'change' }],
    phone_number: [{ required: true, message: '電話為必填', trigger: 'change' }],
    contact_person: [{ required: true, message: '聯絡人為必填', trigger: 'change' }]
  }
}

const mutations = {
}

const actions = {

  // create user
  newData({ commit, state }, paras) {
    return new Promise((resolve, reject) => {
      newData(paras).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // create user
  updateData({ commit, state }, paras) {
    return new Promise((resolve, reject) => {
      updateData(paras).then(response => {
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
