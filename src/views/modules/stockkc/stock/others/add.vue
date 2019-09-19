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
			      value-key="name"
			      @select="handleSelect"
			    ></el-autocomplete>
            </el-form-item>
            <el-form-item prop="orderId" label="备注：">
                <el-input v-model="dataForm.orderId" type="text" maxlength="500" placeholder="请输入备注内容" style="width:400px;"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button  class="btn" type="primary" @click="saveGoods">保存</el-button>
            </el-form-item>
        </el-form>
        <el-form>
            <el-form-item>
                <!--<el-button type="primary"  @click="addOrEditHandle()" >导入商品</el-button>-->
                <el-button type="primary" plain @click="addGoods()" >添加商品</el-button>
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
                </template>
            </el-table-column>
            <el-table-column prop="skuIdJp" label="skuID" align="center"></el-table-column>
            <el-table-column prop="goodsName" label="商品名称" align="center"></el-table-column>
            <el-table-column prop="spe" label="规格" align="center"></el-table-column>
            <el-table-column prop="wareHouseName" label="所属仓库" align="center"></el-table-column>
            <el-table-column prop="beforeQty" label="库存" align="center"></el-table-column>
            <el-table-column prop="changeQty" label="变更数量" align="center">
            	<template slot-scope="scope">
                    <el-input v-model="scope.row.changeQty" type="number" @blur='artnumberinput(scope)' :max='Number(scope.row.beforeQty)' min='0'  placeholder="0" style="width:90px; text-align: center;"></el-input>
                </template>
            </el-table-column>
            <el-table-column prop="afterQty" label="变更后库存" align="center"></el-table-column>
            <el-table-column label="操作" align="center" width="180">
                <template slot-scope="scope">
                    <el-button @click.native.prevent="deletelocaldata(scope.$index, scope.row)"type="text"size="mini">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 弹窗, 查看 -->
        <showData  v-if="showDataVisible" :showdata="dataList || []"  ref="showData" @searchDataList="searchDataList"></showData>
    </div>
</template>

<script>
    import mixinViewModule from '@/mixins/view-module'
    import Bread from "@/components/bread";
    import showData from './model-show-data'
    import { warehouserecordsodoAdd,warelistByType} from "@/api/api"      //获取仓库，保存商品
    export default {
        // mixins: [mixinViewModule],
        data () {
            return {
            	// mixinViewModuleOptions: {
		        //   getDataListURL: '',
		        //   getDataListIsPage: true,
		        //   // exportURL: '/admin-api/log/login/export',
		        //   deleteURL: '',
		        //   dataListLoading: false, 
		        //   deleteIsBatch: true,
		        //   deleteIsBatchKey: 'id'
                // },
                dataListLoading: false, 
                breaddata: [ "库存管理", "其他出库单", "添加出库单"],
                showDataVisible:false,
                goodKindList1:[],   //搜索仓库
                dataForm:{
                	houseName: '', //所属仓库名  
                	wareHouseId:'',   //仓库id  
                	wareHouseName:'', //仓库name
                },
                wareItem:"",
               dataList:[],
               restaurants:[],  //所有仓库
            }
        },
        components: {
            Bread,
            showData
        },
        created(){
            // this.artgetallstock();
            this.getWarelistByType();
        },
        watch:{
        	
        },
        methods: {
        	//显示所选的商品
        	searchDataList(rows){
        		this.dataList = rows;
        	},
        	saveGoods(){
        		if(this.dataList.length < 1){
        			this.$message('请添加商品')
        			return;
        		}
        		warehouserecordsodoAdd(this.dataList).then((data)=>{
        			if(data.code == 200){
        				this.$message({
        					message:'保存成功',
        					type:'success'
        				})
        				this.dataList = [];
        			}else{
        				this.$message('服务器内部错误')
        			}
        		})
        	},
        	//删除商品
        	deletelocaldata(index,row){
        		console.log(index);
        		this.dataList.splice(index, 1); 
        		console.log(this.dataList);
        	},
        	//所有仓库
        	querySearch(queryString, cb) {
                console.log("查询");
                console.log(this.restaurants);
		        var restaurants = this.restaurants;
		        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
                // 调用 callback 返回建议列表的数据
                 cb(results);
		    },
		    createFilter(queryString) {
		        return (restaurant) => {
		          return (restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
		        };
		    },
			//当前选择的仓库
		    handleSelect(item) {
                console.log(item);
                this.wareItem = item;
                //   this.dataForm.wareHouseId = item.id;
		    },
		    //变更数量
		    artnumberinput(scope){
		    	if(scope.row.beforeQty <= scope.row.changeQty){
		    		scope.row.changeQty = scope.row.beforeQty;
		    	}else if(scope.row.changeQty <= 0){
		    		scope.row.changeQty = 0;
		    	}
            },
            // // 查询所有仓库数据
        	// artgetallstock(){
        	// 	var obj = {
            //     	params:this.dataForm
            //    }
            //     getallstock(obj).then(({data})=>{
            //     	if(data){
            //     		this.restaurants = data.list;
            //     		console.log(this.restaurants)
		    //       	}else {
			//           	this.$message.error("服务器错误");
		    //       	}
	        //         })
            // },
            // 根据类型查询仓库列表
            getWarelistByType(){
                var obj  = {
                    type:1
                }
                 warelistByType(obj).then((res)=>{
                     if(res.code==200){
                         this.restaurants = res.data;
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
            addGoods(){
            	if(!this.wareItem){
            		this.$message('请先选择所属仓库')
            		return;
                }
                
                this.setShowDataVisible(true);
                this.$nextTick(() => {
                    this.$refs.showData.init(this.wareItem)
                })
            },
            setShowDataVisible(boolargu){
                this.showDataVisible =  boolargu;
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