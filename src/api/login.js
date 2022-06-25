import request from '@/utils/request'

export const Login = data => {
  return request({
    url: '/api/login',
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
