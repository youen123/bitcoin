<template>
  <div class="form">
    <h2 class="text-center">提币</h2>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>提币</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="币种">
        <el-select v-model="form.currency" placeholder="请选择币种">
          <el-option label="BTC" value="BTC"></el-option>
          <el-option label="LTC" value="LTC"></el-option>
          <el-option label="DASH" value="DASH"></el-option>
          <el-option label="ETH" value="ETH"></el-option>
          <el-option label="QTUM" value="QTUM"></el-option>
          <el-option label="XRP" value="XRP"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数量">
        <el-input v-model="form.amount"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
let api = require('../API/api.js').default

export default {
  name: 'Withdrawal',
  data () {
    return {
      form: {
        currency: 'BTC',
        amount: 0
      }
    }
  },
  methods: {
    onSubmit () {
      api.withDraw({coinname: this.form.currency, amount: this.form.amount}).then((data) => {
        this.$message(data)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
  margin-bottom: 20px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
.form {
  max-width: 500px; 
  margin: 0 auto;
}
</style>
