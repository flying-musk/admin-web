<template>
  <div class="flex justify-between items-center gap-x-24 leading-4 py-1 px-3">
    <span class="min-w-fit"> {{ item.label }}</span>
    <span class="self-end break-all">
      <slot></slot>{{ item.value }}
    </span>
  </div>
</template>

<script setup>
const props = defineProps({
  item: {
    type: Object,
    default: () => {},
  },
})
</script>
