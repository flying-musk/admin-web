<template>
  <el-dropdown>
    <el-button plain>
      <div class="flex items-center gap-x-3">
        <p v-if="!isEmpty(changeRoleInfo)">
          {{ changeRoleInfo?.agname }}｜{{ changeRoleInfo?.mbname }}
        </p>
        <p v-else>切換代理</p>
        <el-icon><ArrowDownBold /></el-icon>
      </div>
    </el-button>
    <template #dropdown>
      <div class="p-1" v-if="!isEmpty(changeRoleInfoList)">
        <p class="text-xs border-b text-gray-500 tracking-widest pb-1">
          切換代理
        </p>
        <div
          v-for="subAgent in changeRoleInfoList"
          :key="subAgent.mbid"
          class="py-2 border-b hover:bg-gray-50 min-w-fit px-3">
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
                  text-white text-lg
                ">
                {{ subAgent.mbname.substring(0, 1) }}
              </div>
              <div class="flex flex-col">
                <p class="text-md">
                  {{ subAgent.mbname }}
                </p>
                <p class="text-gray-500">
                  {{ subAgent.agname }} <span class="text-gray-300">｜</span>
                  {{ subAgent.agid }}
                </p>
              </div>
            </div>
            <div
              v-if="subAgent.mbid == changeRoleInfo?.mbid"
              class="
                min-w-fit
                px-1
                text-primary-500
                tracking-wide
                cursor-default
              ">
              當前代理
            </div>
            <el-button
              v-else
              @click="actions.handleChangeToken(subAgent)"
              type="primary">
              切換
            </el-button>
          </div>
        </div>
      </div>
    </template>
  </el-dropdown>
</template>

<script setup>
import { reactive, computed, onMounted, getCurrentInstance } from 'vue'
import { ChangeTokenApiHandler } from '@/api/change_token'
import { useStore } from 'vuex'
import { ArrowDownBold } from '@element-plus/icons-vue'
import { isEmpty } from 'lodash-es'

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
})

const changeRoleInfoList = computed(
  () => store.state.changeRoleInfo.changeRoleInfoList
)
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
    if (!!changeRoleInfoList.value) return
    state.loading = true
    const params = {
      action: 'getsubagent',
    }
    const { code, data, msg } = await ChangeTokenApiHandler(params)
    if (code === 1) {
      store.commit('changeRoleInfo/setChangeRoleInfoList', data)
      if(!!changeRoleInfo.value) return
      const defaultAgent = changeRoleInfoList.value[0]
      actions.handleChangeToken(defaultAgent)
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