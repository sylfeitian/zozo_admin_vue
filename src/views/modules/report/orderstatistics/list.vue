<template>
  <div>
    <Bread :breaddata="breaddata"></Bread>
	
	<el-form :inline="true" class="grayLine topGapPadding" :model="dataForm" ref="dataForm">
	    <el-form-item label="商品名称：">
	      <el-input v-model.trim="dataForm.goodsName" placeholder="请输入商品名称" clearable></el-input>
	    </el-form-item>
	    <el-form-item label="商品ID：">
	      <el-input v-model.trim="dataForm.spuid" placeholder="请输入spuID" clearable></el-input>
	    </el-form-item>
	     <el-form-item label="店铺名称：">
                <el-select
                v-model="dataForm.storeId"
                filterable
                placeholder="请选择店铺"
                :loading="loadingStore"
                >
                <el-option
                    v-for="(item,index) in selectStoreOption"
                    :key="item.index"
                    :label="item.storeName"
                    :value="item.id"
                ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="品牌名称：">
                <el-select
                v-model="dataForm.brandId"
                filterable
                placeholder="请选择品牌"
                :loading="loadingBrand"
                >
                <el-option
                    v-for="(item,index) in selectBrandOption"
                    :key="item.id"
                    :label="item.brandName"
                    :value="item.id"
                ></el-option>
                </el-select>
		</el-form-item>
	    <el-form-item label="下单时间：">
	      <el-date-picker
		      v-model="valuetime1"
		      type="datetimerange"
		      range-separator="-"
		      start-placeholder="开始日期"
		      end-placeholder="结束日期"
		      value-format="yyyy-MM-dd  HH:mm:ss"
			  :default-time="['00:00:00', '23:59:59']"
		      @blur='acttime1'>
		    </el-date-picker>
	    </el-form-item>   
	    <el-form-item label="完成时间：">
	      <el-date-picker
		      v-model="valuetime2"
		      type="datetimerange"
		      range-separator="-"
		      start-placeholder="开始日期"
		      end-placeholder="结束日期"
		      value-format="yyyy-MM-dd  HH:mm:ss"
			  :default-time="['00:00:00', '23:59:59']"
		      @blur='acttime2'>
		    </el-date-picker>
	    </el-form-item>   
	    
	    
	    <el-form-item label="订单状态：">
        <el-select
          v-model="dataForm.status"
          placeholder="请选择"
          loading-text="加载中···"
          >
		  <!-- @visible-change="getGoodKind2" -->
          <el-option
            v-for="item in statusList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
	    </el-form-item>
	    
	    <el-form-item label="订单类型：">
        <el-select
          v-model="dataForm.orderType"
          placeholder="请选择"
          loading-text="加载中···"
         >
		  <!-- @visible-change="getGoodKind2" -->
          <el-option
            v-for="item in orderTypeList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
	    </el-form-item>
	    
			<el-form-item>
			  <el-button  class="btn" type="primary" @click="getData()">查询</el-button>
			  <el-button   class="btn"  @click="reset('dataForm')" type="primary" plain>重置</el-button>
			</el-form-item>
			<br />
			
	</el-form>
		<el-form>
      	<el-form-item>
	    	<!-- <el-button  class="btn" type="primary" plain @click="artaddmassage()">导出数据</el-button> -->
			<importAndExport :btType="'primary'" :downType="2" :importAndExportOptions="importAndExportOptions" :dataForm="dataForm"  @getDataList="getDataList"></importAndExport>
	  	</el-form-item>
    </el-form>
	<el-table
	  	:data="dataList"
	  	ref='dataList'
	  	border=""
	  	style="width: 100%"
	  	v-loading="dataListLoading"
	  	@selection-change="dataListSelectionChangeHandle">	  
		<el-table-column
		    prop="orderSn"
		    label="订单号"
			align="center">
		</el-table-column>
		<el-table-column
		    prop="orderSnJp"
		    label="日方发货订单号"
				align="center">
			<template slot-scope="scope">
				{{scope.row.orderSnJp || '/'}}
			</template>

		</el-table-column>
		<el-table-column
		    prop="orderType"
		    label="订单类型"
			align="center">
			<template slot-scope="scope">
				<span v-if="scope.row.orderType =='bc'">BC</span>
				<span v-else-if="scope.row.orderType =='cc'">CC</span>
			</template>
		</el-table-column>
		
		<el-table-column
		    prop="orderStatus"
		    label="订单状态"
			align="center">
				<template slot-scope="scope">
					<!-- 待付款 -->
					<!-- <span v-if="scope.row.orderStatus==10">待付款</span> -->
						<!-- 待发货 -->
					<span v-if="scope.row.orderStatus==30">待审核</span>
					<span v-else-if="scope.row.orderStatus==20">付款中</span>
					<span v-else-if="scope.row.orderStatus==35">审核未通过</span>
					<span v-else-if="scope.row.orderStatus==40">lakala申报中</span>
					<span v-else-if="scope.row.orderStatus==50">lakala申报失败</span>
					<span v-else-if="scope.row.orderStatus==60">待日方发货</span>
					<!-- 待收货 -->
					<span v-else-if="scope.row.orderStatus==70">日方取消订单</span>
					<span v-else-if="scope.row.orderStatus==80">JD申报中</span>
					<span v-else-if="scope.row.orderStatus==90 || scope.row.orderStatus==100">JD申报失败</span>
					<span v-else-if="scope.row.orderStatus==110">清关中</span>
					<span v-else-if="scope.row.orderStatus==120">清关失败</span>
					<span v-else-if="scope.row.orderStatus==130">待收货</span>
					<!-- 已完成 -->
					<span v-else-if="scope.row.orderStatus==140">交易完成</span>
					<span v-else-if="scope.row.orderStatus==0">已取消</span>
				</template>
		</el-table-column>
		<el-table-column
		    prop="createDate"
		    label="下单时间"
			align="center">
		</el-table-column>
		<el-table-column
		    prop="finishDate"
		    label="完成时间"
			align="center">
			<template slot-scope="scope">
				{{scope.row.finishDate || '/'}}
			</template>
		</el-table-column>
		<el-table-column
		    prop="payType"
		    label="支付方式"
			align="center">
		</el-table-column>
		<el-table-column
		    prop="orderAmount"
		    label="订单支付金额"
				align="center">
		</el-table-column>
		<el-table-column
		    prop="memberName"
		    label="会员账号"
				align="center">
		</el-table-column>
		<el-table-column
		    prop="skuid"
		    label="SKUID"
				align="center">
		</el-table-column>
		<el-table-column
		    prop="goodsName"
		    label="商品名称"
				align="center">
		</el-table-column>
		<el-table-column
		    prop="spuid"
		    label="商品ID（SPU）"
				align="center">
		</el-table-column>
		<el-table-column
		    prop="storeName"
		    label="店铺"
				align="center">
		</el-table-column>
		<el-table-column
		    prop="brandName"
		    label="品牌"
				align="center">
		</el-table-column>
		<el-table-column
		    prop="goodsNum"
		    label="数量"
				align="center">
		</el-table-column>
		<el-table-column
		    prop="sellPrice"
		    label="商品售价"
				align="center">
		</el-table-column>
		<el-table-column
		    prop="realSalePrice"
		    label="商品实付金额"
				align="center">
		</el-table-column>
		<el-table-column
		    prop="declareSn"
		    label="申报单号"
				align="center">
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
  </div>
</template>

<script>
//import list from "./list.vue"
import mixinViewModule from '@/mixins/view-module'
import { statisticsOrderPage } from '@/api/url'
import { statisticsOrderExport } from '@/api/io'
import Bread from "@/components/bread";
  import importAndExport from "@/components/import-and-export"
   import {searchStoreName,searchBrandName} from "@/api/api";
  
export default {
  	mixins: [mixinViewModule],
	data () {
	    return {
		   importAndExportOptions:{
				// importUrl:colorImportExcel,//导入接口
				// importWord:"导入信息",
				exportUrl:statisticsOrderExport,//导出接口
				exportWord:"导出数据",
		  },
		  mixinViewModuleOptions: {
	          getDataListURL: statisticsOrderPage,
	          getDataListIsPage: true,
	          // exportURL: '/admin-api/log/login/export',
	        //   deleteURL: messagedelete,
	        //   dataListLoading: false, 
	        //   deleteIsBatch: true,
	        //   deleteIsBatchKey: 'id'
		  },
		  breaddata: ["报表中心", "订单统计"],
	      goodKind2loading:false,
	      goodKind3loading:false,
	      dataForm: {
			goodsName:"",//商品名称
			spuid:"",//商品id
			storeId:"",//	店铺名称
			brandId:'',//品牌名称
			startTime: '',//下单开始时间
			endTime:'',//结束下单时间
			finishStartTime:'',//完成开始时间
			finishEndTime:'',//完成结束时间
			status:'',//30待审核 、35审核未通过、40lakala申报中、50lakala申报失败、60待日方发货、70日方取消订单、80JD申报中、90JD申报失败（无法重试）、100JD申报失败（可以重试）、110清关中、120清关失败 130待收货、140交易完成、0已取消
		 	orderType:'',//订单类型 bc cc 
		  },
		  tableData: [],
		  statusList:[
			{ id: '', name: "全部" },
			{ id: "30", name: "待审核" },
			{ id: "35", name: "审核未通过" },
			{ id: "40", name: "lakala申报中" },
			{ id: "50", name: "lakala申报失败" },
			{ id: "60", name: "待日方发货" },
			{ id: "70", name: "日方取消订单" },
			{ id: "80", name: "JD申报中" },
			{ id: "100", name: "JD申报失败" },
			{ id: "110", name: "清关中、" },
			{ id: "120", name: "清关失败" },
			{ id: "130", name: "待收货、" },
			{ id: "140", name: "交易完成" },
			{ id: "0", name: "已取消" }
		  ],
	      orderTypeList: [
			  { id: '', name: "全部" },
			  { id: "bc", name: "BC" },
			  { id: "cc", name: "CC" }
			],
	      activeName: "first",
	      valuetime1: '',
		  valuetime2: '',
		  loadingStore:false,
		  loadingBrand:false,
		  selectStoreOption: [],
		  selectBrandOption: []
	    };
	},
	created() {
		 this.getStoreList();// 获取店铺下拉
		this.getBrandList();// 获取品牌下拉
	},
	components: {
	 Bread,
	 importAndExport
	},
	watch:{
		 "dataForm.spuid": function(newV, oldV) {
			for (let i = 0; i < newV.length; i++) {
				if (!/[a-zA-Z0-9\s]/.test(newV[i])) {
				this.dataForm.spuid = newV.replace(newV[i], "");
				}
			}
			if(newV.length>30){
				this.dataForm.spuid = newV.substr(0,30)
			}
		},
	},
	methods: {
		getData(){
			if(this.valuetime1 && this.valuetime1.length==2){
				this.dataForm.startTime = this.valuetime1[0] || '';
				this.dataForm.endTime = this.valuetime1[1] || '';
			}else{
				this.dataForm.startTime = "";
				this.dataForm.endTime = "";
			}
			if(this.valuetime2 && this.valuetime2.length==2){
				this.dataForm.finishStartTime = this.valuetime2[0] || '';
				this.dataForm.finishEndTime = this.valuetime2[1] || '';
			}else{
				this.dataForm.finishStartTime = "";
				this.dataForm.finishEndTime = "";
			}
			this.page = 1
			this.getDataList();
		},
	
		//开始结束时间
		acttime1(){
			this.dataForm.strTime = this.valuetime1[0] || '';
			this.dataForm.endTime = this.valuetime1[1] || '';
		},
		//开始结束时间
		acttime2(){
			this.dataForm.strTime = this.valuetime2[0] || '';
			this.dataForm.endTime = this.valuetime2[1] || '';
		},
		//跳转站内信
		artaddmassage(){
			this.$router.push({	name: "content-informationmanage-informationupdata"})
		},
		// 获取店铺下拉
		getStoreList(){
			this.loadingStore = true;
			searchStoreName().then(res => {
				this.loadingStore = false;
				if (res.code == 200) {
					this.selectStoreOption = res.data;
				}
			});
		},
		// 获取品牌下拉
		getBrandList(){
			this.loadingBrand= true;
			searchBrandName().then(res => {
					this.loadingBrand= false;
				if (res.code == 200) {
					this.selectBrandOption = res.data;
				}
			});
		},
		// 重置
		reset(dataForm) {
			this.dataForm.startTime = "";
			this.dataForm.endTime = "";
			this.dataForm.finishStartTime = "";
			this.dataForm.finishEndTime = "";
			this.valuetime1 = '';
			this.valuetime2 = '';
			this.dataForm.goodsName = '';
			this.dataForm.spuid = '';
			this.dataForm.storeId = '';
			this.dataForm.brandId = '';
			this.dataForm.status = '';
			this.dataForm.orderType = '';
			this.page = 1
			this.getDataList();
		},

	}
};
</script>
<style lang="scss" scoped>
/* .el-scrollbar__wrap {
  overflow-x: hidden;
} */
@import "@/element-ui/theme-variables.scss";
// 表头背景和字体颜色
/deep/ .el-table__header  th{
  background:#f5f7fa;
}
.el-scrollbar .el-scrollbar__wrap .el-scrollbar__view {
  white-space: nowrap;
}
*::-webkit-scrollbar {
  width: 7px;
  height: 1px;
  background-color: transparent;
} /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
*::-webkit-scrollbar-track {
  background-color: #f0f6ff;
} /*定义滚动条轨道 内阴影+圆角*/
*::-webkit-scrollbar-thumb {
  background-color: #e3e4e4;
  border-radius: 6px;
} /*定义滑块 内阴影+圆角*/
.scrollbarHide::-webkit-scrollbar {
  display: none;
}
.scrollbarShow::-webkit-scrollbar {
  display: block;
}

.el-input {
  width: 170px;
  height: 40px;
}
/deep/ .el-tabs__nav-wrap {
  border-bottom: 2px #efefef dotted;
  &::after {
    content: unset;
  }
}
/deep/ .el-tabs__nav-scroll {
  height: 60px;
  line-height: 60px;
  /deep/ .el-tabs__item {
    width: 120px;
    // box-sizing: border-box;
    text-align: center;
  }
}
/deep/ .el-tabs__active-bar {
  // width: 120px !important;
}

.grayBtn {
}

//
  .btn{
  	width: auto;
  }
</style>

