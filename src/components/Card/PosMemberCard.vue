<template>
  <div class="mx-auto md:min-w-60 text-md bg-white text-gray-500 rounded border">
    <header
      class="flex items-center justify-between space-x-3 shadow p-1">
      <SubTitle title="點位" />
      <button
        class="
          flex
          items-center
          justify-center
          text-gray-700
          p-1
          border
          rounded-full
          shadow
          bg-gray-50
          hover:bg-opacity-50
          hover:text-primary-50
          transition
          duration-100
        ">
        <el-icon><Edit /></el-icon>
      </button>
    </header>
    <div class="space-y-2 p-2">
      <div
        class="flex items-center gap-x-3"
        v-for="item in pos"
        :key="item.label">
        <div
          class="
            w-10
            h-10
            rounded-full
            bg-gray-700
            border-2 border-white
            flex
            justify-center
            items-center
            text-white text-sm
          ">
          <p>{{ item.label }}</p>
        </div>
        <div class="flex flex-col">
          <p>{{ item.name }}</p>
          <p class="text-xs">{{ item.phone }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import SubTitle from '@/components/Text/SubTitle.vue'

const props = defineProps({
  info: {
    type: Object,
    default: () => {},
  },
})
const pos = [
  {
    label: '推',
    name: 'Ads dqw',
    phone: '1231321332',
  },
  {
    label: '安',
    name: '123',
    phone: '1231321332',
  },
  {
    label: '培',
    name: 'cxv ew',
    phone: '1231321332',
  },
]
</script>