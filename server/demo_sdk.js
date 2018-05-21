const BITHUMB_KEY = ''
const BITHUMB_SECRET = ''
const Bithumb = require('./api/bithumb.js')
const bithumb = new Bithumb(BITHUMB_KEY, BITHUMB_SECRET)
const huobi = require('./api/hbsdk.js')


function run () {
    // 准备工作，填写config/default.json中的:
    // access_key & secretkey, www.huobi.com上申请
    // account_id 登陆后看自己的UID
    // trade_password 可以先不填，提现时需要

    // 第一步，获取account_id
    // hbsdk.get_account().then(console.log);
    // 把get_account获取到的type=spot的id填写到:
    // default.json中的${account_id_pro}中去

    // 获取price
    // huobi.get_price('btcusdt').then((data) => {
    //     console.log(data)
    // })
    // 获取订单
    // huobi.get_open_orders('btcusdt').then((data) => {
    //     console.log(data)
    // })

    // 第二步，获取Balance和OpenOrders
    // huobi.get_balance().then((data) => {
    //     console.log(data)
    // })
    // huobi.get_market_depth('btcusdt')
    // huobi.cancel_order(1114525249)
    huobi.batch_cancel_orders([1114913300])
    bithumb.placeOrder('btc', 'KRW', 0.001, 12850000, 'bid', 'N')
    // 第三步，交易
    //huobi.buy_limit('ltcusdt', 0.01, 0.1);
    // huobi.sell_limit('ltcusdt', 0.01, 0.1)
    // 第四步，检查订单
    // huobi.get_order(241044800).then(console.log);

    // 第五步，提现
    // 先去网站上设置好安全提现地址
    // 欢迎打赏到我的钱包，我可以协助测试 ^^
    // hbsdk.withdrawal('0x9edfe04c866d636526828e523a60501a37daf8f6', 'etc', 1);
}

run()
