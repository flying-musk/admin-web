import { createRouter, createWebHashHistory } from 'vue-router'

import login from './modules/login'
import home from './modules/home'
import auth from './modules/auth'
import agent from './modules/agent'
import member from './modules/member'
import product from './modules/product'
import orderSearch from './modules/orderSearch'
import specialSetting from './modules/specialSetting'
import calTitle from './modules/calTitle'
import preOrder from './modules/preOrder'
import tax from './modules/tax'
import travelcal from './modules/travelcal'

/* 菜单栏的路由 */
// 固定菜单
export const fixedRoutes = [
  ...home,
  // ...auth,
  // ...agent,
  // ...member,
  // ...product,
  // ...orderSearch
]
// 动态菜单
export const asyncRoutes = import.meta.env.VITE_BBT_ROLE === 'agent' ? [...preOrder] : [...specialSetting,
...calTitle, ...tax, ...travelcal]
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    ...login,
    ...fixedRoutes,
    ...asyncRoutes
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
