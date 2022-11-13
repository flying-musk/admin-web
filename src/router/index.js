import { createRouter, createWebHashHistory } from 'vue-router'

import login from './modules/login'
import home from './modules/home'
import auth from './modules/auth'
import agent from './modules/agent'
import member from './modules/member'
import product from './modules/product'
import orderSearch from './modules/orderSearch'
import specialSetting from './modules/specialSetting'

/* 菜单栏的路由 */
// 固定菜单
export const fixedRoutes = [
  ...home,
  ...auth,
  ...agent,
  ...member,
  ...product,
  ...orderSearch,
  ...specialSetting,
]
// 动态菜单
export const asyncRoutes = []
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    ...login,
    ...fixedRoutes,
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { left: 0, top: 0 }
    }
  },
})

export default router
