<template>
  <div
    class="bg-white border rounded-lg p-3 tracking-widest flex justify-between items-center">
    <p class="text-primary-500 text-sm font-medium">{{ title }}</p>
    <p
      class="font-bold text-gray-700 text-xl inline-flex items-center space-x-2"
      :class="{ increase: increase, decrease: decrease }">
      <span>¥{{ value }}</span>
    </p>
  </div>
</template>
<script setup>
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  value: {
    type: String,
    default: '',
  },
  increase: {
    type: Boolean,
    default: false,
  },
  decrease: {
    type: Boolean,
    default: false,
  },
})
</script>