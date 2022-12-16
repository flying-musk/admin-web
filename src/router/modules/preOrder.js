// preOrder.js
const Layout = () => import('@/layout/index.vue')
const PreOrder = () => import('@/views/preOrder/index.vue')
const PreOrderMange = () => import('@/views/preOrder/manage.vue')
const PreOrderDetail = () => import('@/views/preOrder/detail.vue')

export default [
  {
    path: '/preOrder',
    component: Layout,
    name: 'preOrderIndex',
    meta: {
      title: '預收訂單',
    },
    icon: 'DocumentChecked',
    children: [
      {
        path: '/preOrder',
        name: 'preOrder',
        component: PreOrder,
        meta: {
          title: '預收訂單',
        },
      },
      {
        path: '/preOrder/create',
        name: 'preOrderCreate',
        hidden:true,
        component: PreOrderMange,
        meta: {
          title: '新增預收訂單',
        },
      },
      {
        path: '/preOrder/:id',
        name: 'preOrderDetail',
        hidden:true,
        component: PreOrderDetail,
        meta: {
          title: '預收訂單詳情',
        },
      },
    ],
  },
]
