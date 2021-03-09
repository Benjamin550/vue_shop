import Vue from 'vue'
import { Button,Form,FormItem,Input,Message } from 'element-ui'
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'

locale.use(lang)

Vue.use(Button)
Vue.use(FormItem)
Vue.use(Form)
Vue.use(Input)
Vue.prototype.$message=Message //挂载到原型 上以后每个组件都能用this.$message访问Message