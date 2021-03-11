<!--  -->
<template>
      <!-- 侧边栏 -->
    <el-aside :width="isCollapse ?'64px' :'200px'" >
        <!-- 侧边栏菜单区域 -->
        <!-- 折叠侧边栏 -->
        <div class="toggle-button" @click="toggleCollapse" >|||</div>

         <el-menu
      background-color="#333744"
      text-color="#fff"
      active-text-color="#409EFF"
      :unique-opened="true"
      :collapse="isCollapse"
      :collapse-transition="false">
      <!-- 一级菜单 -->
      <el-submenu :index="item.id+''" v-for="item in MenuList" :key="item.id">
          <!-- 一级菜单的模板区域 -->
        <template slot="title" >
            <!-- 图标 -->
          <i :class="iconsObj[item.id]"></i>
          <!-- 文本 -->
          <span>{{item.authName}}</span>
        </template>
        <!-- 二级导航 -->
        <el-menu-item :index="subItem.id + ''" v-for="subItem in item.children" :key="subItem.id">
            <template slot="title">
            <!-- 图标 -->
          <i class="el-icon-menu"></i>
          <!-- 文本 -->
          <span>{{subItem.authName}}</span>
        </template>
        </el-menu-item>
      </el-submenu>
      
    </el-menu>
    </el-aside>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
//import引入的组件需要注入到对象中才能使用
components: {},
name:'Aside',
data() {
//这里存放数据
return {
    MenuList:[],
    iconsObj:{
        '125':'iconfont icon-user',
        '103':'iconfont icon-tijikongjian',
        '101':'iconfont icon-shangpin',
        '102':'iconfont icon-danju',
        '145':'iconfont icon-baobiao',
    },
    isCollapse:false
};
},
//监听属性 类似于data概念
computed: {
   
},
//监控data中的数据变化
watch: {},
//方法集合
methods: {
    //获取所有的菜单
    getMenuList(){
        this.$http({
            url:'menus',
            methods:'get'
        }).then(res=>{
            if(res.meta.status!==200) return this.$message.error(res.meta.msg)
            this.MenuList=res.data
            console.log(res)
        })
    },
    // 点击按钮实现折叠与展开
    toggleCollapse(){
        this.isCollapse=!this.isCollapse;
    }
},
//生命周期 - 创建完成（可以访问当前this实例）
created() {
    this.getMenuList()
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
  .el-aside {
    background-color: #333744;
  }
  .el-menu{
      border-right: none;
      
  }
  .el-aside{
      height: 100%;
  }
  .iconfont{
      margin-right: 10px;
  }
  .toggle-button{
      background-color: #4A5064;
      font-size: 10px;
      color: #fff;
      line-height: 24px;
      text-align: center;
      letter-spacing: 0.2em; //线之间增加距离
      cursor: pointer;//变成点击
  }
</style>