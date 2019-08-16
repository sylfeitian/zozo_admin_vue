<template>
    <div>
        <Bread :breaddata="breaddata" @changePage="changePage" :index="'1'"></Bread>
        <el-form :inline="true" class="grayLine topGapPadding" :model="dataForm" @keyup.enter.native="getDataList()" >
            <el-form-item prop="memberId" label="所属仓库：">
            	<el-autocomplete
			      class="inline-input"
			      v-model="dataForm.wareHouseName"
			      :fetch-suggestions="querySearch"
			      placeholder="请输入内容"
			      value-key="wareHouseName"
			      @select="handleSelect"
			    ></el-autocomplete>
            </el-form-item>
            <el-form-item prop="orderId" label="备注：" style="width:400px;">
                <el-input v-model="dataForm.orderId" type="text" maxlength="500" placeholder="请输入备注内容" style="width:400px;"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button  class="btn" type="primary" @click="">保存</el-button>
            </el-form-item>
        </el-form>
        <el-form>
            <el-form-item>
                <!--<el-button type="primary"  @click="addOrEditHandle()" >导入商品</el-button>-->
                <el-button type="primary" plain @click="showDetail()" >添加商品</el-button>
            </el-form-item>
        </el-form>
        <el-table
                width="100%"
                :data="dataList"
                border=""
                v-loading="dataListLoading"
                style="width: 100%;margin-top:20px;"
        >
            <el-table-column label="序号" width="140" align="center">
                <template slot-scope="scope">
                    <span>{{scope.$index+1}}</span>
                    <!-- {{scope.$index+1+(parseInt(params.currentPage)-1)* parseInt(params.currentPageSize) }} -->
                </template>
            </el-table-column>
            <el-table-column prop="name" label="skuID" align="center"></el-table-column>
            <el-table-column prop="" label="商品名称" align="center"></el-table-column>
            <el-table-column prop="" label="规格" align="center"></el-table-column>
            <el-table-column prop="" label="所属仓库" align="center"></el-table-column>
            <el-table-column prop="" label="库存" align="center"></el-table-column>
            <el-table-column prop="" label="变更数量" align="center"></el-table-column>
            <el-table-column prop="" label="变更后库存" align="center"></el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button @click.native.prevent="deleteHandle(scope.$index, scope.row)"type="text"size="mini">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 弹窗, 查看 -->
        <showData  v-if="showDataVisible" :allstockdata="allstockdata" ref="showData" @searchDataList="getDataList"></showData>
    </div>
</template>

<script>
    import mixinViewModule from '@/mixins/view-module'
    import Bread from "@/components/bread";
    import showData from './model-show-data'
    import { getallstock} from "@/api/api"
    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                breaddata: [ "库存管理", "其他出库单", "添加出库单"],
                showDataVisible:false,
                goodKindList1:[],   //搜索仓库
                dataForm:{
                	houseName: '', //所属仓库名  
                	wareHouseId:'',   //仓库id  
                },
               allstockdata:{},   //弹框的仓库内容
               restaurants:[],  //所有仓库
            }
        },
        components: {
            Bread,
            showData
        },
        created(){
        	this.artgetallstock();
        },
        methods: {
        	//所选仓库
        	 querySearch(queryString, cb) {
		        var restaurants = this.restaurants;
		        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
		        // 调用 callback 返回建议列表的数据
		        cb(results);
		      },
		      createFilter(queryString) {
		        return (restaurant) => {
		          return (restaurant.wareHouseName.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
		        };
		      },
			//当前选择的仓库
		      handleSelect(item) {
		      	this.dataForm.wareHouseId = item.id;
		      },
        	getGoodKind2() {},
        	artgetallstock(){
        		var obj = {
                	params:this.dataForm
               }
                getallstock(obj).then(({data})=>{
                	if(data){
                		this.restaurants = data.list;
                		console.log(this.restaurants)
		          	}else {
			          	this.$message.error("服务器错误");
		          	}
	                })
        	},
        	changePage(){
		    	this.$emit("addoraditList");
		    },
            init (row) {
                this.visible = true;
                this.row = row;
                this.$nextTick(() => {
                    //this.$refs['addForm'].resetFields();
                    // this.getApplyPullList();
                })
            },
            showDetail(index=-1,row=""){
            	if(!this.dataForm.wareHouseName){
            		this.$message('请先选择所属仓库')
            		return;
            	}
            	
                this.setShowDataVisible(true);
                var obj = {
                	params:this.dataForm
                }
                getallstock(obj).then(({data})=>{
                	if(data){
	                	this.allstockdata = data;
	                	console.log(this.allstockdata);
		          	}else {
			          	this.$message.error("服务器错误");
		          	}
	                })
                
                this.$nextTick(() => {
                    this.$refs.showData.init(row)
                })
            },
            setShowDataVisible(boolargu){
                this.showDataVisible =  boolargu;
            },
        }
    }
</script>

<style scoped>

</style>