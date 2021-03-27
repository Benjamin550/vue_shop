<!--  -->
<template>
<div class=''>
    <tree-table :data="cateList" :columns="columns" 
    :selection-type="false"
    :expand-type="false"
    show-index index-text="#"
    border>
    <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">

            <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color:lightgreen"></i>
            <i class="el-icon-error" v-else style="color:red"></i>
        </template>
        <!-- 排序模板 -->
        <template slot="order" slot-scope="scope">
            <el-tag type="parimary" v-if="scope.row.cat_level===0">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作模板 -->
        <template slot="opt" slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit"
            @click="showeditCateDialog(scope.row)">编辑</el-button>
            <el-button type="danger " icon="el-icon-delete"
            @click="deleteCate(scope.row.cat_id)">删除</el-button>
        </template>
    </tree-table>
    <!-- 编辑分类的对话框 -->
<el-dialog
  title="编辑角色信息对话框"
  :visible.sync="editCatedialogVisible"
  width="50%" 
  ref="editDialogRef">
  <el-form ref="EditCateForm" :model="EditCateData" :rules="editCateFormRules">
      <el-form-item label="分类名称：" prop="cat_name">
           <el-input v-model="EditCateData.cat_name"></el-input>
      </el-form-item>
   
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editCatedialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editCate">确 定</el-button>
  </span>
</el-dialog>
    <!-- 分页区域 -->
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10,15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
    </el-pagination>
</div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
//import引入的组件需要注入到对象中才能使用
name:'CategoriesForm',
props:{
    cateList:{
        type:Array,
        default(){
            return []
        }
    },
    queryInfo:{
        type:Object,
        default(){
            return {}
        }
    },
    getCateList:{
        type:Function,
        default:null
    },
    total:{
        type:Number,
        default:0
    }
},
components: {},
data() {
//这里存放数据
return {
    //为table指定列
    columns:[
        {
        label:'分类名称',
        prop:'cat_name'
    },
    {
        label:'是否有效',
        //表示将当前列定义成模板列
        type:'template',
        //表示当前这一列使用模板名称
        template:'isok'
    },
    {
        label:'排序',
        //表示将当前列定义成模板列
        type:'template',
        //表示当前这一列使用模板名称
        template:'order'
    },
        {
        label:'操作',
        //表示将当前列定义成模板列
        type:'template',
        //表示当前这一列使用模板名称
        template:'opt'
    },
    
    ],
    //提交编辑分类数据
    EditCateData:{},
    //编辑对话框的显示与隐藏
    editCatedialogVisible:false,
    //编辑分类的规则
     editCateFormRules:{
        cat_name:[
            {required:true, message:'请输入分类名称',trigger:'blur'
            }]
     }
};
},
//监听属性 类似于data概念
computed: {},
//监控data中的数据变化
watch: {},
//方法集合
methods: {
    //监听pagesize改变
    handleSizeChange(newSize){
        this.queryInfo.pagesize=newSize;
        this.getCateList();
    },
    //监听pagenum改变
    handleCurrentChange(newPage){
        this.queryInfo.pagenum=newPage;
        this.getCateList();
    },
    //删除操作
    deleteCate(id){
this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
        //用户点击删除
      }).then(()=>{
          this.$http({
              method:'delete',
              url:'/categories/'+id
          }).then(res=>{
              console.log(res)
              if(res.meta.status!==200){
                return  this.$message.error('删除分类失败');
              }
              this.$message.success('删除分类成功')
              this.getCateList()
          })
      }).catch(()=>{
          this.$message.info('用户取消了删除')
      })
    },
    //编辑分类信息
    showeditCateDialog(cateInfo){
        //根据id请求响应行的数据
        this.$http({
            method:'get',
            url:'categories/'+cateInfo.cat_id
        }).then(res=>{
            console.log(res)
            if(res.meta.status!==200){
                return this.$message.error('请求编辑角色数据失败');
            }
            this.EditCateData=res.data
        })
        this.editCatedialogVisible=true;
    },
    //点击确定提交修改分类
    editCate(){
        this.$refs.EditCateForm.validate(valid=>{
            if(!valid) return
        })
        this.$http({
            method:'put',
            url:'categories/'+this.EditCateData.cat_id,
            data:{
                cat_name:this.EditCateData.cat_name
            }
        }).then(res=>{
            if(res.meta.status!==200){
            return    this.$message.error('分类更改失败')
            }
            this.$message.success('分类名称更改成功')
            this.getCateList();
        })
        this.editCatedialogVisible=false;
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
</style>