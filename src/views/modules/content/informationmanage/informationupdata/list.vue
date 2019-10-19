<template>
  <div>
		  	<el-form :inline="true" class="grayLine topGapPadding" :model="dataForm" ref="dataForm" @keyup.enter.native="getDataList()" >			    
			    <el-form-item label="">
		        <el-select
		          v-model="dataForm.type"
		          placeholder="请选择"
		          loading-text="加载中···"
		          @visible-change="getGoodKind2"
		          @change='actselectchange'>
		          <el-option
		            v-for="item in goodKindList1"
		            :key="item.id"
		            :label="item.name"
		            :value="item.id">
		          </el-option>
		        </el-select>
			    </el-form-item>  
			    <el-form-item label="" v-if='dataForm.type != 1'>
			      <el-input v-model.trim="dataForm.memberName" placeholder="请输入" clearable></el-input>
			    </el-form-item>
			    <el-form-item label="" v-else>
			      <el-input v-model.trim="dataForm.storeName" placeholder="请输入" clearable></el-input>
			    </el-form-item>
					<el-form-item>
					  <el-button  class="btn" type="primary" @click="getDataList()">搜索</el-button>
					</el-form-item>
			</el-form>
		  <el-table
		  		v-if='isshop'
			  	:data="dataList"
			  	ref='dataList'
			  	border
			  	style="width: 100%"
			  	v-loading="dataListLoading"
			  	@select = "onTableSelect"
			  	@selection-change="dataListSelectionChangeHandleshop">
			  <el-table-column
			      type="selection"
			      width="70"
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
			  <!--id-->
				<el-table-column
				    prop="storeName"
				    label="店铺名称"
				    align="center">
				</el-table-column>
				<el-table-column
				    prop="account"
				    label="管理员账号"
				    align="center">
				</el-table-column>
				<el-table-column
				    prop="createDate"
				    label="注册时间"
				    width="180"
				    align="center">
				</el-table-column>
				<el-table-column
				    prop="gradeName"
				    label="店铺等级名称 "
				    align="center"
				    width="110">
				</el-table-column>
				<el-table-column
				    prop="storeType"
				    label="店铺类型"
				    align="center"
				    width="80"
				    :formatter="formatstoreType">
				</el-table-column>
			</el-table>
			<el-table
					v-else
			  	:data="dataList"
			  	ref='dataList'
			  	border
			  	style="width: 100%"
			  	v-loading="dataListLoading"
			  	@select = "onTableSelect"
			  	@selection-change="dataListSelectionChangeHandle">
			  <el-table-column
			      type="selection"
			      width="70"
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
			  <!--id-->
				<el-table-column
				    prop="nickName"
				    label="账号名称"
				    align="center">
				</el-table-column>
				<el-table-column
				    prop="memberRealName"
				    label="真实姓名"
				    align="center">
				</el-table-column>
				<el-table-column
				    prop="createDate"
				    label="注册时间"
				    align="center"
				    width="180">
				</el-table-column>
				<el-table-column
				    prop="memberEmail"
				    label="邮箱"
				    align="center"
				    width="220">
				</el-table-column>
				<el-table-column
				    prop="memberState"
				    label="登录"
				    width="70"
				    align="center"
				    :formatter="formatmessageType">
				</el-table-column>
			</el-table>
			
			<!-- 分页 -->
			<el-pagination
			  @size-change="sizeChangeHandle"
			  @current-change="currentChangeHandle"
			  :current-page="params.currentPage"
			  :page-sizes="[10, 20, 50, 100]"
			  :page-size="params.currentPageSize"
			  :total="total"
			  layout="total, sizes, prev, pager, next, jumper">
			</el-pagination>
		
	    <div class="grayBtnWarp">
	    	<div class="grayBtnWarp-right">
	    		<el-button  class="btn" @click='actDoClose'>取消</el-button>
					<el-button  class="btn" type="primary" @click='actDoAdd'>确定</el-button>
	    	</div>
	    </div>
   </div>
  </div>
</template>

<script>
//import list from "./list.vue"
import mixinViewModule from '@/mixins/view-module'
import { addmessagevip, addmessagevipshop } from '@/api/url'
  
export default {
  	mixins: [mixinViewModule],
	data () {
	    return {
	      mixinViewModuleOptions: {
	          getDataListURL: addmessagevip,
	          getDataListIsPage: true,
	          // exportURL: '/admin-api/log/login/export',
	          deleteURL: '',
	          dataListLoading: false, 
	          deleteIsBatch: true,
	          deleteIsBatchKey: 'id'
	      },
	      goodKind2loading:false,
	      goodKind3loading:false,
	      dataForm: {
					type:0,
					memberName:'',
					storeName:'',
	      },
	      tableData: [],
	      goodKindList1: [{ id: 0, name: "会员" },{ id: 1, name: "店铺" },{ id: 2, name: "邮箱" },{ id: 3, name: "姓名" }],
	      activeName: "first",
	      valuetime: '',
	      params:{
		      "currentPage": 1, //当前页数
		      "currentPageSize" : 10, //每页显示的条数
	      },
	      vipData:[],
	      shopData: [],
	      isshop: false,
	      dataListSelections:[],
	    };
	},
	props:['showdata'],
	created() {
		
	},
	components: {
		
	},
	mounted() {
	},
	methods: {
	onTableSelect(rows, row) {
    let selected = rows.length && rows.indexOf(row) !== -1
	    if(selected == false){
	    	this.$emit("actdodelete",row.id);
	    }else{
	    	if(this.dataForm.type == 1){        //店铺
					this.$emit("actVipNameshop",row);
				}else{    //会员
					this.$emit("actVipNamevip",row);
				}
	    }
		},
			init(){
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
          this.showdata.forEach((item,index)=>{
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
          rows.forEach(row => {
            this.$refs.dataList.toggleRowSelection(row);
          });
        }
      },
	    reset(dataForm) {
	    	this.$refs[dataForm].resetFields();
	    	this.dataForm.memberName = '';
	    	this.dataForm.strTime = '';
	    	this.dataForm.endTime = '';
	    	this.valuetime = '';
	    },
	    getGoodKind2() {},
	    actselectchange(val) {
	    	this.dataForm.memberName = '';
	    	//id=1  是店铺  走店铺的接口
	    	if(val == 1){
	    		this.isshop = true;
	    		this.mixinViewModuleOptions.getDataListURL = addmessagevipshop;
	    		this.getDataList().then((res)=>{
              this.backScanHook();
          });
	    	}else{
	    		this.isshop = false;
	    		this.mixinViewModuleOptions.getDataListURL = addmessagevip;
	    		this.getDataList().then((res)=>{
              this.backScanHook();
          });
	    	}
	    },
	    getGoodKind3() {},
	    showDetail(row){
	    	this.$emit("showDetail",row);
	    },
	    //登录
	    formatmessageType(row, column){
	    	return row.messageType == 1 ? '不允许' : '允许';
	    },
	    //店铺类型
	    formatstoreType(row, column){
	    	return row.storeType == 1 ? '自营商户' : '普通商户';
	    },
	    // 每页数
		sizeChangeHandle (val) {
			this.params.currentPageSize = val;
			this.params.currentPage = 1;
			this.limit = val;
			this.getDataList().then((res)=>{
          this.backScanHook();
      });
		},
		// 当前页
		currentChangeHandle (val) {
			this.params.currentPage = val;
			this.page = val;
			this.getDataList().then((res)=>{
          this.backScanHook();
      });
		},
		//点击取消
		actDoClose(){
			this.$emit("actclose");
		},
		//点击确定   把姓名和id传给父级
		actDoAdd(){ 
			this.$emit("actclose");
		},
		dataListSelectionChangeHandle(val){
//			this.vipData = val;
		},
		dataListSelectionChangeHandleshop(val){
//			this.shopData = val;
		}
	}
};
</script>
<style lang="scss" scoped>
 .el-dialog__wrapper{
 	display: block !important; 
 }
 .grayBtnWarp{
 	overflow: hidden;
 	.grayBtnWarp-right{
 		float:right;
 		
 	}
 	/*margin:20px 340px 0;
 	display:flex;
 	justify-content: space-around;*/
 	
 }
/deep/ table{
 	width: auto !important;
 }
/deep/ .el-table__header{
 	width: auto !important;
 }
.grayLine{
	margin-top: 0px;
}
</style>

