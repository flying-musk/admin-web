import { computed } from 'vue'
import { useStore } from 'vuex'

export const useVariables = () => {
  const store = useStore()
  const variables = computed(() => store.state.variables.variables)

  return { variables }
}
