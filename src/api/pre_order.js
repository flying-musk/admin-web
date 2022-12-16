import request from '@/utils/request'
const role = 'agent'
export const PreOrderApiHandler = data => {
  return request({
    url: `api/${role}/pre_order.php`,
    method: 'post',
    data,
  })
}

export const PreOrderFileApiHandler = (data) => {
  return request({
    headers: { 'Content-Type': 'multipart/form-data' },
    url: `api/${role}/pre_order.php`,
    method: 'post',
    data:data,
  })
}
