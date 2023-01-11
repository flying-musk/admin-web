<template>
  <div class="flex items-center gap-x-1">
    <SubTitle :title="title" class="min-w-fit" />
    <h3 class="text-gray-700 font-light text-sm tracking-widest">
      <span class="text-gray-300">｜</span>
      共
      <span class="text-primary-500 font-medium">{{ total }}</span>
      筆
    </h3>
    <slot></slot>
  </div>
</template>
<script setup>
import SubTitle from '@/components/Text/SubTitle.vue'
const props = defineProps({
  title: { type: String, default: '' },
  total: {
    type: Number,
    default: 0,
  },
})
</script>