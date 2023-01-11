<template>
  <div
    class="w-fit hover:opacity-70 cursor-pointer flex items-center gap-x-2"
    @click="emit('on-click')">
    <div
      class="
        flex
        justify-center
        items-center
        w-[18px]
        h-[18px]
        rounded-full
        border border-primary-500
      ">
      <div
        class="w-[10px] h-[10px] rounded-full bg-primary-500"
        v-show="selected"></div>
    </div>
    <DefaultLabel v-show="!!label" :label="label" />
  </div>
</template>
<script setup>
import DefaultLabel from '@/components/Text/DefaultLabel.vue'
const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  selected: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['on-click'])
</script>