<template>
  <div
    class="left"
    :class="{ 'isCollapse': collapse, mobile: device === 'mobile' }"
    >
    <logo />
    <menus :collapse="collapse" />
  </div>
  <div class="mask" @click="closeSidebar"></div>
</template>

<script>
  import { defineComponent, onBeforeMount, computed } from 'vue'
  import Logo from './Logo.vue'
  import Menus from './Menus.vue'
  import { useStore } from 'vuex'

  export default defineComponent({
    components: {
      Logo,
      Menus,
    },
    setup() {
      const store = useStore()
      const collapse = computed(() => !!store.state.app.sidebar.collapse)
      const device = computed(() => store.state.app.device)

      const closeSidebar = () => {
        store.commit('app/setCollapse', 1)
      }

      onBeforeMount(async () => {
        await store.dispatch('menu/generateMenus')
      })

      return {
        collapse,
        device,
        closeSidebar,
      }
    },
  })
</script>

<style lang="scss" scoped>
  .left {
    width: 180px;
    height: 100%;
    background: $menuBg;
    transition: all 0.3s ease-in-out;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    &.isCollapse {
      width: 64px;
      ::v-deep(.brand .title) {
        display: none;
      }
    }
    &.mobile {
      height: 100%;
      position: fixed;
      left: 0;
      top: 0;
      z-index: 10;
      & + .mask {
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.3);
        z-index: 9;
      }
      &.isCollapse {
        transform: translateX(-100%);
        & + .mask {
          display: none;
        }
      }
    }
  }
</style>
