// auth.js
const Layout = () => import('@/layout/index.vue')
const Auth = () => import('@/views/auth/index.vue')

export default [
  {
    path: '/auth',
    component: Layout,
    name: 'Auth',
    meta: {
      title: '授權管理',
    },
    icon: 'el-icon-lock',
    children: [
      {
        path: '/auth',
        name: 'auth',
        component: Auth,
        meta: {
          title: '授權管理',
          affix: true,
        },
      },
    ],
  },
]
