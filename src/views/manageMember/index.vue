<template>
  <div id="manage_member" class="h-full reactive">
    <!-- 會員管理 -->
    <div
      class="flex flex-col gap-y-3 md:gap-y-6 md:bg-white md:h-full md:p-3 rounded-md">
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
const { proxy } = getCurrentInstance()
const state = reactive({})
onMounted(() => {})
const actions = {}
</script>

<style lang="scss" scoped>
</style>