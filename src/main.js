import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

import ElementPlus from 'element-plus'
import './assets/style/element-variables.scss'
import 'dayjs/locale/zh-cn'
import locale from 'element-plus/lib/locale/lang/zh-cn'

import router from './router'
import store from './store'

// global components
import * as Components from './global-components'
Object.entries(Components).forEach(([key, component]) => {
  app.component(key, component)
})

app
  .use(ElementPlus, {
    locale,
  })
  .use(store)
  .use(router)
  .mount('#app')
