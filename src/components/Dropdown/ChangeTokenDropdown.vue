<template>
  <el-dropdown split-button type="primary">
    切換代理 {{changeRoleInfo}}
    <template #dropdown>
      <div
        v-for="subAgent in state.subAgentList"
        :key="subAgent.mbid"
        class="py-2 border-b hover:bg-gray-50 min-w-fit px-3 cursor-pointer">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-x-3 w-full lg:min-w-[240px]">
            <div
              class="
                h-10
                w-10
                bg-primary-50
                rounded-full
                flex
                justify-center
                items-center
                text-white text-xl
              ">
              {{ subAgent.mbname.substring(0, 1) }}
            </div>
            <div class="flex flex-col">
              <p class="text-lg">
                {{ subAgent.mbname }}
              </p>
              <p class="text-gray-500">
                {{ subAgent.agname }} <span class="text-gray-300">｜</span> {{ subAgent.agid }}
              </p>
            </div>
          </div>
          <el-button @click="actions.handleChangeToken(subAgent)" bg text>
            切換
          </el-button>
        </div>
      </div>
    </template>
  </el-dropdown>
</template>

<script setup>
import { reactive, computed, onMounted, getCurrentInstance } from 'vue'
import { ChangeTokenApiHandler } from '@/api/change_token'
import { useStore } from 'vuex'
const { proxy } = getCurrentInstance()
const store = useStore()
const state = reactive({
  loading: false,
  model: {
    action: null,
    id: null,
  },
  currentSelected: {
    name: '',
    id: '',
  },
  subAgentList: [],
})

const changeRoleInfo = computed(() => store.state.changeRoleInfo.changeRoleInfo)

onMounted(() => {
  actions.handleSubagentList()
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
    const { code, data, msg } = await ChangeTokenApiHandler(params)
    if (code === 1) {
      state.subAgentList = data
    } else {
      proxy.$message({
        type: 'error',
        message: msg,
      })
    }
    state.loading = false
  },

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
      store.commit('changeRoleInfo/setChangeRoleInfo', agent)
      store.dispatch('app/setToken', token)
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