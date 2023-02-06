<template>
  <div class="flex justify-between items-center gap-x-4 leading-4 py-1 px-2">
    <p class="min-w-fit flex items-center gap-x-1 text-primary-500">
        <slot name="icon"></slot>

      <span class="text-gray-500">
        {{ item.label }}
      </span>
    </p>
    <span class="self-end break-all">
      <slot></slot>{{ item.value || '-' }}
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
