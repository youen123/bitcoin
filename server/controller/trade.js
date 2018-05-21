let express = require('express')
let router = express.Router()
let fs = require('fs')
function toClient(res, flag, data, msg) {
  res.json({
    flag,
    data: data || null,
    msg
  })
}

// 开启/关闭交易
router.get('/getStatus', (req, res) => {
  var exec = require('child_process').exec
  var cmdStr = 'sh ./shell/check.sh'
  exec(cmdStr, (err, stdout, stderr) => {
    if (err) {
      toClient(res, false, null, stderr)
    } else {
      console.log(stdout)
      let data = stdout.trim()
      if (data) {
        toClient(res, true, { pid: data, status: true }, '成功')
      } else {
        toClient(res, true, { status: false }, '成功')
      }
    }
  })
})

router.post('/setStatus', (req, res) => {
  let status = req.body.status
  console.log(status)
  var exec = require('child_process').exec
  var cmdStr = 'sh ./shell/check.sh'
  exec(cmdStr, (err, stdout, stderr) => {
    console.log(cmdStr)
    if (err) {
      toClient(res, false, null, stderr)
      return
    }
    let data = stdout.trim()
    if (data) {
      if (status === true) {
        toClient(res, true, { pid: data, status: true }, '成功')
        return
      }
      var cmdStart = 'sh ./shell/stop.sh'
      exec(cmdStart, (err, stdout, stderr) => {
        console.log(cmdStart)
        if (err) {
          toClient(res, false, null, stderr)
        } else {
          toClient(res, true, { status: false }, '成功')
        }
      })
      return
    }
    if (status === false) {
      toClient(res, true, { status: false }, '成功')
      return
    }
    cmdStart = 'sh ./shell/start.sh'
    exec(cmdStart, (err, stdout, stderr) => {
      console.log(cmdStart)
      if (err) {
        console.log(stderr)
        toClient(res, false, null, stderr)
      } else {
        console.log(stdout)
        toClient(res, true, { status: true }, '成功')
      }
    })
  })
})

router.get('/getTradeRate', (req, res) => {
  fs.readFile('config/trade.json', (err, data) => {
    if (err) {
      toClient(res, false, null, err)
    } else {
      toClient(res, true, JSON.parse(data.toString()), '成功')
    }
  })
})

router.post('/setTradeRate', (req, res) => {
  let rate1 = req.body.rate1
  let rate2 = req.body.rate2
  let content = '{\"rate1\":' + rate1 + ',\"rate2\":' + rate2 + '}'
  fs.writeFile('config/trade.json', content, (err) => {
    if (err) {
      toClient(res, false, null, '写入失败')
      return
    }
    toClient(res, true, null, '写入成功')
  })
})

module.exports = router
