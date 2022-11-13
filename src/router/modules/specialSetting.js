// specialSetting.js
const Layout = () => import('@/layout/index.vue')
const SpecialSetting = () => import('@/views/specialSetting/index.vue')

export default [
  {
    path: '/specialSetting',
    component: Layout,
    name: 'SpecialSettingIndex',
    meta: {
      title: '特別設定',
    },
    icon: 'Setting',
    children: [
      {
        path: '/specialSetting',
        name: 'specialSetting',
        component: SpecialSetting,
        meta: {
          title: '特別設定',
        },
      },
    ],
  },
]
