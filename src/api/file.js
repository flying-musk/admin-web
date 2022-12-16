import request from '@/utils/request'
export const FileApiHandler = data => {
  return request({
    url: `api/filedl.php`,
    method: 'post',
    responseType: 'blob',
    data,
  })
}