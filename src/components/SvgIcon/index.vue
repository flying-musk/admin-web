<template>
  <svg aria-hidden="true" :width="width" :height="height">
    <use :href="symbolId" :fill="color" />
  </svg>
</template>

<script setup>
import { defineComponent, computed } from 'vue'

defineComponent({
  name: 'SvgIcon',
})

const props = defineProps({
  prefix: {
    type: String,
    default: 'icon',
  },

  name: {
    type: String,
    required: true,
  },

  color: {
    type: String,
    default: '#333',
  },

  width: {
    type: String,
    default: '22px',
  },

  height: {
    type: String,
    default: '22px',
  },
})

const symbolId = computed(() => `#${props.prefix}-${props.name}`)
</script>

<style lang="scss" scoped>
svg {
  display: inline-block;
}
</style>
