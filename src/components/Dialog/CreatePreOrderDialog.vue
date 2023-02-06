<template>
  <div>
    <el-button
      type="primary"
      auto-insert-space
      @click="actions.handleDialog(true)">
      新增
    </el-button>
    <el-dialog
      v-model="state.dialogVisible"
      align-center
      class="create-dialog"
      :fullscreen="formatDialogWidth == '100%'"
      :width="formatDialogWidth"
      :close-on-click-modal="false"
      @close="actions.handleCloseDialog">
      <header
        class="
          pl-3
          pr-2
          py-2
          border-b
          flex
          justify-between
          items-center
          bg-primary-500
          text-gray-50
        ">
        <h5 class="text-sm tracking-widest font-base">新增預收單</h5>

        <el-button link circle @click="state.dialogVisible = false">
          <el-icon color="#fff"><CloseBold /></el-icon>
        </el-button>
      </header>
      <div class="p-3">
        <div
          class="
            flex
            items-center
            gap-x-2
            tracking-widest
            leading-10
            text-md
            px-1
            mb-3
            bg-primary-50 bg-opacity-10
            rounded
            text-gray-500
          ">
          <div
            class="
              flex
              justify-center
              items-center
              tracking-wider
              text-primary-500
            ">
            <el-icon :size="20"><InfoFilled /></el-icon>
          </div>
          <p>請輸入送單人編號（必填）</p>
        </div>
        <div class="py-3">
          <el-input
            v-model="state.mbid"
            prefix-icon="User"
            clearable
            placeholder="請輸入送單人編號"></el-input>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end px-2 pt-2">
          <el-button bg text @click="state.dialogVisible = false"
            >下次再預訂</el-button
          >
          <el-button type="primary" :disabled="!state.mbid" @click="actions.handleCreate">
            新增預收訂單
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { PreOrderApiHandler } from '@/api/pre_order'
import { reactive, computed, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { proxy } = getCurrentInstance()
const state = reactive({
  dialogVisible: false,
  mbid: null,
})
const formatDialogWidth = computed(() => {
  const width = window.innerWidth
    ? window.innerWidth
    : document.documentElement.clientWidth
    ? document.documentElement.clientWidth
    : screen.width
  return width < 768 ? '100%' : '500px'
})

const actions = {
  /**
   * @description  開啟/關閉 新增預收單彈窗
   */
  handleDialog: (dialogVisible = false) => {
    state.dialogVisible = dialogVisible
  },
  /**
   * @description  新增
   */
  handleCreate: async () => {
    const params = {
      action: 'new',
      mbid: state.mbid,
    }
    const { code, data, msg } = await PreOrderApiHandler(params)
    if (code > 0) {
      const id = data.pre_order_id
     actions. handlePushPreOrderManage(id)
    } else {
      proxy.$message({
        type: 'error',
        message: msg,
      })
    }
  },
  /**
   * @description  關閉彈窗
   */
  handleCloseDialog: () => {
    state.mbid = null
  },
  /**
   * @description  跳轉編輯預收單
   */
  handlePushPreOrderManage: id => {
    state.dialogVisible = false
    setTimeout(() => {
      router.push({ path: `/preOrder/${id}` })
    }, 300)
  },
}
</script>
