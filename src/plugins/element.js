import Vue from 'vue'
import {
    Button,Form,FormItem,Input,Message,Container,Header,Aside,Main,Menu,Submenu,MenuItem
} from 'element-ui'
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';
locale.use(lang)

Vue.use(Button)
Vue.use(FormItem)
Vue.use(Form)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.prototype.$message=Message //挂载到原型 上以后每个组件都能用this.$message访问Message