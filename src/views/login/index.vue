<template>
  <div class="login">
    <el-form class="form" :model="model" :rules="rules" ref="loginForm">
      <h1 class="title">
        <!-- 管理界面 以及 代理商界面  -->
        {{ title }}界面</h1>
      <el-form-item prop="id">
        <el-input
          class="text"
          v-model="model.id"
          prefix-icon="User"
          clearable
          placeholder="用户名" />
      </el-form-item>
      <el-form-item prop="pwd">
        <el-input
          class="text"
          v-model="model.pwd"
          prefix-icon="Lock"
          show-password
          clearable
          placeholder="密碼" />
      </el-form-item>
      <div class="flex justify-center pb-6">
        <vue-recaptcha :sitekey="siteKey"></vue-recaptcha>
      </div>

      <el-form-item>
        <el-button
          :loading="loading"
          type="primary"
          class="btn"
          @click="submit">
          {{ btnText }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {
  defineComponent,
  getCurrentInstance,
  reactive,
  toRefs,
  ref,
  computed,
} from 'vue'
import { Login } from '@/api/login'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { VueRecaptcha } from 'vue-recaptcha'
export default defineComponent({
  name: 'login',
  components: {
    VueRecaptcha,
  },
  setup() {
    const { proxy } = getCurrentInstance() // same to vue2 this
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const state = reactive({
      siteKey: '6LfjGXoUAAAAAJFgeFh_a0qUDVFGXT30YLwdarMM',
      model: {
        id: 'cksunny',
        pwd: 'xs38f5bk',
      },
      rules: {
        id: [{ required: true, message: '請輸入帳號', trigger: 'blur' }],
        pwd: [
          { required: true, message: '請輸入密碼', trigger: 'blur' },
          {
            min: 6,
            max: 12,
            message: '長度在 6 到 12 字元',
            trigger: 'blur',
          },
        ],
      },
      loading: false,
      title: computed(() =>
        import.meta.env.VITE_BBT_ROLE === 'agent' ? '代理商' : '管理'
      ),
      btnText: computed(() => (state.loading ? '登入中...' : '登入')),
      loginForm: ref(null),
      submit: () => {
        if (state.loading) {
          return
        }
        state.loginForm.validate(async valid => {
          if (valid) {
            state.loading = true
            const { code, data, msg } = await Login(state.model)
            if (code === 1) {
              proxy.$message({
                type: 'success',
                message: '登入成功',
                duration: 1000,
              })
              const targetPath = decodeURIComponent(route.query.redirect)
              if (targetPath.startsWith('http')) {
                window.location.href = targetPath
              } else if (targetPath.startsWith('/')) {
                router.push(targetPath)
              } else {
                router.push('/')
              }
              store.dispatch('app/setToken', msg)

            } else {
              proxy.$message({
                type: 'error',
                message: msg,
              })
            }
            state.loading = false
          }
        })
      },
    })

    return {
      ...toRefs(state),
    }
  },
})
</script>

<style lang="scss">
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-transition: 'color 9999s ease-out, background-color 9999s ease-out';
  -webkit-transition-delay: 9999s;
}
</style>
<style lang="scss" scoped>
.login {
  transition: transform 1s;
  transform: scale(1);
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #2d3a4b;
  .form {
    width: 520px;
    max-width: 100%;
    padding: 0 24px;
    box-sizing: border-box;
    margin: 160px auto 0;
    .title {
      color: #fff;
      text-align: center;
      font-size: 24px;
      margin: 0 0 24px;
    }
    .text {
      font-size: 16px;
      :deep(.el-input__wrapper) {
        background: rgba(0, 0, 0, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: #fff;
        height: 48px;
        line-height: 48px;
        &::placeholder {
          color: rgba(255, 255, 255, 0.2);
        }
      }
      :deep(.el-input__inner) {
        color: #fff;
      }
    }
    .btn {
      width: 100%;
      height: 48px;
      line-height: 48px;
    }
  }
}
</style>
