<template>
  <div>
    <Bread :breaddata="breaddata"></Bread>
	
	<el-form :inline="true" class="grayLine topGapPadding" :model="dataForm" ref="dataForm" @keyup.enter.native="getDataList()" >
	    <el-form-item label="输入搜索：">
	      <el-input v-model="dataForm.messageTitle" placeholder="信息标题名称" clearable></el-input>
	    </el-form-item>
	    <el-form-item label="信息类型：">
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
	    <el-form-item label="发送时间：">
	      <el-date-picker
		      v-model="valuetime"
		      type="daterange"
		      range-separator="-"
		      start-placeholder="开始日期"
		      end-placeholder="结束日期"
		      value-format="yyyy-MM-dd"
		      @blur='acttime'>
		    </el-date-picker>
	    </el-form-item>   
			<el-form-item>
			  <el-button  class="btn" type="primary" @click="getDataList()">搜索</el-button>
			  <el-button   class="btn"  @click="reset('dataForm')" type="primary" plain>重置</el-button>
			</el-form-item>
			<br />
			
	</el-form>
		<el-form>
      	<el-form-item>
	    	<el-button  class="btn" type="primary" @click="artaddmassage()">新增站内信</el-button>
	    	<el-button class="btn" @click='deleteHandle()' type="danger" plain>批量删除</el-button>
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
	      type="selection"
				align="center"
	      width="70">
	  </el-table-column>
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
		    prop="messageTitle"
		    label="信息标题"
				align="center">
		</el-table-column>
		<el-table-column
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
		</el-table-column>
		<el-table-column
		    prop="sendMode"
		    label="发送方式"
				align="center"
				width="100"
		    :formatter="formatsendMode">
		</el-table-column>
		<el-table-column
		    prop="creator"
				align="center"
		    label="发送人">
		</el-table-column>
  	<el-table-column
   		prop="address"
			 align="center"
			 width="140"
    	label="操作">
	    <template slot-scope="scope">
	    	<el-button type="text" size="small" @click="showDetail(scope.row)">查看</el-button>
 				<el-button class="artdanger" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
	    </template>
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
				breaddata: ["内容", "站内信管理", "站内信列表"],
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
	      valuetime: '',
	      params:{
	      "currentPage": 1, //当前页数
	      "currentPageSize" : 10, //每页显示的条数
	      },
	    };
	},
	created() {
		this.dataForm.messageType = this.goodKindList1[0].id;
	},
	components: {
	 Bread
	},
	watch:{
		valuetime(val){
	      if(!val){
	      	this.dataForm.strTime = '';
	    	this.dataForm.endTime = '';
	      }
	    }
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
	    // 每页数
		sizeChangeHandle (val) {
			this.params.currentPageSize = val;
			this.params.currentPage = 1;
			this.limit = val;
			this.getDataList();
		},
		// 当前页
		currentChangeHandle (val) {
			this.params.currentPage = val;
			this.page = val;
			this.getDataList();
		},
    //开始结束时间
    acttime(){
    	this.dataForm.strTime = this.valuetime[0];
    	this.dataForm.endTime = this.valuetime[1];
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

