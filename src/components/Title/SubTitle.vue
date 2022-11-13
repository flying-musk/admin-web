<template>
  <h3 class="border-l-4 border-primary-300 pl-2 text-gray-700 text-sm tracking-widest" v-text="title"></h3>
</template>
<script setup>

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
})
</script>