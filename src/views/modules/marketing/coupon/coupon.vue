<template>
  <div>
    <Bread :breaddata="breaddata"></Bread>
    <el-form :inline="true" class="grayLine topGapPadding" :model="dataForm" @keyup.enter.native="getDataList()" >
        <el-form-item label="优惠券名称：">
            <el-input v-model.trim="dataForm.name" placeholder="请输入优惠券名称" clearable></el-input>
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
         <el-form-item label="活动时间：">
		        <el-date-picker
			        v-model="valuetime"
			        type="datetimerange"
			        align="right"
	      			unlink-panels
							range-separator="-"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							value-format="yyyy-MM-dd HH:mm:ss"
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
            <el-button class="btn" type="primary" @click="getData()">搜索</el-button>
            <el-button class="btn" type="primary" plain @click="reset()" plain>重置</el-button>
        </el-form-item>
    </el-form>
  	<el-form>
	  	<el-button type="primary"   @click="addCoupon()">新增优惠券</el-button>
  	</el-form>
    <el-table
	  :data="dataList"
      v-loading="dataListLoading"
      border
	  style="width: 100%;margin-top: 10px;">
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
			<template slot-scope="scope">
				<div :title="scope.row.name">
					{{scope.row.name}}
				</div>
			</template>

		</el-table-column>
		<el-table-column
		    prop="type"
		    label="优惠券类型"
			align="center">
			<template slot-scope="scope">
				<el-tag v-if="scope.row.type==0" type="info">普通优惠券</el-tag>
				<el-tag v-if="scope.row.type==1" type="success">新会员专享</el-tag>
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
				<span v-if="scope.row.validityPeriodType==1">领取后{{scope.row.validityDays}}天内有效</span>
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
<!--		    	<el-button type="text" size="small" @click="showDetail(scope.row)">查看</el-button>-->
<!--		    	<el-button type="text" size="small" @click="addCoupon(scope.row)" v-if="scope.row.auditState==0 || scope.row.auditState==1 && scope.row.state==0 || scope.row.auditState==2 && scope.row.state==0">编辑</el-button>-->
<!--		    	<el-button class="artdanger" type="text" size="small" @click="deleteHandleLocal(scope.row)" v-if="scope.row.auditState==2">删除</el-button>-->
<!--				<el-button type="text" size="small" @click="showStopModel(scope.row)" v-if="scope.row.state==1">停止</el-button>-->
<!--				<el-button type="text" size="small" @click="showExammine(scope.row)" v-if="scope.row.auditState==0">审核</el-button>-->
<!--		    </template>-->
			<template slot-scope="scope">
				<el-button type="text" size="small" @click="showDetail(scope.row)">查看</el-button>
				<el-button type="text" size="small" v-if="scope.row.state ==0" @click="addCoupon(scope.row)">编辑</el-button>
				<el-button class="artdanger" type="text" size="small"  v-if="scope.row.state ==2&&scope.row.state ==0"  @click="deleteHandleLocal(scope.row)">删除</el-button>
				<el-button type="text" size="small" v-if="scope.row.state ==1" @click="showStopModel(scope.row)">停止</el-button>
				<el-button type="text" size="small" v-if="scope.row.auditState==0" @click="showExammine(scope.row)">审核</el-button>
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
	  <!-- 审核 -->
	  <exammine v-if="exammineVisible" ref="exammineCompon" @searchDataList="getDataList()"></exammine>
	  <!-- 停止 -->
	  <stopModel v-if="stopModelVisible" ref="stopModelCompon" @searchDataList="getDataList()"></stopModel>
  </div>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import { activityPage, deleteActivity } from '@/api/url'
import { storeGrade } from '@/api/api'
import Bread from "@/components/bread";
import exammine from './model-exammine.vue'
import stopModel from './model-stop.vue'

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
      storeTypes:[
		  {id: '',label: '全部'},
          {id: '0',label: '未审核'},
          {id: '1',label: '审核通过'},
          {id: '2',label: '审核未通过'}
      ],
	  stopModelVisible:false,
	  exammineVisible:false,
      couponKindList1: [{ id: '', name: "全部" },{ id: 0, name: "普通优惠券" },{ id: 1, name: "新人专享券" },{ id: 2, name: "积分兑换券" }],
      activitesstates: [{ id: '', name: "全部" },{ id: 0, name: "未开始" },{ id: 1, name: "进行中" },{ id: 2, name: "已结束" }],
      breaddata: ["营销管理", "优惠券"],
      valuetime:"",
    }
  },
  components:{
	  Bread,
	  exammine,
	  stopModel
  },
  created(){
  	this.dataForm.type = this.couponKindList1 && this.couponKindList1[0].id;
  	this.dataForm.state = this.activitesstates && this.activitesstates[0].id;
  	this.dataForm.auditState = this.storeTypes && this.storeTypes[0].id;
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
        addCoupon(row){
            console.log(row);
            if(row){
                if(row.type==0){
                    row.editType = "普通优惠券";
                }else if(row.type==1){
                    row.editType =  "新会员专享";
                }else if(row.type==2){
                    row.editType =  "积分兑换券";
                }
        	    this.$emit('showAddOrEditCoupon',row)//编辑优惠券
            }else{
        	    this.$emit('showAddOrEditCoupon')//新增优惠券
            }
        },
        //开始结束时间
		acttime(){
			this.dataForm.getStartTime = this.valuetime[0] || '';
			this.dataForm.getEndTime = this.valuetime[1] || '';
		},
		deleteHandleLocal(row){
			this.deleteHandle(row.id);
		},
	  // 审核弹框
	  showExammine(row){
		  this.exammineVisible = true;
		  this.$nextTick(()=>{
			  this.$refs.exammineCompon.init(row);
		  })
	  },
	  showStopModel(row){
		  this.stopModelVisible = true;
		  this.$nextTick(()=>{
			  this.$refs.stopModelCompon.init(row);
		  })
	  },

  }
};
</script>
<style lang="scss" scoped>
.el-input {
  width: 170px;
  height: 40px;
}
.cell div{
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	overflow: hidden;
}

</style>
