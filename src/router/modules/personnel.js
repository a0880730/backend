/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const personnelRouter = {
  path: '/personnel',
  component: Layout,
  redirect: '/personnel/page',
  alwaysShow: true, // will always show the root menu
  name: 'personnel',
  meta: {
    title: '人事管理',
    icon: 'peoples',
    roles: ['admin', 'editor'] // you can set roles in root nav
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/personnel/index'),
      name: 'listPersonnel',
      meta: {
        title: '人員列表',
        roles: ['admin']
      }
    },
    // {
    //   path: 'count-salary',
    //   component: () => import('@/views/personnel/index'),
    //   name: 'countSalary',
    //   meta: {
    //     title: '薪資計算',
    //     roles: ['admin']
    //   }
    // },
    // {
    //   path: 'record-salary',
    //   component: () => import('@/views/personnel/index'),
    //   name: 'recordSalary',
    //   meta: {
    //     title: '薪資記錄',
    //     roles: ['admin']
    //   }
    // }
  ]
}

export default personnelRouter
