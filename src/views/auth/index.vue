<template>
  <el-tabs
    v-model="activeName"
    type="card"
    class="demo-tabs"
    @tab-click="handleClick">
    <el-tab-pane label="New" name="first">新增用戶</el-tab-pane>
    <el-tab-pane label="Sys" name="second">系統用戶</el-tab-pane>
  </el-tabs>
</template>

<script>
  import { defineComponent, ref } from 'vue'

  export default defineComponent({
    name: 'auth',
    setup() {
      const handleClick = () => {}
      return {
        activeName: ref('New'),
        handleClick,
      }
    },
  })
</script>

<style lang="scss" scoped>
  .auth {
    color: $mainColor;
  }
</style>
