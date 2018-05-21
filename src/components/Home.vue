<template>
  <div>
    <h1>交易货币</h1>
    <router-link to='/withdrawal'><el-button>去提币</el-button></router-link>
    <hr/>
    <span>usdt/cny = {{rate}}</span>
    <el-switch class="pull-right"
      v-model="tradeStatus"
      active-text="按月付费"
      inactive-text="按年付费"
      @change="toggleStatus()">
    </el-switch>
    <el-row style="margin-bottom: 10px">
      <el-col :span="4"><span style="line-height:36px">火币买入的条件：火币/b网</span></el-col>
      <el-col :span="5"><el-input size="medium" v-model="rate1" placeholder="hb/bithumb"></el-input></el-col>
    </el-row>
    <el-row style="margin-bottom: 10px">
      <el-col :span="4"><span style="line-height:36px">b网买入的条件：火币/b网</span></el-col>
      <el-col :span="5"><el-input size="medium" v-model="rate2" placeholder="hb/bithumb"></el-input></el-col>
      <el-col :span="5">
        <el-button type="primary" @click="setTradeRate()">修改买入条件</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="20" :offset="2">
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            prop="name"
            label="">
          </el-table-column>
          <el-table-column
            prop="bithumb"
            label="bithumb">
          </el-table-column>
          <el-table-column
            prop="hb"
            label="火币">
          </el-table-column>
          <el-table-column
            prop="rate1"
            label="汇率（bithumb/火币）"
            width="150">
          </el-table-column>
          <el-table-column
            prop="rate2"
            label="汇率（火币/bithumb）"
            width="150">
          </el-table-column>
<!--           <el-table-column
            prop="priceDiffMax"
            label="最大差价">
          </el-table-column>
          <el-table-column
            prop="priceDiffMin"
            label="最小差价">
          </el-table-column>
          <el-table-column
            prop="priceDiffAve"
            label="平均差价">
          </el-table-column>
 -->        </el-table> 
        <hr>
        <select v-model="currency">
          <option value="btc">btc</option>
          <option value="ltc">ltc</option>
          <option value="eth">eth</option>
          <option value="dash">dash</option>
          <option value="xrp">xrp</option>
          <option value="qtum">qtum</option>
        </select>
        <h3 class="center">火币挂单信息</h3>
        <el-table
          :data="orderData"
          style="width: 100%">
          <el-table-column
            prop="coin_type"
            label="币种"
            width="60">
          </el-table-column>
          <el-table-column
            prop="date"
            label="日期">
          </el-table-column>
          <el-table-column
            prop="type"
            label="类型">
          </el-table-column>
          <el-table-column
            prop="amount"
            label="存币数量">
          </el-table-column>
          <el-table-column
            prop="price"
            label="价格（人民币元）">
          </el-table-column>
          <el-table-column
            prop="total"
            label="总价">
          </el-table-column>
        </el-table> 
         <h3 class="center">bithumb挂单信息</h3>
        <el-table
          :data="orderTimeData"
          style="width: 100%">
          <el-table-column
            prop="coinname"
            label="币种"
            width="60">
          </el-table-column>
          <el-table-column
            prop="time"
            label="日期">
          </el-table-column>
          <el-table-column
            prop="type"
            label="类型">
          </el-table-column>
          <el-table-column
            prop="amount"
            label="存币数量">
          </el-table-column>
          <el-table-column
            prop="price"
            label="价格 （人民币元）">
          </el-table-column>
          <el-table-column
            prop="total"
            label="总价">
          </el-table-column>
        </el-table>        
        <hr>
        <h3 class="center">火币成交记录</h3>
        <el-table
          :data="tradeData"
          style="width: 100%">
          <el-table-column
            prop="coin_type"
            width="60"
            label="币种">
          </el-table-column>
          <el-table-column
            prop="date"
            label="时间">
          </el-table-column>
          <el-table-column
            prop="type"
            width="60"
            label="类型">
          </el-table-column>
          <el-table-column
            prop="filled-amount"
            label="数量">
          </el-table-column>
          <el-table-column
            prop="price"
            label="价格（人民币元）">
          </el-table-column>

          <el-table-column
            prop="total"
            label="总量（人民币元）">
          </el-table-column>
        </el-table> 
        <hr>
        <h3 class="center">bithumb成交记录</h3>
        <el-table
          :data="tradeTimeData"
          style="width: 100%">
          <el-table-column
            prop="coinname"
            width="60"
            label="币种">
          </el-table-column>
          <el-table-column
            prop="date"
            label="时间">
          </el-table-column>
          <el-table-column
            prop="type"
            width="60"
            label="类型">
          </el-table-column>
          <el-table-column
            prop="units"
            label="数量">
          </el-table-column>
          <el-table-column
            prop="price"
            label="价格 （人民币元）">
          </el-table-column>

          <el-table-column
            prop="total"
            label="总量（人民币元）">
          </el-table-column>
        </el-table> 
        <hr>
        <h3 class="center">资金</h3>
        <el-table
          :data="balanceData"
          style="width: 100%">
          <el-table-column
            prop="webName"
            width="80"
            label="网站">
          </el-table-column>
          <el-table-column
            prop="amount"
            label="资金">
          </el-table-column>
        </el-table>         
      </el-col>
      <!-- <el-button type="primary" @click="addOrder()">挂单</el-button>  -->
    </el-row> 
  </div>
</template>
<script>
let api = require('../API/api.js').default
export default {
  name: 'home',
  data () {
    return {
      rate: '',
      last: '',
      tableData: [{
        bitthumb: '',
        name: '比特币',
        poloniex: ''
      }, {
        bitthumb: '',
        name: '莱特币'
      }, {
        bitthumb: '',
        name: '以太币'
      }, {
        bitthumb: '',
        name: 'DASH'
      }, {
        bitthumb: '',
        name: 'QTUM'
      }, {
        bitthumb: '',
        name: 'XRP'
      }],
      tradeData: [],
      tradeTimeData: [],
      orderData: [],
      orderTimeData: [],
      balanceData: [{
        webName: 'hb',
        amount: ''
      }, {
        webName: 'bithumb',
        amount: ''
      }],
      tradeStatus: false,
      rate1: 0.965,
      rate2: 0.99,
      currency: 'btc'
    }
  },
  methods: {
    toggleStatus () {
      api.setStatus({status: this.tradeStatus}).then((res) => {
        this.getStatus()
      })
    },
    getStatus () {
      api.getStatus().then((res) => {
        this.tradeStatus = res && res.status
      })
    },
    setTradeRate () {
      api.setTradeRate({rate1: this.rate1, rate2: this.rate2}).then((res) => {
        this.getTradeRate()
      })
    },
    getTradeRate () {
      api.getTradeRate().then((res) => {
        this.rate1 = res && res.rate1
        this.rate2 = res && res.rate2
      })
    }
  },
  mounted () {
    let getData = async () => {
      await api.getData('btc').then((res) => {
        this.tableData = this.tableData.map(function (item) {
          if (item.name === '比特币' && res) {
            item.bithumb = res.closing_price
          }
          return item
        })
      })
      await api.getData('eth').then((res) => {
        this.tableData = this.tableData.map(function (item) {
          if (item.name === '以太币' && res) {
            item.bithumb = res.closing_price
          }
          return item
        })
      })
      await api.getData('ltc').then((res) => {
        this.tableData = this.tableData.map(function (item) {
          if (item.name === '莱特币' && res) {
            item.bithumb = res.closing_price
          }
          return item
        })
        // setTimeout(getData, 2000)
      })
      await api.getData('dash').then((res) => {
        this.tableData = this.tableData.map(function (item) {
          if (item.name === 'DASH' && res) {
            item.bithumb = res.closing_price
          }
          return item
        })
        // setTimeout(getData, 2000)
      })
      await api.getData('qtum').then((res) => {
        this.tableData = this.tableData.map(function (item) {
          if (item.name === 'QTUM' && res) {
            item.bithumb = res.closing_price
          }
          return item
        })
        // setTimeout(getData, 2000)
      })
      await api.getData('xrp').then((res) => {
        this.tableData = this.tableData.map(function (item) {
          if (item.name === 'XRP' && res) {
            item.bithumb = res.closing_price
          }
          return item
        })
        // setTimeout(getData, 2000)
      })
      setTimeout(getData, 2000)
    }
    let getHbPrice = async () => {
      await api.getHbPrice('btcusdt').then((res) => {
        this.tableData = this.tableData.map(function (item) {
          if (item.name === '比特币' && res) {
            item.hb = res.price
            item.rate1 = item.bithumb / item.hb
            item.rate2 = item.hb / item.bithumb
          }
          return item
        })
      })
      await api.getHbPrice('ltcusdt').then((res) => {
        this.tableData = this.tableData.map(function (item) {
          if (item.name === '莱特币' && res) {
            item.hb = res.price
            item.rate1 = item.bithumb / item.hb
            item.rate2 = item.hb / item.bithumb
          }
          return item
        })
      })
      await api.getHbPrice('ethusdt').then((res) => {
        this.tableData = this.tableData.map(function (item) {
          if (item.name === '以太币' && res) {
            item.hb = res.price
            item.rate1 = item.bithumb / item.hb
            item.rate2 = item.hb / item.bithumb
          }
          return item
        })
      })
      await api.getHbPrice('dashusdt').then((res) => {
        this.tableData = this.tableData.map(function (item) {
          if (item.name === 'DASH' && res) {
            item.hb = res.price
            item.rate1 = item.bithumb / item.hb
            item.rate2 = item.hb / item.bithumb
          }
          return item
        })
      })
      await api.getHbPrice('qtumusdt').then((res) => {
        this.tableData = this.tableData.map(function (item) {
          if (item.name === 'QTUM' && res) {
            item.hb = res.price
            item.rate1 = item.bithumb / item.hb
            item.rate2 = item.hb / item.bithumb
          }
          return item
        })
      })
      await api.getHbPrice('xrpusdt').then((res) => {
        this.tableData = this.tableData.map(function (item) {
          if (item.name === 'XRP' && res) {
            item.hb = res.price
            item.rate1 = item.bithumb / item.hb
            item.rate2 = item.hb / item.bithumb
          }
          return item
        })
      })
      setTimeout(getHbPrice, 2000)
    }
    // 账户信息
    let getHbBalance = () => {
      api.getHbBalance().then((res) => {
        console.log(res)
        if (res) {
          var str = ''
          res.forEach(item => {
            if (item.type === 'trade') {
              str += item.currency + ':' + parseFloat(item.balance).toFixed(6) + ','
            }
          })
          this.$set(this.balanceData, 0, {
            webName: 'hb',
            amount: str
          })
        }
      })
      setTimeout(getHbBalance, 4000)
    }
    let getTimeBalance = () => {
      api.getTimeBalance('all').then((res) => {
        if (res) {
          var str = ''
          for (var a in res) {
            // console.log(res[a])
            if (a.indexOf('available') === 0 && parseFloat(res[a]) !== 0) {
              str += a + ':' + res[a] + ','
            }
          }
          this.$set(this.balanceData, 1, {
            webName: 'bithumb',
            amount: str
          })
        }
      })
      setTimeout(getTimeBalance, 4000)
    }
    // 成交记录
    let getHbTradeList = () => {
      let currency = this.currency
      api.getHbTradeList(this.currency + 'usdt').then((res) => {
        if (res) {
          if (res.length > 10) {
            res.length = 10
          }
          this.tradeData = res.map((item) => {
            item.coin_type = currency
            item.type = item.type === 'sell-limit' ? 'sell' : 'buy'
            item.total = item['filled-amount'] * item.price
            item.date = new Date(item['created-at']).toLocaleString()
            return item
          })
        }
      })
      setTimeout(getHbTradeList, 4000)
    }
    let getTimeTradeList = () => {
      let currency = this.currency
      api.getTimeTradeList({page: 0, searchGb: 0, coinname: currency}).then((res) => {
        if (Array.isArray(res)) {
          if (res.length > 10) {
            res.length = 10
          }
          this.tradeTimeData = res.map((item) => {
            item.coinname = currency
            item.type = item.search === '2' ? 'sell' : 'buy'
            item.date = new Date(parseInt(item.transfer_date) / 1000).toLocaleString()
            return item
          })
        }
      })
      setTimeout(getTimeTradeList, 4000)
    }
    // 交易记录
    let getHbOrderList = () => {
      let currency = this.currency
      api.getHbOrderList(currency + 'usdt').then((res) => {
        if (res) {
          if (res.length > 10) {
            res.length = 10
          }
          this.orderData = res.map((item) => {
            item.coin_type = currency
            item.type = item.type === 'sell-limit' ? 'sell' : 'buy'
            item.total = item.amount * item.price
            item.date = new Date(item['created-at']).toLocaleString()
            return item
          })
        }
        setTimeout(getHbOrderList, 4000)
      })
    }
    let getTimeOrderList = () => {
      /*
      var that = this
      api.getTimeOrderList(this.currency).then((res) => {
        if (Array.isArray(res)) {
          that.orderTimeData = res.map((item) => {
            if (item) {
              item.type = item.type === '1' ? 'buy' : 'sell'
            }
            return item
          })
        }
      })
      setTimeout(getTimeOrderList, 4000) */
    }
    getData()
    getHbPrice()
    getHbBalance()
    getTimeBalance()
    getHbTradeList()
    getTimeTradeList()
    getHbOrderList()
    getTimeOrderList()
    this.getTradeRate()
  },
  beforeCreate () {
    let getRate = () => {
      api.getRate().then((res) => {
        this.rate = res.rate
      })
    }
    getRate()
    api.getStatus().then((res) => {
      this.tradeStatus = res.status
    })
  }
}
</script>
<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin: 10px;
}
.center {
  text-align: center;
}
</style>
