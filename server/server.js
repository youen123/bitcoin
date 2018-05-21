const express = require('express')
const app = express()
var path = require('path')
var os = require('os')
var index = require('./routes/index')
// 请求参数解析
const bodyParser = require('body-parser')
const multer = require('multer')
const coinApi = require('./controller/bithumb')
const tradeApi = require('./controller/trade')
const hbApi = require('./controller/hb')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

// app.get('/', function (req, res) {
//   res.send('Hello World!')
// })

app.use('/coin', coinApi)
app.use('/trade', tradeApi)
app.use('/hb', hbApi)
app.listen(8087, function () {
  console.log('Example app listening on port 8088!')
})
// app.use(express.static(path.join(__dirname, 'public')));
