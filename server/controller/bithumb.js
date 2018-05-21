let express = require('express')
let router = express.Router()

const KEY = ''
const SECRET = ''

const Bithumb = require('../api/bithumb.js')
const bithumb = new Bithumb(KEY, SECRET)
const rate = require('../api/rate')

function toClient (res, flag, data, msg) {
  res.json({
    flag,
    data: data || null,
    msg
  })
}
// 获取价格
router.use('/getPrice', (req, res) => {
  let coinname = (req.query.coinname || 'btc').toLowerCase()
  bithumb.getTicker(coinname).then((data) => {
    if (data.status === '0000') {
      data = data.data
      data.closing_price = (parseFloat(data.closing_price) * rate.KRWCNY).toFixed(8)
      toClient(res, true, data, '成功')
    } else {
      toClient(res, false, null, data.message || '失败')
    }
  }).catch((err) => {
    toClient(res, false, null || err, '失败')
  })
})

// 挂单
router.post('/submitOrder', (req, res) => {
  let { type, price, amount, coinname } = req.body
  price = parseInt(price)
  amount = parseFloat(amount)
  bithumb.placeOrder(coinname, 'KRW', amount, price, type, 'N').then((data) => {
    console.log(data)
    if (data.status === '0000') {
      toClient(res, true, data.order_id, '成功')
    } else {
      toClient(res, false, null, data.message)
    }
  }).catch((err) => {
    toClient(res, false, null || err, '失败')
  })
})

// 撤单
router.post('/cancleOrder', (req, res) => {
  let { order_id, coinname, type } = req.body
  console.log(order_id)
  bithumb.cancelOrder(order_id, type, coinname).then((data) => {
    console.log(data)
    if (data.status === '0000') {
      toClient(res, true, null, '成功')
    } else {
      toClient(res, false, null, data.message)
    }
  }).catch((err) => {
    toClient(res, false, null, err || '失败')
  })
})

// 成交记录
router.get('/getMyTradeList', (req, res) => {
  let page = req.query.page || 0
  let coinname = req.query.coinname || 'BTC'
  let searchGb = req.query.searchGb
  bithumb.getAccountTradeHistory(page, 50, searchGb, coinname).then((data) => {
    if (data.status === '0000') {
      data = data.data.filter((item) => {
        return item.search === '2' || item.search === '1'
      }).map((item) => {
        item.total = parseFloat(item.price) * rate.KRWCNY
        item.price = parseFloat(item[coinname + '1krw']) * rate.KRWCNY
        return item
      })
      toClient(res, true, data, '成功')
    } else {
      toClient(res, false, [], '失败')
    }
  }).catch((err) => {
    toClient(res, false, null, err || '失败')
  })
})

// 挂单信息==
router.get('/getOrderList', (req, res) => {
  let coinname = req.query.coinname || 'BTC'
  bithumb.getOpenOrders('1510062193757', 'bid', coinname.toUpperCase()).then((data) => {
    console.log(data)
    if (data.status === '0000') {
      toClient(res, true, data.data, '成功')
    } else {
      toClient(res, false, [], data.message || '失败')
    }
  }).catch((err) => {
    toClient(res, false, null, err || '失败')
  })
})

// 账户余额
router.get('/getMyBalance', (req, res) => {
  bithumb.getBalance('all').then((data) => {
    toClient(res, true, data.data, '成功')
  }).catch((err) => {
    toClient(res, false, null, err || '失败')
  })
})

// 获取市场价格
router.use('/getMarketPrice', (req, res) => {
  let coinname = (req.query.coinname || 'btc').toLowerCase()
  bithumb.getOrderbook(coinname).then((data) => {
    toClient(res, true, data.data, '成功')
  }).catch((err) => {
    toClient(res, false, null, err || '失败')
  })
})

// 提币
router.use('/withdraw', (req, res) => {
  let {coinname, amount} = req.body
  console.log(coinname)
  bithumb.btcWithdrawal(amount, coinname).then((data) => {
    console.log(data)
    if (data.status === '0000') {
      toClient(res, true, '成功', '成功')
    } else {
      toClient(res, false, data, '失败')
    }
  }).catch((err) => {
    toClient(res, false, null, err || '失败')
  })
})

module.exports = router
