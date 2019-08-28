<template>
  <div>
    <Bread :breaddata="breaddata"></Bread>
    <el-form :inline="true" class="grayLine topGapPadding" :model="dataForm" @keyup.enter.native="getDataList()" >
        <el-form-item label="优惠券名称：">
            <el-input v-model="dataForm.storeId" placeholder="请输入优惠券名称" clearable></el-input>
        </el-form-item>
        <el-form-item  label="优惠券类型：">
            <el-select v-model="dataForm.messageType" clearable  placeholder="请选择">
                <el-option
                    v-for="item in couponKindList1"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
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
            <el-select v-model="dataForm.storeType" clearable  placeholder="请选择">
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
            <el-button  class="btn" type="primary" @click="getDataList()">查询</el-button>
            <el-button class="btn"  type="primary" plain @click="reset()" plain>重置</el-button>
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
		    prop="id"
		    label="优惠券名称"
		    width="180">
		</el-table-column>
		<el-table-column
		    prop="storeName"
		    label="优惠券类型">
            <template slot-scope="scope">
                <div style="float:left">
                    <span style="width: 40px; height: 40px;margin-right:20px;" v-if="scope.row.storeLogo">
                        <img :src="scope.row.storeLogo" alt="img" style=" object-fit: contain;width: 40px;border-radius:50%;">
                    </span>
                    <span>{{scope.row.storeName}}</span>
                </div>
		    </template>
		</el-table-column>
		<el-table-column
		    prop="account"
		    label="使用门槛">
		</el-table-column>
		<el-table-column
		    prop="gradeName"
		    label="面值">
		</el-table-column>
		<el-table-column
		    prop="createDate"
		    label="活动时间"
             width="180">
		</el-table-column>
        <el-table-column
		    prop="creator"
		    label="有效期">
            <template slot-scope="scope">
		    	<span>{{scope.row.storeType==2?'普通商户':'自营商户'}}</span>
		    </template>
		</el-table-column>
        <el-table-column
		    prop="creator"
		    label="审核状态">
            <template slot-scope="scope">
		    	<span>{{scope.row.storeType==2?'普通商户':'自营商户'}}</span>
		    </template>
		</el-table-column>
        <el-table-column
		    prop="creator"
		    label="活动状态">
            <template slot-scope="scope">
		    	<span>{{scope.row.storeType==2?'普通商户':'自营商户'}}</span>
		    </template>
		</el-table-column>
	    <el-table-column
	   		prop="address"
	    	label="操作">
		    <template slot-scope="scope">
		    	<el-button type="text" size="small" @click="showDetail(scope.row.id)">查看</el-button>
		    	<el-button type="text" size="small" @click="addCoupon(scope.row.id,'普通优惠券')">编辑</el-button>
		    	<el-button class="artdanger" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
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
      dataForm: {},
      storeTypes:[
          {id: '',label: '待审核'},
          {id: '1',label: '审核通过'},
          {id: '2',label: '审核不通过'}
      ],
      couponKindList1: [{ id: '', name: "全部" },{ id: 1, name: "普通优惠券" },{ id: 2, name: "新会员优惠券" },{ id: 3, name: "积分优惠券" }],
      activitesstates: [{ id: '', name: "全部" },{ id: 1, name: "未开始" },{ id: 2, name: "进行中" },{ id: 3, name: "已结束" },{ id: 4, name: "待审核" }],
      breaddata: ["营销管理", "优惠券"],
       valuetime:"",
    }
  },
  components:{
  	Bread
  },
  created(){
  	this.dataForm.messageType = this.couponKindList1[0].id;
  	this.dataForm.gradeId = this.activitesstates[0].id;
  	this.dataForm.storeType = this.storeTypes[0].id;
    this.demo();
  },
  methods: {
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
</style>
