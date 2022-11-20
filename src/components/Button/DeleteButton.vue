<template>
  <el-button
    type="danger"
    icon="Delete"
    plain
    size="small"
    auto-insert-space
    @click="actions.handleConfirm"
    >{{ action }}</el-button
  >
</template>

<script setup>
import { getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance()
const props = defineProps({
  action: {
    type: String,
    default: '',
  },
  msg: {
    type: String,
    default: '',
  },
})
const emit = defineEmits(['on-submit'])
const actions = {
  handleConfirm: () => {
    proxy.$messageBox
      .confirm(props.msg, '提示', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning',
      })
      .then(() => {
        emit('on-submit')
      })
      .catch(() => {
        proxy.$message({
          type: 'info',
          message: '已取消刪除',
        })
      })
  },
}
</script>