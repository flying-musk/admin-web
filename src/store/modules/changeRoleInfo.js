import { getSessionItem, setSessionItem, removeSessionItem } from '@/utils/storage'
export const changeRoleInfo = 'BBT-CHANGE-ROLE-INFO'

export default {
  namespaced: true,
  state: {
    changeRoleInfo:getSessionItem(changeRoleInfo),
  },
  mutations: {
    // 保存切換身份
    setChangeRoleInfo(state, data) {
      state.changeRoleInfo = data
      setSessionItem(changeRoleInfo, data)
    },
    // 清除切換身份
    clearChangeRoleInfo(state) {
      state.changeRoleInfo = null
      removeSessionItem(changeRoleInfo)
    },
  },
}
