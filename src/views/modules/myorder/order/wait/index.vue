<template>
    <div v-if="detailOrList==1">
        <Bread :breaddata="breaddata"></Bread>
        <el-form
                :inline="true"
                ref="dataForm"
                class="grayLine topGapPadding"
                :model="dataForm"
                @keyup.enter.native="getDataList()"
        >
            <el-form-item label="订单号搜索：" prop="orderSn">
                <el-input v-model="dataForm.orderSn" placeholder="请输入" clearable></el-input>
            </el-form-item>
            <el-form-item label="会员账号：" prop="buyerName">
                <el-input v-model="dataForm.buyerName" placeholder="请输入" clearable></el-input>
            </el-form-item>
            <el-form-item label="订单状态：" prop="paymentStatus">
                <el-select v-model="dataForm.paymentStatus" placeholder="请选择">
                    <el-option label="全部订单" value=""></el-option>
                    <el-option label="待支付" value="10" ></el-option>
                    <el-option label="待发货" value="20"></el-option>
                    <el-option label="待收货" value="30" ></el-option>
                    <el-option label="交易成功" value="40"></el-option>
                    <el-option label="订单取消" value="0"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="下单时间：">
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
            <el-form-item label="订单类型：" prop="orderType">
                <el-select v-model="dataForm.orderType" placeholder="请选择">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="未付款" value="0"></el-option>
                    <el-option label="已付款" value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button class="btn" type="primary" @click="getData()">搜索</el-button>
                <el-button class="btn" type="primary" plain @click="reset('dataForm')">重置</el-button>
            </el-form-item>
            <br>
            <!-- <el-form-item>
              <el-button calss="btn" @click="reset()" style="color:#999999FF;">导出</el-button>
            </el-form-item>-->
        </el-form>
        <el-table
                width="100%"
                :data="dataList"
                border=""
                v-loading="dataListLoading"
                style="width: 100%; maigin-top:10px;"
        >
            <el-table-column prop="orderSn" label="订单编号" align="center" width="180"></el-table-column>
            <el-table-column prop="createDate" label="下单时间" align="center"></el-table-column>
            <el-table-column prop="buyerName" label="会员账号" align="center"></el-table-column>
            <el-table-column prop="orderAmount" label="订单金额" align="center">
                <template slot-scope="scope">￥{{scope.row.orderAmount}}</template>
            </el-table-column>
            <el-table-column prop="paymentName" label="支付方式" align="center"></el-table-column>
            <el-table-column prop="orderState" label="订单状态" align="center"></el-table-column>
            <el-table-column prop="orderType" label="订单类型" align="center" :formatter="orderState"></el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <!-- <el-button type="primary" @click="submitStore()">{{ $t('confirm') }}</el-button> -->
                    <el-button size="mini" type="text" @click="handleEdit( scope.row)">查看</el-button>
                    <el-button size="mini" type="text" @click="handleEdit( scope.row)">取消订单</el-button>
                    <el-button size="mini" type="text" @click="handleEdit( scope.row)">审核</el-button>
                    <el-button size="mini" type="text" @click="handleEdit( scope.row)">重新申报</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                @size-change="pageSizeChangeHandle"
                @current-change="pageCurrentChangeHandle"
                :current-page="page"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="limit"
                :total="total"
                layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
    </div>
    <orderDet
            v-else-if="detailOrList==2"
            @changePage="changePage"
            :data="data"
            :addressInfo="addressInfo"
            :orderLog="orderLog"
            :orderData="orderData"
    ></orderDet>
    <discountDet v-else @changeState="changeState"></discountDet>
</template>

<script>
    import Bread from "@/components/bread";
    import { orderlists } from "@/api/url";
    import { orderDetail, paymentList } from "@/api/api";
    // import discountDet from "./discountDet";
    // import orderDet from "./orderDet";
    import mixinViewModule from "@/mixins/view-module";
    export default {
        mixins: [mixinViewModule],
        data() {
            return {
                mixinViewModuleOptions: {
                    getDataListURL: orderlists,
                    getDataListIsPage: true,
                    exportURL: "",
                    // deleteURL: deleteAttributeUrl,
                    deleteIsBatch: true,
                    deleteIsBatchKey: "id"
                },
                paymentList: "", //支付方式
                formInline: {}, //订单优惠明细
                textarea: "",
                breaddata: ["待处理订单"],
                dataListLoading: false,
                detailOrList: 1,
                tableData: [],
                orderData: [],
                dataForm: {
                    orderSn: "",
                    storeIdAndName: "",
                    buyerName: "",
                    paymentId: "",
                    paymentStatus: "",
                    startCreateDate: "",
                    endCreateDate: "",
                    endPaymentTime: "",
                    startPaymentTime: "",
                    orderType: "",//订单类型：bc,cc
                    isWaitDeal:' 1',//是否为等待处理订单 0不是 1是 默认为不是
                },
                tableData: [],
                timeArr: "", //下单时间数据
                timeArr2: "", //交易时间数据
                addressInfo: [], //地址数据
                packageInfo: [], //包裹数据
                orderLog: [], //操作日志
                params: {
                    currentPage: 1, //当前页数
                    currentPageSize: 10 //每页显示的条数
                },
                orderState: function(row, column) {
                    return row.orderStatus == 0 ? (
                        <el-tag type="info">已取消</el-tag>
                ) : row.orderStatus == 10 ? (
                        <el-tag type="warning">待付款</el-tag>
                ) : row.orderStatus == 20 ? (
                        <el-tag type="warning">待发货</el-tag>
                ) : row.orderStatus == 30 ? (
                        <el-tag type="warning">待收货</el-tag>
                ) : (
                    <el-tag type="success">交易完成</el-tag>
                );
                }
            };
        },
        props: ["status"],
        created() {
            //处理不同状态
            this.dataForm.orderStatus = this.status == undefined ? "" : this.status;
            this.getPaymentList();
        },
        methods: {
            getData() {
                this.dataForm.startCreateDate = this.timeArr && this.timeArr[0];
                this.dataForm.endCreateDate = this.timeArr && this.timeArr[1];
                this.dataForm.startPaymentTime = this.timeArr2[0];
                this.dataForm.endPaymentTime = this.timeArr2[1];
                this.page = 1;
                this.limit = 10;
                this.dataForm.orderStatus  = this.dataForm.paymentStatus 
                this.getDataList();
            },
            //订单支付方式
            getPaymentList() {
                paymentList().then(res => {
                    if (res.code == 200) {
                        this.paymentList = res.data;
                    } else {
                        this.$message({
                            type: "warning",
                            message: res.msg
                        });
                    }
                });
            },
            //重置
            reset(formName) {
                this.timeArr = [];
                this.timeArr2 = [];
                this.dataForm.startCreateDate = "";
                this.dataForm.endtime = "";
                this.dataForm.startPaymentTime = "";
                this.dataForm.endPaymentTime = "";
                this.$refs[formName].resetFields();
                this.page = 1;
                this.limit = 10;
                this.getDataList();
            },
            //返回页 1-列表  3-优惠详情
            changePage(data) {
                console.log(data);
                this.detailOrList = data;
                this.$emit("showListFn");
            },
            //返回详情页 2-详情页
            changeState(data) {
                this.detailOrList = data;
                this.$emit("showListFn");
            },
            //订单详情
            handleEdit(index) {
                const obj = { id: index.id };
                orderDetail(obj).then(res => {
                    if (res.code == 200) {
                        this.addressInfo = res.data.orderAddressDTO; //收货人信息
                        this.orderData = res.data.orderGoodsDTOList;
                        this.orderLog = res.data.orderLogisticsLogDTOList; //物流
                        this.packageInfo = res.data.orderLogDTOList; //订单状态
                        this.data = res.data;
                        this.detailOrList = 2;
                    } else {
                        this.$message({
                            type: "warning",
                            message: res.msg
                        });
                    }
                });
            }
        },
        components: {
            Bread,
            // orderDet,
            // discountDet
        }
    };
</script>
<style scoped>
    .el-popper {
        left: 292px !important;
    }
    .el-table--border {
        margin-top: 20px;
    }
    .el-radio-group {
        margin-top: 20px;
    }
    .orderUerInfo {
        width: 100%;
        height: auto;
        margin-top: 20px;
        border: 1px solid #d1d1d1;
    }
    .orderDe {
        /* border: 1px solid #333; */
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .orderDelf,
    .orderDerg {
        /* display: flex; */
        display: flex;
        align-items: center;
    }
    .orderDelf div {
        margin-left: 20px;
    }
    .orderDerg div {
        margin-right: 20px;
    }
    .buyerInfo {
        box-sizing: border-box;
        border-radius: 5px;
        padding: 0px 8px;
        height: 70px;
        margin: 5px 10px;
        border: 1px solid #d1d1d1;
        display: flex;
    }
    .buyerInfo ul {
        width: 50%;
        padding: inherit;
    }
    .buyerInfo ul li {
        list-style-type: none;
        padding: 3px;
    }
    .orderRecord {
        widows: 100%;
        height: auto;
        height: 200px;
        display: flex;
        margin-top: 10px;
        border: 1px solid #d1d1d1;
    }
    .orderText {
        width: 80%;
        height: 100%;
        display: flex;
        padding: 10px;
        justify-content: center;
    }
    .orderInfo {
        width: 20%;
        padding: 20px 0 0 30px;
        border-right: 1px solid #d1d1d1;
        text-align: left;
        height: 100%;
    }
    .el-textarea {
        width: 100%;
    }
    .el-textarea__inner {
        height: 100%;
        resize: none;
    }
    .orderConfig {
        width: 100%;
        border: 1px solid #d1d1d1;
        height: auto;
        display: flex;
        justify-content: flex-start;
        margin-top: 10px;
    }
    .orderConList {
        width: 25%;
        padding: 20px 0 0 30px;
        border-right: 1px solid #d1d1d1;
        text-align: left;
        height: auto;
    }
    .summary {
        width: 100%;
        display: flex;
        margin-top: 20px;
        justify-content: flex-end;
    }
    .summary ul li {
        list-style: none;
        width: 200px;
        line-height: 30px;
    }
    .operationRecord {
        width: 100%;
        padding-left: 20px;
        margin: 20px 0;
        height: auto;
        border: 1px solid #d1d1d1;
    }
    .operationRecord p {
        line-height: 30px;
    }
    .order {
        display: flex;
    }
    .order p {
        margin-left: 20px;
    }
    .ssss {
        display: flex;
        height: auto;
        align-items: center;
    }
    /deep/ .el-form-item {
        margin-top: 0px !important;
    }
</style>
