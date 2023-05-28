<template>
  <div class="bg-white border rounded-lg p-3 tracking-widest flex justify-between items-center">
    <p class="text-primary-500 text-sm font-medium">{{ title }}</p>
    <p class="font-bold text-gray-700 text-xl inline-flex items-center space-x-2">
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
})
</script>