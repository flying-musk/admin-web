<template>
<el-dropdown @command="actions.handleCommand" >
    <span class="flex items-center text-xs">
      操作<el-icon class="el-icon--right"><arrow-down /></el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="a">完成訂單</el-dropdown-item>
        <el-dropdown-item command="b" disabled>取消訂單</el-dropdown-item>
        <el-dropdown-item command="c" divided>恢復訂單</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script setup>
import { reactive, getCurrentInstance } from 'vue'
import { ChangeTokenApiHandler } from '@/api/change_token'
import { useStore } from 'vuex'
import { isEmpty } from 'lodash-es'

const { proxy } = getCurrentInstance()
const store = useStore()
const state = reactive({
  loading: false,
  model: {
    action: null,
    id: null,
  },
})
const actions = {
    handleCommand:()=>{},
  /**
   * @description ChangeToken 變更代理
   * @param {string}  action  agent
   * @param {number}  action  id
   */
  handleChangeToken: async agent => {
    state.loading = true
    const params = {
      action: 'agent',
      id: agent.agid,
    }
    const { code, token, info, msg } = await ChangeTokenApiHandler(params)
    if (code === 1) {
      store.dispatch('app/setToken', token)
      store.commit('changeRoleInfo/setChangeRoleInfo', agent)
      setTimeout(() => {
        window.location.reload()
      }, 300)
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