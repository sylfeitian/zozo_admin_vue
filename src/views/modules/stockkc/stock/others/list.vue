<template>
    <div>
        <Bread :breaddata="breaddata"></Bread>
        <el-form :inline="true" class="grayLine topGapPadding" :model="dataForm" @keyup.enter.native="getDataList()" >
            <el-form-item prop="documentNo" label="单据单号：">
                <el-input v-model="dataForm.documentNo" placeholder="请输入单据单号" maxlength="30"></el-input>
            </el-form-item>
            <el-form-item prop="creator" label="操作人：">
                <el-input v-model="dataForm.creator" placeholder="请输入操作人账号"></el-input>
            </el-form-item>
            <el-form-item label="出库时间：">
                <el-date-picker
                        v-model="valuetime"
                        type="datetimerange"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        align="left"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                         @blur='acttime'
                        :default-time="['00:00:00', '23:59:59']"
                ></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button  class="btn" type="primary" @click="getData()">查询</el-button>
                <el-button  class="btn" type="primary" plain @click="reset()" >重置</el-button>
            </el-form-item>
            <!--@click="showDetail()"-->
        </el-form>
        <el-form>
            <el-button  class="btn" type="primary" plain @click="addOrAdit()" >添加出库单</el-button>
        </el-form>
        <el-table
                width="100%"
                :data="dataList"
                border=""
                v-loading="dataListLoading"
                style="width: 100%;margin-top:10px;"
        >
            <el-table-column label="序号" width="140" align="center">
                <template slot-scope="scope">
                    <span>{{scope.$index+1}}</span>
                    <!-- {{scope.$index+1+(parseInt(params.currentPage)-1)* parseInt(params.currentPageSize) }} -->
                </template>
            </el-table-column>
            <el-table-column prop="documentNo" label="单据单号" align="center"></el-table-column>
            <el-table-column prop="createDate" label="出库时间" align="center"></el-table-column>
            <el-table-column prop="outputQuantity" label="出库总数量" align="center"></el-table-column>
            <el-table-column prop="creator" label="操作人" align="center"></el-table-column>
            <el-table-column label="操作" align="center" width="180">
                <template slot-scope="scope">
                    <el-button @click.native.prevent="showDetail(scope.$index, scope.row)"type="text"size="mini">查看</el-button>
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
        <showDetail  v-if="showDetailVisible" ref="showDetail" @searchDataList="getDataList"></showDetail>
    </div>
</template>

<script>
    import mixinViewModule from '@/mixins/view-module'
    import Bread from "@/components/bread";
    import showDetail from './model-show-detail'
    import {warehouserecordsodoListPage} from '@/api/url'
    export default {
        mixins: [mixinViewModule],
        data () {
            return {
            	mixinViewModuleOptions: {
		          getDataListURL: warehouserecordsodoListPage,
		          getDataListIsPage: true,
		          // exportURL: '/admin-api/log/login/export',
		          deleteURL: '',
		          dataListLoading: false, 
		          deleteIsBatch: true,
		          deleteIsBatchKey: 'id'
			    },
                breaddata: [ "库存管理", "其他出库单"],
                valuetime: null,
                dataForm: {
                	documentNo: null,
                	creator: null,
                	startTime: null,
                	endTime: null,
                },
                timeArr: "", //出库时间
                dataList: [],
                dataListLoading: false,
                showDetailVisible:false,
            }
        },
        components: {
            Bread,
            showDetail
        },
        watch:{
			valuetime(val){
		      if(!val){
		      	this.dataForm.strTime = '';
		    	this.dataForm.endTime = '';
		      }
		    },
            'dataForm.documentNo':function(newV,oldV) {
                for(let i=0;i<newV.length;i++){
                    if(!/[a-zA-Z0-9\s]/.test(newV[i])){
                        this.dataForm.documentNo = newV.replace(newV[i],"")
                    }
                }
                if(newV.length>30){
                    this.dataForm.documentNo = newV.substr(0,30)
                }
            },
            'dataForm.creator':function(newV,oldV) {
                var chineseCount = 0,characterCount = 0;
                for (let i = 0; i < newV.length; i++) {
                    if (/^[\u4e00-\u9fa5]*$/.test(newV[i])) { //汉字
                        chineseCount = chineseCount + 2;
                    } else { //字符
                        characterCount = characterCount + 1;
                    }
                    var count = chineseCount + characterCount;
                    if (count > 300) { //输入字符大于300的时候过滤
                        this.dataForm.creator = newV.substr(0,(chineseCount/2+characterCount)-1)
                    }
                }
            },
		},
        methods: {
            getData(){
                this.page =1;
                this.getDataList();
            },
        	//开始结束时间
		    acttime(){
		    	this.dataForm.startTime = this.valuetime[0];
		    	this.dataForm.endTime = this.valuetime[1];
		    },
		    // 每页数
			sizeChangeHandle (val) {
				this.params.currentPageSize = val;
				this.params.currentPage = 1;
				this.limit = val;
				this.getDataList();
			},
			// 当前页
			currentChangeHandle (val) {
				this.params.currentPage = val;
				this.page = val;
				this.getDataList();
			},
            addOrAdit(){
                this.$emit("addOrAdit");
            },
            showDetail(index=-1,row=""){
                this.setShowDetailVisible(true);
                this.$nextTick(() => {
                    this.$refs.showDetail.init(row)
                })
            },
            setShowDetailVisible(boolargu){
                this.showDetailVisible =  boolargu;
            },
            reset(formName) {
                this.dataForm.documentNo = null;
                this.dataForm.creator = null;
                this.dataForm.startTime = null;
                this.dataForm.endTime = null;
                this.valuetime = '',
                this.getDataList();
            },
        }
    }
</script>

<style scoped>

</style>