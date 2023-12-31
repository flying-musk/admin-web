import request from '@/utils/request'

/**
 * @description 金流管理
 * @param {object}  data
 */
export const MoneyApiHandler = data => {
  return request({
    url: 'money',
    method: 'post',
    data,
  })
}
