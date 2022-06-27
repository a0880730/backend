/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const chartsRouter = {
  path: '/permission',
  component: Layout,
  redirect: '/permission/page',
  alwaysShow: true, // will always show the root menu
  name: 'Permission',
  meta: {
    title: 'Permission',
    icon: 'lock',
    roles: ['admin', 'editor'] // you can set roles in root nav
  },
  children: [
    // {
    //   path: 'page',
    //   component: () => import('@/views/permission/page'),
    //   name: 'PagePermission',
    //   meta: {
    //     title: 'Page Permission',
    //     roles: ['admin'] // or you can only set roles in sub nav
    //   }
    // },
    // {
    //   path: 'role',
    //   component: () => import('@/views/permission/role'),
    //   name: 'RolePermission',
    //   meta: {
    //     title: 'Role Permission',
    //     roles: ['admin']
    //   }
    // }
  ]
}

export default chartsRouter
