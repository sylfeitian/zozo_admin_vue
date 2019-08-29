<template>
  <div>
    <Bread :breaddata="breaddata"></Bread>
    <el-form :inline="true" class="grayLine topGapPadding" :model="dataForm" @keyup.enter.native="getDataList()" >
        <el-form-item label="活动名称：">
            <el-input v-model="dataForm.storeId" placeholder="请输入优惠券名称" clearable></el-input>
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
        </el-form-item> 
        
        <el-form-item>
            <el-button  class="btn" type="primary" @click="getDataList()">查询</el-button>
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
		    prop="id"
		    label="活动标题"
		    width="180">
		</el-table-column>
		<el-table-column
		    prop="account"
		    label="活动时间">
		</el-table-column>
		<el-table-column
		    prop="gradeName"
		    label="审核状态">
		</el-table-column>
		<el-table-column
		    prop="createDate"
		    label="活动状态"
             width="180">
		</el-table-column>
	    <el-table-column
	   		prop="address"
	    	label="操作">
		    <template slot-scope="scope">
		    	<el-button type="text" size="small">审核</el-button>
		    	<el-button type="text" size="small" @click="showDetail(scope.row.id)">查看商品</el-button>
		    	<el-button type="text" size="small" @click="addAdit(scope.row.id)">添加商品</el-button>
		    	<el-button type="text" size="small" @click="addActivity(scope.row.id)">编辑</el-button>
		    	<el-button class="artdanger" type="text" size="small">删除</el-button>
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

    <!-- 新增编辑活动弹框 -->
    <el-dialog
        :title="activiTitle"
        :visible.sync="activiVisible"
        :close-on-click-modal = "false"
        :show-close = "false"
        class="activiDialog"
        width="40%">
        <el-form :model="activiDataForm" :rules="dataRule" ref="activiDataForm" @keyup.enter.native="subActivity()" label-width="120px">
            <el-form-item label="活动标题：" prop="sgName">
                <el-input v-model="activiDataForm.sgName" placeholder="请输入50字以内的标题" :maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="开始时间：" prop="startTime">
                <el-date-picker
                    v-model="activiDataForm.startTime"
                    type="datetime"
                    value-format="yyyy-MM-dd"
                    placeholder="选择开始时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间：" prop="endTime">
                <el-date-picker
                    v-model="activiDataForm.endTime"
                    type="datetime"
                    value-format="yyyy-MM-dd"
                    placeholder="选择结束时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="活动限制：">
                <el-checkbox-group v-model="activiDataForm.checkList">
                    <el-checkbox :label="1">不可同时使用优惠券</el-checkbox>
                    <el-checkbox :label="2">不可同时参加满减活动</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="noCheck('activiDataForm')">取 消</el-button>
            <el-button type="primary" @click="subActivity('activiDataForm')" :loading="buttonStatus">确 定</el-button>
        </span>
    </el-dialog>
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
      buttonStatus:false,
      activiVisible:false,
      activiTitle:'添加活动',
      activiDataForm:{
          sgName:'',
          startTime:'',
          endTime:'',
          checkList:'0'
      },
      dataForm: {
          gradeId:'',
          storeType:'',
      },
      storeTypes:[
          {id: '',label: '待审核'},
          {id: '1',label: '审核通过'},
          {id: '2',label: '审核不通过'}
      ],
      activitesstates: [{ id: '', name: "全部" },{ id: 1, name: "未开始" },{ id: 2, name: "进行中" },{ id: 3, name: "已结束" },{ id: 4, name: "待审核" }],
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
  	Bread
  },
  created(){
    this.demo();
  },
  methods: {
        //回调跳到查看页面
        showDetail(id){
	    	this.$emit("showDetail",id);
        },
        //重置
        reset() {
            this.dataForm = {};
            this.getDataList();
        },
        //回调跳到添加商品页面
        addAdit(id){                    //id:为活动id
        	this.$emit('addAditFun',id)//添加商品
        },
        //打开新增编辑活动弹框
        addActivity(id){
            this.activiVisible = true;
            if(id){
                this.activiTitle = '编辑活动';
                this.getInfo(id);//判断是编辑情况下调详情方法
            }else{
                this.activiTitle = '添加活动';
            }
        },
        //取消弹框
        noCheck(formName){
            this.$refs[formName].resetFields();
            this.activiVisible = false;
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
