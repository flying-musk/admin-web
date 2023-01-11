<template>
    <h5 class="text-xs leading-6 tracking-widest text-custom-gray">
      {{ label }}
    </h5>
  </template>
  <script setup>
  // ----------- props -----------
  const props = defineProps({
    label: { type: String, default: '' },
  })
  </script>