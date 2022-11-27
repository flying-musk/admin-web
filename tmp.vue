<template>
  <div></div>
</template>
  
<script setup>
import { reactive, computed, getCurrentInstance } from 'vue'
import { ChangeTokenApiHandler } from '@/api/change_token'
const { proxy } = getCurrentInstance()

const state = reactive({
  loading: false,
  model: {
    action: null,
    id: null,
  },
})

const actions = {
  /**
   * @description ChangeToken 取得我的代理資料
   * @param {string}  action  getsubagent
   */
  handleSubagentList: async () => {
    state.loading = true
    const params = {
      action: 'getsubagent',
    }
    const { code, data, count = 0, msg } = await ChangeTokenApiHandler(params)
    if (code === 1) {
    } else {
      proxy.$message({
        type: 'error',
        message: msg,
      })
    }
    state.loading = false
  },

  /**
   * @description ChangeToken 變更角色
   * @param {string}  action  member / agent
   */
  handleChangeToken: async () => {
    state.loading = true
    const params = {
      action: 'member',
      id: 108907,
    }
    const { code, data, count = 0, msg } = await ChangeTokenApiHandler(params)
    if (code === 1) {
    } else {
      proxy.$message({
        type: 'error',
        message: msg,
      })
    }
    state.loading = false
  },
}
</script>