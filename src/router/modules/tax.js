// tax.js
const Layout = () => import('@/layout/index.vue')
const Tax = () => import('@/views/tax/index.vue')

export default [
  {
    path: '/tax',
    component: Layout,
    name: 'TaxIndex',
    meta: {
      title: '稅務管理',
    },
    icon: 'Tickets',
    children: [
      {
        path: '/tax',
        name: 'tax',
        component: Tax,
        meta: {
          title: '稅務管理',
        },
      },
    ],
  },
]
