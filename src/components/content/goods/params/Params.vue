<!--  -->
<template>
<div class=''>
    <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item>参数列表</el-breadcrumb-item>
</el-breadcrumb>
    <!-- 卡片式图 --> 
    <el-card>
        <el-alert
            title="注意：只允许设置第三级分类相关的参数！" type="warning" :closable="false" show-icon>
        </el-alert>
        <!-- 选择商品分类区域 -->
        <el-row class="cat_opt">
            <el-col >
                <span>选择商品的分类：</span>
                <!-- 绘制级联选择框 -->
                  <el-cascader
    expand-trigger="hover"
    :options="CateList"
    :props="cateProps"
    v-model="selectedCateKeys"
    @change="handleChange">
  </el-cascader>
            </el-col>
        </el-row>
            <!-- 表格视图 -->
    <!-- tabs 标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
          <!-- 添加参数面板 -->
    <el-tab-pane label="动态参数" name="many">
        <el-button type="primary" :disabled="isBtnDisable" @click="addDialogVisible=true">添加参数</el-button>
        <!-- 动态参数表格 -->
        <el-table
            :data="ManyTabData"
            border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand" >
            <template slot-scope="scope">
                <!--循环渲染tag标签 -->
                <el-tag type="primary" v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i,scope.row)">{{item}}</el-tag>
<!-- 输入文本框 -->
<el-input
  class="input-new-tag"
  v-if="scope.row.inputVisible"
  v-model="scope.row.inputValue"
  ref="saveTagInput"
  size="small"
  @keyup.enter.native="handleInputConfirm(scope.row)"
  @blur="handleInputConfirm(scope.row)"
>
</el-input>
<el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
            </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column
                type="index">

            </el-table-column>
                        <el-table-column
                label="参数名称"
                prop="attr_name">
            </el-table-column>
             <el-table-column
                label="操作">
                <template slot-scope="scope"> 
                    <el-button type="primary" icon="el-icon-edit" 
                    round
                    @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                    <el-button type="danger"
                    round icon="el-icon-delete" 
                    @click="removeParams(scope.row.attr_id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-tab-pane>
    
    <!-- 添加属性面板 -->
    <el-tab-pane label="静态属性" name="only">
        <el-button type="primary" :disabled="isBtnDisable" @click="addDialogVisible=true">添加属性</el-button>
        <el-table
            :data="OnlyTabData"
            border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand" >
            <template slot-scope="scope">
                <!--循环渲染tag标签 -->
                <el-tag type="primary" v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i,scope.row)">{{item}}</el-tag>
<!-- 输入文本框 -->
<el-input
  class="input-new-tag"
  v-if="scope.row.inputVisible"
  v-model="scope.row.inputValue"
  ref="saveTagInput"
  size="small"
  @keyup.enter.native="handleInputConfirm(scope.row)"
  @blur="handleInputConfirm(scope.row)"
>
</el-input>
<el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
            </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column
                type="index">
            </el-table-column>
                        <el-table-column
                label="属性名称"
                prop="attr_name">
            </el-table-column>
             <el-table-column
                label="操作">
                             <template  slot-scope="scope">                  
                <el-button  round type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button  round type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
        </el-table>
    </el-tab-pane>
  </el-tabs>
  <!-- 添加参数、属性对话框 -->
  <el-dialog
      :title="'添加'+titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed">
      <!-- 添加参数的对话框 -->
      <el-form :model="addForm" :rules="addFormRules"
      ref="addFormRef" >
        <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="addForm.attr_name" placeholder=""></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">   
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
  </el-dialog>
  <!-- 修改对话框 -->
    <el-dialog :title="'修改'+titleText" :visible.sync="editDialogVisible" width="40%"
    close="closeEditDialog"> 
      <!-- 添加参数的对话框 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
    </el-card>
</div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
export default {
//import引入的组件需要注入到对象中才能使用
components: {
},
data() {
//这里存放数据
return {
    //商品分类列表
    CateList:[],
       activeName:'many',
    //级联选择框的配置对象
    cateProps:{
        value:'cat_id',
        label:'cat_name',
        children:'children'
    },
    //级联选择框双向绑定到的数组
    selectedCateKeys:[],
    //存放动态属性数据
    ManyTabData:[],
    //存放静态参数数据
    OnlyTabData:[],
    //控制添加对话框的显示和隐藏
    addDialogVisible:false,
    // 控制修改对话框的显示隐藏
    editDialogVisible:false,
    //添加参数表单数据对象
    addForm:{},
    //添加表单验证规则对象
    addFormRules:{
        attr_name:[
            {required:true,message:"请输入参数" ,trigger:'blur'}
        ]
    },

//修改的表单数据对象
editForm:{},
//修改表单验证规则
editFormRules:{
        attr_name:[
            {required:true,message:"请输入参数" ,trigger:'blur'}
        ]
    },
    // //控制按钮和文本框的切换显示
    // inputVisible:false,
    // //文本框中输入的内容
    // inputValue:''
};
},
//监听属性 类似于data概念
computed: {
        //按钮需要被禁用返回 true 否则返回true
    isBtnDisable(){
        if(this.selectedCateKeys.length!==3){  
            return true
        }
        return false
    },
            // 当前选中的三级分类的id
    cateId(){
        if(this.selectedCateKeys.length === 3){
            return this.selectedCateKeys[2]
        }
        return null;
    },
    //动态计算标题属性
    titleText(){
        if(this.activeName==='many'){
            return '动态参数'
        }
        else{
            return '静态属性'
        }
    }
},
//监控data中的数据变化
watch: {},
//方法集合
methods: {
    //获取商品数据
    getCateList(){
        this.$http({
            method:'get',
            url:'categories'
        }).then(res=>{
            if(res.meta.status!==200){
                return this.$message.error('获取商品数据失败')
            }
            this.CateList=res.data;
            console.log(this.CateList)
        })
    },
    //获取参数数据
     getParamsData(){
                //  console.log(this.selectedCateKeys )
        if(this.selectedCateKeys.length!==3){
            //证明选中的不是三级分类 把选择清空重置
            this.selectedCateKeys=[]
            this.ManyTabData=[];
            this.OnlyTabData=[]
            return
        }
        //证明选择的是三级分类
        // console.log(this.selectedCateKeys)
                // 根据所选分类的id和当前所处的面板 获取对应的参数
        this.$http({
        method:'get',
        url:`categories/${this.cateId}/attributes`,
        params:{
            sel:this.activeName
        }
        }).then(res=>{
            if(res.meta.status !== 200){
                return this.$message.error('请求参数列表错误')
            }
            res.data.forEach(item=>{
               item.attr_vals= item.attr_vals? item.attr_vals.split(' '):[];
               //添加一个布尔值 控制文本框的显示和隐藏
               item.inputVisible=false;
               item.inputValue='';
            })
            //如果是动态属性
            if(this.activeName=='many'){
                this.ManyTabData=res.data
                console.log(this.ManyTabData)
            }else{
                this.OnlyTabData=res.data
            }
        })
    },
        //tab 点击事件处理函数
    handleTabClick(){
        // 切换面板属性重新发起一次网络请求
        this.getParamsData()
    },
    //级联选择框变化 会触发这个函数
    handleChange(){
        this.getParamsData();
    },
    //监听添加对话框的关闭事件
    addDialogClosed(){
        this.$refs.addFormRef.resetFields()
    },
        addParams(){
        this.$refs.addFormRef.validate(valid=>{
            if(!valid){
                return 
            }
            this.$http({
                method:'post',
                url:`categories/${this.cateId}/attributes`,
                data:{
                    attr_name:this.addForm.attr_name,
                    attr_sel:this.activeName
                }
            }).then(res=>{
                if(res.meta.status!==201){
                    return this.$message.error('添加参数失败')
                }
                this.$message.success('添加参数成功')
                this.addDialogVisible=false;
                this.getParamsData(); 
            })
        })
    },
    //监听修改对话框的关闭
    closeEditDialog(){
        this.$refs.editFormRef.resetFields();
    },
            //点击按钮展示修改对话框
    showEditDialog(attr_id){
        //查询当前参数的信息
        this.$http({
            method:'get',
            url:`categories/${this.cateId}/attributes/${attr_id}`,
            params:{
                attr_sel:this.activeName
            }
        }).then(res=>{
            if(res.meta.status!==200){
                return this.$message.error('获取表单数据失败')

            }
            this.editForm=res.data
        })
        this.editDialogVisible = true
    },

    //点击按钮修改参数信息
    editParams(){
        this.$refs.editFormRef.validate(valid=>{
            if(!valid){
                return
            }
            this.$http({
                method:'put',
                url:`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
                data:{
                    attr_name:this.editForm.attr_name,
                    attr_sel:this.activeName
                }
            }).then(res=>{
                if(res.meta.status!==200){
                    return this.$message.error('修改失败')
                }
                this.$message.success('修改成功');
                this.getParamsData();
                this.editDialogVisible=false;
            })
        })
    },
    // 根据id删除对应的参数
  removeParams(attr_id){
this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
        //用户点击删除
      }).then(()=>{
          this.$http({
              method:'delete',
              url:`categories/${this.cateId}/attributes/${attr_id}`
          }).then(res=>{
              console.log(res)
              if(res.meta.status!==200){
                return  this.$message.error('删除参数失败');
              }
              this.$message.success('删除参数成功')
              this.getParamsData()
          })
      }).catch(()=>{
          this.$message.info('用户取消了删除')
      })
    },
    //文本框失去焦点或按下enter
    handleInputConfirm(){
        console.log('ok')
    },
    //点击按钮展示文本框
    showInput(row){
        row.inputVisible=true
        //自动获取焦点   
        //$nextTick 当前页面的元素被重新渲染之后执行回调函数的代码
        this.$nextTick(_=>{
            this.$refs.saveTagInput.$refs.input.focus();
        })
    },
    //  当输入框失去焦点的时候
    handleInputConfirm(row){
        if(row.inputValue.trim().length===0){
            row.inputValue=''
            row.inputVisible=false
            return
        }
        //如果没有return 证明正确输入了 需要把tag添加进去
        row.attr_vals.push(row.inputValue.trim());
        row.inputValue='';
        row.inputVisible=false;
        //发起网络请求保存这一次操作
        this.saveAttrVals(row)
        
    },
    //将对attr_vals 的操作保存到数据库
    saveAttrVals(row){
        this.$http({
            method:'put',
            url:`categories/${this.cateId}/attributes/${row.attr_id}`,
            data:{
                attr_name:row.attr_name,
                attr_sel:row.attr_sel,
                attr_vals:row.attr_vals.join(' ')//数组转换为字符串
            }
        }).then(res=>{
            console.log(res)
            if(res.meta.status!==200){
                return this.$message.error('修改参数失败')
            }
            this.$message.success('修改参数成功')
        })
    },
    //删除对应的tag
    handleClose(i,row){
        row.attr_vals.splice(i,1);
        this.saveAttrVals(row);
    }
},
//生命周期 - 创建完成（可以访问当前this实例）
created() {
    this.getCateList();
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
.cat_opt{
    margin: 15px 0;
}
.el-tag{
    margin:10px;
}
.input-new-tag{
    width:120px;
}
</style>