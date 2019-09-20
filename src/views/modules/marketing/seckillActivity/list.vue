<template>
  <div>
    <Bread :breaddata="breaddata"></Bread>
    <el-form :inline="true" class="grayLine topGapPadding" :model="dataForm" @keyup.enter.native="getDataList()" >
        <el-form-item  label="活动状态：">
            <el-select v-model="dataForm.gradeId" clearable  placeholder="请选择">
                <el-option
                    v-for="item in activitesstates"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="活动时间：">
            <el-date-picker
                v-model="valuetime"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                @blur='acttime'>
			</el-date-picker>
		    </el-form-item>
        <el-form-item>
            <el-button  class="btn" type="primary" @click="getData()">搜索</el-button>
            <el-button class="btn"  type="primary" plain @click="reset()" plain>重置</el-button>
        </el-form-item>
        <el-form-item style="float:right">
            <el-button type="primary" @click="totimeList()">秒杀时间段列表</el-button>
            <!-- <el-button type="primary" @click="showDetail('31313121212')">添加活动</el-button> -->
        </el-form-item>
    </el-form>
    <el-table
	  :data="dataList"
      v-loading="dataListLoading"
      border
	  style="width: 100%">
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
		    prop="id"
		    label="活动场次"
		    width="180">
		</el-table-column>
        <el-table-column
		    prop="account"
		    label="审核状态">
		</el-table-column>
		<el-table-column
		    prop="account"
		    label="活动状态">
		</el-table-column>
		<el-table-column
		    prop="gradeName"
		    label="秒杀时间段">
		</el-table-column>
	    <el-table-column
	   		prop="address"
	    	label="操作">
		    <template slot-scope="scope">
		    	<el-button type="text" size="small">审核</el-button>
		    	<el-button class="artdanger" type="text" size="small" @click="toAddList(scope.row.id)">添加商品</el-button>
		    	<el-button type="text" size="small" @click="showDetail(scope.row.id)">查看商品</el-button>
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
  </div>
</template>

<script>
    import mixinViewModule from '@/mixins/view-module'
    import { businessPageUrl } from '@/api/url'
    import { storeGrade } from '@/api/api'
    import Bread from "@/components/bread";
    
    export default {
    mixins: [mixinViewModule],
    components:{Bread},
    data () {
        return {
            mixinViewModuleOptions: {
                getDataListURL: businessPageUrl,
                getDataListIsPage: true,
                exportURL: '/admin-api/store/export',
                deleteURL: '/admin-api/store',
                deleteIsBatch: true,
                // deleteIsBatchKey: 'id'
            },
            buttonStatus:false,
            dataForm: {
                gradeId:'',
            },
            activitesstates: [{ id: '', name: "全部" },{ id: 1, name: "未开始" },{ id: 2, name: "进行中" },{ id: 3, name: "已结束" },{ id: 4, name: "待审核" }],
            breaddata: ["营销管理", "秒杀活动"],
            valuetime:"",
        }
    },
    created(){
        this.demo();
    },
    methods: {
		getData () {
			this.page =1;
			this.getDataList();
		},
            //回调跳到查看页面
            showDetail(id){
                this.$emit("detailistFun",id);
            },
            //回调跳到时间段列表页面
            totimeList(){
                this.$emit("timelistFun");
            },
            //回调跳到添加商品页面
            toAddList(id){
                this.$emit("addlistFun",id);
            },
            //重置
            reset() {
                this.dataForm = {};
                this.getDataList();
            },

            demo(){
                function placeholderPic(){
                    var w = document.documentElement.offsetWidth;
                    document.documentElement.style.fontSize=w/20+'px';
                }
                    placeholderPic();
                window.onresize=function(){
                    placeholderPic();
                }
            },
            //开始结束时间
            acttime(){
                this.dataForm.strTime = this.valuetime[0];
                this.dataForm.endTime = this.valuetime[1];
            },
            
    }
    };
</script>
<style lang="scss" scoped>
.el-input {
  width: 170px;
  height: 40px;
}
.activiDialog{
    .el-input {
        width: 300px;
    }
}

</style>
