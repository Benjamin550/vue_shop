<!--  -->
<template>
<div class=''>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>权限管理</el-breadcrumb-item>
  <el-breadcrumb-item>角色管理</el-breadcrumb-item>
</el-breadcrumb>
<!-- 卡片视图 -->
<el-card>
    <!-- 添加角色按钮区域 -->
    <el-row :gutter="10">
        <el-col :span="6">
            <el-button type="primary" @click="addRolesdialogVisible=true">添加角色</el-button>
        </el-col>
    </el-row>
    <!-- 角色列表区域 -->
    <roles-list :rolelist="rolelist" :getRolesList="getRolesList"></roles-list>
</el-card>
<!-- 添加角色区域 -->
<el-dialog
  title="添加角色"
  :visible.sync="addRolesdialogVisible"
  width="50%">
  <el-form ref="addRolesForm" :model="addRolesInfo" :rules="addRolesRule">
<el-form-item label="角色名称" prop="roleName">
    <el-input  v-model="addRolesInfo.roleName"></el-input>
  </el-form-item>
<el-form-item label="角色描述"  prop="roleDesc">
    <el-input  v-model="addRolesInfo.roleDesc"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addRolesdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addRoles">确 定</el-button>
  </span>
</el-dialog>
</div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import {getRolesList} from 'network/power'

import RolesList from './childComps/RolesList.vue';

export default {
//import引入的组件需要注入到对象中才能使用
name:'Roles',
components: {RolesList},

data() {
//这里存放数据
return {
    rolelist:[],
    addRolesdialogVisible:false,
    addRolesInfo:{
        roleName:'',
        roleDesc:''
},
addRolesRule:{
    roleName:[
            {required: true, message:'请输入角色名', trigger: 'blur'},
            {min:3 ,max :10,message:'角色名的长度为3-10个字符',trigger:'blur'}
        ],
    roleDesc:[
            {required: true, message:'请输入用户描述', trigger: 'blur'},
            {min:1 ,max :15,message:'角色描述的长度为1-15个字符',trigger:'blur'}
        ],
}
};
},
//监听属性 类似于data概念
computed: {},
//监控data中的数据变化
watch: {},
//方法集合
methods: {
    getRolesList(){
        getRolesList().then(res=>{
            if(res.meta.status !== 200){
                return this.$message.error('请求角色列表失败')
            }
            this.rolelist=res.data
            console.log(this.rolelist)
        })
    },
    addRoles(){
             this.$http({
            method:'post',
            url:'roles',
            data:this.addRolesInfo
        }).then(res=>{
            if(res.meta.status!==201){
                return this.$message.error('添加失败')
            }
            this.$message.success('添加角色成功')
              //关闭对话框
                this.addRolesdialogVisible = false
                //重新获取角色数据
                this.getRolesList()
                
        })
        
    }
},
//生命周期 - 创建完成（可以访问当前this实例）
created() {
    this.getRolesList()
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
<style scoped>

</style>