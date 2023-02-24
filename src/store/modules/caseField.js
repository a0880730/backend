import { getInfo, newData, updateData, deleteCaseField, getQuotation, newQuotation, deleteQuotation, getBrick, newBrick, updateBrick, deleteBrick, newCaseShipping, newCaseMisc, newReceipts, newBrickRange, updateBrickRange, deleteBrickRange } from '@/api/caseField'

const state = {

  // 案場施工級距
  CaseBrickRange: {
    'id': { label: 'ID', default: null },
    'case_type': { label: '案場類型', list: 1, edit: 1, default: 1, colType: {
      data: {
        1: '裝修案',
        2: '工地案'
      }
    }},
    'name': { label: '級距名稱', list: 0, edit: 0, default: '' },
    'construction_height_gt': { label: '高度大於(cm)', list: 0, edit: 0, type: 'number', default: '' },
    'wage': { label: '計算起薪', list: 0, edit: 0, default: '' },
    'notes': { label: '備註', list: 0, edit: 0, default: '' }
  },
  CaseBrickRangeRules: {
    case_type: [{ required: true, message: '案場類型為必填', trigger: 'change' }],
    name: [{ required: true, message: '名稱為必填', trigger: 'change' }],
    construction_height_gt: [{ required: true, message: '施工高度為必填', trigger: 'change' }],
    wage: [{ required: true, message: '計算起薪為必填', trigger: 'change' }]
  },

  // 案場
  CaseFieldData: {
    'case_id': { label: 'ID', default: null },
    'name': { label: '名稱', list: 0, edit: 0, default: '', search: 1 },
    'customer_id': { label: '客戶', list: 9, edit: 7, default: '', showMethod: '', selectData: '' },
    'contractor_id': { label: '包商', list: 9, edit: 7, default: '', showMethod: '', selectData: '' },
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
    'name': { label: '施工內容', list: 0, edit: 9, default: '', selectData: '' },
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
  // 石膏磚數量計算表item
  WorkFinishBrick: {
    'assign_for': { label: '施工人員', list: 0, edit: 7, default: '', selectData: '' },
    'notes': { label: '備註', list: 0, edit: 0, default: '' }
  },
  WorkFinishBrickRules: {
    'assign_for': [{ required: true, message: '施工人員為必填', trigger: 'change' }]
  },
  // 進出貨
  ShippingItem: {
    'product_id': { label: '商品', list: 1, edit: 7, default: '' },
    'quantity': { label: '數量', list: 1, edit: 0, default: '0' }
  },
  ShippingItemRules: {
    'product_id': [{ required: true, message: '商品為必填', trigger: 'change' }],
    'quantity': [{ required: true, message: '數量為必填', trigger: 'change' }]
  },
  // 零用金
  MiscData: {
    'name': { label: '雜支項目', edit: 0, default: '' },
    'amount': { label: '金額', edit: 0, default: '0' },
    'petty_cash': { label: '扣零用金', edit: 1, default: 0,
      colType: {
        data: {
          0: '不扣零用金',
          1: '扣零用金'
        },
        followKey: 'type'
      }
    }
  },
  MiscDataRules: {
    'name': [{ required: true, message: '雜支項目為必填', trigger: 'change' }],
    'amount': [{ required: true, message: '金額為必填', trigger: 'change' }],
    'petty_cash': [{ required: true, message: '此欄為必填', trigger: 'change' }]
  },
  // 回收進貨
  PurchaseData: {
    'product_id': { label: '產品', edit: 7, default: '' },
    'quantity': { label: '數量', edit: 0, type: 'number', default: '' },
    'cost_price': { label: '回收單價', edit: 0, type: 'number', default: '' }
  },
  PurchaseDataRules: {
    'product_id': [{ required: true, message: '商品為必填', trigger: 'change' }],
    'quantity': [{ required: true, message: '數量為必填', trigger: 'change' },
      { min: 1, type: 'number', message: '數量必須大於0', trigger: 'change' }],
    'cost_price': [{ required: true, message: '回收單價為必填', trigger: 'change' },
      { min: 1, type: 'number', message: '回收單價必須大於0', trigger: 'change' }]
  },

  // 收款
  ReceiptsData: {
    'receipts': { label: '收款金額', edit: 0, type: 'number', default: '' },
    'notes': { label: '備註', edit: 0, default: '' }
  },
  ReceiptsDataRules: {
    'receipts': [{ required: true, message: '收款金額為必填', trigger: 'change' }]
  }
}

const mutations = {
}

const actions = {
  // 取得案場
  getInfo({ commit, state }, paras) {
    return new Promise((resolve, reject) => {
      getInfo(paras).then(response => {
        resolve(response)
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
  // delete 案場
  deleteCaseField({ commit, state }, paras) {
    return new Promise((resolve, reject) => {
      deleteCaseField(paras).then(response => {
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
  // 刪除報價單
  deleteQuotation({ commit, state }, paras) {
    return new Promise((resolve, reject) => {
      deleteQuotation(paras).then(response => {
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

  // 新增規格表
  updateBrick({ commit, state }, paras) {
    return new Promise((resolve, reject) => {
      updateBrick(paras).then(response => {
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
  },

  // 新增出貨紀錄
  newCaseShipping({ commit, state }, paras) {
    return new Promise((resolve, reject) => {
      newCaseShipping(paras).then(response => {
        const callback = { ...response }
        if (response.code === 201) {
          callback.notify = { title: '成功', message: '資料新增成功', type: 'success', duration: 2000 }
        } else if (callback.code === 409) {
          callback.notify = { title: '失敗', message: '商品庫存不足', type: 'error', duration: 2000 }
        }
        resolve(callback)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 新增雜支項目
  newCaseMisc({ dispatch }, paras) {
    return new Promise((resolve, reject) => {
      newCaseMisc(paras).then(response => {
        const callback = { ...response }
        if (response.code === 201) {
          callback.notify = { title: '成功', message: '資料新增成功', type: 'success', duration: 2000 }
        } else if (response.code === 409) {
          callback.notify = { title: '失敗', message: '零用金餘額不足', type: 'error', duration: 2000 }
        }
        resolve(callback)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 新增收款項目
  newReceipts(paras) {
    return new Promise((resolve, reject) => {
      newReceipts(paras).then(response => {
        const callback = { ...response }
        if (response.code === 201) {
          callback.notify = { title: '成功', message: '資料新增成功', type: 'success', duration: 2000 }
        } else if (response.code === 409) {
          callback.notify = { title: '失敗', message: '錯誤:' + response.code, type: 'error', duration: 2000 }
        }
        resolve(callback)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 新增案場施工級距
  newBrickRange({ commit, state }, paras) {
    return new Promise((resolve, reject) => {
      newBrickRange(paras).then(response => {
        const callback = { ...response }
        if (response.code === 201) {
          callback.notify = { title: '成功', message: '資料新增成功', type: 'success', duration: 2000 }
        } else if (response.code === 409) {
          callback.notify = { title: '失敗', message: '錯誤:' + response.code, type: 'error', duration: 2000 }
        }
        resolve(callback)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 修改案場施工級距
  updateBrickRange({ commit, state }, paras) {
    return new Promise((resolve, reject) => {
      updateBrickRange(paras).then(response => {
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 刪除案場施工級距
  deleteBrickRange({ commit, state }, paras) {
    return new Promise((resolve, reject) => {
      deleteBrickRange(paras).then(response => {
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
