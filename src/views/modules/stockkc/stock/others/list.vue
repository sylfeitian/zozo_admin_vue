<template>
    <div>
        <Bread :breaddata="breaddata"></Bread>
        <el-form :inline="true" class="grayLine topGapPadding" :model="dataForm" @keyup.enter.native="getDataList()" >
            <el-form-item prop="documentNo" label="单据单号：">
                <el-input v-model="dataForm.documentNo" placeholder="请输入单据单号"></el-input>
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
                <el-button  class="btn" type="primary" @click="getData()">搜索</el-button>
                <el-button  class="btn" type="primary" plain @click="reset()" >重置</el-button>
            </el-form-item>
            <!--@click="showDetail()"-->
            <el-form-item>
                <el-button  class="btn" type="primary" plain @click="addOrAdit()" >添加出库单</el-button>
            </el-form-item>
        </el-form>
        <el-table
                width="100%"
                :data="dataList"
                border=""
                v-loading="dataListLoading"
                style="width: 100%;margin-top:20px;"
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
            <el-table-column label="操作" align="center">
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
        <showData  v-if="showDataVisible" ref="showData" @searchDataList="getDataList"></showData>
    </div>
</template>

<script>
    import mixinViewModule from '@/mixins/view-module'
    import Bread from "@/components/bread";
    import showData from './model-show-data'
    import {getstockdata} from '@/api/url'
    export default {
        mixins: [mixinViewModule],
        data () {
            return {
            	mixinViewModuleOptions: {
		          getDataListURL: getstockdata,
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
                showDataVisible:false,
            }
        },
        components: {
            Bread,
            showData
        },
        watch:{
			valuetime(val){
		      if(!val){
		      	this.dataForm.strTime = '';
		    	this.dataForm.endTime = '';
		      }
		    }
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
            addOrAdit(id){
                this.$emit("addOrAdit",id);
            },
            showDetail(index=-1,row=""){
                this.setShowDataVisible(true);
                this.$nextTick(() => {
                    this.$refs.showData.init(row)
                })
            },
            setShowDataVisible(boolargu){
                this.showDataVisible =  boolargu;
            },
            reset(formName) {
                this.dataForm.documentNo = null;
                this.dataForm.creator = null;
                this.dataForm.startTime = null;
                this.dataForm.endTime = null;
                this.getDataList();
            },
        }
    }
</script>

<style scoped>

</style>