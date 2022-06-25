import { reactive, toRefs, getCurrentInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default () => {
  const instance = getCurrentInstance()
  const store = useStore()
  const router = useRouter()
  const route = useRoute()
  const state = reactive({
    /**
     * @param {String} fullPath url jump to
     * @param {Boolean} reload rerender component
     * @param {Boolean} f5 refresh page
     * @return {*}
     */
    closeTag({ fullPath, reload, f5 } = {}) {
      store.dispatch('tags/delTag', route)
      fullPath ? router.push(fullPath) : router.back()
      reload &&
        setTimeout(() => {
          instance.appContext.config.globalProperties.$tagsbar.refreshSelectedTag(
            route
          )
        }, 500)

      f5 && setTimeout(() => window.location.reload(), 500)
    },
  })

  return toRefs(state)
}
