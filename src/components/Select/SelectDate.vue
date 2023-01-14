<template>
  <el-select
    v-model="propsDate"
    value-key="value"
    placeholder="天數"
    size="small"
    class="md:max-w-[130px] select-date md:px-3"
    @change="emit('on-change')">
    <template #prefix>最近</template>
    <el-option v-for="i in dateOptions" :key="i" :label="`${i} 天`" :value="i" />
  </el-select>
</template>
<script setup>
const props = defineProps({
  selectedDate: {
    type: Number,
    default: 31,
  },
  dateOptions:{
    type: Number,
    default: 31,
  }
})
const emit = defineEmits(['update:selectedDate','on-change'])

const propsDate = computed({
  get: () => props.selectedDate,
  set: val => {
    emit('update:selectedDate', val)
  },
})
</script>