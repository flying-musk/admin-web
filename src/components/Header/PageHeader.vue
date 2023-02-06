<template>
  <el-page-header @back="actions.handleGoBack" class="p-1">
    <template #icon>
<el-icon>      <el-icon>
        <Back />
      </el-icon>
    </template>
    <template #title>
      <p class="hidden sm:flex text-sm">返回</p>
    </template>
    <template #content>
      <div class="flex items-center gap-x-2">
        <span class="text-sm text-gray-700 tracking-wider">送單人</span>
        <p class="text-sm font-bold tracking-wide">#{{ data.mbid }}</p>
      </div>
    </template>
    <template #extra>
      <div class="pr-1 flex flex-col gap-x-3 gap-y-1 text-xs justify-end">
        <p class="flex items-center text-gray-500 gap-x-2">
          <el-icon><Calendar /></el-icon>
          <span class="min-w-fit">2023-02-12</span>
        </p>
      </div>
    </template>
  </el-page-header>
</template>
<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
})
const actions = {
  handleGoBack: () => {
    if (window.history.state.back) {
      router.back()
    } else {
      router.replace({ path: '/preOrder' })
    }
  },
}
</script>