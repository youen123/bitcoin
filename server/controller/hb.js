let express = require('express')
let router = express.Router()
const huobi = require('../api/hbsdk.js')

const rate = require('../api/rate')

function toClient(res, flag, data, msg) {
  res.json({
    flag,
    data: data || null,
    msg
  })
}
// 获取价格
router.use('/getPrice', (req, res) => {
  let coinname = (req.query.coinname || 'btcusdt').toLowerCase()
  huobi.get_price(coinname).then((data) => {
    if (data) {
      let price = data[0].price * rate.USDCNY
      toClient(res, true, {price}, '成功')
    } else {
      toClient(res, false, null, '失败')
    }
  }).catch((err) => {
    toClient(res, false, null, '失败')
  })
})

// 挂单==
router.post('/submitOrder', (req, res) => {
  let { type, price, amount, coinname } = req.body
  huobi.place_order(coinname, type, amount, price).then((data) => {
    toClient(res, false, data, '成功')
  }).catch((err) => {
    toClient(res, false, null, '失败')
  })
})

// 撤单
router.post('/cancleOrder', (req, res) => {
  let {order_id} = req.body
  console.log(order_id)
  huobi.cancel_order(order_id).then((data) => {
    if (data) {
      toClient(res, true, null, '成功')
    } else {
      toClient(res, false, null, '失败')
    }
  }).catch((err) => {
    toClient(res, false, null, err || '失败')
  })
})

// 成交记录
router.get('/getMyTradeList', (req, res) => {
  let coinname = req.query.coinname || 'btcusdt'
  huobi.get_trades(coinname).then((data) => {
    if (data) {
      data = data.map((item) => {
        item.price = parseFloat(item.price) * rate.USDCNY
        return item
      })
      toClient(res, true, data, '成功')
    } else {
      toClient(res, false, null, '失败')
    }
  }).catch((err) => {
    toClient(res, false, null, err || '失败')
  })
})

// 挂单信息
router.get('/getOrderList', (req, res) => {
  let coinname = req.query.coinname || 'btcusdt'
  huobi.get_open_orders(coinname).then((data) => {
    if (data) {
      data = data.map((item) => {
        item.amount = parseFloat(item.amount).toFixed(6)
        item.price = parseFloat(item.price) * rate.USDCNY
        item.total = item.amount * item.price
        return item
      })
      toClient(res, true, data, '成功')
    } else {
      toClient(res, false, null, '失败')
    }
  }).catch((err) => {
    toClient(res, false, null, err || '失败')
  })
})

// 账户余额
router.get('/getMyBalance', (req, res) => {
  huobi.get_balance().then((data) => {
    toClient(res, true, data || [], '成功')
  }).catch((err) => {
    toClient(res, false, null, err || '失败')
  })
})

router.get('/getRate', (req, res) => {
  toClient(res, true, {rate: rate.USDCNY}, '成功')
})

module.exports = router
