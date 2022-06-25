import axios from 'axios'
import { ElMessage } from 'element-plus'
import store from '@/store'
import router from '@/router'

const service = axios.create({
  baseURL: '/',
  timeout: 10000,
  withCredentials: true,
})

service.interceptors.request.use(
  config => {
    const { authorization } = store.state.app
    if (authorization) {
      config.headers.Authorization = `Bearer ${authorization.token}`
    }
    return config
  },
  error => {
    // console.log(error);
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    return response.data
  },
  async error => {
    if (error.response && error.response.status === 401) {
      const { authorization } = store.state.app
      if (!authorization || !authorization.refresh_token) {
        if (router.currentRoute.value.name === 'login') {
          return Promise.reject(error)
        }
        const redirect = encodeURIComponent(window.location.href)
        router.push(`/login?redirect=${redirect}`)
        // clear token
        store.dispatch('app/clearToken')
        setTimeout(() => {
          ElMessage.closeAll()
          try {
            ElMessage.error(error.response.data.msg)
          } catch (err) {
            ElMessage.error(error.message)
          }
        })
        return Promise.reject(error)
      }
      // if has refresh_token, require refresh token
      try {
        const res = await axios({
          method: 'PUT',
          url: '/api/authorizations',
          timeout: 10000,
          headers: {
            Authorization: `Bearer ${authorization.refresh_token}`,
          },
        })

        store.commit('app/setToken', {
          token: res.data.data.token, // new token
          refresh_token: authorization.refresh_token, // old refresh_token
        })

        return service(error.config)
      } catch (err) {
        const redirect = encodeURIComponent(window.location.href)
        router.push(`/login?redirect=${redirect}`)

        store.dispatch('app/clearToken')
        return Promise.reject(error)
      }
    }

    ElMessage.closeAll()
    try {
      ElMessage.error(error.response.data.msg)
    } catch (err) {
      ElMessage.error(error.message)
    }

    return Promise.reject(error)
  }
)

export default service
