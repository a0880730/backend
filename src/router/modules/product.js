/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const productRouter = {
  path: '/product',
  component: Layout,
  redirect: '/product/page',
  alwaysShow: true, // will always show the root menu
  name: 'product',
  meta: {
    title: '商品管理',
    icon: 'star',
    roles: ['admin', 'editor'] // you can set roles in root nav
  },
  children: [
    {
      path: 'productType',
      component: () => import('@/views/product/productType'),
      name: 'productType',
      meta: {
        title: '商品類型規格',
        roles: ['admin']
      }
    },
    {
      path: 'list',
      component: () => import('@/views/product/index'),
      name: 'listProduct',
      meta: {
        title: '商品列表',
        roles: ['admin']
      }
    },
    {
      path: 'record-stock',
      component: () => import('@/views/product/record'),
      name: 'recordStock',
      meta: {
        title: '庫存紀錄',
        roles: ['admin']
      }
    }
  ]
}

export default productRouter
