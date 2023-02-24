import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'
import enLang from 'element-ui/lib/locale/lang/zh-TW'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  locale: enLang // 如果使用中文，无需设置，请删除
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

// 搜尋框 全域掛載
import FilterContainer from '@/components/TableList/FilterContainer'
Vue.component('FilterContainer', FilterContainer)
// 頁碼 全域掛載
import Pagination from '@/components/Pagination'
Vue.component('Pagination', Pagination)
// 編輯彈窗 全域掛載
import EditDialog from '@/components/TableList/editDialog.vue'
Vue.component('EditDialog', EditDialog)
// 表格 全域掛載
import TableList from '@/components/TableList'
Vue.component('TableList', TableList)

import VCalendar from 'v-calendar' // 引入日曆插件

Vue.use(VCalendar, {
  componentPrefix: 'v'
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
