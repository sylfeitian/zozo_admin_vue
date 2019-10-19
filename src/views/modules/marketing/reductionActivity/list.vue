<template>
  <div>
    <Bread :breaddata="breaddata"></Bread>
    <el-form :inline="true" class="grayLine topGapPadding" :model="dataForm" @keyup.enter.native="getDataList()" >
        <el-form-item label="活动标题：">
            <el-input v-model.trim.trim="dataForm.title" placeholder="请输入优惠券名称" clearable></el-input>
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
        <el-form-item label="活动时间：">
            <el-date-picker
                v-model="valuetime"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
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
		    prop=""
            align="center"
		    label="满减规则">
             <template slot-scope="scope">
                    满{{scope.row.limitPrice}}元减{{scope.row.reducePrice}}元
            </template>
		</el-table-column>
		<el-table-column
		    prop="startTime"
            align="center"
		    label="活动时间">
		</el-table-column>
		<el-table-column
            align="center"
		    prop="auditState"
		    label="审核状态">
            <template slot-scope="scope">
                <span v-if="scope.row.auditState==0">未审核</span>
                <span v-else-if="scope.row.auditState==1">审核通过</span>
                <span v-else="scope.row.auditState==2">审核不通过</span>
            </template>
		</el-table-column>
		<el-table-column
		    prop="state "
            align="center"
		    label="活动状态"
             width="180">
             <template slot-scope="scope">
                <span v-if="scope.row.state ==0">未开始</span>
                <span v-else-if="scope.row.state ==1">进行中</span>
                <span v-else="scope.row.state ==2">已结束</span>
            </template>
		</el-table-column>
	    <el-table-column
            align="center"
	    	label="操作">
		    <template slot-scope="scope">
		    	<el-button v-if="scope.row.auditState==0" type="text" size="small" @click="showExammine(scope.row)">审核</el-button>
                <el-button v-if="scope.row.state ==0" type="text" size="small" @click="addActivity(scope.row)">编辑</el-button>
		    	<el-button v-if="scope.row.state ==1"   class="artdanger" type="text" size="small" @click="showStopModel(scope.row)">停止</el-button>
		    	<el-button  type="text" size="small" @click="showDetail(scope.row)">查看</el-button>
		    	<el-button   v-if="scope.row.state ==0" class="artdanger" type="text" size="small"   @click="deleteHandleLocal(scope.row)">删除</el-button>
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

    <modelAddOrEdit v-if="addEditDataVisible" ref="modelAddOrEditCompon" @searchDataList="getDataList()"></modelAddOrEdit>
      <!-- 审核 -->
    <exammine v-if="exammineVisible" ref="exammineCompon" @searchDataList="getDataList()"></exammine>
      <!-- 审核 -->
    <stopModel v-if="stopModelVisible" ref="stopModelCompon" @searchDataList="getDataList()"></stopModel>
    
  </div>
</template>

<script>
    import mixinViewModule from '@/mixins/view-module'
    import { activityReduceUrl,deleteActivityReduceUrl  } from '@/api/url'
    import { storeGrade } from '@/api/api'
    import Bread from "@/components/bread";
    import modelAddOrEdit from "./model-add-or-edit.vue";
    import exammine from './model-exammine.vue'
    import stopModel from './model-stop.vue'
    
    export default {
    mixins: [mixinViewModule],
    data () {
        return {
            stopModelVisible:false,
            exammineVisible:false,
            mixinViewModuleOptions: {
                getDataListURL: activityReduceUrl,
                getDataListIsPage: true,
                exportURL: '/admin-api/store/export',
                deleteURL: deleteActivityReduceUrl,
                deleteIsBatch: false,
                // deleteIsBatchKey: 'id'
            },
            buttonStatus:false,
            addEditDataVisible:false,
            activiTitle:'添加活动',
            dataForm: {
                title:'',// 活动标题
                auditState:'',//	审核状态 0未审核 1审核通过 2审核不通过
                state:'',//	活动状态 0未开始 1进行中 2已结束
                startTime:'',
                endTime:'',
            },
            storeTypes:[
                {id: '',label: '全部'},
                {id: '0',label: '待审核'},
                {id: '1',label: '审核通过'},
                {id: '2',label: '审核不通过'}
            ],
            activitesstates: [
                { id: '', name: "全部" },
                { id: 0, name: "未开始" },
                { id: 1, name: "进行中" },
                { id: 2, name: "已结束" }
            ],
            breaddata: ["营销管理", "满减活动"],
            valuetime:"",
            ruleName:'rule1'
        }
    },
    computed:{
        dataRule(){
            return{
                sgName : [
                    { required: true, message: '活动标题不能为空', trigger: 'blur' },
                ],
                startTime : [
                        { required: true, message: '开始时间不能为空', trigger: 'blur' },
                ],
                endTime : [
                        { required: true, message: '结束时间不能为空', trigger: 'blur' },
                ],
                rule1 : [
                        { required: true, message: '订单满多少元不能为空', trigger: 'blur' },
                ],
                rule2 : [
                        { required: true, message: '立减多少元不能为空', trigger: 'blur' },
                ],
            }
        }
    },
   
    components:{
        modelAddOrEdit,
        Bread,
        exammine,
        stopModel
    },
     created(){
        // this.demo();
    },
    methods: {
        getData () {
            this.page =1;
            console.log(this.valuetime);
            if(this.valuetime){
                this.acttime();
            }else{
                this.dataForm.startTime ="";
                this.dataForm.endTime = '';
            }
            this.getDataList();
        },
            //回调跳到查看页面
            showDetail(id){
                this.$emit("showDetailFun",id);
            },
            deleteHandleLocal(row){
                this.deleteHandle(row.id);
            },
            //重置
            reset() {
                this.dataForm = {};
                this.getDataList();
            },
            //打开新增编辑活动弹框
            addActivity(row){
                this.addEditDataVisible = true;
                this.$nextTick(()=>{
                    this.$refs.modelAddOrEditCompon.init(row);
                })
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
            // demo(){
            //     function placeholderPic(){
            //         var w = document.documentElement.offsetWidth;
            //         document.documentElement.style.fontSize=w/20+'px';
            //     }
            //         placeholderPic();
            //     window.onresize=function(){
            //         placeholderPic();
            //     }
            // },
            //开始结束时间
            acttime(){
                this.dataForm.startTime = this.valuetime[0] // +" 00:00:00";
                this.dataForm.endTime = this.valuetime[1] // +" 00:00:00";
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
