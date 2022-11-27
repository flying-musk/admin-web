import request from '@/utils/request'

export const ChangeTokenApiHandler = data => {
  return request({
    url: 'api/changeToken.php',
    method: 'post',
    data,
  })
}