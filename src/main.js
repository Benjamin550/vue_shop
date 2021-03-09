import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import ElementUI from 'element-ui/lib/theme-chalk/index.css'
import './assets/css/global.css'
//导入字体图标
import './assets/fonts/iconfont.css'
import axios from './network/axios.js'
Vue.prototype.$http = axios
//axios 挂载到了$http上就意味着 http共享axios的所有方法 调用方法就是$http(里面写需要的参数)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  ElementUI,
  render: h => h(App)
}).$mount('#app')
