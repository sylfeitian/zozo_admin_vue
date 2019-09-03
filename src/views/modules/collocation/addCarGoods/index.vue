<template>
  <div>
    <Bread :breaddata="breaddata"></Bread>
    <el-form :inline="true" class="grayLine topGapPadding" :model="dataForm" @keyup.enter.native="getDataList()" >
        <el-form-item label="商品ID：">
            <el-input v-model="dataForm.storeId" placeholder="请输入商品ID" clearable></el-input>
        </el-form-item>
        <el-form-item label="商品名称：">
            <el-input v-model="dataForm.storeId" placeholder="请输入商品名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
            <el-button  class="btn" type="primary" @click="getDataList()">查询</el-button>
            <el-button class="btn"  type="primary" plain @click="reset()" plain>重置</el-button>
        </el-form-item>
        <el-form-item style="float:right;">
            <el-button type="primary" @click="addActivity()">添加商品</el-button>
        </el-form-item>
    </el-form>
    <el-table
	  :data="dataList"
      v-loading="dataListLoading"
      @selection-change="dataListSelectionChangeHandle"
      border
	  style="width: 100%">
        <el-table-column 
            type="selection" 
            header-align="center" 
            align="center" 
            width="50">
        </el-table-column>
	    <!-- <el-table-column
	    	type="index"
		    prop="$index"
				align="center"
		    label="序号"
		    width="70">
		    <template slot-scope="scope">
            {{scope.$index+1+(parseInt(page)-1)* parseInt(limit) }}
            </template>
		</el-table-column> -->
		<el-table-column
		    prop="id"
		    label="商品ID"
		    width="200">
		</el-table-column>
        <el-table-column
		    prop="createDate"
		    label="排序">
		</el-table-column>
		<el-table-column
		    prop="account"
		    label="商品名称">
		</el-table-column>
		<el-table-column
		    prop="gradeName"
		    label="所属分类">
		</el-table-column>
		<el-table-column
		    prop="createDate"
		    label="销售价格">
		</el-table-column>
        <el-table-column
		    prop="createDate"
		    label="库存">
		</el-table-column>
	    <el-table-column
	   		prop="address"
	    	label="操作">
		    <template slot-scope="scope">
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

    <!-- 商品弹框 -->
    <el-dialog
        title="添加商品"
        :visible.sync="goodsVisible"
        width="60%">
        <el-form :inline="true" :model="goodsdataForm">
            <el-form-item label="商品名称：">
                <el-input v-model="goodsdataForm.storeId" placeholder="请输入商品名称" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button  class="btn" type="primary" @click="getgoodsList()">查询</el-button>
                <el-button class="btn"  type="primary" plain @click="goodsreset()" plain>重置</el-button>
            </el-form-item>
        </el-form>
        <el-table
            :data="goodsdataList"
            v-loading="dataListLoading"
            border
            style="width: 100%">
            <el-table-column
                prop="id"
                label="商品名称"
                width="240">
            </el-table-column>
            <el-table-column
                prop="account"
                label="商品ID">
            </el-table-column>
            <el-table-column
                prop="gradeName"
                label="价格">
            </el-table-column>
            <el-table-column
                prop="address"
                label="操作">
                <template slot-scope="scope">
                    <el-checkbox @change="gettem($event,scope.row)"></el-checkbox>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @size-change="pageSize"
            @current-change="pageCurrent"
            :current-page="pages"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="limits"
            :total="totals"
            layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
    </el-dialog>
  </div>
</template>

<script>
    import mixinViewModule from '@/mixins/view-module'
    import { businessPageUrl } from '@/api/url'
    import { zozogoodsPage } from '@/api/api'
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
                goodsdataList:[],
                buttonStatus:false,
                goodsVisible:false,
                activiTitle:'添加活动',
                dataForm: {
                    gradeId:'',
                    storeType:'',
                },
                goodsdataForm:{
                    storeId:'',
                    radio:''
                },
                pages:1,
                limits:10,
                totals:0,
                breaddata: ["配置管理", "购物车推荐商品配置"],
            }
        },
        created(){
            this.demo();
        },
        methods: {
            //重置
            reset() {
                this.dataForm = {};
                this.getDataList();
            },
            //打开新增编辑活动弹框
            addActivity(id){
                this.goodsVisible = true;
                this.getgoodsList();
            },
            getgoodsList(){

            },
            goodsreset(){

            },
            gettem($event,item){
                console.log($event,item)
            },
            // 弹框分页, 每页条数
            pageSize(val) {
                this.pages = 1
                this.limits = val
                this.getgoodsList()
            },
            // 弹框分页, 当前页
            pageCurrent(val) {
                this.page = val
                this.getgoodsList()
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
