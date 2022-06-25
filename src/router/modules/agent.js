// auth.js
const Layout = () => import('@/layout/index.vue')
const Agent = () => import('@/views/agent/index.vue')

export default [
  {
    path: '/agent',
    component: Layout,
    name: 'Agent',
    meta: {
      title: '代理專區',
    },
    icon: 'el-icon-document',
    children: [
      {
        path: '/agent',
        name: 'agent',
        component: Agent,
        meta: {
          title: '代理專區',
          affix: true,
        },
      },
    ],
  },
]
