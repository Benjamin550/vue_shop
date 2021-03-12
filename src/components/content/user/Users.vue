<!--   -->
<template>
<div class=''>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>用户管理</el-breadcrumb-item>
  <el-breadcrumb-item>用户列表</el-breadcrumb-item>
</el-breadcrumb>
<el-card>
    <!-- 搜索与添加区域 -->
    <!-- layout 布局 -->
  <el-row :gutter="40">
      <el-col :span="8">
          <el-input placeholder="请输入内容" >
          <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
      </el-col>
      <el-col :span="4">
          <el-button type="primary">添加用户</el-button>
      </el-col>
  </el-row>
</el-card>
</div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
//导入封装好的网络请求
// import {getUserList} from '../../../network/users'

export default {
//import引入的组件需要注入到对象中才能使用
components: {},
data() {
//这里存放数据
return {
    queryInfo:{
        query:'',
        pagenum:1,
        pagesize:2
    },
    userlist:[],
    total:0
};
},
//监听属性 类似于data概念
computed: {},
//监控data中的数据变化
watch: {},
//方法集合
methods: {
    getUserList(){
        this.$http({
            url:'users',
            params:this.queryInfo
        }).then(res=>{
            console.log(res)
            if(res.meta.status !== 200) {
                return this.$message.error('用户数据获取失败')
            }
            this.userlist=res.data.list;
            this.total=res.data.total
        })
    }
},
//生命周期 - 创建完成（可以访问当前this实例）
created() {
    this.getUserList()
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
<style lang="less">

</style>