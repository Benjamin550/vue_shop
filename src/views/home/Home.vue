<!--  -->
<template >
<el-container class="home-container">
    <!-- 网页头部 -->
  <el-header>
      <div>
          <img src="~assets/img/heima.png" alt="">
          <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button></el-header>
      <!-- 网页侧边栏 -->
      
  <el-container>
      <Aside></Aside>
    <!-- 网站主体部分 -->
    <Main></Main>
    
  </el-container>
</el-container>
    
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import Aside from 'views/aside/Aside'
import Main from 'views/main/Main'
export default {
//import引入的组件需要注入到对象中才能使用
components: {
    Aside,
    Main
    },
name:'Home',
data() {
//这里存放数据
return {

};
},
//监听属性 类似于data概念
computed: {
},
//监控data中的数据变化
watch: {},
//方法集合
methods: {
    logout(){
        //获取到本地的 token 然后清除掉就可以实现退出  有了token以后才能进去
        window.sessionStorage.clear('token')
        this.$router.push('/login')
    }
},
//生命周期 - 创建完成（可以访问当前this实例）
created() {

},
//生命周期 - 挂载完成（可以访问DOM元素）
mounted() {

},
beforeCreate() {}, //生命周期 - 创建之前
beforeMount() {}, //生命周期 - 挂载之前
beforeUpdate() {}, //生命周期 - 更新之前
updated() {}, //生命周期 - 更新之后
beforeDestroy() {}, //生命周期 - 销毁之前
destroyed() {}, //生命周期 - 销毁完成
activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style lang="less" scoped>
  .home-container{
      height: 100%;
      
}
 .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;
    >div{
        display: flex;
        align-items: center;
        span {
            margin-left: 15px;
        }
    }
  }
  .el-main {
    background-color: #eaedf1;
    
  }

</style>