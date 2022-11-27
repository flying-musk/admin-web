import request from '@/utils/request'

export const ReadJson = (file) => {
  return request({
    url: `/api/readjson.php?file=${file}.json`,
    method: 'get'
  })
}