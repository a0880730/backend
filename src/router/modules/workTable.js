/** When your routing table is too long, you can split it into small modules**/
const printQuotation = {
  path: '/qrbrick/*',
  component: () => import('@/views/caseField/Brick'),
  hidden: true
}

export default printQuotation
