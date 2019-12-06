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
                <el-input v-model.trim="dataForm.orderSn" placeholder="请输入" clearable></el-input>
            </el-form-item>
            <el-form-item label="会员账号：" prop="memberName">
                <el-input v-model.trim="dataForm.memberName" placeholder="请输入" clearable></el-input>
            </el-form-item>
            <el-form-item label="订单状态：" prop="orderStatus">
                <el-select v-model="dataForm.orderStatus" placeholder="请选择">
                    <el-option label="全部订单" value=""></el-option>
                    <!-- 待付款 -->
                    <!-- <el-option label="待付款" value="10"  v-if="dataForm.topStatus=='all' || dataForm.topStatus=='waitpay'" ></el-option> -->
                    <!-- 待发货 -->
                    <!-- <el-option label="付款中" value="20"  v-if="dataForm.topStatus=='all' || dataForm.topStatus=='waitshipped'" ></el-option> -->
                    <el-option label="待审核" value="30" v-if="dataForm.topStatus=='all' || dataForm.topStatus=='waitshipped'" ></el-option>
                    <!-- <el-option label="申报中" value="40" v-if="dataForm.topStatus=='all' || dataForm.topStatus=='waitshipped'" ></el-option> -->
                    <el-option label="lakala申报失败" value="50" v-if="dataForm.topStatus=='all' || dataForm.topStatus=='waitshipped'" ></el-option>
                    <!-- <el-option label="待发货" value="60" v-if="dataForm.topStatus=='all' || dataForm.topStatus=='waitshipped'" ></el-option> -->
                    <!-- 待收货 -->
                     <el-option label="日本取消订单" value="70" v-if="dataForm.topStatus=='all' || dataForm.topStatus=='waitshipped'" ></el-option>
                    <el-option label="JD申报失败" value="100" v-if="dataForm.topStatus=='all' || dataForm.topStatus=='waitreceived'" ></el-option>
                    <!-- <el-option label="清关中" value="80" v-if="dataForm.topStatus=='all' || dataForm.topStatus=='waitreceived'" ></el-option> -->
                    <!-- <el-option label="待收货" value="90" v-if="dataForm.topStatus=='all' || dataForm.topStatus=='waitreceived'" ></el-option> -->
                    <!-- 已完成 -->
                    <!-- <el-option label="交易完成" value="100" v-if="dataForm.topStatus=='all' || dataForm.topStatus=='complete'" ></el-option> -->
                    <!-- 已取消 -->
                    <!-- <el-option label="已取消" value="0" v-if="dataForm.topStatus=='all' || dataForm.topStatus=='cancel'" ></el-option> -->
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
                    <el-option label="bc" value="bc"></el-option>
                    <el-option label="cc" value="cc"></el-option>
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
            <el-table-column prop="memberName" label="会员账号" align="center"></el-table-column>
            <el-table-column prop="orderAmount" label="订单金额" align="center">
                <template slot-scope="scope">￥{{scope.row.orderAmount}}</template>
            </el-table-column>
            <el-table-column prop="paymentName" label="支付方式" align="center"></el-table-column>
            <el-table-column prop="orderStatus" label="订单状态" align="center">
                    <template slot-scope="scope">
                        <!-- 待付款 -->
                        <span v-if="scope.row.orderStatus==10">待付款</span>
                         <!-- 待发货 -->
                        <span v-else-if="scope.row.orderStatus==20">付款中</span>
                        <span v-else-if="scope.row.orderStatus==30">待审核</span>
                        <span v-else-if="scope.row.orderStatus==35">审核未通过</span>
                        <span v-else-if="scope.row.orderStatus==40">lakala申报中</span>
                        <span v-else-if="scope.row.orderStatus==50">lakala申报失败</span>
                        <span v-else-if="scope.row.orderStatus==60">待日方发货</span>
                        <!-- 待收货 -->
                        <span v-else-if="scope.row.orderStatus==70">日方取消订单</span>
                        <span v-else-if="scope.row.orderStatus==80">JD申报中</span>
                        <span v-else-if="scope.row.orderStatus==90 || scope.row.orderStatus==100">JD申报失败</span>
                        <span v-else-if="scope.row.orderStatus==110">清关中</span>
                        <!-- <span v-else-if="scope.row.orderStatus==120">清关失败</span> -->
                        <span v-else-if="scope.row.orderStatus==120">待收货</span>
                        <!-- 已完成 -->
                        <span v-else-if="scope.row.orderStatus==140">交易完成</span>
                        <span v-else-if="scope.row.orderStatus==0">已取消</span>
                    </template>
            </el-table-column>
            <!-- :formatter="orderState" -->
            <el-table-column prop="orderType" label="订单类型" align="center" ></el-table-column>
            <el-table-column label="操作" align="center" width="200">
                <template slot-scope="scope">
                    <!-- <el-button type="primary" @click="submitStore()">{{ $t('confirm') }}</el-button> -->
                    <el-button size="mini" type="text" @click="orderDetFn(scope.row)">查看</el-button>
                    <el-button size="mini" type="text" @click="cancleOrderFn(scope.row)"   v-if="scope.row.orderStatus==10  ||   scope.row.orderStatus==50 || scope.row.orderStatus==70 || scope.row.orderStatus==90 || scope.row.orderStatus==100">取消订单</el-button>
                    <el-button size="mini" type="text" @click="exammineFn(scope.row)" v-if="scope.row.orderStatus==30">审核</el-button>
                    <!-- JD申报失败 -->
                    <el-button size="mini" type="text" @click="declareSthFn(scope.row,'jd')" v-if="scope.row.orderStatus==100">重新申报</el-button>
                    <!-- <el-button size="mini" type="text"  @click="clearancFailureFn(scope.row)"  v-if="scope.row.orderStatus==80">清关失败</el-button>
                    <el-button size="mini" type="text"  @click="writeLogisticsInfo(scope.row)"  v-if="scope.row.orderStatus==80">填写物流</el-button> -->
                    <!-- tudo lakala申报失败,申报失败需要重新申报，和JD申报失败重新申报调不一样的接口  -->
                    <el-button size="mini" type="text" @click="declareSthFn(scope.row,'lakala')" v-if="scope.row.orderStatus==50">重新申报</el-button>
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
        
        <!-- 申报 -->
        <declareSth v-if="declareSthVisible" ref="declareSthCompon" @searchDataList="getDataList"></declareSth>
         <!-- 审核 -->
        <exammine v-if="exammineVisible" ref="exammineCompon" @searchDataList="getDataList"></exammine>
        <!-- 取消订单弹框 -->
        <cancleOrder v-if="cancleOrderVisible" ref="cancleOrderCompon" @searchDataList="getDataList"></cancleOrder>
         <!-- 清关失败 -->
        <clearancFailure v-if="clearancFailureVisible" ref="clearancFailureCompon" @searchDataList="getDataList"></clearancFailure>
         <!-- 填写物流 -->
        <writeLogisticsInfo v-if="writeLogisticsInfoVisible" ref="writeLogisticsInfoCompon" @searchDataList="getDataList"></writeLogisticsInfo>

    </div>
    <!-- <orderDet
            v-else-if="detailOrList==2"
            @changePage="changePage"
            :data="data"
            :addressInfo="addressInfo"
            :orderLog="orderLog"
            :orderData="orderData"
    ></orderDet>
    <discountDet v-else @changeState="changeState"></discountDet> -->
</template>

<script>
    import Bread from "@/components/bread";
    import { orderlists } from "@/api/url";
    import { orderDetail, paymentList } from "@/api/api";
    // import discountDet from "./discountDet";
    // import orderDet from "./orderDet";
    import declareSth from '../modules/model-declare-sth.vue'
    import clearancFailure from '../modules/model-clearanc-failure.vue'
    import writeLogisticsInfo from '../modules/model-write-logistics-info.vue'
    import exammine from '../modules/model-exammine.vue'
    import cancleOrder from '../modules/model-cancle-order.vue'
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
                breaddata: ["订单系统", "待处理订单", "订单列表"],
                dataListLoading: false,
                clearancFailureVisible:false,
                writeLogisticsInfoVisible:false,
                declareSthVisible:false,
                exammineVisible:false,
                cancleOrderVisible:false,
                detailOrList: 1,
                tableData: [],
                orderData: [],
                dataForm: {
                    topStatus:"all",// 顶部状态 all全部 waitpay待付款 waitshipped待发货 waitreceived待收货 complete交易成功 cancel订单取消
                    orderStatus:"",//10待付款、20付款中、30待审核、40申报中、50申报失败、60待发货、70日方取消订单、80清关中、90待收货、100交易完成、110拒收、0已取消
                    orderSn: "",
                    storeIdAndName: "",
                    memberName: "",
                    paymentId: "",
                    // paymentStatus: "",
                    startTime: "",
                    endTime: "",
                    // endPaymentTime: "",
                    // startPaymentTime: "",
                    orderType: "",//订单类型：bc,cc
                    isWaitDeal:'1',//是否为等待处理订单 0不是 1是 默认为不是
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
                // orderState: function(row, column) {
                //     return row.orderStatus == 0 ? (
                //         <el-tag type="info">已取消</el-tag>
                // ) : row.orderStatus == 10 ? (
                //         <el-tag type="warning">待付款</el-tag>
                // ) : row.orderStatus == 20 ? (
                //         <el-tag type="warning">待发货</el-tag>
                // ) : row.orderStatus == 30 ? (
                //         <el-tag type="warning">待收货</el-tag>
                // ) : (
                //     <el-tag type="success">交易完成</el-tag>
                // );
                // }
            };
        },
        props: ["status"],
        components: {
            Bread,
            declareSth,
            clearancFailure,
            writeLogisticsInfo,
            cancleOrder,
            exammine,
            // orderDet,
            // discountDet
        },
        created() {
            //处理不同状态
            // this.dataForm.orderStatus = this.status == undefined ? "" : this.status;
            // this.getPaymentList();
            this.getDataList().then((res)=>{
                this.dataList = res.data.page.list;
                this.topNum = res.data.orderListTopVO;
                this.total = res.data.page.total;
            })
        },
        methods: {
            orderDetFn(row){
                this.$emit("orderDetFn",row);
            },
            getData() {
                this.dataForm.startTime = this.timeArr && this.timeArr[0];
                this.dataForm.endTime = this.timeArr && this.timeArr[1];
                // this.dataForm.startPaymentTime = this.timeArr2[0];
                // this.dataForm.endPaymentTime = this.timeArr2[1];
                this.page = 1;
                this.limit = 10;
                // this.dataForm.orderStatus  = this.dataForm.orderStatus 
                // this.getDataList();
                this.getDataList().then((res)=>{
                    this.dataList = res.data.page.list;
                    this.topNum = res.data.orderListTopVO;
                    this.total = res.data.page.total;
                })
            },
            //订单支付方式
            // getPaymentList() {
            //     paymentList().then(res => {
            //         if (res.code == 200) {
            //             this.paymentList = res.data;
            //         } else {
            //             this.$message({
            //                 type: "warning",
            //                 message: res.msg
            //             });
            //         }
            //     });
            // },
            //重置
            reset(formName) {
                this.timeArr = [];
                this.timeArr2 = [];
                this.dataForm.startTime = "";
                this.dataForm.endtime = "";
                // this.dataForm.startPaymentTime = "";
                // this.dataForm.endPaymentTime = "";
                this.$refs[formName].resetFields();
                this.page = 1;
                this.limit = 10;
                // this.getDataList();
                this.getDataList().then((res)=>{
                    this.dataList = res.data.page.list;
                    this.topNum = res.data.orderListTopVO;
                    this.total = res.data.page.total;
                })
            },
            // //返回页 1-列表  3-优惠详情
            // changePage(data) {
            //     console.log(data);
            //     this.detailOrList = data;
            //     this.$emit("showListFn");
            // },
            // //返回详情页 2-详情页
            // changeState(data) {
            //     this.detailOrList = data;
            //     this.$emit("showListFn");
            // },
            // //订单详情
            // handleEdit(index) {
            //     const obj = { id: index.id };
            //     orderDetail(obj).then(res => {
            //         if (res.code == 200) {
            //             this.addressInfo = res.data.orderAddressDTO; //收货人信息
            //             this.orderData = res.data.orderGoodsDTOList;
            //             this.orderLog = res.data.orderLogisticsLogDTOList; //物流
            //             this.packageInfo = res.data.orderLogDTOList; //订单状态
            //             this.data = res.data;
            //             this.detailOrList = 2;
            //         } else {
            //             this.$message({
            //                 type: "warning",
            //                 message: res.msg
            //             });
            //         }
            //     });
            // },
             // 清关失败
            clearancFailureFn(row){
                this.clearancFailureVisible = true;
                this.$nextTick(() => {
                    this.$refs.clearancFailureCompon.init(row)
                })
            },
            // 填写物流信息
            writeLogisticsInfo(row){
                this.writeLogisticsInfoVisible = true;
                this.$nextTick(() => {
                    this.$refs.writeLogisticsInfoCompon.init()
                })
            },
              // 申报
            exammineFn(row){
                this.exammineVisible = true;
                this.$nextTick(() => {
                   this.$refs.exammineCompon.init(row)
                })
            },
             // 审核
            declareSthFn(row,type){
                this.declareSthVisible = true;
                this.$nextTick(() => {
                   this.$refs.declareSthCompon.init(row,type)
                })
            },
            // 取消订单
           cancleOrderFn(row){
                this.cancleOrderVisible = true;
                this.$nextTick(() => {
                   this.$refs.cancleOrderCompon.init(row)
                })
            },
        },
        
    };
</script>
<style lang="scss" scoped>
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
    /deep/ .cell {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>
