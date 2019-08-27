<template>
  <div>
  	<Bread :breaddata="breaddata" ></Bread>
		<el-table
		  	:data="dataList"
		  	ref='dataList'
		  	border
		  	style="width: 100%"
		  	v-loading="dataListLoading">
			<el-table-column
			    prop="storeName"
			    label="推送类型"
			    align="center">
			    <template slot-scope="scope">
			        <span style="margin-left: 10px">{{ "推送类型" }}</span>
			    </template>
			</el-table-column>
			<el-table-column
			    prop="account"
			    label="站内信"
			    align="center">
			    <template slot-scope="scope">
			        <el-switch
					  v-model="value2"
					  active-color="#13ce66"
					  inactive-color="#ff4949">
					</el-switch>
					<span class="artblue">模板设置</span>
			    </template>
			</el-table-column>
			<el-table-column
			    prop="createDate"
			    label="APP推送"
			    align="center">
			</el-table-column>
			<el-table-column
			    prop="gradeName"
			    label="短信 "
			    align="center">
			</el-table-column>
		</el-table>
			
   </div>
  </div>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import Bread from "@/components/bread";
import { getmessagepage, addmessagevipshop } from '@/api/url'
  
export default {
  	mixins: [mixinViewModule],
	data () {
	    return {
	      mixinViewModuleOptions: {
	          getDataListURL: getmessagepage,
	          getDataListIsPage: true,
	          // exportURL: '/admin-api/log/login/export',
	          deleteURL: '',
	          dataListLoading: false, 
	          deleteIsBatch: true,
	          deleteIsBatchKey: 'id'
	      },
	      breaddata: ["消息中心", "系统消息设置"],
	      goodKind2loading:false,
	      goodKind3loading:false,
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
		Bread
	},
	mounted() {
	},
	methods: {}
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
.artblue{
	color: blue;
}
</style>

