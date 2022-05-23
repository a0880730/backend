/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const companyRouter = {
  path: '/customer',
  component: Layout,
  redirect: '/customer/page',
  alwaysShow: true, // will always show the root menu
  name: 'Customer',
  meta: {
    title: '客戶管理',
    icon: 'excel',
    roles: ['admin', 'editor'] // you can set roles in root nav
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/customer/index'),
      name: 'listCustomer',
      meta: {
        title: '客戶列表',
        roles: ['admin']
      }
    }
  ]
}

export default companyRouter
