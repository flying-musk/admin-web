// auth.js
const Layout = () => import('@/layout/index.vue')
const Auth = () => import('@/views/auth/index.vue')

export default [
  {
    path: '/auth',
    component: Layout,
    name: 'AuthIndex',
    meta: {
      title: '授權管理',
    },
    icon: 'Lock',
    children: [
      {
        path: '/auth',
        name: 'auth',
        component: Auth,
        meta: {
          title: '授權管理',
        },
      },
    ],
  },
]
