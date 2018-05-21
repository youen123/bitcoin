import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Withdrawal from '@/components/Withdrawal'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    }, {
      path: '/withdrawal',
      name: 'Withdrawal',
      component: Withdrawal
    }
  ]
})
