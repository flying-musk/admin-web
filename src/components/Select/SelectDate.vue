<template>
  <el-select
    v-model="dates"
    value-key="value"
    placeholder="天數"
    size="small"
    class="md:max-w-[130px] select-date md:px-3"
    @change="emit('on-change')">
    <template #prefix>最近</template>
    <el-option v-for="i in dates" :key="i" :label="`${i} 天`" :value="i" />
  </el-select>
</template>
<script setup>
const props = defineProps({
  dates: {
    type: Number,
    default: 31,
  },
})
const emit = defineEmits(['on-change'])
</script>