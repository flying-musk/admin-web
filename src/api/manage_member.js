import request from '@/utils/request'

/**
 * @description 會員管理
 * @param {object}  data
 */
export const ManageMemberApiHandler = data => {
  return request({
    url: 'api/sys/mbop.php',
    method: 'post',
    data,
  })
}