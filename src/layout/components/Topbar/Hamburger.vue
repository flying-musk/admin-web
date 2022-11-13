<template>
  <div @click="handleToggleMenu">
      <svg
      :class="{ 'rotate-180 isCollapse': collapse }"
      class="fold-btn"
      viewBox="0 0 1024 1024"
      xmlns="http://www.w3.org/2000/svg"
      width="36"
      height="36"
    >
      <path
        d="M408 442h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm-8 204c0 4.4 3.6 8 8 8h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56zm504-486H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 632H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM142.4 642.1L298.7 519a8.84 8.84 0 0 0 0-13.9L142.4 381.9c-5.8-4.6-14.4-.5-14.4 6.9v246.3a8.9 8.9 0 0 0 14.4 7z"
      />
    </svg>
  </div>
</template>
<script>
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  setup() {
    const store = useStore()
    const collapse = computed(() => !!store.state.app.sidebar.collapse)
    const handleToggleMenu = () => {
      store.commit('app/setCollapse', +!collapse.value)
    }
    return {
      collapse,
      handleToggleMenu,
    }
  },
})
</script>
<style lang="scss" scoped>
.fold-btn {
  line-height: 48px;
  padding: 0 10px;
  font-size: 18px;
  cursor: pointer;
  &:hover {
    background: #f5f5f5;
  }
  &.isCollapse {
    transform: scale(-1, 1);
  }
}
</style>
