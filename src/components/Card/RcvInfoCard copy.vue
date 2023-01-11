<template>
  <div
    class="
      border-2 border-b-4 border-gray-200
      rounded-xl
      bg-white
      leading-5
      tracking-wider
    ">
    <!-- Badge -->
    <p
      class="
        bg-primary-500
        w-fit
        px-4
        py-1
        text-xs
        font-bold
        text-white
        rounded-tl-lg rounded-br-xl
        flex items-center
        gap-x-2
      ">
      <div
        class="
          w-4
          h-4
          rounded-full
          border
          flex
          items-center
          justify-center
          text-primary-500
          border-white-50
          bg-white
        ">
        <el-icon :size="12"><User /></el-icon>
      </div>
      收貨人資料
    </p>
      <!-- Description -->
      <div class="space-y-2 pl-4">
        <p class="text-primary-500 text-xs flex items-center gap-x-1">
          <el-icon :size="16"><User /></el-icon>
          <span class="text-gray-400">
            {{ info.name }}
          </span>
        </p>
        <p class="text-primary-500 text-xs flex items-center gap-x-1">
          <el-icon :size="16"><Phone /></el-icon>
          <span class="text-gray-400">
            {{ info.rcvphone }}
          </span>
        </p>
        <p class="text-primary-500 text-xs flex items-center gap-x-1">
          <el-icon :size="16"><Message /></el-icon>
          <span class="text-gray-400">
            {{ info.rcvemail }}
          </span>
        </p>
        <p class="text-primary-500 text-xs flex items-center gap-x-1">
          <el-icon :size="16"><Location /></el-icon>
          <span class="text-gray-400">
            {{ info.shipadd1 }}
          </span>
        </p>

        <p class="text-gray-400 ml-5 text-xs">{{ info.shipadd2 }}</p>
      </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'

const props = defineProps({
  info: {
    type: Object,
    default: () => {},
  },
})

const name = computed(() => {
  return `${props.info.first_rcvname} ${props.info.last_rcvname}`
})
</script>