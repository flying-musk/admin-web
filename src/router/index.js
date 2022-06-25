import { createRouter, createWebHashHistory } from 'vue-router'

import login from './modules/login'
import home from './modules/home'
import auth from './modules/auth'
import agent from './modules/agent'

/* 菜单栏的路由 */
// 固定菜单
export const fixedRoutes = [...home, ...auth, ...agent]
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
console.log(fixedRoutes)
export default router
