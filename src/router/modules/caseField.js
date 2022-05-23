/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const caseFieldRouter = {
  path: '/caseField',
  component: Layout,
  redirect: '/caseField/page',
  alwaysShow: true, // will always show the root menu
  name: 'caseField',
  meta: {
    title: '案場管理',
    icon: 'tab',
    roles: ['admin', 'editor'] // you can set roles in root nav
  },
  children: [
    // {
    //   path: 'case-field-set',
    //   component: () => import('@/views/caseField/case-field-set'),
    //   name: 'caseFieldSet',
    //   meta: {
    //     title: '案場類型設定',
    //     roles: ['admin']
    //   }
    // },
    {
      path: 'list',
      component: () => import('@/views/caseField/index'),
      name: 'listCaseField',
      meta: {
        title: '案場列表',
        roles: ['admin']
      }
    },
    {
      path: 'info/*',
      component: () => import('@/views/caseField/info'),
      name: 'info',
      meta: {
        title: '案場資訊',
        roles: ['admin']
      },
      hidden: true
    },
    {
      path: 'calculate',
      component: () => import('@/views/caseField/index'),
      name: 'calculate',
      meta: {
        title: '石膏磚計算式',
        roles: ['admin']
      },
      hidden: true
    },
    {
      path: 'quotation/*',
      component: () => import('@/views/caseField/quotation'),
      name: 'quotation',
      meta: {
        title: '報價單',
        roles: ['admin']
      },
      hidden: true
    },
    {
      path: 'brick/*',
      component: () => import('@/views/caseField/Brick'),
      name: 'brick',
      meta: {
        title: '石膏磚數量計算表',
        roles: ['admin']
      },
      hidden: true
    },
    {
      path: 'shipping/*',
      component: () => import('@/views/caseField/Shipping'),
      name: 'shipping',
      meta: {
        title: '出貨',
        roles: ['admin']
      },
      hidden: true
    }
  ]
}

export default caseFieldRouter
