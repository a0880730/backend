/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const calendarRouter = {
  path: '/calendar',
  component: Layout,
  redirect: '/calendar/index',
  alwaysShow: true, // will always show the root menu
  meta: {
    title: '行事曆',
    icon: 'el-icon-date',
    noCache: true
  },
  children: [
    {
      path: 'index',
      component: () => import('@/views/calendar/index'),
      meta: { title: '安排事項', noCache: true },
      name: 'Calendar'
    },
    {
      path: 'todo',
      component: () => import('@/views/calendar/todo'),
      meta: { title: '待辦事項', noCache: true },
      name: 'Todo'
    }
  ]
  // hidden: true
}

export default calendarRouter
