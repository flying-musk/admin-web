import request from '@/utils/request'

export const CalTitleApiHandler = data => {
  return request({
    url: 'api/sys/cal_title.php',
    method: 'post',
    data,
  })
}