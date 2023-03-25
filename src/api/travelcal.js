import request from '@/utils/request'

/**
 * @description 旅游统计
 * @param {object}  data
 */
export const TravelcalApiHandler = data => {
  return request({
    url: 'api/sys/travelcal.php',
    method: 'post',
    data,
  })
}


