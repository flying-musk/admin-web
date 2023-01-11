import { getItem, setItem, removeItem } from '@/utils/storage'
import { toRaw } from 'vue'
const RoleMap = {
  admin: 'BBT-ADMIN',
  agent: 'BBT-AGENT',
  member: 'BBT-MEMBER',
}
const role = RoleMap[import.meta.env.VITE_BBT_ROLE]
export const TOKEN = `${role}-TOKEN`
const COLLAPSE = 'VEA-COLLAPSE'

export default {
  namespaced: true,
  state: {
    title: 'Vue3 Element Admin',
    authorization: getItem(TOKEN),
    sidebar: {
      collapse: getItem(COLLAPSE),
    },
    device: 'desktop',
  },
  mutations: {
    setToken(state, data) {
      state.authorization = data
      // 保存到 localStorage
      setItem(TOKEN, data)
    },
    clearToken(state) {
      state.authorization = ''

      removeItem(TOKEN)
    },
    setCollapse(state, data) {
      state.sidebar.collapse = data
      // 保存到 localStorage
      setItem(COLLAPSE, data)
    },
    clearCollapse(state) {
      state.sidebar.collapse = ''

      removeItem(COLLAPSE)
    },
    setDevice(state, device) {
      state.device = device
    },
  },
  actions: {
    setToken({ commit, dispatch }, payload) {
      dispatch('clearToken')
      commit('setToken', payload)
    },
    clearToken({ commit }) {
      // 清除token
      commit('clearToken')
      // 清除用户信息
      commit('account/clearUserinfo', '', { root: true })
      // 清除标签栏
      commit('tags/CLEAR_ALL_TAGS', '', { root: true })
      // 清空menus
      commit('menu/SET_MENUS', [], { root: true })
      // 清空 variables
      commit('variables/clearVariables', '', { root: true })
      // 清除角色信息
      commit('changeRoleInfo/clearChangeRoleInfoList', '', { root: true }) // 清除角色信息
      commit('changeRoleInfo/clearChangeRoleInfo', '', { root: true })
    },
    setScreenCode({ commit, state }, password) {
      const authorization = toRaw(state.authorization)

      if (!password) {
        try {
          delete authorization.screenCode
        } catch (err) {
          console.log(err)
        }
        commit('setToken', authorization)

        return
      }

      const screenCode = password

      commit('setToken', {
        ...authorization,
        screenCode,
      })
    },
  },
}
