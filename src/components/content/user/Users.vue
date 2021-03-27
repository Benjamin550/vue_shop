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
          <el-input placeholder="请输入内容" 
          v-model="queryInfo.query" clearable @clear="getUserList">
          <el-button slot="append" icon="el-icon-search" @click="getUserList" ></el-button>
          </el-input>
      </el-col>
      <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
      </el-col>
  </el-row>
  <!-- 用户列表区域 -->
  <el-table :data="userlist" border stripe>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="姓名" prop="username"></el-table-column>
      <el-table-column label="邮箱" prop="email"></el-table-column>
      <el-table-column label="电话" prop="mobile"></el-table-column>
      <el-table-column label="角色" prop="role_name"></el-table-column>
      <el-table-column label="状态" >
          <template slot-scope="scope">
              <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949" @change="userStateChanged(scope.row)"></el-switch>
              </template>
      </el-table-column>
      <el-table-column label="操作" >
          <template  slot-scope="scope">
              <!-- 修改 -->
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
              <!-- 删除 -->
              <el-button type="danger" icon="el-icon-delete" size="mini"
              @click="removeUserById(scope.row.id)"></el-button>
             <!-- 分配角色 -->
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
                <el-button type="warning" icon="el-icon-setting" size="mini"
                @click="setRole(scope.row)"></el-button>
            </el-tooltip>
              
          </template>
      </el-table-column>
  </el-table>

  <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <!-- 添加用户的对话框 -->
 <el-dialog
  title="添加用户"
  :visible.sync="addDialogVisible"
  width="50%"
  @close="addDialogClosed">
  <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
  <el-form-item label="用户名" prop="username">
    <el-input v-model="addForm.username"></el-input>
  </el-form-item>
    <el-form-item label="密码" prop="password">
    <el-input v-model="addForm.password"></el-input>
  </el-form-item>
    <el-form-item label="邮箱" prop="email">
    <el-input v-model="addForm.email"></el-input>
  </el-form-item>
    <el-form-item label="手机号" prop="mobile" >
    <el-input v-model="addForm.mobile"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
</el-dialog>
<!-- 修改用户的对话框 -->
<el-dialog
  title="修改用户"
  :visible.sync="editDialogVisible"
  width="50%"
  @close="editDialogClosed"
  ref="">
  <el-form label-width="70px" :model="editForm" :rules="editFormRules" ref="editFormRef" >
      <el-form-item label="用户名">
                <el-input v-model="editForm.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
                <el-input v-model="editForm.email" ></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
                <el-input v-model="editForm.mobile" ></el-input>
      </el-form-item>

  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUserInfo">确 定</el-button>
  </span>
</el-dialog>
<!-- 分配角色的对话框 -->
<el-dialog
  title="分配角色"
  :visible.sync="setRoleDialogVisible"
  width="50%"
  @close="setRoleDialogClosed" 
  >
  <div>
      <p>当前的用户:{{userInfo.username}}</p>
      <p>当前的角色:{{userInfo.role_name}}</p>
      <p>分配新角色:
          <el-select v-model="selectRoleId" placeholder="请分配角色">
              <el-option
                  v-for="item in rolesList"
                  :key="item.id"
                  :label="item.roleName"
                  :value="item.id">
              </el-option>
          </el-select>
      </p>
  </div>
    <span slot="footer" class="dialog-footer">
    <el-button @click="setRoleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
    </span>
</el-dialog>
</el-card>
</div>
</template>

<script>

//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
//导入封装好的网络请求
// import {getUserList} from 'network/users'

export default {
//import引入的组件需要注入到对象中才能使用
components: {
    },
data() {
//验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    // 验证手机号
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
      if (regMobile.test(value)) {
        // 合法手机号
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }
return {
    
    queryInfo:{
            query:'',
            //当前的页数
            pagenum:1,
            // 当前每页显示的多少条数据
            pagesize:2,
    },
    userlist:[],
    total:0,
    //控制用户对话框的显示与隐藏
    addDialogVisible:false,
    //修改用户对话框的显示隐藏
    editDialogVisible:false,
    //控制分配角色对话框的显示和隐藏
   setRoleDialogVisible:false,
    //查询到的用户信息
    editForm:{},
    //需要被分配角色的用户信息
    userInfo:{},
    //所有角色的数据列表
    rolesList:[],
    //已选中的角色id
    selectRoleId:'',
    //添加用户的表单数据
    
    addForm:{
        username:'',
        password:'',
        email:'',
        mobile:''
    },
    addFormRules:{
        username:[
            {required: true, message:'请输入用户名', trigger: 'blur'},
            {min:3 ,max :10,message:'用户名的长度为3-10个字符',trigger:'blur'}
        ],
        password:[
            {required: true, message:'请输入密码', trigger: 'blur'},
            {min:6 ,max :15,message:'密码的长度为6-15个字符',trigger:'blur'}
        ],
        email:[
            {required: true, message:'请输入邮箱', trigger: 'blur'},
             { validator: checkEmail, trigger: 'blur' },
        ],
        mobile:[
            {required: true, message:'请输入手机号', trigger: 'blur'},
            {validator: checkMobile ,trigger:'blur'}
        ]
    },
    editFormRules:{
        email:[
            {required: true, message:'请输入邮箱', trigger: 'blur'},
             { validator: checkEmail, trigger: 'blur' },
        ],
        mobile:[
            {required: true, message:'请输入手机号', trigger: 'blur'},
            {validator: checkMobile ,trigger:'blur'}
        ]
    },
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
            url:'/users',
            method:'get',
            params:this.queryInfo
        }).then(res=>{
            // console.log(res)
            if(res.meta.status !== 200) {
                return this.$message.error('用户数据获取失败')
            }
            this.userlist=res.data.users;
            this.total=res.data.total
        })
    },
    // getUserList(){
    //     getUserList().then(res=>{
    //     console.log(res)
    //      if(res.meta.status !== 200) {
    //              return this.$message.error('用户数据获取失败')
    //         }
    //          this.userlist=res.data.users;
    //          this.total=res.data.total
    // })
    // },
    //监听pagesize
    handleSizeChange(newSize){
        // console.log(newSize)  监听到的值 保存到queryInfo 里面
        this.queryInfo.pagesize=newSize
        this.getUserList()
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage){
        this.queryInfo.pagenum=newPage;
        this.getUserList()
    },
    //监听用户状态改变
    userStateChanged(userinfo){
        // console.log(userinfo)
        this.$http({
            method:'put',
            url:`/users/${userinfo.id}/state/${userinfo.mg_state}`
        }).then(res=>{
            if(res.meta.status !==200){
                userinfo.mg_state=!userinfo.mg_state
                return this.$message.error('更新状态失败')
            }
             this.$message.success('更新状态成功')
        })
    },
    //监听用户对话框的关闭时间
    addDialogClosed(){
        this.$refs.addFormRef.resetFields()
    },
    //点击按钮添加新用户
    addUser(){
        this.$refs.addFormRef.validate(valid=>{
            // console.log(valid)  表单的预校验
            if(!valid) return
            //通过后发起添加用户的网络请求
            this.$http({
                method:'post',
                url:'users',
                data:this.addForm
            }).then(res=>{
                if(res.meta.status!==201){
                    return this.$message.error('添加用户失败')
                }
                this.$message.success('添加用户成功')
                //关闭对话框
                this.addDialogVisible=false
                //重新获取用户数据
                this.getUserList()
            })
        })
    },
    //展示编辑用户的对话框
    showEditDialog(id){
        
        // console.log(id)
        this.$http({
            method:'get',
            url:'users/'+id
        }).then(res=>{
            if(res.meta.status!==200) {
                return this.$message.error('请求数据失败')
                }
            this.editForm=res.data
            this.editDialogVisible=true
        })
    },
    //监听修改用户对话框的关闭事件
    editDialogClosed(){
        this.$refs.editFormRef.resetFields();
    },
    //修改用户信息并且提交  预验证
    editUserInfo(){
        this.$refs.editFormRef.validate(validate=>{
            if(!validate){
                return 
            }
            //发起修改信息的请求
            this.$http({
                method:'put',
                url:'users/'+this.editForm.id,
                data:{
                    //从查询到的用户数据里面取数据
                    email:this.editForm.email,
                    mobile:this.editForm.mobile
                }
            }).then(res=>{
                if(res.meta.status!==200){
                    return this.$message.error('抱歉，更新数据失败')
                }
                //关闭对话框  刷新用户列表  提示信息
                this.editDialogVisible=false
                this.getUserList()
                this.$message.success('恭喜你，更新成功了')
            })
        })
    },
    //根据id删除用户的信息
    async removeUserById(id){
        const confirmResult =await this.$confirm('删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>{
            return err
        })
        //用户确认删除返回confirm 
        //用户取消 返回cancel 字符串
        if(confirmResult!=='confirm'){
           return  this.$message.info('已经取消了删除')
        }
        this.$http({
            method:'delete',
            url:'users/'+id
        }).then(res=>{
            if(res.meta.status!==200){
                return this.$message.error('删除用户失败')
            }
            this.$message.success('删除成功')
            this.getUserList()
        })
    },
    //展示分配角色对话框
    setRole(userInfo){
        this.userInfo=userInfo
        //展示对话框之前获取所有角色列表
        this.$http({
            method:'get',
            url:'roles'
        }).then(res=>{
            if(res.meta.status!==200){
                return this.$message.error('获取角色信息失败');
            }
            this.rolesList=res.data
            // console.log(this.rolesList)
        })
        this.setRoleDialogVisible=true
    },
    //点击确定后进行分配角色
    saveRoleInfo(){
        if(!this.selectRoleId){
            return this.$message.error('请选择一个角色')
        }
        this.$http({
            method:'put',
            url:`users/${this.userInfo.id}/role`,
            data:{
                rid:this.selectRoleId
            }
        }).then(res=>{
            console.log(res)
            if(res.meta.status!==200){
                return this.$message.error('更新角色失败')
            }
            
            this.$message.success('更新角色成功');
            this.getUserList();
            this.setRoleDialogVisible=false 
        })
    },
    //监听分配角色对话框的关闭
    setRoleDialogClosed(){
        this.selectRoleId='',
        this.userInfo={}
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