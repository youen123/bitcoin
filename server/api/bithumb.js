const rp = require('request-promise')
const crypto = require('crypto')
const querystring = require('querystring')

const wallet = {
  BTC: '',
  ETH: '',
  XRP: '',
  LTC: '',
  DASH: '',
  QTUM: ''
}
const XRP_TAG = 0

class Bithumb {
  constructor (key, secret) {
    this.key = key
    this.secret = secret
    this.API_URL = 'https://api.bithumb.com'
  }

  _public (command, params) {
    return rp({
      method: 'GET',
      uri: this.API_URL + command + '/' + params,
      json: true
    })
  }

  _private (command, params) {
    params || (params = {})
    params.endPoint = command
    const _nonce = (function () {
      var now = new Date().getTime() / 1000
      const sec = parseInt(now, 10)
      const usec = (Math.round((now - sec) * 1000) / 1000).toString().substr(2, 3)

      return Number(String(sec) + String(usec))
    })()
    const requestSignature = command + String.fromCharCode(0) + querystring.stringify(params) + String.fromCharCode(0) + _nonce
    const hmacSignature = Buffer.from(crypto.createHmac('sha512', this.secret).update(requestSignature).digest('hex')).toString('base64')
    return rp({
      method: 'POST',
      uri: this.API_URL + command,
      formData: params,
      json: true,
      timeout: 10000,
      headers: {
        'Api-Key': this.key,
        'Api-Sign': hmacSignature,
        'Api-Nonce': _nonce
      }
    })
  }

  async getTicker (currency) {
    return this._public('/public/ticker', currency)
  }

  async getOrderbook (currency) {
    return this._public('/public/orderbook', currency)
  }

  async getRecentTransactions (currency) {
    return this._public('/public/recent_transactions', currency)
  }

  async getAccountInfo (currency) {
    return this._private('/info/account', {currency})
  }
  async getBalance (currency) {
    return this._private('/info/balance', {currency})
  }

  async getWalletAddress (currency) {
    return this._private('/info/wallet_address', {currency})
  }

  async getAccountLastTrades (orderCurrency, paymentCurrency) {
    return this._private('/info/ticker', {orderCurrency, paymentCurrency})
  }

  async getOpenOrders (orderId, type, currency) {
    let count = 10
    let after = new Date().getTime() - 7 * 24 * 60 * 60 * 1000
    return this._private('/info/orders', {orderId, type, count, after, currency})
  }

  async getAccountTradeHistory (offset, count, searchGb, currency) {
    return this._private('/info/user_transactions', {offset, count, searchGb, currency})
  }

  async placeOrder (orderCurrency, PaymentCurrency, units, price, type, misu) {
    // console.log({order_currency, Payment_currency, units, price, type, misu})
    return this._private('/trade/place', {orderCurrency, PaymentCurrency, units, price, type, misu})
  }

  async getOrderDetail (orderId, type, currency) {
    return this._private('/info/order_detail', {orderId, type, currency})
  }

  async cancelOrder (orderId, type, currency) {
    return this._private('/trade/cancel', {orderId, type, currency})
  }

  async btcWithdrawal (units, currency) {
    if (currency === 'XRP') {
      return this._private('/trade/btc_withdrawal', {units, address: wallet[currency], destination: XRP_TAG, currency})
    } else {
      return this._private('/trade/btc_withdrawal', {units, address: wallet[currency], currency})
    }
  }

  async krwDeposit () {
    return this._private('/trade/krw_deposit')
  }

  async krwWithdrawal (bank, account, price) {
    return this._private('/trade/krw_withdrawal', {bank, account, price})
  }

  async marketBuy (units, currency) {
    return this._private('/trade/market_buy', {units, currency})
  }

  async marketSell (units, currency) {
    return this._private('/trade/market_sell', {units, currency})
  }
}

module.exports = Bithumb
