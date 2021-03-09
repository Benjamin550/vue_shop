<!--  -->
<template>
<div class='login_container'>
    <div class="login_box">
        <div class="avatar_box">
            <img src="~assets/logo.png" alt="">
        </div>
        <!-- 登录表单区域 -->
    <el-form :model="loginForm" class="login_form" :rules="loginFormRules" ref="loginFormRef">
        <el-form-item prop="username">
        <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
        <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
        </el-form-item>
        <el-form-item class="btns">
        <el-button type="primary" @click="login">登录</el-button>
        <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    
</div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import Element from 'element-ui'
//导入网络请求
export default {
//import引入的组件需要注入到对象中才能使用
name:'Login',
components: {
    Element
},
data() {
//这里存放数据
return {
    loginForm:{
        username:'admin',
        password:'123456'
    },//登录表单的数据绑定
    loginFormRules:{//表单的验证规则
    //验证用户名
    username:[
         { required: true, message: '请输入登录名称', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
    ],
    //验证密码
    password:[
         { required: true, message: '请输入登录密码', trigger: 'blur' },
        { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
    ]
    }
};
},
//监听属性 类似于data概念
computed: {},
//监控data中的数据变化
watch: {},
//方法集合
methods: {
   resetLoginForm(){
       this.$refs.loginFormRef.resetFields()//将数据恢复成默认值
   },
   login(){
       this.$refs.loginFormRef.validate(valid=>{
           
          if(!valid) return;
         this.$http({
             url:'login',
             method:'post',
             data:this.loginForm
         }).then(res=>{
             console.log(res)
              if(res.meta.status !==200) return  this.$message.error('登录失败，请检查用户名或者密码')
              this.$message.success('登录成功')
                        // 1.登录成功后 服务器返回了一个token  保存在客户端的sessionstoryage中
                // 1.1 项目中除了登录以外的其他api接口 都必须在登录之后才能访问
                // 1.2 token 只又在当前网站打开期间才生效，所以才储存在 sessionstorage中
                //2 跳转到主页/home
                console.log(res)
                window.sessionStorage.setItem('token',res.data.token)//保存token
                this.$router.push('/home')
          })
       })
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
<style Lang="less" scoped>
    .login_container{
        background-color: #2b4b6b;
        height: 100%;
    }
    .login_box{
        width: 450px;
        height: 300px;
        background-color: #fff;
        border-radius: 3px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        /* flex 写法
        display: flex;
        justify-content: center;
        align-items: center; */
    }
    .avatar_box{
        height: 130px;
        width: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 0 10px #ddd;
        position: absolute;
        left: 50%;
        transform: translate(-50%,-50%);
        background-color: #fff;
    }
    .avatar_box img{
            height: 100%;
            width:100%;
            border-radius: 50%;
            background-color: #eee;
        }
        .btns{
            display: flex;
            justify-content: center;
        }
   .login_form{
       position: absolute;
       bottom: 0;
       width: 100%;
       padding: 0 20px;
       box-sizing: border-box;
   }

</style>