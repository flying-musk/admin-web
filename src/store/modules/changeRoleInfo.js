import {
  getSessionItem,
  setSessionItem,
  removeSessionItem,
} from '@/utils/storage'
export const changeRoleInfoList = 'BBT-CHANGE-ROLE-INFO-LIST'
export const changeRoleInfo = 'BBT-CHANGE-ROLE-INFO'

export default {
  namespaced: true,
  state: {
    changeRoleInfoList: getSessionItem(changeRoleInfoList),
    changeRoleInfo: getSessionItem(changeRoleInfo),
  },
  mutations: {
    // 保存切換身份列表
    setChangeRoleInfoList(state, data) {
      state.changeRoleInfoList = data
      setSessionItem(changeRoleInfoList, data)
    },
    // 清除切換身份列表
    clearChangeRoleInfoList(state) {
      state.changeRoleInfoList = null
      removeSessionItem(changeRoleInfoList)
    },
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
