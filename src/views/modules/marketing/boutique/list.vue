<template>
  <div>
    <Bread :breaddata="breaddata"></Bread>
    <el-form :inline="true" class="grayLine topGapPadding" :model="dataForm" @keyup.enter.native="getDataList()" >
        <el-form-item label="分类名称：">
            <el-input v-model="dataForm.name" placeholder="请输入优惠券名称" clearable></el-input>
        </el-form-item>
        <el-form-item  label="状态：">
            <el-select v-model="dataForm.storeType" clearable  placeholder="请选择">
                <el-option
                    v-for="item in storeTypes"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-button  class="btn" type="primary" @click="getDataList()">查询</el-button>
            <el-button class="btn"  type="primary" plain @click="reset()" plain>重置</el-button>
        </el-form-item>
        <el-form-item style="float:right">
            <!-- <el-button type="primary" @click="addActivity()">添加分类</el-button> -->
            <el-button type="primary" @click="toGoodsList('31313121212')">商品列表</el-button>
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
		    prop="id"
		    label="分类名称"
		    width="180">
		</el-table-column>
        <el-table-column
		    prop="account"
		    label="排序">
		</el-table-column>
		<el-table-column
		    prop="account"
		    label="状态">
		</el-table-column>		
	    <el-table-column
	   		prop="address"
	    	label="操作">
		    <template slot-scope="scope">
		    	<el-button type="text" size="small" @click="toGoodsList(scope.row.id)">商品列表</el-button>
		    	<el-button type="text" size="small" @click="addActivity(scope.row.id)">编辑</el-button>
		    	<el-button class="artdanger" type="text" size="small">删除</el-button>
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
    <el-dialog
        :title="activiTitle"
        :visible.sync="activiVisible"
        :close-on-click-modal = "false"
        :show-close = "false"
        class="activiDialog"
        width="40%">
        <el-form :model="activiDataForm" :rules="dataRule" ref="activiDataForm" @keyup.enter.native="subActivity()" label-width="120px">
            <el-form-item label="分类名称：" prop="sgName">
                <el-input v-model="activiDataForm.sgName" placeholder="最多可输入4个汉字" :maxlength="4"></el-input>
            </el-form-item>
            <el-form-item label="排序：" prop="sort">
                <el-input style="width:140px;margin-right:20px;" v-model="activiDataForm.sort" type="number" :maxlength="4"></el-input>数字越大越靠前
            </el-form-item>
            <el-form-item label="是否启用：" prop="radio">
               <el-radio-group v-model="activiDataForm.radio">
                    <el-radio label="0">启用</el-radio>
                    <el-radio label="1">停用</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="noCheck('activiDataForm')">取 消</el-button>
            <el-button type="primary" @click="subActivity('activiDataForm')" :loading="buttonStatus">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
    import mixinViewModule from '@/mixins/view-module'
    import { businessPageUrl } from '@/api/url'
    import { storeGrade } from '@/api/api'
    import Bread from "@/components/bread";
    
    export default {
    mixins: [mixinViewModule],
    components:{Bread},
        data () {
            return {
                mixinViewModuleOptions: {
                    getDataListURL: businessPageUrl,
                    getDataListIsPage: true,
                    exportURL: '/admin-api/store/export',
                    deleteURL: '/admin-api/store',
                    deleteIsBatch: true,
                    // deleteIsBatchKey: 'id'
                },
                buttonStatus:false,
                activiVisible:false,
                activiTitle:'添加分类',
                activiDataForm:{
                    sgName:'',
                    sort:'0',
                    radio:'0'
                },
                dataForm: {
                    storeType:'0',
                    name:''
                },
                storeTypes:[
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
            //回调跳到商品列表页面
            toGoodsList(id){
                this.$emit("goodsListFun",id);
            },
            //重置
            reset() {
                this.dataForm = {storeType:'0',name:''};
                this.getDataList();
            },
            //打开新增编辑活动弹框
            addActivity(id){
                this.activiVisible = true;
                if(id){
                    this.activiTitle = '编辑分类';
                    this.getInfo(id);//判断是编辑情况下调详情方法
                }else{
                    this.activiTitle = '添加分类';
                }
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
