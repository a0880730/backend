/** When your routing table is too long, you can split it into small modules**/
const printQuotation = {
  path: '/printQuotation/*',
  component: () => import('@/views/caseField/print'),
  name: 'printQuotation',
  hidden: true,
  meta: {
    title: '報價單列印',
    roles: ['admin', 'editor'] // you can set roles in root nav
  }
}

export default printQuotation
