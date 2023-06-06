<template>
  <div id="manage_member" class="h-full reactive">
    <!-- 會員管理 -->
    <div
      class="flex flex-col gap-y-3 md:gap-y-4 md:bg-white md:h-full md:p-3 rounded-md border">
      <header
        class="flex justify-between md:items-center flex-col md:flex-row gap-y-3">
        <div
          class="flex flex-col md:flex-row md:items-center gap-y-3 md:gap-x-3">
          <SubTitle title="會員管理" class="min-w-fit" />
        </div>
      </header>
    </div>
  </div>
</template>
<script setup>
import { reactive, onMounted, getCurrentInstance } from 'vue'
import { ManageMemberApiHandler } from '@/api/manage_member'
import SubTitle from '@/components/Text/SubTitle.vue'
const { proxy } = getCurrentInstance()
const state = reactive({})
onMounted(() => {
  actions.handleSearchMember()
})
const actions = {
  /**
   * @description ManageMemberApiHandler 查找會員
   * @param {string}  action  search_member
   */
  handleSearchMember: async () => {
    const params = {
      action: 'info_member',
      id: '354745',
    }
    const { code, data, msg } = await ManageMemberApiHandler(params)
    if (code === 2 || code === 3) {
      console.log(code, data, msg)
    } else {
      proxy.$message({
        type: 'error',
        message: msg,
      })
    }
  },
}
</script>

<style lang="scss" scoped>
</style>