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
      <div class="grid gap-1 md:gap-2">
        <div class="flex gap-1 md:gap-2 items-center">
          <small class="text-gray-500 w-[100px] text-[13px]">查找會員</small>
          <el-input
            v-model="state.search.keyword"
            placeholder="Search Text"
            class="input-with-select">
            <template #prepend>
              <el-select
                v-model="state.search.column"
                placeholder="Select"
                style="width: 115px">
                <el-option
                  v-for="column in state.search.columns"
                  :key="column.value"
                  :label="column.label"
                  :value="column.value" />
              </el-select>
            </template>
            <template #append>
              <el-button icon="Search" />
            </template>
          </el-input>
        </div>
        <div class="border">
          keyword: {{ state.search.keyword }}, column: {{ state.search.column }}
        </div>
      </div>
      <div class="grid gap-1 md:gap-2">
        <div class="flex gap-1 md:gap-2 items-center">
          <small class="text-gray-500 w-[100px] text-[13px]"
            >會員基本資料</small
          >
          <el-input
            v-model="state.memberInfo.id"
            placeholder="Member ID"
            class="input-with-select">
            <template #append>
              <el-button icon="Search" />
            </template>
          </el-input>
        </div>
        <div class="border">{{ state.memberInfo.id }}</div>
      </div>
      <div class="grid gap-1 md:gap-2">
        <div class="flex gap-1 md:gap-2 items-center">
          <small class="text-gray-500 w-[100px] text-[13px]"
            >會員營運資料</small
          >
          <el-input
            v-model="state.memberData.id"
            placeholder="Member ID"
            class="input-with-select">
            <template #append>
              <el-button icon="Search" />
            </template>
          </el-input>
        </div>
        <div class="border">{{ state.memberData.id }}</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { reactive, onMounted, getCurrentInstance } from 'vue'
import { ManageMemberApiHandler } from '@/api/manage_member'
import SubTitle from '@/components/Text/SubTitle.vue'
import BasicTable from '@/components/Table/index.vue'
const { proxy } = getCurrentInstance()
const state = reactive({
  search: {
    keyword: '',
    column: '',
    columns: [
      { value: '', label: '全部' },
      { value: 'birth', label: '生日' },
      { value: 'idnumber', label: '會員編號' },
      { value: 'email', label: '電子信箱' },
    ],
  },
  memberInfo: {
    id: '',
  },
  memberData: {
    id: '',
  },
})
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