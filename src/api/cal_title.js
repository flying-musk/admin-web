import request from '@/utils/request'

export const SetCalTitle = data => {
  return request({
    url: 'api/sys/cal_title.php',
    method: 'post',
    data,
  })
}

export const GetCalTitle = data => {
  return request({
    url: 'api/sys/cal_title.php',
    method: 'post',
    data,
  })
}
