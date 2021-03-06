import Vue from 'vue'
import VueRouter from 'vue-router'
// component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
const Login =() =>import('../views/login/Login')
const Home =() =>import('../views/home/Home')
const Welcome =() =>import('../components/common/Welcome')
const Users =() =>import('../components/content/user/Users')
const Rights =() =>import('../components/content/power/Rights')
const Roles =() =>import('../components/content/power/Roles')
const Categories =() =>import('../components/content/goods/categories/Categories')
const Params =() =>import('../components/content/goods/params/Params')
const GoodsList =() =>import('../components/content/goods/list/GoodsList')
const Add =() =>import('../components/content/goods/list/Add')
const Order =() =>import('../components/content/order/Order')
const Report =() =>import('../components/content/report/Report')
Vue.use(VueRouter)

const routes = [
    {
        path:'/',
        redirect:'/login'
    },
    {
        path:'/login',
        component:Login
    },
    {
        path:'/home',
        component:Home,
        redirect:'/welcome',
        children:[
            {path:'/welcome',component:Welcome},
            {path:'/users',component:Users},
            {path:'/rights',component:Rights},
            {path:'/roles',component:Roles},
            {path:'/categories',component:Categories},
            {path:'/params',component:Params},
            {path:'/goods',component:GoodsList},
            {path:'/goods/add',component:Add},
            {path:'/orders',component:Order},
            {path:'/reports',component:Report}
        ]
    },

]

const router = new VueRouter({
  routes,
  mode:'history'
})
//路由导航守卫
router.beforeEach((to,from,next)=>{
    // to 访问的路径 from 从那个路径跳转  next放行
    if(to.path==='/login') return next();
    //获取token 
    const tokenStr = window.sessionStorage.getItem('token')
    if(!tokenStr) return next('/login')  
    next()
})

export default router
