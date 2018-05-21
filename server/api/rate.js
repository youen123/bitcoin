const Yahoo_API = 'https://finance.yahoo.com/webservice/v1/symbols/allcurrencies/quote?format=json'
const request = require('request')
let Agent = require('socks5-https-client/lib/Agent')

let rate = {USDKRW: 1114.790039, USDCNY: 6.635900}
let options = {
  url: Yahoo_API
/*  agentClass: Agent,
  agentOptions: {
    socksHost: '127.0.0.1',
    socksPort: 1080
  } */ 
}

let getRate = () => {
  request(options, (err, res, body) => {
    if (err) {
      console.log('get rate err!');
      return;
    }
    if (body) {
      try {
        let list = JSON.parse(body).list.resources
        list.forEach((item) => {
          if (item.resource.fields.name === 'USD/KRW') {
            rate.USDKRW = parseFloat(item.resource.fields.price)
          } else if (item.resource.fields.name === 'USD/CNY') {
            rate.USDCNY = parseFloat(item.resource.fields.price)
          }
          rate.KRWCNY = rate.USDCNY / rate.USDKRW
        })
       // console.log('json parse ok!')
      } catch (err) {
        console.log('json parse err!')
        // console.log(err);
        return;
      }
    }
  })
  setTimeout(getRate, 10000)  
}
getRate()

module.exports = rate
