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
            <el-form-item label="商品名称：" prop="goodsName">
                <el-input v-model="dataForm.goodsName" placeholder="请输入商品名称"></el-input>
            </el-form-item>
            <el-form-item label="商品ID：" prop="skuIdJp">
                <el-input v-model="dataForm.skuIdJp" placeholder="请输入skuID"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button  class="btn" type="primary" @click="search()">搜索</el-button>
            </el-form-item>
        </el-form>
        <el-table
            width="100%"
            :data="dataList"
            ref='dataList'
            border=""
            v-loading="dataListLoading"
            @select-all = "onTableSelectall"
            @select = "onTableSelect"
            style="width: 100%;margin-top:20px;"
        >
        	<el-table-column
		      	type="selection"
		     	width="70"
		     	label="操作"
		      	align="center">
		  	</el-table-column>
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
            <el-table-column prop="wareHouseName" label="所属仓库" align="center"></el-table-column>
            <el-table-column prop="beforeQty" label="库存" align="center"></el-table-column>
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
    import {getallstock,delstock} from '@/api/url'
    export default {
        mixins: [mixinViewModule],
        data () {
            return {
            	mixinViewModuleOptions: {
				  activatedIsNeed: false,   
		          getDataListURL: getallstock,
		          getDataListIsPage: true,
		          // exportURL: '/admin-api/log/login/export',
		          deleteURL: '',
		          deleteIsBatch: true,
		          deleteIsBatchKey: 'id'
			    },
                dataForm:{
                	houseName: '', //所属仓库名  
                	wareHouseId: '',   //仓库id  
                	goodsName:'',  //商品名
                	skuIdJp:'',  //商品的日本skuid
                	wareHouseId:'', //wareHouseIds
                },
                title:'',
                visible : false,
                loading : false,
                formLabelWidth: '120px',
                clickdata: [],  //选中的商品
                showdatacurrent:[],      //页面回显
            }
        },
        props:['dataId','showdata'],
        watch:{
		},
        created(){
        },
        methods: {
			init(row){
		      	this.visible = true;
                this.row = row;
				this.title="查看详情";
				this.dataForm.wareHouseId = this.dataId;
        		this.showdatacurrent = this.showdata;
				this.$nextTick(()=>{
					this.search();
				})
			},
	      	search(){
	          	this.getDataList().then((res)=>{
	              	this.backScanHook();
	          	});
	      	},
			//   处理回显数据
	       	backScanHook(){
	          	this.dataListSelections = [];
	          	var specIds = [];
	          	this.showdatacurrent = this.showdata;
	         	this.showdatacurrent.forEach((item,index)=>{
	          		specIds[index] = item.id;
	          	})
	          	this.dataList.forEach((item,index)=>{
	               	if(specIds.indexOf(item.id)!=-1){
	                   this.dataListSelections.push(item);
	               	}
	           	})
	            this.toggleSelection(this.dataListSelections);
	      	},
        	//单个去选商品    //点击全选
        	onTableSelect(rows, row) {
        		let selected = rows.length && rows.indexOf(row) !== -1
				if(selected){   //true    添加
					row.wareHouseId = this.dataId;
					row.skuId = row.id;
					delete row.id;
        			this.showdatacurrent.push(row);
        		}else{          //删除
			        for (var i = 0; i < this.showdatacurrent.length; i++) {
				        if (this.showdatacurrent[i].id == row.id){
						    this.showdatacurrent.splice(i, 1);
				        }
				    }
        		}
        		console.log(this.showdatacurrent);
			},
			onTableSelectall(rows){
				if(this.$refs.dataList.selection[0]){     //全选
					var flag = true;    //添加进去
					rows.forEach((item)=>{
						flag = true; 
						for (var i = 0; i < this.showdatacurrent.length; i++) {
					        if (this.showdatacurrent[i].id == item.id){
							    flag = false;   //已经存在不用添加
					        }
					   }
						if (flag){
							item.wareHouseId = this.dataId;
							item.skuId = item.id;
							delete item.id;
							this.showdatacurrent.push(item);
						}
					})
				}else{     //全不选
					this.dataList.forEach((item)=>{
						for (var i = 0; i < this.showdatacurrent.length; i++) {
					        if (this.showdatacurrent[i].id == item.id){
						    	this.showdatacurrent.splice(i, 1);
					        }
					   }
					})
				}
				console.log(this.showdatacurrent);
			},
			handleClose(done) {    //带回到父级页面
				console.log(this.showdatacurrent);
			    this.$emit('searchDataList',this.showdatacurrent);
		        done();
		   },
	      	//  处理回显事件
	      	toggleSelection(rows) {
	        if (rows) {
		        	console.log(rows);
		          	rows.forEach(row => {
		            	this.$refs.dataList.toggleRowSelection(row);
		          	});
	        	}
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

<style scoped>

</style>