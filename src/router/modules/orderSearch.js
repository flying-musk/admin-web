// orderSearch.js
const Layout = () => import('@/layout/index.vue')
const OrderSearch = () => import('@/views/orderSearch/index.vue')

export default [
  {
    path: '/orderSearch',
    component: Layout,
    name: 'OrderSearchIndex',
    meta: {
      title: '訂單查詢',
    },
    icon: 'el-icon-document-checked',
    children: [
      {
        path: '/orderSearch',
        name: 'orderSearch',
        component: OrderSearch,
        meta: {
          title: '訂單查詢',
        },
      },
    ],
  },
]
