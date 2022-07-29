import { getProductInfo, newData, updateData, newTypeData, updateTypeData, purchaseProduct, getProductRecord } from '@/api/product'

const state = {
  // 商品資料
  productDataList: [],

  // 商品
  ProductData: {
    'product_id': { label: 'ID', default: null },
    'name': { label: '名稱', list: 0, edit: 0, default: '', search: 1 },
    'type': { label: '類型', list: 1, edit: 1, default: 1, search: 2,
      colType: {
        data: {}
      }
    },
    'specification': { label: '規格', list: 5, edit: 5, default: '',
      colType: {
        data: {},
        followKey: 'type'
      }
    },
    'unit_price': { label: '單價', list: 0, edit: 0, type: 'number', default: '0' },
    'quantity_minimum': { label: '計算庫存', list: 0, edit: 1, default: '1',
      colType: {
        data: {
          '-1': '不計算庫存',
          '1': '計算庫存'
        }
      }
    },
    'quantity': { label: '庫存', list: 0 },
    'notes': { label: '備註', list: 0, edit: 0, default: '' },
    'status': { label: '狀態' }
  },
  ProductRules: {
    name: [{ required: true, message: '名稱為必填', trigger: 'change' }],
    type: [{ required: true, message: '商品類型為必填', trigger: 'change' }],
    specification: [{ required: true, message: '規格為必填', trigger: 'change' }],
    unit_price: [
      { max: 9999, min: 0, type: 'number', message: '數值超出範圍', trigger: 'change' },
      { required: true, type: 'number', message: '單價為必填', trigger: 'change' }
    ],
    quantity_minimum: [
      { required: true, type: 'number', message: '庫存下限為必填', trigger: 'change' }
    ]
  },

  // 商品類型
  ProductTypeData: {
    'type_id': { label: 'ID', default: null },
    'name': { label: '名稱', list: 0, edit: 0, default: '' },
    'specName': { label: '規格', list: -1, edit: 0 },
    'specification': { label: '規格', list: 4, default: '',
      colType: {
        nameKey: 'name'
      }
    }
  },
  ProductTypeRules: {
    name: [{ required: true, message: '名稱為必填', trigger: 'change' }]
  },

  // 進出貨
  PurchaseData: {
    'product_id': { label: 'ID', default: null },
    'cost_price': { label: '單價', edit: 0, type: 'number', default: 0 },
    'quantity': { label: '數量', edit: 0, type: 'number', default: 1 },
    'notes': { label: '備註', edit: 0, default: '' }
  },

  PurchaseDataRules: {
    cost_price: [{ min: 0, type: 'number', message: '單價錯誤', trigger: 'change' }],
    quantity: [{ min: 1, type: 'number', message: '數量必須大於0', trigger: 'change' }]
  },

  // 庫存
  RecordData: {
    'batch_id': { label: '進貨批次ID', default: null },
    'record_id': { label: '庫存紀錄ID', default: null },
    'product_id': { label: '商品ID', default: null },
    'product_name': { label: '商品', list: 0, default: null, search: 1 },
    'cost_price': { label: '單價', list: 0, default: '' },
    'quantity': { label: '數量', list: 0, type: 'number', default: 0 },
    'notes': { label: '備註', list: 0, default: '' },
    'created_at': { label: '建立時間', list: 6, default: '', search: 6 }
  }
}

const mutations = {
  SET_PRODUCT_LIST: (state, data) => {
    const productDataList = {}
    for (const i in data) {
      productDataList[data[i].product_id] = data[i]
    }
    state.productDataList = productDataList
  },
  SET_PRODUCT_TYPE: (state, data) => {
    state.ProductData.type.colType.data = data
  },
  SET_SPECIFICATION: (state, data) => {
    state.ProductData.specification.colType.data = data
  }
}

const actions = {
  // 取得商品
  getProductInfo({ commit, state }, paras) {
    return new Promise((resolve, reject) => {
      getProductInfo(paras).then(response => {
        commit('SET_PRODUCT_LIST', response.data)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 新增商品
  newData({ commit, state }, paras) {
    return new Promise((resolve, reject) => {
      newData(paras).then(response => {
        const callback = { ...response }
        if (response.code === 201) {
          callback.notify = { title: '成功', message: '資料新增成功', type: 'success', duration: 2000 }
        } else if (response.code === 400) {
          callback.notify = { title: '失敗', message: '資料格式錯誤', type: 'error', duration: 2000 }
        } else {
          callback.notify = { title: '失敗', message: '錯誤:' + response.code, type: 'error', duration: 2000 }
        }
        resolve(callback)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 修改商品
  updateData({ commit, state }, paras) {
    return new Promise((resolve, reject) => {
      updateData(paras).then(response => {
        const callback = { ...response }
        if (response.code === 200) {
          callback.notify = { title: '成功', message: '資料新增成功', type: 'success', duration: 2000 }
        } else if (response.code === 400) {
          callback.notify = { title: '失敗', message: '資料格式錯誤', type: 'error', duration: 2000 }
        } else {
          callback.notify = { title: '失敗', message: '錯誤:' + response.code, type: 'error', duration: 2000 }
        }
        resolve(callback)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 新增類型規格
  newTypeData({ commit, state }, paras) {
    return new Promise((resolve, reject) => {
      newTypeData(paras).then(response => {
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 修改類型規格
  updateTypeData({ commit, state }, paras) {
    return new Promise((resolve, reject) => {
      updateTypeData(paras).then(response => {
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 手動進貨
  purchaseProduct({ commit, state }, paras) {
    return new Promise((resolve, reject) => {
      purchaseProduct(paras).then(response => {
        const callback = { ...response }
        if (response.code === 201) {
          callback.notify = { title: '成功', message: '資料新增成功', type: 'success', duration: 2000 }
        } else if (response.code === 400) {
          callback.notify = { title: '失敗', message: '資料格式錯誤', type: 'error', duration: 2000 }
        } else {
          callback.notify = { title: '失敗', message: '錯誤:' + response.code, type: 'error', duration: 2000 }
        }
        resolve(callback)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 取得庫存
  getProductRecord({ commit, state }, paras) {
    return new Promise((resolve, reject) => {
      getProductRecord(paras).then(response => {
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  setProductType({ commit }, data) {
    commit('SET_PRODUCT_TYPE', data)
  },
  setSpecification({ commit }, data) {
    commit('SET_SPECIFICATION', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
