var config = {
  "huobi": {
    "access_key": "",
    "secretkey":  "",
    "account_id": "",
    "account_id_pro": "",
    "trade_password": ""
  }
}
var crypto = require('crypto')
var CryptoJS = require('crypto-js')
var moment = require('moment')
var HmacSHA256 = require('crypto-js/hmac-sha256')
const rp = require('request-promise')

const URL_HUOBI_PRO = 'api.huobipro.com'
// const URL_HUOBI_PRO = 'api.huobi.pro' //备用地址

const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  "User-Agent": "Mozilla/5.0 (Windows NT 6.1 WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36"
}

function get_auth() {
  var sign = config.huobi.trade_password + 'hello, moto'
  // var md5 = CryptoJS.MD5(sign).toString().toLowerCase()
  var md5 = crypto.createHash('md5').update(sign).digest('hex')
  let ret = encodeURIComponent(JSON.stringify({
    assetPwd: md5
  }))
  return ret
}

function sign_sha(method, baseurl, path, data) {
  var pars = []
  for (let item in data) {
    pars.push(item + "=" + encodeURIComponent(data[item]))
  }
  var p = pars.sort().join("&")
  var meta = [method, baseurl, path, p].join('\n')
  var hash = HmacSHA256(meta, config.huobi.secretkey)
  var Signature = encodeURIComponent(CryptoJS.enc.Base64.stringify(hash))
  // console.log(`Signature: ${Signature}`)
  p += `&Signature=${Signature}`
  // console.log(p)
  return p
  }

  function get_body() {
    return {
      AccessKeyId: config.huobi.access_key,
      SignatureMethod: "HmacSHA256",
      SignatureVersion: 2,
      Timestamp: moment.utc().format('YYYY-MM-DDTHH:mm:ss'),
    }
  }

  function _request (options) {
    options.headers = DEFAULT_HEADERS
    options.headers.AuthData = get_auth()
    options.json = true
    options.timeout = 10 * 1000
    // console.log(options.url)
    return rp(options).then(data => {
      if (data.status === 'ok') {
        // console.log(data)
        return data
      } else {
        console.log('调用错误', data)
        return null
      }
    }).catch(ex => {
        console.log(options.url, '异常', ex)
    })
  }

  function _get (path, payload, body) {
    let options = {
      method: 'GET',
      url: `https://${URL_HUOBI_PRO}${path}?${payload}`
    }
    return _request(options)
  }

  function _post (path, payload, body) {
    let options = {
      method: 'POST',
      url: `https://${URL_HUOBI_PRO}${path}?${payload}`,
      body: body,
      json: true
    }
    return _request(options)

  }

  function call_api(method, path, payload, body) {
    if (method == 'GET') {
      return _get(path, payload, body)
    } else {
      return _post(path, payload, body)
    }
  }

  var HUOBI_PRO = {
    get_price: async function (symbol) {
      var path = '/market/trade'
      var body = get_body()
      body.symbol = symbol
      var payload = sign_sha('GET', URL_HUOBI_PRO, path, body)
      return call_api('GET', path, payload, body)
      .then((data) => {
        return data && data.tick && data.tick.data
      })
    },
    get_account: function () {
      var path = `/v1/account/accounts`
      var body = get_body()
      var payload = sign_sha('GET', URL_HUOBI_PRO, path, body)
      return call_api('GET', path, payload, body)
    },
    get_balance: function () {
      var account_id = config.huobi.account_id_pro
      var path = `/v1/account/accounts/${account_id}/balance`
      var body = get_body()
      var payload = sign_sha('GET', URL_HUOBI_PRO, path, body)
      return call_api('GET', path, payload, body).then((data) => {
        return data && data.data && data.data.list && data.data.list.filter((item) => {
          return item.balance != 0
        })
      })
    },
    get_open_orders: function (symbol) {
      var path = `/v1/order/orders`
      var body = get_body()
      body.symbol = symbol
      body.states = 'submitted,partial-filled'
      var payload = sign_sha('GET', URL_HUOBI_PRO, path, body)
      return call_api('GET', path, payload, body).then((data) => {
        return data && data.data
      })
    },
    get_trades: function (symbol) {
      var path = `/v1/order/matchresults`
      var body = get_body()
      body.symbol = symbol
      var payload = sign_sha('GET', URL_HUOBI_PRO, path, body)
      return call_api('GET', path, payload, body).then((data) => {
        return data && data.data
      })      
    },
    get_order: function (order_id) {
      var path = `/v1/order/orders/${order_id}`
      var body = get_body()
      var payload = sign_sha('GET', URL_HUOBI_PRO, path, body)
      return call_api('GET', path, payload, body)
    },
    get_market_depth: function (symbol) {
      var path = '/market/depth'
      var body = get_body()
      body.symbol = symbol
      body.type = 'step1'
      var payload = sign_sha('GET', URL_HUOBI_PRO, path, body)
      return call_api('GET', path, payload, body).then((data) => {
          return data && data.tick
      })
    },
    place_order: function (symbol, type, amount, price) {
      var path = '/v1/order/orders/place'
      var body = get_body()
      var payload = sign_sha('POST', URL_HUOBI_PRO, path, body)
      body["account-id"] = config.huobi.account_id_pro
      body.type = type
      body.amount = amount
      body.symbol = symbol
      body.price = price
      console.log(body)
      return call_api('POST', path, payload, body).then((data) => {
        return data && data.data
      })
    },
    cancel_order: function (orderid) {
      var path =  `/v1/order/orders/${orderid}/submitcancel`
      var body = get_body()
      var payload = sign_sha('POST', URL_HUOBI_PRO, path, body)
      return call_api('POST', path, payload, body).then((data) => {
        return data && data.data
      })
    },
    batch_cancel_orders: function (list) {
      var path =  `/v1/order/orders/batchcancel`
      var body = get_body()
      var payload = sign_sha('POST', URL_HUOBI_PRO, path, body)
      body['order-ids'] = list
      return call_api('POST', path, payload, body).then((data) => {
        return data && data.data
      })
    },
    buy_limit: function (symbol, amount, price) {
      var path = '/v1/order/orders/place'
      var body = get_body()
      var payload = sign_sha('POST', URL_HUOBI_PRO, path, body)

      body['account-id'] = config.huobi.account_id_pro
      body.type = "buy-limit"
      body.amount = amount
      body.symbol = symbol
      body.price = price

      return call_api('POST', path, payload, body).then((data) => {
      	return data && data.data
      })
	},
    sell_limit: function (symbol, amount, price) {
      var path = '/v1/order/orders/place'
      var body = get_body()
      var payload = sign_sha('POST', URL_HUOBI_PRO, path, body)

      body["account-id"] = config.huobi.account_id_pro
      body.type = "sell-limit"
      body.amount = amount
      body.symbol = symbol
      body.price = price

      return call_api('POST', path, payload, body)
    },
    withdrawal: function (address, coin, amount, payment_id) {
      var path = `/v1/dw/withdraw/api/create`
      var body = get_body()
      var payload = sign_sha('POST', URL_HUOBI_PRO, path, body)

      body.address = address
      body.amount = amount
      body.currency = coin
      if (coin.toLowerCase() == 'xrp') {
        if (payment_id) {
          body['addr-tag'] = payment_id
        } else {
          console.log('huobi withdrawal', coin, 'no payment id provided, cancel withdrawal')
          return Promise.resolve(null)
        }
      }

      return call_api('POST', path, payload, body)
    }
  }

  module.exports = HUOBI_PRO
