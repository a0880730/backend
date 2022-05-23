/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const backendRouter = {
  path: '/backend',
  component: Layout,
  redirect: '/backend/page',
  alwaysShow: true, // will always show the root menu
  name: 'backend',
  meta: {
    title: '基本資料',
    icon: 'form',
    roles: ['admin', 'editor'] // you can set roles in root nav
  },
  children: [
    {
      path: 'data-set',
      component: () => import('@/views/backend/index'),
      name: 'dataSet',
      meta: {
        title: '資料設定',
        roles: ['admin']
      }
    }
  ]
}

export default backendRouter
