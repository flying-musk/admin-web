// money.js
const Layout = () => import('@/layout/index.vue')
const Money = () => import('@/views/money/index.vue')

export default [
  {
    path: '/money',
    component: Layout,
    name: 'moneyIndex',
    meta: {
      title: '金流管理',
    },
    icon: 'Money',
    children: [
      {
        path: '/money',
        name: 'money',
        component: Money,
        meta: {
          title: '金流管理',
        },
      },
    ],
  },
]
