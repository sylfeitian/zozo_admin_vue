<template>
  <div>
    <Bread :breaddata="breaddata"></Bread>
    <el-form :inline="true" class="grayLine topGapPadding" :model="dataForm" @keyup.enter.native="getDataList()" >
        <el-form-item label="优惠券名称：">
            <el-input v-model="dataForm.name" placeholder="请输入优惠券名称" clearable></el-input>
        </el-form-item>
        <el-form-item  label="优惠券类型：">
            <el-select v-model="dataForm.type" clearable  placeholder="请选择">
                <el-option
                    v-for="item in couponKindList1"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item  label="活动状态：">
            <el-select v-model="dataForm.state" clearable  placeholder="请选择">
                <el-option
                    v-for="item in activitesstates"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
         <el-form-item label="上传日期：">
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
        <el-form-item  label="审核状态：">
            <el-select v-model="dataForm.auditState" clearable  placeholder="请选择">
                <el-option
                    v-for="item in storeTypes"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        <!-- </el-scrollbar> -->
        <el-form-item>
            <el-button class="btn" type="primary" @click="getData()">查询</el-button>
            <el-button class="btn" type="primary" plain @click="reset()" plain>重置</el-button>
        </el-form-item>
        <br />
        <el-form-item>
            <el-button type="primary"   @click="addCoupon()">新增优惠券</el-button>
            <!-- <el-button type="primary"   @click="showDetail('asassasasasasa')">新增优惠券</el-button> -->
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
		    prop="name"
		    label="优惠券名称"
		    width="180"
			align="center">
		</el-table-column>
		<el-table-column
		    prop="type"
		    label="优惠券类型"
			align="center">
			<template slot-scope="scope">
				<el-tag v-if="scope.row.type==0" type="info">普通优惠券</el-tag>
				<el-tag v-if="scope.row.type==1" type="success">新人专享券</el-tag>
				<el-tag v-if="scope.row.type==2" type="warning">积分兑换券</el-tag>
			</template>
		</el-table-column>
		<el-table-column
		    prop="threshold"
		    label="使用门槛"
			align="center">
		</el-table-column>
		<el-table-column
		    prop="faceValue"
		    label="面值"
			align="center">
			<template slot-scope="scope">
				<div class="price1">￥{{scope.row.faceValue?scope.row.faceValue:'0.00'}}</div>
			</template>
		</el-table-column>
		<el-table-column
		    prop="createDate"
		    label="活动时间"
             width="180"
			align="center">
			<template slot-scope="scope">
				<div>
					{{scope.row.getStartTime}}
					<span>~</span>
					{{scope.row.getEndTime}}
				</div>
			</template>
		</el-table-column>
        <el-table-column
		    prop="creator"
		    label="有效期"
			align="center">
            <template slot-scope="scope">
		    	<span v-if="scope.row.validityPeriodType==0">{{scope.row.startTime}}~{{scope.row.endTime}}</span>
				<span v-if="scope.row.validityPeriodType==1">{{scope.row.validityDays}}</span>
		    </template>
		</el-table-column>
        <el-table-column
		    prop="auditState"
		    label="审核状态"
			align="center">
			<template slot-scope="scope">
				<el-tag v-if="scope.row.auditState==0" type="info">未审核</el-tag>
				<el-tag v-if="scope.row.auditState==1" type="success">审核通过</el-tag>
				<el-tag v-if="scope.row.auditState==2" type="warning">审核未通过</el-tag>
			</template>
		</el-table-column>
        <el-table-column
		    prop="state"
		    label="活动状态"
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
<!--		    <template slot-scope="scope">-->
<!--		    	<el-button type="text" size="small" @click="showDetail(scope.row.id)">查看</el-button>-->
<!--		    	<el-button type="text" size="small" @click="addCoupon(scope.row.id,'普通优惠券')" v-if="scope.row.auditState==0 || scope.row.auditState==1 && scope.row.state==0 || scope.row.auditState==2 && scope.row.state==0">编辑</el-button>-->
<!--		    	<el-button class="artdanger" type="text" size="small" @click="deleteHandle(scope.row.id)" v-if="scope.row.auditState==2">删除</el-button>-->
<!--				<el-button type="text" size="small" @click="" v-if="scope.row.state==1">停止</el-button>-->
<!--				<el-button type="text" size="small" @click="" v-if="scope.row.auditState==0">审核</el-button>-->
<!--		    </template>-->
			<template slot-scope="scope">
				<el-button type="text" size="small" @click="showDetail(scope.row.id)">查看</el-button>
				<el-button type="text" size="small" @click="addCoupon(scope.row.id,'普通优惠券')">编辑</el-button>
				<el-button class="artdanger" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
				<el-button type="text" size="small" @click="">停止</el-button>
				<el-button type="text" size="small" @click="">审核</el-button>
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
import { activityPage, deleteActivity } from '@/api/url'
import { storeGrade } from '@/api/api'
import Bread from "@/components/bread";
  
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
          getDataListURL: activityPage,
          getDataListIsPage: true,
          exportURL: '/admin-api/store/export',
          deleteURL: deleteActivity,
          deleteIsBatch: true,
          deleteIsBatchKey: 'id'
      },
      dataForm: {},
      storeTypes:[
		  {id: '',label: '全部'},
          {id: '0',label: '未审核'},
          {id: '1',label: '审核通过'},
          {id: '2',label: '审核未通过'}
      ],
      couponKindList1: [{ id: '', name: "全部" },{ id: 0, name: "普通优惠券" },{ id: 1, name: "新人专享券" },{ id: 3, name: "积分兑换券" }],
      activitesstates: [{ id: '', name: "全部" },{ id: 0, name: "未开始" },{ id: 1, name: "进行中" },{ id: 2, name: "已结束" }],
      breaddata: ["营销管理", "优惠券"],
      valuetime:"",
    }
  },
  components:{
  	Bread
  },
  created(){
  	this.dataForm.type = this.couponKindList1 && this.couponKindList1[0].id;
  	this.dataForm.state = this.activitesstates && this.activitesstates[0].id;
  	this.dataForm.auditState = this.storeTypes && this.storeTypes[0].id;
    this.demo();
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
            this.dataForm = {};
            this.getDataList();
        },
        addCoupon(id){
            if(id){
        	    this.$emit('artcoupon',id,'普通优惠券')//编辑优惠券
            }else{
        	    this.$emit('artcoupon')//新增优惠券
            }
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
		    	this.dataForm.getStartTime = this.valuetime[0];
		    	this.dataForm.getEndTime = this.valuetime[1];
		    },
        
  }
};
</script>
<style lang="scss" scoped>
.el-input {
  width: 170px;
  height: 40px;
}
</style>
