import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
import ElementPlus from 'element-plus'
import './assets/style/main.scss'
import './assets/style/element-variables.scss'
import 'dayjs/locale/zh-cn'
import locale from 'element-plus/lib/locale/lang/zh-cn'
import JsonCSV from 'vue-json-csv'
app.component('downloadCsv', JsonCSV)
// 权限控制
import './permission'
import router from './router'
import store from './store'

// 权限控制
import './permission'

// global directive
import directives from '@/directives/index'

// global element-plus/icons-vue
import * as ICONS from '@element-plus/icons-vue'
Object.entries(ICONS).forEach(([key, component]) => {
  app.component(key, component)
})

// global components
import * as Components from './global-components'
Object.entries(Components).forEach(([key, component]) => {
  app.component(key, component)
})


directives.forEach((directive) => {
  app.directive(directive.name, directive)
})


app
  .use(ElementPlus, {
    locale,
  })
  .use(store)
  .use(router)
  .mount('#app')
