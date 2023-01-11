<template>
  <div class="brand">
    <img class="logo" src="~@/assets/logo.svg" @click="goHome" />
    <div class="title">國際{{ formatTitle }}平台</div>
  </div>
</template>
<script>
import { defineComponent, computed } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  setup() {
    const router = useRouter()
    const goHome = () => {
      router.push('/')
    }
    const formatTitle = computed(() =>
      import.meta.env.VITE_BBT_ROLE === 'agent' ? '代理商' : '管理'
    )
    return { formatTitle, goHome }
  },
})
</script>
<style lang="scss" scoped>
.brand {
  height: 48px;
  padding: 0 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  .logo {
    cursor: pointer;
    max-width: 32px;
    max-height: 32px;
  }
  .title {
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    white-space: nowrap;
    margin-left: 8px;
    transition: all 0.5s;
  }
}
</style>
