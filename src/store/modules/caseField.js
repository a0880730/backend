import { getInfo, newData, updateData, getQuotation, newQuotation, getBrick, newBrick, deleteBrick } from '@/api/caseField'

const state = {
  // 案場
  CaseFieldData: {
    'case_id': { label: 'ID', default: null },
    'name': { label: '名稱', list: 0, edit: 0, default: '', search: 1 },
    'customer_id': { label: '客戶', list: 9, edit: 6, default: '', showMethod: '', selectData: '' },
    'contractor_id': { label: '包商', list: 9, edit: 6, default: '', showMethod: '', selectData: '' },
    'address': { label: '地址', list: 0, edit: 0, default: '', search: 1 },
    'notes': { label: '備註', list: 0, edit: 0, default: '' }
  },
  rules: {
    name: [{ required: true, message: '名稱為必填', trigger: 'change' }],
    address: [{ required: true, message: '地址為必填', trigger: 'change' }],
    customer_id: [{ required: true, message: '客戶為必填', trigger: 'change' }],
    contractor_id: [{ required: true, message: '包商為必填', trigger: 'change' }]
  },

  // 報價單item
  QuotationItem: {
    'name': { label: '施工內容', list: 0, edit: 0, default: '' },
    'specification': {
      label: '規格', list: 0, edit: 0, default: '',
      colType: {
        data: {},
        followKey: 'type'
      }
    },
    'unit': { label: '單位', list: 0, edit: 0, default: '' },
    'quantity': { label: '數量', list: 0, edit: 0, default: '' },
    'unit_price': { label: '單價(元)', list: 0, edit: 0, default: '' },
    'amount': { label: '金額(元)', list: 0, edit: 0, type: 'number', default: '' },
    'notes': { label: '備註', list: 0, edit: 0, default: '' }
  },
  QuotationItemRules: {
    name: [{ required: true, message: '名稱為必填', trigger: 'change' }],
    // specification: [{ required: true, message: '規格為必填', trigger: 'change' }],
    // unit: [{ required: true, message: '單位為必填', trigger: 'change' }],
    // quantity: [{ required: true, message: '數量為必填', trigger: 'change' }],
    // unit_price: [{ required: true, message: '單價為必填', trigger: 'change' }],
    amount: [{ required: true, message: '金額為必填', trigger: 'change' },
      { max: 100000000, min: 0, type: 'number', message: '數值超出範圍', trigger: 'change' }]
  },
  // 石膏磚數量計算表item
  BrickItem: {
    'number': { label: '編號', list: 0, edit: 0, default: '' },
    'name': { label: '施工內容', list: 0, edit: 0, default: '' },
    'width': { label: '寬(M)', list: 0, edit: 0, default: '' },
    'height': { label: '高(M)', list: 0, edit: 0, default: '' },
    'quantity': { label: '數量(M²)', list: 0, edit: 99, default: '0' },
    'door_width': { label: '門洞寬(M)', list: 0, edit: 0, default: '' },
    'door_height': { label: '門洞高(M)', list: 0, edit: 0, default: '' },
    'door_quantity': { label: '門洞總計(M²)', list: 0, edit: 99, default: '0' },
    'window_width': { label: '窗洞寬(M)', list: 0, edit: 0, default: '' },
    'window_height': { label: '窗洞高(M)', list: 0, edit: 0, default: '' },
    'window_quantity': { label: '窗洞總計(M²)', list: 0, edit: 99, default: '0' },
    'subtotal': { label: '小計(M²)', list: 0, edit: 99, default: '0' },
    'notes': { label: '備註', list: 0, edit: 0, default: '' }
  },
  // 進出貨
  ShippingItem: {
    'product_id': { label: '商品', list: 1, edit: 6, default: '' },
    'quantity': { label: '數量', list: 1, edit: 0, default: null }
  },
  // 進出貨
  ShippingItemRules: {
    'product_id': [{ required: true, message: '商品為必填', trigger: 'change' }],
    'quantity': [{ required: true, message: '數量為必填', trigger: 'change' }]
  }
}

const mutations = {

}

const actions = {
  // 取得案場
  getInfo({ commit, state }, paras) {
    return new Promise((resolve, reject) => {
      getInfo(paras).then(response => {
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // create
  newData({ commit, state }, paras) {
    return new Promise((resolve, reject) => {
      newData(paras).then(response => {
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // update
  updateData({ commit, state }, paras) {
    return new Promise((resolve, reject) => {
      updateData(paras).then(response => {
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 取得報價單
  getQuotation({ commit, state }, paras) {
    return new Promise((resolve, reject) => {
      getQuotation(paras).then(response => {
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 新增報價單
  newQuotation({ commit, state }, paras) {
    return new Promise((resolve, reject) => {
      newQuotation(paras).then(response => {
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 取得規格表
  getBrick({ commit, state }, paras) {
    return new Promise((resolve, reject) => {
      getBrick(paras).then(response => {
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 新增規格表
  newBrick({ commit, state }, paras) {
    return new Promise((resolve, reject) => {
      newBrick(paras).then(response => {
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 刪除規格表
  deleteBrick({ commit, state }, paras) {
    return new Promise((resolve, reject) => {
      deleteBrick(paras).then(response => {
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
