<template>
    	<el-dialog
            class="model-add-edit-data"
            :title="title"
            :close-on-click-modal="false"
            :before-close="handleClose"
            :visible.sync="visible"
            width="80%"
    	>
        <el-form
            :model="dataForm"
            ref="addForm"
            label-width="100px"
            :inline="true"
        >
            <el-form-item label="商品名称：">
                <el-input v-model="dataForm.goodsName" placeholder="请输入商品名称" maxlength="300"></el-input>
            </el-form-item>
            <el-form-item label="商品货号：">
                <el-input v-model="dataForm.goodCsId" placeholder="请输入spu编号"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button  class="btn" type="primary" @click="getData()">查询</el-button>
            </el-form-item>
        </el-form>
        <el-table
            width="100%"
            :data="dataList"
            ref='dataList'
            border=""
            v-loading="dataListLoading"
            style="width: 100%;margin-top:20px;"
        >
        	<!-- <el-table-column
		      	type="selection"
		     	width="70"
		     	label="操作"
		      	align="center">
		  	</el-table-column> -->
		  	<el-table-column
		    	type="index"
			    prop="$index"
			    label="序号"
			    align="center"
			    width="70">
			    <template slot-scope="scope">
	          		{{scope.$index+1+(parseInt(page)-1)* parseInt(limit) }}
	        	</template>
			</el-table-column>
            <el-table-column prop="skuIdJp" label="skuID" align="center"></el-table-column>
            <el-table-column prop="goodsName" label="商品名称" align="center"></el-table-column>
            <el-table-column prop="spe" label="规格" align="center"></el-table-column>
            <el-table-column prop="warehouseName" label="所属仓库" align="center"></el-table-column>
            <el-table-column prop="beforeQty" label="修改前仓库数" align="center"></el-table-column>
            <el-table-column prop="changeQty" label="扣减库存数" align="center"></el-table-column>
            <el-table-column prop="afterQty" label="修改后库存数" align="center"></el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="page"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="limit"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper">
    	</el-pagination>
    </el-dialog>
</template>

<script>
    import mixinViewModule from '@/mixins/view-module'
	import {warehouserecordsodoStockPageUrl} from '@/api/url'
	// import {wareInfoById} from  "@/api/api.js"
    export default {
        mixins: [mixinViewModule],
        data () {
            return {
				
            	mixinViewModuleOptions: {
				  activatedIsNeed: false,   
				  getDataListURL: warehouserecordsodoStockPageUrl,
		          getDataListIsPage: true,
		          // exportURL: '/admin-api/log/login/export',
		          deleteURL: '',
		          deleteIsBatch: true,
		          deleteIsBatchKey: 'id'
			    },
                dataForm:{
                    goodCsId:'',//商品的日本skuid
                    documentNo:"",//出库单号
                	goodsName:""//商品名
                },
                title:'',
                visible : false,
                loading : false,
                formLabelWidth: '120px',
                clickdata: [],  //选中的商品
                showdatacurrent:[],      //页面回显
            }
        },
        created(){
        },
        methods: {
			init(row){
				console.log(row);
		      	this.visible = true;
				this.title="查看详情";
				this.$nextTick(()=>{
					this.getData(row);
				})
			},
	      	getData(row){
	          	// this.getDataList().then((res)=>{
                // 	this.backScanHook();
                this.dataForm.documentNo = row.documentNo  ////出库单号
                //    this.dataForm.goodCsId //商品的日本skuid
                // this.dataForm.goodsName =  //商品名
				this.getDataList();
	      	},
			handleClose(done) {    //带回到父级页面
			    this.$emit('searchDataList');
		        done();
		   },
	     
			// 每页数
			sizeChangeHandle (val) {
				this.page = 1;
				this.limit = val;
				this.getDataList().then((res)=>{
		          	this.backScanHook();
		      	});
			},
			// 当前页
			currentChangeHandle (val) {
				this.page = val;
				this.getDataList().then((res)=>{
		          	this.backScanHook();
		      });
			},
           
            closeDialog() {
                this.$parent.addEditDataVisible = false;
            },
        }
    }
</script>

<style lang="scss" scoped>
    /deep/ .cell {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>