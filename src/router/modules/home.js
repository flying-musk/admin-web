// home.js
const Layout = () => import('@/layout/index.vue')
const Home = () => import('@/views/home/index.vue')

export default [
  {
    path: '/home',
    component: Layout,
    name: 'Dashboard',
    meta: {
      title: '工作台',
    },
    icon: 'el-icon-home',
    children: [
      {
        path: '/',
        name: 'home',
        component: Home,
        meta: {
          title: '首頁',
          affix: true,
        },
      },
    ],
  },
]
