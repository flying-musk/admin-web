import { ReadJson } from '@/api/read_json'
import { getSessionItem, setSessionItem, removeSessionItem } from '@/utils/storage'
export const VARIABLES = 'BBT-VARIABLES'

export default {
  namespaced: true,
  state: {
    variables:getSessionItem(VARIABLES),
  },
  mutations: {
    // 保存通用變數
    setVariables(state, data) {
      state.variables = data
      setSessionItem(VARIABLES, data)
    },
    // 清除通用變數
    clearVariables(state) {
      state.variables = null
      removeSessionItem(VARIABLES)
    },
  },
  actions: {
    // 獲取通用變數
    async getVariables({ commit }) {
      const { code, data } = await ReadJson('myGlobalvar')
      if (code === 1) {
        commit('setVariables', data)
        return Promise.resolve(data)
      }
    },
  },
}
