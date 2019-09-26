<template>
  <div>
    <Bread :breaddata="breaddata"></Bread>
    <el-form :inline="true" class="grayLine topGapPadding" :model="dataForm" @keyup.enter.native="getDataList()" >
        <el-form-item label="活动名称：">
            <el-input v-model="dataForm.title" placeholder="请输入优惠券名称" clearable  maxlength="300" ></el-input>
        </el-form-item>
        <el-form-item  label="活动状态：">
            <el-select v-model="dataForm.state" clearable  placeholder="请选择">
                <el-option
                    v-for="item in activitesstatesOption"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item  label="审核状态：">
            <el-select v-model="dataForm.auditState" clearable  placeholder="请选择">
                <el-option
                    v-for="item in auditStateOption"
                    :key="item.id"
                    :label="item.label"
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
        <br />
        <el-form-item>
            <el-button type="primary" @click="addActivity()">添加活动</el-button>
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
		    prop="title"
		    label="活动标题"
            align="center"
		    width="180">
		</el-table-column>
		<el-table-column
		    prop="startTime"
            align="center"
		    label="活动时间">
             <template slot-scope="scope">
                    <span>{{scope.row.startTime}} 至 {{scope.row.endTime}}</span>
             </template> 
		</el-table-column>
		<el-table-column 
            align="center"
		    label="审核状态">
             <template slot-scope="scope">
                <span v-if="scope.row.auditState==0">待审核</span>
                <span v-else-if="scope.row.auditState==1">审核通过</span>
                <span v-else-if="scope.row.auditState==2">审核未通过</span>
            </template> 
		</el-table-column>
		<el-table-column
		    prop="createDate"
            align="center"
		    label="活动状态"
            width="180">
                <template slot-scope="scope">
                    <span v-if="scope.row.state ==0">未开始</span>
                    <span v-else-if="scope.row.state ==1">进行中</span>
                    <span v-else-if="scope.row.state ==2">已结束</span>
                </template>   
		</el-table-column>
	    <el-table-column
            align="center"
	    	label="操作">
		    <template slot-scope="scope">
		    	<el-button type="text" size="small" @click="exammineActivity(scope.row)" v-if="scope.row.auditState==0">审核</el-button>
                <el-button type="text" size="small" @click="stopActivity(scope.row)" v-if="scope.row.state ==1">停止</el-button>
		    	<el-button type="text" size="small" @click="showDetail(scope.row)">查看商品</el-button>
		    	<el-button type="text" size="small" @click="addAdit(scope.row)" v-if="scope.row.state ==0">添加商品</el-button>
		    	<el-button type="text" size="small" @click="addActivity(scope.row)" v-if="scope.row.state ==0">编辑</el-button>
		    	<el-button class="artdanger" type="text" size="small" @click="deleteHandle(scope.row.id)" v-if="scope.row.auditState==2 && scope.row.state ==0">删除</el-button>
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

    <!-- 添加或者编辑 -->
    <modelAddOrEdit v-if="modelAddOrEditVisible" ref="modelAddOrEditCompon" @searchDataList="getDataList" ></modelAddOrEdit>
    <!-- 审核 -->
    <modelExammine v-if="modelExammineVisible" ref="modelExammineCompon" @searchDataList="getDataList" ></modelExammine>
    <!-- 停止 -->
    <modelStop v-if="modelStopVisible" ref="modelStopCompon" @searchDataList="getDataList" ></modelStop>
    
  </div>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import { limitActivityPage,deleteLimitActivity } from '@/api/url'
import { storeGrade } from '@/api/api'
import Bread from "@/components/bread";
import modelAddOrEdit from "./modules/model-add-or-edit"
import modelExammine from "./modules/model-exammine"
import modelStop from "./modules/model-stop"
  
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
          getDataListURL: limitActivityPage,
          getDataListIsPage: true,
          exportURL: '/admin-api/store/export',
          deleteURL:deleteLimitActivity,
          deleteIsBatch: true,
          deleteIsBatchKey: 'id'
      },
      modelAddOrEditVisible:false,
      modelExammineVisible:false,
      modelStopVisible:false,
      buttonStatus:false,
      activiTitle:'添加活动',
      
      dataForm: {
        //   title:'',// 活动标题 ,
        //   state:'',//0:未开始，1：进行中，2：已结束 ,
        //   auditState :'',//审核状态：0未审核，1：审核通过，2审核未通过 ,
        //   startTime:'',//活动开始时间   
        //   endTime:'', // 活动结束时间
      },
      auditStateOption:[
          {id: '',label: '全部'},
          {id: '0',label: '待审核'},
          {id: '1',label: '审核通过'},
          {id: '2',label: '审核不通过'}
      ],
      activitesstatesOption: [
          { id: '', name: "全部" },
          { id: 1, name: "未开始" },
          { id: 2, name: "进行中" },
          { id: 3, name: "已结束" },
        ],
      breaddata: ["营销管理", "限量活动"],
      valuetime:"",
      dataRule : {
            sgName : [
                { required: true, message: '必填项不能为空', trigger: 'blur' },
            ],
            startTime : [
                    { required: true, message: '必填项不能为空', trigger: 'blur' },
            ],
            endTime : [
                    { required: true, message: '必填项不能为空', trigger: 'blur' },
            ]
        },
    }
  },
  components:{
      Bread,
      modelAddOrEdit,
      modelExammine,
      modelStop
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
        showDetail(row){
	    	this.$emit("showDetail",row);
        },
        //重置
        reset() {
            this.dataForm.title = '';
            this.dataForm.state = '';
            this.dataForm.auditState = '';
            this.dataForm.startTime = '';
            this.dataForm.endTime = '';
            this.valuetime = [];
            this.page = 1;
            this.getDataList();
        },
        //回调跳到添加商品页面
        addAdit(row){                    //id:为活动id
        	this.$emit('addAditFun',row)//添加商品
        },
        //打开新增编辑活动弹框
        addActivity(row){
            this.modelAddOrEditVisible = true;
            this.$nextTick(()=>{
                this.$refs.modelAddOrEditCompon.init(row);
            })
        },
        // 审核活动
        exammineActivity(row){
            this.modelExammineVisible = true;  
            this.$nextTick(()=>{
                this.$refs.modelExammineCompon.init(row);
            })
        },
        // 停止活动
        stopActivity(row){
            this.modelStopVisible = true;
             this.$nextTick(()=>{
                this.$refs.modelStopCompon.init(row);
            })
        },
        //提交新增编辑活动
        subActivity(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    
                }
            });
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
            this.dataForm.startTime = this.valuetime[0];
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
