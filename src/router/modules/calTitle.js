// calTitle.js
const Layout = () => import('@/layout/index.vue')
const CalTitle = () => import('@/views/CalTitle/index.vue')

export default [
  {
    path: '/calTitle',
    component: Layout,
    name: 'calTitleIndex',
    meta: {
      title: '晉升計算',
    },
    icon: 'EditPen',
    children: [
      {
        path: '/calTitle',
        name: 'calTitle',
        component: CalTitle,
        meta: {
          title: '晉升計算',
        },
      },
    ],
  },
]
