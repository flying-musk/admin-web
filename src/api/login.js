import request from '@/utils/request'

/**
 * @description 登入
 * @param {string}  cat   角色 (member / agent / admin)
 * @param {string}  id    帳號
 * @param {string}  pwd   密碼
 */
export const Login = params => {
  const categoryMap = {
    admin: 'sysuser',
    agent: 'agent',
    member: 'member',
  }
  const cat = categoryMap[import.meta.env.VITE_BBT_ROLE]
  const data = {
    ...params,
    cat
  }
  return request({
    url: '/api/login.php',
    method: 'post',
    data,
  })
}

export const GetUserinfo = () => {
  return request({
    url: '/api/userinfo',
    method: 'get',
  })
}
