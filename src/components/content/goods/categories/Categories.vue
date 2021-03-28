<!--  -->
<template>
<div class=''>
    <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item>商品分类</el-breadcrumb-item>
</el-breadcrumb>
<!-- 卡片视图区域 -->
<el-card>
    <el-row >
        <el-col >
            <el-button type="primary" @click="showaddCateDialog">添加分类</el-button>
        </el-col>
    </el-row>
    <!-- 表格区域 -->
<categories-form :cateList="cateList" :queryInfo="queryInfo" :getCateList="getCateList" :total="total"></categories-form>
<!-- 添加分类对话框 -->
<el-dialog
  title="添加分类"
  :visible.sync="addCateDialogVisible"
  width="50%"
  @closed="addCateDialogClosed">
  <!-- 添加分类的表单 -->
  <el-form  :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="80px"
  >
      <el-form-item label="分类名称" prop="cat_name">   
        <el-input v-model="addCateForm.cat_name " placeholder="请输入分类名称"></el-input>
      </el-form-item>
            <el-form-item label="父级分类">   
                <!-- options指定数据源 props 用来指定配置对象 -->
                <el-cascader
    expand-trigger="hover"
    :options="parentCateList"
    v-model="selectedKeys"
    :props="cascaderProps"
    @change="parentCateChange"
    clearable
    change-on-select>
  </el-cascader>
      </el-form-item>

  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addCateDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
</el-dialog>
</el-card>
</div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import CategoriesForm from './CategoriesForm';
export default {
//import引入的组件需要注入到对象中才能使用
components: {
    CategoriesForm

},
data() {
//这里存放数据
return {
    //商品分类的数据列表
    cateList:[],
    //总数据条数
    total:0,
    //控制添加分类对话框
    addCateDialogVisible:false,
    //查询条件
    queryInfo:{
        type:3,
        pagenum:1,
        pagesize:5
    },
    //添加分类的表单数据对象
    addCateForm:{
    //将要添加分类的名称
    cat_name:'',
    //父级分类的id
    cat_pid:0,
    //当前分类的等级
    cat_level:0,
    },

    //添加分类表单的验证规则
    addCateFormRules:{
        cat_name:[
            {required:true, message:'请输入分类名称',trigger:'blur'
            }]
},
//父级分类列表数据
parentCateList:[],
//指定级联选择器的配置对象
cascaderProps:{
    value:'cat_id',
    label:'cat_name',
    children:'children'
},
//选中前两级分类的id数组
selectedKeys:[],
    
};
},
//监听属性 类似于data概念
computed: {},
//监控data中的数据变化
watch: {},
//方法集合
methods: {
    //获取商品数据
    getCateList(){
        this.$http({
            method:'get',
            url:'categories',
            params:this.queryInfo
        }).then(res=>{
            if(res.meta.status!==200){
                return this.$message.error('请求商品分类出错')
            }
            //数据列表赋值给catelist
            this.cateList=res.data.result;
            // console.log(this.cateList)
            this.total=res.data.total;
        })
    },
    //点击按钮展示对话框
    showaddCateDialog(){
        // 先获取前两级数据分类的方法
        this.getParentCateList()
        this.addCateDialogVisible=true; 
    },
    //获取前两级分类的数据列表
    getParentCateList(){
        this.$http({
            method:'get',
            url:'categories',
            params:{
                type:2,
            }
        }).then(res=>{
            
            if(res.meta.status!==200){
                return this.$message.error('获取父级分类失败')
            }
            // console.log(res.data);
            this.parentCateList=res.data;
        })
    },
    //选择项发生变化触发这个函数
    parentCateChange(){
         //如果selectkeys>0 说明选中了父级分类 否则就是没有
         if(this.selectedKeys.length>0){
        //父级分类的id
        this.addCateForm.cat_pid= this.selectedKeys[this.selectedKeys.length-1]
        //
        this.addCateForm.cat_level=this.selectedKeys[this.selectedKeys.length-1]
        return
    }else{
        this.addCateForm.cat_pid= 0
        //
        this.addCateForm.cat_level=0
    }
    },
    //点击按钮添加新的分类
    addCate(){
        this.$refs.addCateFormRef.validate(valid=>{
            if(!valid) return
            this.$http({
                method:'post',
                url:'categories',
                data:this.addCateForm
            }).then(res=>{
                if(res.meta.status!==201){
                    return this.$message.error('添加分类失败')
                }
                this.$message.success('添加分类成功')
                this.getCateList();
                this.addCateDialogVisible=false
            })
        })
    },
    //监听对话框的关闭事件
    addCateDialogClosed(){
        this.$refs.addCateFormRef.resetFields();
        //这个数组里面存放的就是与级联选择器双向绑定的父级数据
        this.selectedKeys=[];
         this.addCateForm.cat_pid= 0
        this.addCateForm.cat_level=0
    },
    
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
.el-cascader{
    width: 100%;
}
</style>