<!--  -->
<template>
<el-card>
    <el-table
        :data="rolelist" border stripe>
        <!-- 设置一个展开列 -->
        <el-table-column type="expand" >
            <template slot-scope="scope">
                <el-row :class="['bdbottom', i1===0 ? 'bdtop':'','vcenter']" v-for="(item,i1) in scope.row.children" :key="item.id">
                    <!-- 渲染一级权限 -->
                  <el-col :span="5">
                          <el-tag type="primay"
                          closable @close="removeRightbyId(scope.row,item.id)">{{item.authName}}</el-tag>
                          <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 渲染二级和三级权限 -->
                  <el-col :span="19">
                      <!-- 通过二层循环渲染二级权限 -->
                      <el-row :class="[i2===0?'':'bdtop','vcenter']" v-for="(item2,i2) in item.children" :key="item2.id">
                          <el-col :span="6">
                              <!-- 动态决定是否添加上面的第一条线 如果是index =0 就不用添加  -->
                              <el-tag  type="success"
                              closable @close="removeRightbyId(scope.row,item2.id)">{{item2.authName}}</el-tag>
                               <i class="el-icon-caret-right"></i> 
                          </el-col>
                          <el-col :span="18">
                              <el-tag :class="[i3===0?'':'bdtop']" type="warning" v-for="(item3,i3) in item2.children" :key="item3.id" closable @close="removeRightbyId(scope.row,item3.id)">{{item3.authName}}</el-tag>
                          </el-col>
                      </el-row>
                  </el-col>
                </el-row>
                
            </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
            <template slot-scope="scope">
                <el-button 
                size="mini" type="primary" icon="el-icon-edit"  @click="showEditRolesInfo(scope.row.id)">
                    编辑
                    </el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete"
                @click="DeleteRoles(scope.row.id)">删除</el-button>
                            <el-tooltip class="item" effect="dark" content="分配权限" placement="top" :enterable="false">
                <el-button size="mini" type="warning" icon="el-icon-setting" @click="showsetRightDialog(scope.row)">分配权限</el-button>
                            </el-tooltip>
            </template>
        </el-table-column>
    </el-table>
<!-- 展示修改对话框 -->
<el-dialog
  title="修改角色信息"
  :visible.sync="editRolesDialog"
  width="50%"
  @closed="editRoleDialogClosed">
  <el-form ref="editRoleRef" :model="editRolesForm" :rules="editRolesRules">

<el-form-item label="角色名称" prop="roleName">
    <el-input  v-model="editRolesForm.roleName"></el-input>
  </el-form-item>
<el-form-item label="角色描述"  prop="roleDesc">
    <el-input  v-model="editRolesForm.roleDesc"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editRolesDialog = false">取 消</el-button>
    <el-button type="primary" @click="editRolesSubmit" >确 定</el-button>
  </span>
</el-dialog>
<!-- 分配权限的对话框 -->
<el-dialog
  title="分配权限"
  :visible.sync="setRightDialogVisible"
  width="50%"
  @close="setRightDialogClosed">
  <!-- 树形控件 -->
  <el-tree :data="rightsList" :props="TreeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>

  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
</el-dialog>
</el-card>

</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
//import引入的组件需要注入到对象中才能使用
name:'RightsList',
props:{
        rolelist:{
        type:Array,
        default(){
            return []
        }
    },
    getRolesList:{
        type:Function,
        default:null
    }
},
components: {},
data() {
//这里存放数据
return {
    editRolesDialog:false,
    //所有权限的数据
    rightsList:[],
    //树形控件的绑定对象
    TreeProps:{
        label:'authName',
        children:'children'
    },
    //默认选中的节点id数组值
    defKeys:[],
    //当前即将分配权限的角色id
    roleId:'',
    setRightDialogVisible:false,
    editRolesForm:{},
    editRolesRules:{
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
    showEditRolesInfo(id){
        // console.log(id)
        this.$http({
            url:'/roles/'+id,
            method:'get',
        }).then(res=>{
            if(res.meta.status !== 200){
                return this.$message.error('未查询到该角色')
            }
        const { roleDesc, roleId, roleName } = res.data//结构赋值
        this.editRolesForm = { roleDesc, roleId, roleName }
            this.editRolesDialog=true
        })
    },
    editRolesSubmit(){
        this.$http({
            method:'put',
            url:'roles/'+this.editRolesForm.roleId,
            data:this.editRolesForm
        }).then(res=>{
            // console.log(res)
            if(res.meta.status!==200){
                return this.$message.error('修改角色信息失败')
            }
            this.editRolesDialog=false;
            this.getRolesList();
            this.$message.success('修改角色信息成功')
        })
    },
     editRoleDialogClosed() {
      this.$refs.editRoleRef.resetFields()
    },
    //删除角色信息
    DeleteRoles(id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }).then(()=>{
          //用户点击确定删除
          this.$http({
              method:'delete',
              url:'/roles/'+id
          }).then(res=>{
            //   console.log(res)
            if(res.meta.status!==200){
                return this.$message.error('删除角色失败')
            }
            this.getRolesList()
            this.$message.success('删除角色操作成功')
          })
      })
    },
    //根据id删除对应的权限
    async removeRightbyId(role,rightId){
        //弹框用户是否要删除
        const confirmResult=await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }).catch(err=>err)
      if(confirmResult!='confirm'){
         return  this.$message.info('取消了删除')
      }
      this.$http({
          method:'delete',
          url:`roles/${role.id}/rights/${rightId}`
      }).then(res=>{
          if(res.meta.status!==200){
              return this.$message.error('删除失败')
          }
        //   this.getRolesList()
        //返回的数据是最新的角色权限 所以把返回的数据重新赋值给他的children
        role.children=res.data
        this.$message.success('删除成功')
      })
    },
    //分配权限的对话框
    showsetRightDialog(role){
        //获取所有权限的数据
        this.roleId=role.id
        this.$http({
            method:'get',
            url:'rights/tree'
        }).then(res=>{
            if(res.meta.status!==200){
                return this.$message.error('获取权限数据失败')
            }
            //获取到的权限数据保存到rightslist
            this.rightsList=res.data
        })
        this.setRightDialogVisible=true 
        //递归获取三级节点id
            this.getLeafKeys(role,this.defKeys)
    },
    //通过递归获取角色下所有三级权限的id并且保存到defKeys
getLeafKeys(node,arr) {
      // 如果当前 node节点 不包含children属性 则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach((item) => {
        this.getLeafKeys(item, arr)
      })
    },
    //监听分配权限对话框关闭时间
    setRightDialogClosed(){
        this.defKeys=[];
    },
    //点击为角色分配权限
    allotRights(){
        const keys=[
            // ...是展开数组 两个函数都是树形控件的api方法 获取到选中的标签和半选中的标签并且返回数组
            ...this.$refs.treeRef.getCheckedKeys(),
            ...this.$refs.treeRef.getHalfCheckedKeys()
        ]
        const idStr = keys.join(',')
        this.$http({
            method:'post',
            url:`roles/${this.roleId}/rights`,
            data:{
                rids:idStr
            }
        }).then(res=>{
            if(res.meta.status!==200){
                return this.$message.error('分配权限失败')
            }
            this.$message.success('分配权限成功');
            this.getRolesList();
            this.setRightDialogVisible=false;
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
<style scoped>
    .el-tag{
        margin: 7px;
    }
    .bdtop{
        border-top: 1px solid #eee;
    }
    .bdbottom{
        border-bottom: 1px solid #eee;
    }
    .vcenter{
        display: flex;
        align-items: center;
}
</style>