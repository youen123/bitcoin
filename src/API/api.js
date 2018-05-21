import Axios from 'axios'

let http = Axios

let _get = (url, params) => {
  return http.get(url, {params: params}).then((res) => {
    if (!res.data.flag) {
     // console.log(res.data.msg)
    }
    return res.data.data
  })
  .catch((er) => {
    // console.log(er)
  })
}

let _post = (url, params) => {
  return http.post(url, params).then((res) => {
    if (!res.data.flag) {
      return res.data.msg
    }
    return res.data.data
  })
  .catch((er) => {
   // console.log(er)
  })
}

let getData = async (coinname) => {
  return _get('coin/getPrice', {coinname})
}

// p网价格
let getHbPrice = async (coinname) => {
  return _get('hb/getPrice', {coinname})
}

// p网账户
let getHbBalance = async () => {
  return _get('hb/getMyBalance')
}

// 交易记录
let getHbTradeList = async (coinname) => {
  return _get('hb/getMyTradeList', {coinname})
}

// 挂单记录
let getHbOrderList = async (coinname) => {
  return _get('hb/getOrderList', {coinname})
}

// 时代账户
let getTimeBalance = async () => {
  return _get('coin/getMyBalance')
}

// 交易记录
let getTimeTradeList = async ({page, searchGb, coinname}) => {
  return _get('coin/getMyTradeList', {page, searchGb, coinname})
}

// 挂单记录
let getTimeOrderList = async (coinname) => {
  return _get('coin/getOrderList', {coinname})
}

// 汇率
let getRate = async () => {
  return _get('hb/getRate')
}

// 交易状态
let getStatus = async () => {
  return _get('trade/getStatus')
}

let setStatus = ({status}) => {
  return _post('trade/setStatus', {status})
}

// 交易条件
let getTradeRate = async () => {
  return _get('trade/getTradeRate')
}

let setTradeRate = async ({rate1, rate2}) => {
  return _post('trade/setTradeRate', {rate1, rate2})
}

// 提币
let withDraw = async ({coinname, amount}) => {
  return _post('coin/withdraw', {coinname, amount})
}

export default {
  getData,
  getHbPrice,
  getHbBalance,
  getHbTradeList,
  getHbOrderList,
  getTimeBalance,
  getTimeOrderList,
  getTimeTradeList,
  getRate,
  getStatus,
  setStatus,
  getTradeRate,
  setTradeRate,
  withDraw
}

