import request from '@/utils/request'
const role = 'agent'
export const PreOrderApiHandler = data => {
  return request({
    url: `api/${role}/pre_order.php`,
    method: 'post',
    data,
  })
}