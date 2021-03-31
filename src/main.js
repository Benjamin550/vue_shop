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
import TreeTable from 'vue-table-with-tree-grid'
Vue.prototype.$http = axios
//axios 挂载到了$http上就意味着 http共享axios的所有方法 调用方法就是$http(里面写需要的参数)
Vue.filter('dateFormat',function(orginVal){
   const dt= new Date(orginVal)
   const y=dt.getFullYear()
   const m=(dt.getMonth()+1+'').padStart(2,'0')
   const d=(dt.getDate()+'').padStart(2,'0')

   const hh=(dt.getHours()+'').padStart(2,'0')
   const mm=(dt.getMonth()+'').padStart(2,'0')
   const ss=(dt.getSeconds()+'').padStart(2,'0')

   return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
Vue.config.productionTip = false
//安装树形可视化
Vue.component('tree-table',TreeTable)
//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 富文本编辑器样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
Vue.use(VueQuillEditor)

new Vue({
  router,
  store,
  ElementUI,
  render: h => h(App)
}).$mount('#app')
