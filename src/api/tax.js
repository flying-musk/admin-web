import request from '@/utils/request'

/**
 * @description 稅務表格
 * @param {object}  data  
 */
export const TexApiHandler = data => {
  return request({
    url: 'api/sys/mbtax_verify.php',
    method: 'post',
    data,
  })
}


