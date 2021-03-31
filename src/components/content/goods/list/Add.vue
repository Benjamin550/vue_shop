<!--  -->
<template>
<div class=''>
    <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item>添加商品</el-breadcrumb-item>
</el-breadcrumb>
<!-- 卡片式图 -->
<el-card>
    <!-- 提示区域 -->
    <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="fasle">
    </el-alert>
    <!-- 步骤条区域 -->
    <el-steps :space="200" :active="parseInt(activeIndex)" finish-status="success" align-center>
        <el-step title="商品信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
         <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
    </el-steps>
    <!-- 左侧tabs区域 -->
 <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
        <el-tabs :tab-position="'left'" v-model="activeIndex" :before-leave="beforeLeave" @tab-click="TabClick">
          <el-tab-pane name="0" label="基本信息">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
                <el-cascader
                    :options="CateList"
                    :props="CateProps"
                    v-model="addForm.goods_cat"
                    @change="handlechange"
                    expand-trigger="hover">
                </el-cascader>
            </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="商品参数" name="1" >
        <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
            <!-- 复选框族 -->
            <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb"  v-for="(cb,i) in item.attr_vals" :key="i" border></el-checkbox>
            </el-checkbox-group>
        </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="商品属性" name="2">
        <el-form-item :label="item.attr_name" v-for="item in OnlyTableData" :key="item.attr_id">
            <el-input  v-model="item.attr_vals" ></el-input>
        </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="商品图片" name="3">
        <!-- 上传图片 -->
        <el-upload
  :action='UpLoad'
  :on-preview="handlePreview"
  :on-remove="handleRemove"
  list-type="picture"
  :headers="headerObj"
  :on-success="handleSuccess"
  >
  <el-button size="small" type="primary">点击上传</el-button>
  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
</el-upload>
    </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器组件 -->
             <quill-editor
    ref="myQuillEditor"
    v-model="addForm.goods_introduce">
    </quill-editor>
    <el-button type="primary" @click="add">添加商品</el-button>
        </el-tab-pane>
  </el-tabs>
  </el-form>
</el-card>
<el-dialog
    title="图片预览"
    :visible.sync="PreviewVisible"
    width="700px">
    <img :src="PreviewPath" alt="" class="previewimg">
</el-dialog>
</div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
//导入深拷贝需要的lodash
import _ from 'lodash'
export default {
//import引入的组件需要注入到对象中才能使用
components: {},
data() {
//这里存放数据
return {
        //定义步骤条某一个被激活
      activeIndex:'0',
    // 添加商品的表单数据对象
    addForm:{
        goods_name:'',
        goods_price:0,
        goods_weight:0,
        goods_number:0,
        //商品所属分类
        goods_cat:[],
        //图片的数组
        pics:[],
        //商品详情描述
        goods_introduce:'',
        attrs:[]
    },
    //表单验证规则
    addFormRules:{
        goods_name:[
          { required:true,message:'请输入商品名称',trigger:'blur'}
        ],
                goods_price:[
          { required:true,message:'请输入商品价格',trigger:'blur'}
        ],
                goods_weight:[
          { required:true,message:'请输入商品重量',trigger:'blur'}
        ],
                goods_number:[
          { required:true,message:'请输入商品数量',trigger:'blur'}
        ],
        goods_cat:[
          { required:true,message:'请选择商品分类',trigger:'blur'}
        ],
    },
    // 商品分类列表
    CateList:[],
//看到的选项
    CateProps:{
        label:'cat_name',
        value:'cat_id',
        children:'children'
    },
    //保存获取到的参数数据
    manyTableData:[],
    //保存静态属性
    OnlyTableData:[],
    //上传图片的URL
    UpLoad:'http://timemeetyou.com:8889/api/private/v1/upload',
    //图片上传组件的headers请求头
    headerObj:{
        Authorization:window.sessionStorage.getItem('token')
    },
    //图片预览的路径
    PreviewPath:'',
    //控制图片预览的显示
    PreviewVisible:false
};
},
//监听属性 类似于data概念
computed: {
    cateId(){
        if(this.addForm.goods_cat.length===3){
            return this.addForm.goods_cat[2]
        }
        return null
    }
},
//监控data中的数据变化
watch: {}, 
//方法集合
methods: {
    //获取商品分类信息
   getCateList(){
        this.$http({
            method:'get',
            url:'categories',
            params:this.queryInfo
        }).then(res=>{
            if(res.meta.status!==200){
                return this.$message.error('获取商品分类出错')
            }
            //数据列表赋值给catelist
            this.CateList=res.data;
        })
    },
    //级联选择器选中项的变化触发函数
    handlechange(){
         console.log(this.addForm.goods_cat)
        if(this.addForm.goods_cat.length!==3){
            this.addForm.goods_cat=[]
        }
    },
    //阻止标签页的切换
    beforeLeave(activeName,oldActiveName){
        if(oldActiveName==='0'&&this.addForm.goods_cat.length!==3){
            this.$message.error('请先选择商品分类')
            return false;
        }
    },
    //tabs 被单击
    TabClick(){
        // console.log(this.activeIndex)
        if(this.activeIndex==='1'){
            //证明访问的是动态参数面板
            this.$http({
                method:'get',
                url:`categories/${this.cateId}/attributes`,
                params:{
                    sel:'many'
                }
            }).then(res=>{
                if(res.meta.status!==200){
                    this.$message.error('参数获取失败')
                }
                //循环item 并且判断item是否是一个空数组 如果是返回空数组 不是 用空格分隔形成一个数组
                res.data.forEach(item=>{
                 item.attr_vals=item.attr_vals.length===0 ?[]:  item.attr_vals.split(' ')
                })
               this.manyTableData=res.data
            })
        }else if(this.activeIndex==='2'){
             this.$http({
                method:'get',
                url:`categories/${this.cateId}/attributes`,
                params:{
                    sel:'only'
                }
            }).then(res=>{
                if(res.meta.status!==200){
                    return this.$message.error('获取失败')
                }
                this.OnlyTableData=res.data;
            })
        }
    },
    //处理图片预览
    handlePreview(){

    },
    //处理移除图片的操作
    handleRemove(){

    },
    //监听图片上传成功的事件
    handleSuccess(response){
        //拼接得到一个图片信息对象
        // 图片信息对象push到数组中
        const picInfo={pic:response.data.tmp_path}
        this.addForm.pics.push(picInfo)
            // console.log(this.addForm)
    },
    handleRemove(file){
        //获取要删除的图片的临时路径
        // 从pics中找到这个图片对应的索引值
        // 删除图片
        const filePath=file.response.data.tmp_path;
        const i=this.addForm.pics.findIndex(x=>
            x.pic===filePath
        )
        this.addForm.pics.splice(i,1)
        console.log(this.addForm)
    },
    //处理图片预览
    handlePreview(file){
        this.PreviewPath=file.response.data.url;
        this.PreviewVisible=true;
    },
    // 添加商品
    add(){
        this.$refs.addFormRef.validate(valid=>{
            if(!valid){
                return this.$message.error('请写必要的表单项')
            }
            //用,分隔之前深拷贝一下
            // lodash cloneDeep(obj)
            const form =_.cloneDeep(this.addForm)
            form.goods_cat=form.goods_cat.join(',')
            // 处理动态参数和静态属性
            this.manyTableData.forEach(item=>{
                const newInfo={attr_id:item.attr_id,attr_value:item.attr_vals.join(' ')}
                this.addForm.attrs.push(newInfo)
            })
            // 处理静态属性
            this.OnlyTableData.forEach(item=>{
                const newInfo={
                    attr_id:item.attr_id,attr_value:item.attr_vals
                }
                this.addForm.attrs.push(newInfo)
            })
            form.attrs=this.addForm.attrs
            // 商品的名称必须是唯一的
            this.$http({
                method:'post',
                url:'goods',
                data:form
            }).then(res=>{
                if(res.meta.status!==201){
                    this.message.error('添加商品失败，请检查参数是否完整')
                }
                this.$message.success('添加商品成功')
                this.$router.push('/goods')
            })
        })
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
    .el-checkbox{
        margin: 0 10px 0 0 !important;
    }
    .previewimg{
        width: 100%;
    }
    .el-button{
        margin-top: 15px;
    }
</style>