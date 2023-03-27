<template>
  <div class="bg-white border rounded-lg p-3 space-y-3 leading-6 tracking-widest text-center md:text-left">
    <p class="text-primary-500 text-sm font-medium">{{ title }}</p>
    <p class="font-bold text-gray-700 text-xl inline-flex items-center space-x-2">
      <span>{{ value }}笔</span>
      <span>
        <slot name="icon"></slot>
      </span>
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