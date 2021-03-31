<!--  -->
<template>
<div class=''>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>订单管理</el-breadcrumb-item>
  <el-breadcrumb-item>订单列表</el-breadcrumb-item>
</el-breadcrumb>
<!-- 卡片视图 -->
<el-card>
    <el-row :gutter="10">
        <el-col :span="8">
            <el-input placeholder="请输入要搜索的内容" >
                <el-button slot="append" type="primary" icon="el-icon-search"></el-button>
            </el-input>
        </el-col>
    </el-row>
    <!-- 订单列表数据 -->
    <el-table border stripe :data="OrderList" >
        <el-table-column
            prop="order_number"
            label="订单编号" >
        </el-table-column>
        <el-table-column
            prop="order_price"
            label="订单价格" >
        </el-table-column>
                <el-table-column
            prop="pay_status"
            label="是否付款" >
            <template slot-scope="scope">
                <el-tag type="success" v-if="scope.row.pay_status==='1'">已付款</el-tag>
                <el-tag type="danger" v-else>未付款</el-tag>
            </template>
        </el-table-column>
                <el-table-column
            prop="is_send"
            label="是否发货" >
        </el-table-column>
                <el-table-column
            prop="create_time"
            label="下单时间" >
            <template slot-scope="scope">
                {{scope.row.create_time|dateFormat}}
            </template>
        </el-table-column>
                <el-table-column
            label="操作" >
            <template slot-scope="scope">
                        <el-button size="mini" round type="primary" icon="el-icon-edit" @click="showBox"></el-button>
                        <el-button  size="mini" round type="success" icon="el-icon-location" @click="showProcessBox"
                        ></el-button>
            </template>
        </el-table-column>
    </el-table>
    <!-- 分页功能 -->
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
    </el-pagination>
    <!-- 修改地址的对话框 -->
    <el-dialog
        title="修改地址"
        :visible.sync="AddressdialogVisible"
        width="50%"
        @close="addressCLose">
        <el-form ref="addressFormRef" :model="addressForm" label-width="100px"
        :rules="addressFormRules">
            <el-form-item label="省市区/县" prop="address1">
                <el-cascader
                    :options="cityData"
                    v-model="addressForm.address1"
                    >
                </el-cascader>
            </el-form-item>
                        <el-form-item label="详细地址/县" prop="address2">
            <el-input v-model="addressForm.address2" ></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer">
            <el-button @click="AddressdialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="AddressdialogVisible = false">确 定</el-button>
        </span>
    </el-dialog>
    <!-- 物流进度的对话框 -->
    <el-dialog
        title="物流进度"
        :visible.sync="ProcessdialogVisible"
        width="width">
        <!-- 时间线 -->
    <el-timeline >
        <el-timeline-item
            v-for="(activity, index) in ProcessInfo"
            :key="index"
            :timestamp="activity.time">
            {{activity.context}}
        </el-timeline-item>
    </el-timeline>
        <span slot="footer">
            <el-button @click="ProcessdialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="ProcessdialogVisible = false">确 定</el-button>
        </span>
    </el-dialog>
    
</el-card>
</div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import cityData from './citydata'
export default {
//import引入的组件需要注入到对象中才能使用
components: {},
data() {
//这里存放数据
return {
    //查询对象
    queryInfo:{
        // 查询条件
        query:'',
        pagenum:1,
        pagesize:10
    },
    // 存放请求过来的表单数据
    OrderList:[],
    //存放总数据
    total:0,
    //修改地址对话框
    AddressdialogVisible:false,
    //存放地址对象
    addressForm:{
        address1:[],
        address2:''
    },
    addressFormRules:{
        address1:[
            {required:true,message:'请选择省市区/县',trigger:'blur'}
        ],
                address2:[
            {required:true,message:'请填写详细地址',trigger:'blur'}
        ]
    },
    cityData,
    // 物流进度的对话框
    ProcessdialogVisible:false,
    //物流信息
    ProcessInfo:[]
};
},
//监听属性 类似于data概念
computed: {},
//监控data中的数据变化
watch: {},
//方法集合
methods: {
        getOrderList(){
            this.$http({
                method:'get',
                url:'orders',
                params:this.queryInfo
            }).then(res=>{
                if(res.meta.status!==200){
                   return this.$message.error('请求订单数据出错')
                }
                this.OrderList=res.data.goods;
                this.total=res.data.total;
            })
        },
        // 监听pagesize变化
        handleSizeChange(newSize){
            this.queryInfo.pagesize=newSize;
            this.getOrderList();
        },
        // 页码值发生变化
        handleCurrentChange(newPage){
            this.queryInfo.pagenum=newPage;
            this.getOrderList();
        },
        //修改地址的对话框
        showBox(){
            this.AddressdialogVisible=true
        },
        // 关闭对话框
        addressCLose(){
            this.$refs.addressFormRef.resetFields() 
        },
        //显示物流进度
        showProcessBox(){
            this.$http({
                method:'get',
                url:'/kuaidi/1106975712662'
            }).then(res=>{
                if(res.meta.status!==200){
                    this.$message.error('获取物流信息失败')
                }
                this.ProcessInfo=res.data
                console.log(this.ProcessInfo)
            })
            this.ProcessdialogVisible=true
        }   
},
//生命周期 - 创建完成（可以访问当前this实例）
created() {
    this.getOrderList();
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