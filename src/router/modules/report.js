/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const reportRouter = {
  path: '/report',
  component: Layout,
  redirect: '/report/page',
  alwaysShow: true, // will always show the root menu
  name: 'report',
  meta: {
    title: '報表',
    icon: 'documentation',
    roles: ['admin', 'editor'] // you can set roles in root nav
  },
  children: [
    // {
    //   path: 'salary',
    //   component: () => import('@/views/report/index'),
    //   name: 'salaryReport',
    //   meta: {
    //     title: '薪資報表',
    //     roles: ['admin']
    //   }
    // },
    // {
    //   path: 'product',
    //   component: () => import('@/views/report/index'),
    //   name: 'productReport',
    //   meta: {
    //     title: '商品報表',
    //     roles: ['admin']
    //   }
    // },
    // {
    //   path: 'profit',
    //   component: () => import('@/views/report/index'),
    //   name: 'profitReport',
    //   meta: {
    //     title: '利潤報表',
    //     roles: ['admin']
    //   }
    // }
  ]
}

export default reportRouter
