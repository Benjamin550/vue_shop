import Vue from 'vue'
import VueRouter from 'vue-router'
// component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
const Login =() =>import('../views/login/Login')
const Home =() =>import('../views/home/Home')
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
        component:Home
    }
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
