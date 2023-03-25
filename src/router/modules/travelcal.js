// travelcal.js
const Layout = () => import('@/layout/index.vue')
const Travelcal = () => import('@/views/travelcal/index.vue')

export default [
  {
    path: '/travelcal',
    component: Layout,
    name: 'travelcalIndex',
    meta: {
      title: '旅游统计',
    },
    icon: 'LocationInformation',
    children: [
      {
        path: '/travelcal',
        name: 'travelcal',
        component: Travelcal,
        meta: {
          title: '旅游统计',
        },
      },
    ],
  },
]
