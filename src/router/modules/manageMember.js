// manageMember.js
const Layout = () => import('@/layout/index.vue')
const ManageMember = () => import('@/views/manageMember/index.vue')

export default [
  {
    path: '/manageMember',
    component: Layout,
    name: 'manageMemberIndex',
    meta: {
      title: '會員管理',
    },
    icon: 'User',
    children: [
      {
        path: '/manageMember',
        name: 'manageMember',
        component: ManageMember,
        meta: {
          title: '會員管理',
        },
      },
    ],
  },
]
