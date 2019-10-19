<template>
  <div>
    <Bread :breaddata="breaddata"></Bread>
	
	<el-form :inline="true" class="grayLine topGapPadding" :model="dataForm" ref="dataForm" @keyup.enter.native="getDataList()" >
	    <el-form-item label="商品名称：">
	      <el-input v-model.trim="dataForm.messageTitle" placeholder="请输入商品名称" clearable></el-input>
	    </el-form-item>
	    <el-form-item label="商品ID：">
	      <el-input v-model.trim="dataForm.messageTitle" placeholder="请输入spuID" clearable></el-input>
	    </el-form-item>
	    <el-form-item label="店铺名称：">
	      <el-input v-model.trim="dataForm.messageTitle" placeholder="请输入店铺名称" clearable></el-input>
	    </el-form-item>
	    <el-form-item label="品牌名称：">
	      <el-input v-model.trim="dataForm.messageTitle" placeholder="请输入品牌名称" clearable></el-input>
	    </el-form-item>
	    <el-form-item label="下单时间：">
	      <el-date-picker
		      v-model="valuetime1"
		      type="daterange"
		      range-separator="-"
		      start-placeholder="开始日期"
		      end-placeholder="结束日期"
		      value-format="yyyy-MM-dd"
		      @blur='acttime1'>
		    </el-date-picker>
	    </el-form-item>   
	    <el-form-item label="完成时间：">
	      <el-date-picker
		      v-model="valuetime2"
		      type="daterange"
		      range-separator="-"
		      start-placeholder="开始日期"
		      end-placeholder="结束日期"
		      value-format="yyyy-MM-dd"
		      @blur='acttime2'>
		    </el-date-picker>
	    </el-form-item>   
	    
	    
	    <el-form-item label="订单状态：">
        <el-select
          v-model="dataForm.messageType"
          placeholder="请选择"
          loading-text="加载中···"
          @visible-change="getGoodKind2">
          <el-option
            v-for="item in goodKindList1"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
	    </el-form-item>
	    
	    <el-form-item label="订单类型：">
        <el-select
          v-model="dataForm.messageType"
          placeholder="请选择"
          loading-text="加载中···"
          @visible-change="getGoodKind2">
          <el-option
            v-for="item in goodKindList1"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
	    </el-form-item>
	    
			<el-form-item>
			  <el-button  class="btn" type="primary" @click="getDataList()">查询</el-button>
			  <el-button   class="btn"  @click="reset('dataForm')" type="primary" plain>重置</el-button>
			</el-form-item>
			<br />
			
	</el-form>
		<el-form>
      	<el-form-item>
	    	<el-button  class="btn" type="primary" plain @click="artaddmassage()">导出数据</el-button>
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
		    prop="messageTitle"
		    label="订单号"
				align="center">
		</el-table-column>
		<el-table-column
		    prop="messageTitle"
		    label="日方发货订单号"
				align="center">
		</el-table-column>
		<el-table-column
		    prop="messageTitle"
		    label="订单类型"
				align="center">
		</el-table-column>
		
		<el-table-column
		    prop="messageTitle"
		    label="订单状态"
				align="center">
		</el-table-column>
		<el-table-column
		    prop="messageTitle"
		    label="下单时间"
				align="center">
		</el-table-column>
		<el-table-column
		    prop="messageTitle"
		    label="完成时间"
				align="center">
		</el-table-column>
		<el-table-column
		    prop="messageTitle"
		    label="支付方式"
				align="center">
		</el-table-column>
		<el-table-column
		    prop="messageTitle"
		    label="订单支付金额"
				align="center">
		</el-table-column>
		<el-table-column
		    prop="messageTitle"
		    label="会员账号"
				align="center">
		</el-table-column>
		<el-table-column
		    prop="messageTitle"
		    label="SKUID"
				align="center">
		</el-table-column>
		<el-table-column
		    prop="messageTitle"
		    label="商品名称"
				align="center">
		</el-table-column>
		<el-table-column
		    prop="messageTitle"
		    label="商品ID（SPU）"
				align="center">
		</el-table-column>
		<el-table-column
		    prop="messageTitle"
		    label="店铺"
				align="center">
		</el-table-column>
		<el-table-column
		    prop="messageTitle"
		    label="品牌"
				align="center">
		</el-table-column>
		<el-table-column
		    prop="messageTitle"
		    label="数量"
				align="center">
		</el-table-column>
		<el-table-column
		    prop="messageTitle"
		    label="商品售价"
				align="center">
		</el-table-column>
		<el-table-column
		    prop="messageTitle"
		    label="商品实付金额"
				align="center">
		</el-table-column>
		<!--<el-table-column
		    prop="createDate"
				align="center"
				width="180"
		    label="发送时间">
		</el-table-column>
		<el-table-column
		    prop="messageType"
				align="center"
		    label="信息类型"
				width="120"
		    :formatter="formatmessageType">
		</el-table-column>-->
		
  	<!--<el-table-column
   		prop="address"
			 align="center"
			 width="140"
    	label="操作">
	    <template slot-scope="scope">
	    	<el-button type="text" size="small" @click="showDetail(scope.row)">查看</el-button>
 				<el-button class="artdanger" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
	    </template>
  	</el-table-column>-->
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
import { informationsee,messagedelete } from '@/api/url'
import Bread from "@/components/bread";

  
export default {
  	mixins: [mixinViewModule],
	data () {
	    return {
	      mixinViewModuleOptions: {
	          getDataListURL: informationsee,
	          getDataListIsPage: true,
	          // exportURL: '/admin-api/log/login/export',
	          deleteURL: messagedelete,
	          dataListLoading: false, 
	          deleteIsBatch: true,
	          deleteIsBatchKey: 'id'
				},
				breaddata: ["报表中心", "订单统计"],
	      goodKind2loading:false,
	      goodKind3loading:false,
	      dataForm: {
					messageTitle:'',
					messageType:'',
					strTime: '',
					endTime:'',
	      },
	      tableData: [],
	      goodKindList1: [{ id: '', name: "全部" },{ id: 1, name: "系统信息" },{ id: 0, name: "私信" }],
	      activeName: "first",
	      valuetime1: '',
	      valuetime2: '',
	    };
	},
	created() {
		this.dataForm.messageType = this.goodKindList1[0].id;
	},
	components: {
	 Bread
	},
	watch:{
	},
	methods: {
	//  getDataList() {},
	    reset(dataForm) {
	    	this.$refs[dataForm].resetFields();
	    	this.dataForm.messageTitle = '';
	    	this.dataForm.messageType = this.goodKindList1[0].id;
	    	this.dataForm.strTime = '';
	    	this.dataForm.endTime = '';
	    	this.valuetime = '';
	    },
	    getGoodKind2() {},
	    getGoodKind3() {},
	    handleClick(tab, event) {
	      console.log(tab.name);
	    },
	    showDetail(row){
	    	this.$emit("showDetail",row);
	    },
	    //信息类型
	    formatmessageType(row, column){
	    	return row.messageType == 1 ? '系统信息' : '私信';
	    },
	    //发送的方式
	    formatsendMode(row, column){
	    	return row.sendMode  == 0 ? '站内信' : row.sendMode == 1 ? '短信' : row.sendMode == 2 ? '微信' : '邮件';
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

