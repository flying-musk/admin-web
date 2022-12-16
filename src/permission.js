import router from '@/router'
import { TOKEN } from '@/store/modules/app' // TOKEN变量名
import getPageTitle from '@/utils/get-page-title'

// 白名单，里面是路由对象的name
const WhiteList = ['login']

// vue-router4的路由守卫不再是通过next放行，而是通过return返回true或false或者一个路由地址
router.beforeEach(async to => {
  document.title = getPageTitle(to.meta.title)

  if (WhiteList.includes(to.name)) {
    return true
  }
  if (!window.localStorage[TOKEN]) {
    return {
      name: 'login',
      query: {
        redirect: to.fullPath, // redirect是指登录之后可以跳回到redirect指定的页面
      },
      replace: true,
    }
  } else {
    // 获取用户角色信息，根据角色判断权限
  }
})