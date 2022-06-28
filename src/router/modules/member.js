// member.js
const Layout = () => import('@/layout/index.vue')
const Member = () => import('@/views/member/index.vue')

export default [
  {
    path: '/member',
    component: Layout,
    name: 'MemberIndex',
    meta: {
      title: '會員管理',
    },
    icon: 'el-icon-user',
    children: [
      {
        path: '/member',
        name: 'member',
        component: Member,
        meta: {
          title: '會員管理',
        },
      },
    ],
  },
]
