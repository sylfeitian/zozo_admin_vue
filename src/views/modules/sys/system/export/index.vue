<template>
  <div>
    <Bread :breaddata="breaddata"></Bread>
    <el-table
	  :data="dataList"
      v-loading="dataListLoading"
      border
	  style="width: 100%;margin-top: 10px;">
		<el-table-column
		    prop="name"
		    label="任务名称"
		    width="180"
			align="center">
			<template slot-scope="scope">
				<div :title="scope.row.name">
					{{scope.row.name}}
				</div>
			</template>
		</el-table-column>
		<el-table-column
		    prop="createDate"
		    label="操作时间"
            width="280"
			align="center">
			<template slot-scope="scope">
				<div>
					{{scope.row.getStartTime}}
				</div>
			</template>
		</el-table-column>
		<el-table-column
		    prop="createDate"
		    label="完成时间"
            width="280"
			align="center">
			<template slot-scope="scope">
				<div>
					{{scope.row.getStartTime}}
				</div>
			</template>
		</el-table-column>
		<el-table-column
		    prop="type"
		    label="操作人"
			align="center">
			<template slot-scope="scope">
				<div>
					{{scope.row.admin}}
				</div>
			</template>
		</el-table-column>
        <el-table-column
		    prop="state"
		    label="状态"
			align="center">
			<template slot-scope="scope">
				<el-tag v-if="scope.row.state==0" type="info">未开始</el-tag>
				<el-tag v-if="scope.row.state==1" type="success">进行中</el-tag>
				<el-tag v-if="scope.row.state==2" type="warning">已结束</el-tag>
			</template>
		</el-table-column>
	    <el-table-column
	   		prop="address"
	    	label="操作"
			align="center"
			width="250">
			<template slot-scope="scope">
				<el-button type="text" size="small" @click="showDetail(scope.row)">下载</el-button>
                <el-button @click.native.prevent="detailHandle(scope.$index, scope.row)"type="text"size="mini">查看详情</el-button>
			</template>
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
    <!-- 弹窗, 查看 -->
    <detailData  v-if="detailDataVisible" ref="detailDataCompon" @searchDataList="getDataList"></detailData>
  </div>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import { activityPage, deleteActivity } from '@/api/url'
import { storeGrade } from '@/api/api'
import Bread from "@/components/bread";
import detailData from './model-detail-data'

export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
          getDataListURL: activityPage,
          getDataListIsPage: true,
          exportURL: '/admin-api/store/export',
          deleteURL: deleteActivity,
          deleteIsBatch: false,
          deleteIsBatchKey: 'id'
      },
      dataForm: {
      	type:null,
      	state:null,
      	auditState:null
      },
      breaddata: ["系统设置", "导出管理"],
      valuetime:"",
      detailDataVisible:false,
    }
  },
  components:{
      Bread,
      detailData
  },
  created(){
  },
  methods: {
	  getData () {
		  this.page =1;
		  this.getDataList();
	  },
	  
        showDetail(id){
	    	this.$emit("showDetail",id);
        },
        reset() {
            this.dataForm.getStartTime =  '';
			this.dataForm.getEndTime = '';
			this.dataForm.name = '';
			this.dataForm.type = '';
			this.dataForm.state = '';
			this.dataForm.auditState  =""
            this.valuetime = '',
            this.getDataList();
        },
        // 新建和编辑
        detailHandle(index=-1,row=""){
            this.setDetailDataVisible(true);
            this.$nextTick(() => {
                this.$refs.detailDataCompon.init(row)
            })
        },
        setDetailDataVisible(boolargu){
            this.detailDataVisible =  boolargu;
        },
		deleteHandleLocal(row){
			this.deleteHandle(row.id);
		},
  }
};
</script>
<style lang="scss" scoped>
.cell div{
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	overflow: hidden;
}

</style>
