<template>
    <div>
        <Bread :breaddata="breaddata"></Bread>
        <el-form :inline="true" class="grayLine topGapPadding" :model="dataForm" @keyup.enter.native="getDataList()" >
            <el-form-item prop="memberId" label="单据单号：">
                <el-input v-model="dataForm.memberId" placeholder="请输入单据单号"></el-input>
            </el-form-item>
            <el-form-item prop="orderId" label="操作人：">
                <el-input v-model="dataForm.orderId" placeholder="请输入操作人账号"></el-input>
            </el-form-item>
            <el-form-item label="出库时间：">
                <el-date-picker
                        v-model="timeArr"
                        type="datetimerange"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        align="left"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :default-time="['00:00:00', '23:59:59']"
                ></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button  class="btn" type="primary" @click="showDetail()">搜索</el-button>
                <el-button  class="btn" type="primary" plain @click="reset()" >重置</el-button>
            </el-form-item>
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
            <el-table-column prop="name" label="单据单号" align="center"></el-table-column>
            <el-table-column prop="" label="出库时间" align="center"></el-table-column>
            <el-table-column prop="" label="出库总数量" align="center"></el-table-column>
            <el-table-column prop="" label="操作人" align="center"></el-table-column>
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
    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                breaddata: [ "库存管理", "其他出库单"],
                dataForm: {},
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
        methods: {
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
                this.timeArr = [];
                this.dataForm.startCreateDate = "";
                this.dataForm.endtime = "";
                this.dataForm.startPaymentTime = "";
                this.dataForm.endPaymentTime = "";
                this.$refs[formName].resetFields();
                this.getDataList();
            },
        }
    }
</script>

<style scoped>

</style>