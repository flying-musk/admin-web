import request from '@/utils/request'

/**
 * @description 取得最近 n 天的 扣補調整清單
 * @param {string}  action  deduct_list
 * @param {number}  days    天數
 */
export const GetDeductList = data => {
  return request({
    url: 'api/sys/sp_epadj.php',
    method: 'post',
    data,
  })
}

/**
 * @description 設定單筆扣補
 * @param {string}  action  set_single
 * @param {number}  mbid    會員編號
 * @param {number}  amount  金額
 * @param {string}  remark  備註
 * @param {number}  dtype   1(扣款) or 2(補錢)
 * @param {number}  iscfm   null(未確認) or 1(確認)
 */
 export const SetDeduct = data => {
  return request({
    url: 'api/sys/sp_epadj.php',
    method: 'post',
    data,
  })
}


