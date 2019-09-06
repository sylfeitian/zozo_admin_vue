<template>
  <div>
		  <el-table
			  	:data="dataList"
			  	ref='dataList'
			  	border
			  	style="width: 100%"
			  	v-loading="dataListLoading">
				<el-table-column
				    prop="rateGetDate"
				    label="日期"
				    align="center">
				</el-table-column>
				<el-table-column
				    prop="rate"
				    label="汇率"
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
  </div>
</template>

<script>
//import list from "./list.vue"
import mixinViewModule from '@/mixins/view-module'
import { gethistoryRate } from '@/api/url'
  
export default {
  	mixins: [mixinViewModule],
	data () {
	    return {
	      mixinViewModuleOptions: {
	          getDataListURL: gethistoryRate,
	          getDataListIsPage: true,
	          // exportURL: '/admin-api/log/login/export',
	          deleteURL: '',
	          dataListLoading: false, 
	          deleteIsBatch: true,
	          deleteIsBatchKey: 'id'
	      },
	      dataForm: {
	      },
	      tableData: [],
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
		init(){
			this.getDataList()
		},
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

