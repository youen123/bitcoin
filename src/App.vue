<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
body {
  font-size: 14px;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  color: #2c3e50;
  margin: 60px auto;
  max-width: 1000px; 
}
h3 {
  font-size: 14px;
}
a {
    cursor: pointer
}

a:link {
    color: #37a;
    text-decoration: none
}

a:visited {
    color: #666699;
    text-decoration: none
}

a:hover {
    color: #FFFFFF;
    text-decoration: none;
    background: #37a
}
.el-table .cell, .el-table th>div {
  padding: 0 5px;
}
</style>
