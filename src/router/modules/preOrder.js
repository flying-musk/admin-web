// preOrder.js
const Layout = () => import('@/layout/index.vue')
const PreOrder = () => import('@/views/preOrder/index.vue')
const PreOrderMange = () => import('@/views/preOrder/manage.vue')

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
        path: '/preOrder/:id',
        name: 'PreOrderMange',
        hidden:true,
        component: PreOrderMange,
        meta: {
          title: '預收訂單詳情',
        },
      },
    ],
  },
]
