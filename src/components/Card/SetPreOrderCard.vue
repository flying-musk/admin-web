<template>
  <div
    class="bg-white tracking-wider text-gray-500 text-xs rounded-md border-2"
    disabled>
    <header
      class="
        bg-gray-50
        text-gray-700
        py-2
        px-4
        text-center
        shadow
        tracking-widest
        flex
        items-center
        cursor-pointer
      "
      @click="state.isCollapse = !state.isCollapse">
      <h3 class="flex-1">新增預收訂單</h3>
      <el-icon>
        <ArrowUp v-show="state.isCollapse" />
        <ArrowDown v-show="!state.isCollapse" />
      </el-icon>
    </header>
    <div v-show="state.isCollapse">
      <CreatePreOrderForm @on-refresh="emit('on-refresh')" />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import CreatePreOrderForm from '@/components/Form/CreatePreOrderForm.vue'
const emit = defineEmits(['on-refresh'])
const state = reactive({
  isCollapse: true,
})
</script>