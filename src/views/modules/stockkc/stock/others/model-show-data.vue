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
		          getDataListURL: getallstock,
		          getDataListIsPage: true,
		          // exportURL: '/admin-api/log/login/export',
		          deleteURL: '',
		          dataListLoading: false, 
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
                currentpageclickdata:{},
                showdatacurrent:[],      //页面回显
            }
        },
        props:['dataId','showdata'],
        watch:{
		},
        created(){
        	this.dataForm.wareHouseId = this.dataId;
        	this.showdatacurrent = this.showdata;
        	this.getDataList();
        },
        methods: {
        	//单个去选商品    //点击全选
        	onTableSelect(rows, row) {
        		console.log(rows,row)
        		
        		
        		
        		
        		return;
        		if(this.currentpageclickdata[this.page]){    //存在
        			this.currentpageclickdata[this.page] = this.$refs.dataList.selection;
        		}else{  								    //不存在
        			this.$set(this.currentpageclickdata, this.page, this.$refs.dataList.selection)
        		}
//      		console.log(this.currentpageclickdata);
        		this.artselect(this.currentpageclickdata);
			},
			onTableSelectall(rows){
				if(this.$refs.dataList.selection[0]){     //全不选
					console.log('全选');
				}else{
					console.log('全不选')
				}
//				console.log('全选');
//				console.log(rows);
			},
			artaddordel(arrlist,type,row){
				if(type == "add"){     //添加
					let selected = arrlist.length && arrlist.indexOf(row) !== -1
				    if(selected == false){
				    	this.$emit("actdodelete",row.id);
				    }else{
				    	if(this.dataForm.type == 1){        //店铺
								this.$emit("actVipNameshop",row);
							}else{    //会员
								this.$emit("actVipNamevip",row);
							}
				    }
				}else{                //减少
					
				}
			},
			artselect(){     
				this.clickdata = [];
				for(var k in this.currentpageclickdata){
					this.currentpageclickdata[k].forEach((item)=>{
						this.clickdata.push(item);
					})
        		}
				this.showdatacurrent = this.clickdata;
			},
			handleClose(done) {
			    this.$emit('searchDataList',this.clickdata);
		        done();
		   },
			init(row){
		      	this.visible = true;
                this.row = row;
                this.title="查看详情";
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