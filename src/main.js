import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 引入全局样式
import './assets/css/global.less'
// 引入字体文件
import './assets/font/iconfont.css'

// 引入echarts
// import * as echarts from 'echarts'
Vue.prototype.$echarts = window.echarts

// 引入SocketService
import SocketService from './utils/socket_serive'
// 创建SocketService的实例对象
const intance = SocketService.getIntance()
// 通过SocketService实例对象的connect方法连接服务器
intance.connect()
// 将SocketService.实例挂载到Vue原型上
Vue.prototype.$socket = intance

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')