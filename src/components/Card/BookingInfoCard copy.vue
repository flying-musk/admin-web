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
      訂購人資料
    </p>
      <!-- Description -->
      <div class="space-y-1 pl-4">
        <div
          class="flex items-center gap-x-1 text-primary-500"
          :class="{ 'text-red-400': info?.sex == 'm' }">
          <p class="text-gray-600 font-bold">
            {{ info?.first_name }}
            {{ info?.last_name }}
          </p>
          <span
            v-show="!!info?.order_mbid"
            class="text-xs bg-sky-100 text-sky-500 rounded-full py-1 px-2">
            #{{ info?.order_mbid }}
          </span>
          <el-icon v-show="info?.sex == 'f'"><Female /></el-icon>
          <el-icon v-show="info?.sex == 'm'"><Male /></el-icon>
        </div>

        <p class="text-primary-500 text-xs flex items-center gap-x-1">
          <el-icon :size="16"><Phone /></el-icon>
          <span class="text-gray-400">{{ info?.phone }} </span>
        </p>
        <p class="text-primary-500 text-xs flex items-center gap-x-1">
          <el-icon :size="16"><Calendar /></el-icon>
          <span class="text-gray-400">
            {{ info?.birth }}
          </span>
        </p>
        <p class="text-primary-500 text-xs flex items-center gap-x-1">
          <el-icon :size="16"><Postcard /></el-icon>

          <span class="text-gray-400">
            <span
              class="text-gray-400"
              v-show="!!variables.ccodename[info?.ccode]">
              {{ variables.ccodename[info?.ccode] }} </span
            >{{ variables.idtype[info?.idtype] }} {{ info?.idnumber }}
          </span>
        </p>
        <p class="text-primary-500 text-xs flex items-center gap-x-1">
          <el-icon :size="16"><Message /></el-icon>
          <span class="text-gray-400">
            {{ info?.email }}
          </span>
        </p>
        <p class="text-primary-500 text-xs flex items-center gap-x-1">
          <el-icon :size="16"><Location /></el-icon>
          <span class="text-gray-400">
            {{ info?.add1 }}
          </span>
        </p>

        <p class="text-gray-400 ml-5 text-xs">{{ info?.add2 }}</p>
      </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { useVariables } from '@/hooks/useVariables'
const { variables } = useVariables()

const props = defineProps({
  info: {
    type: Object,
    default: () => {},
  },
})
const name = computed(() => {
  return `${props.info.first_name} ${props.info.last_name}`
})
</script>