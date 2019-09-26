<template>
  <div>
    <Bread :breaddata="breaddata"></Bread>
    <el-form :inline="true" class="grayLine topGapPadding" :model="dataForm" @keyup.enter.native="getDataList()" >
        <el-form-item label="分类名称：">
            <el-input v-model="dataForm.title" placeholder="请输入优惠券名称" clearable></el-input>
        </el-form-item>
        <el-form-item  label="状态：">
            <el-select v-model="dataForm.stopFlag" clearable  placeholder="请选择">
                <el-option
                    v-for="item in storeTypes"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-button  class="btn" type="primary" @click="getData()">搜索</el-button>
            <el-button class="btn"  type="primary" plain @click="reset()" plain>重置</el-button>
        </el-form-item>
        <el-form-item style="float:right">
            <el-button type="primary" @click="addActivity()">添加分类</el-button>
        </el-form-item>
    </el-form>
    <el-table
	  :data="dataList"
      v-loading="dataListLoading"
      border
	  style="width: 100%">
	    <el-table-column
	    	type="index"
		    prop="$index"
				align="center"
		    label="序号"
		    width="70">
		    <template slot-scope="scope">
            {{scope.$index+1+(parseInt(page)-1)* parseInt(limit) }}
            </template>
		</el-table-column>
		<el-table-column
		    prop="title"
		    label="分类名称"
            align="center"
		    width="180">
		</el-table-column>
        <el-table-column
		    prop="sort"
            align="center"
		    label="排序">
		</el-table-column>
		<el-table-column
            align="center"
		    label="状态">
            <template slot-scope="scope">
                <span v-if="scope.row.stopFlag==1">已停用</span>
                <span v-else-if="scope.row.stopFlag==0">已启用</span>
            </template>
		</el-table-column>		
	    <el-table-column
            align="center"
	    	label="操作">
		    <template slot-scope="scope">
		    	<el-button type="text" size="small" @click="toGoodsList(scope.row)">商品列表</el-button>
		    	<el-button type="text" size="small" @click="addActivity(scope.row)">编辑</el-button>
		    	<el-button class="artdanger" type="text" size="small"  @click="deleteHandle(scope.row.id)">删除</el-button>
		    </template>
	  	</el-table-column>
	</el-table>
	<!-- 分页 -->
    <el-pagination
	    @size-change="pageSizeChangeHandle"
	    @current-change="pageCurrentChangeHandle"
	    :current-page="page"
	    :page-sizes="[10, 20, 50, 100]"
	    :page-size="limit"
	    :total="total"
	    layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>

    <!-- 新增编辑分类弹框 -->
    <!-- <el-dialog
        :title="activiTitle"
        :visible.sync="activiVisible"
        :close-on-click-modal = "false"
        :show-close = "false"
        class="activiDialog"
        width="40%">
       
    </el-dialog> -->

    <!-- 添加或者编辑 -->
    <modelAddOrEdit v-if="modelAddOrEditVisible" ref="modelAddOrEditCompon" @searchDataList="getDataList" ></modelAddOrEdit>
    
  </div>
</template>

<script>
    import mixinViewModule from '@/mixins/view-module'
    import { categoryactivityPageUrl,deleteCategoryactivity } from '@/api/url'
    import { storeGrade } from '@/api/api'
    import Bread from "@/components/bread";
    import modelAddOrEdit from "./modules/model-add-or-edit"
    export default {
        mixins: [mixinViewModule],
        components:{
            Bread,
            modelAddOrEdit
        },
        data () {
            return {
                mixinViewModuleOptions: {
                    getDataListURL: categoryactivityPageUrl,
                    getDataListIsPage: true,
                    exportURL: '/admin-api/store/export',
                    deleteURL: deleteCategoryactivity,
                    deleteIsBatch: true,
                    // deleteIsBatchKey: 'id'
                },
                modelAddOrEditVisible:false,
                buttonStatus:false,
                activiVisible:false,
                activiTitle:'添加分类',
                activiDataForm:{
                    sgName:'',
                    sort:'0',
                    radio:'0'
                },
                dataForm: {
                    stopFlag:'',//状态(0:启用，1：停用)
                    title:''//分类名称
                },
                storeTypes:[
                    {id: '',label: '全部'},
                    {id: '0',label: '启用'},
                    {id: '1',label: '停用'}
                ],
                breaddata: ["营销管理", "精选分类"],
            }
        },
        computed:{
            dataRule(){
                return{
                    sgName : [
                        { required: true, message: '分类名称不能为空', trigger: 'blur' },
                    ],
                    sort : [
                            { required: true, message: '排序不能为空', trigger: 'blur' },
                    ],
                    radio: [
                            { required: true, message: '是否启用不能为空', trigger: 'blur' },
                    ],
                }
            }
        },
        created(){
            this.demo();
        },
        methods: {
            getData () {
                this.page =1;
                this.getDataList();
            },
            //回调跳到商品列表页面
            toGoodsList(row){
                this.$emit("goodsListFun",row);
            },
            //重置
            reset() {
                this.dataForm.stopFlag = ""
                this.dataForm.title = "";
                this.getData();
            },
            //打开新增编辑活动弹框
            addActivity(row){
                // this.activiVisible = true;
                this.modelAddOrEditVisible = true;
                this.$nextTick(()=>{
                    this.$refs.modelAddOrEditCompon.init(row);
                })
                // if(id){
                //     this.activiTitle = '编辑分类';
                //     this.getInfo(id);//判断是编辑情况下调详情方法
                // }else{
                //     this.activiTitle = '添加分类';
                // }
            },
            //取消弹框
            noCheck(formName){
                this.$refs[formName].resetFields();
                this.activiVisible = false;
            },
            //提交新增编辑分类
            subActivity(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        
                    }
                });
            },






            demo(){
                function placeholderPic(){
                    var w = document.documentElement.offsetWidth;
                    document.documentElement.style.fontSize=w/20+'px';
                }
                    placeholderPic();
                window.onresize=function(){
                    placeholderPic();
                }
            },
        }
    };
</script>
<style lang="scss" scoped>
.el-input {
  width: 170px;
  height: 40px;
}
.activiDialog{
    .el-input {
        width: 300px;
    }
}

</style>
