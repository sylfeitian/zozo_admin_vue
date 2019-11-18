<template>
  <div>
    <Bread :breaddata="breaddata"></Bread>
    <el-table
	  :data="dataList"
      v-loading="dataListLoading"
      border
	  style="width: 100%;margin-top: 10px;">
		<el-table-column
		    prop="assignmentName"
		    label="任务名称"
		    width="180"
			align="center">
			<template slot-scope="scope">
				<div :title="scope.row.assignmentName">
					{{scope.row.assignmentName}}
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
					{{scope.row.createDate}}
				</div>
			</template>
		</el-table-column>
		<el-table-column
		    prop="finishTime"
		    label="完成时间"
            width="280"
			align="center">
			<template slot-scope="scope">
				<div v-if="scope.row.operationStatus==2">
					{{scope.row.finishTime}}
				</div>
			</template>
		</el-table-column>
		<el-table-column
		    prop="creator"
		    label="操作人"
			align="center">
			<template slot-scope="scope">
				<div>
					{{scope.row.creator}}
				</div>
			</template>
		</el-table-column>
        <el-table-column
		    prop="operationStatus "
		    label="状态"
			align="center">
			<template slot-scope="scope">
				<el-tag v-if="scope.row.operationStatus==0" type="info">失败</el-tag>
				<el-tag v-if="scope.row.operationStatus==1" type="success">进行中</el-tag>
				<el-tag v-if="scope.row.operationStatus==2" type="warning">已完成</el-tag>
				<el-tag v-if="scope.row.operationStatus==3" type="warning">操作失败</el-tag>
			</template>
		</el-table-column>
	    <el-table-column
	   		prop="address"
	    	label="操作"
			align="center"
			width="250">
			<template slot-scope="scope">
				<a v-if="scope.row.operationStatus==2" :href="scope.row.downloadLink" download>
                    <el-button type="text" size="mini">下载</el-button>
                </a>
				<!-- <el-button v-if="scope.row.failureNumber>0" type="text" size="small" @click="download(scope.row)">下载</el-button> -->
                <el-button v-if="scope.row.operationStatus==2" @click.native.prevent="detailHandle(scope.$index, scope.row)" type="text" size="mini" style="margin-left:10px;">查看详情</el-button>
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
import { getsysexportmanagement } from '@/api/url'
import { sysexportmanagementPage } from '@/api/api'
import Bread from "@/components/bread";
import detailData from './model-detail-data'

export default {
	mixins: [mixinViewModule],
	data () {
		return {
			mixinViewModuleOptions: {
				getDataListURL: getsysexportmanagement,
				getDataListIsPage: true,
				exportURL: '',
				deleteURL: '',
				deleteIsBatch: false,
				deleteIsBatchKey: 'id'
			},
			breaddata: ["系统设置", "导出管理"],
			detailDataVisible:false,
      		downloadLink:'',
		}
	},
	components:{
		Bread,
		detailData
	},
	created() {
	},
	methods: {
		getData () {
			this.page =1;
			this.getDataList();
		},
        showDetail(row){
	    	this.$emit("showDetail",row);
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
        }
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
