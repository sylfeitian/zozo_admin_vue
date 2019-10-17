<template>
    <div v-if="isOrderDet">
        <Bread :breaddata="breaddata"></Bread>
        <el-form
                :inline="true"
                ref="dataForm"
                class="grayLine topGapPadding"
                :model="dataForm"
        >
            <el-form-item label="售后单号：" prop="aftersaleSn">
                <el-input v-model="dataForm.aftersaleSn" placeholder="请输入售后单号" clearable></el-input>
            </el-form-item>
            <el-form-item label="订单号：" prop="orderSn">
                <el-input v-model="dataForm.orderSn" placeholder="请输入订单号" clearable></el-input>
            </el-form-item>
<!--            <el-form-item label="商户名称：" prop="storeName">-->
<!--                <el-input v-model="dataForm.storeName" placeholder="商户名称" clearable></el-input>-->
<!--            </el-form-item>-->
            <el-form-item label="会员账号：" prop="memberName">
                <el-input v-model="dataForm.memberName" placeholder="请输入会员账号" clearable></el-input>
            </el-form-item>
            <el-form-item label="售后状态：" prop="status">
                <!-- 110退款中、20退款完成、30退款失败 -->
                <el-select v-model="dataForm.status" placeholder="请选择">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="退款中" value="10"></el-option>
                    <el-option label="退款完成" value="20"></el-option>
                    <el-option label="退款失败" value="30"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="申请时间：">
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
                <el-button class="btn" type="primary" @click="getData()">搜索</el-button>
                <el-button
                        class="btn"
                        type="primary"
                        plain
                        @click="resetForm('dataForm')"
                        style="/color:#999999FF;"
                >重置</el-button>
            </el-form-item>
            <br>
            <!-- <el-form-item>
                      <el-button ca/lss="btn" @click="exForm()" style="color:#999999FF;">导出</el-button>
            </el-form-item>-->
        </el-form>
        <el-table
                width="100%"
                :data="dataList"
                border=""
                v-loading="dataListLoading"
                style="width: 100%;maigin-top:20px;"
        >
            <el-table-column prop="aftersaleSn" label="售后单号" align="center"></el-table-column>
            <el-table-column prop="orderSn" label="订单编号" align="center">
                 <template slot-scope="scope">
                     <el-button size="mini" type="text" @click="orderDetFn(scope.row)">{{scope.row.orderSn}}</el-button>
                </template>
            </el-table-column>
            <!--<el-table-column prop="goodsName" label="商品名称" align="center"></el-table-column>-->
            <el-table-column prop="memberName" label="会员账号" align="center"></el-table-column>
            <el-table-column prop="createDate" label="申请时间" align="center"></el-table-column>
            <el-table-column prop="goodsNum" label="售后数量" align="center" width="100"></el-table-column>
            <el-table-column prop="refundAmount" label="退款金额" align="center">
                <template slot-scope="scope">￥{{scope.row.refundAmount}}</template>
            </el-table-column>
            <el-table-column
                    prop="status"
                    label="售后状态"
                    align="center"
            >
            <!-- :formatter="statusRules" -->
                     <template slot-scope="scope">
                        <el-tag v-if="scope.row.auditStatus==0" type="danger">待审核</el-tag>
                        <el-tag v-else-if="scope.row.auditStatus==2" type="danger">审核不通过</el-tag>
                        <el-tag v-else-if="scope.row.auditStatus==3" type="danger">已取消</el-tag>
                        <!-- 审核通过 -->
                        <div  v-else-if="scope.row.auditStatus==1">
                            <el-tag v-if="scope.row.status==10" type="danger">退款中</el-tag>
                            <el-tag v-else-if="scope.row.status==20" type="danger">退款完成</el-tag>
                            <el-tag v-else-if="scope.row.status==30" type="danger">退款失败</el-tag>
                        </div>
                    </template>
            </el-table-column>
            <el-table-column label="操作" min-width="100" align="center" width="200">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" @click="afterSaleDetailFn(scope.row)">查看</el-button>
                    <el-button size="mini" type="text" @click="returnMoneyFn(scope.row)"   v-if="scope.row.status==40">同意退款</el-button>
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

        <!-- 退款 -->
        <returnMoneyModel v-if="returnMoneyVisible" ref="returnMoneyCompon"></returnMoneyModel>
    </div>
</template>
<script>
    import Bread from "@/components/bread";
    import { returngoods, exportsales } from "@/api/url";
    import { returnDetail } from "@/api/api";
    import mixinViewModule from "@/mixins/view-module";
      import returnMoneyModel from "../modules-return/model-return-money";
    export default {
        mixins: [mixinViewModule],
        data() {
            return {
                mixinViewModuleOptions: {
                    getDataListURL: returngoods,
                    getDataListIsPage: true,
                    exportURL: exportsales,
                    // deleteURL: deleteAttributeUrl,
                    deleteIsBatch: true,
                    deleteIsBatchKey: "id"
                },
                goodsData: [],
                isOrderDet: true,
                breaddata: ["订单系统", "售后管理", "退货管理"],
                detdata: ["订单系统", "售后管理", "退货管理", "退货详情"],
                tableData: [],
                timeArr: "", //下单时间
                dataForm: {
                    aftersaleSn:"",//售后单号
                    orderSn:"",//订单编号
                    memberName:"",//会员账号
                    status:"",//售后状态 退货退款（10待审核、20待退货、30待入库、40待退款、50退款中、60退款完成、70退款失败、80售后取消）；仅退款（10退款中、20退款完成、30退款失败）
                    startTime:"",//申请开始时间
                    endTime:"",//申请结束时间
                    type:"1",//类型 0退货退款 1仅退款
                },
                piclist: [],
                changeVal: "",
                totalPage: 0,
                dataListLoading: false,
                detailOrList: true,
                 returnMoneyVisible:false,
                goodsData: [], //售后商品table
                saleGoods: [], //售后申请数据
                params: {
                    currentPage: 1, //当前页数
                    currentPageSize: 10 //每页显示的条数
                },
                // statusRules: function(row, column) {
                //     return row.status== 10 ? (
                //         <el-tag type="info">退款中</el-tag>
                // ) : row.status == 20 ? (
                //         <el-tag type="success">退款完成</el-tag>
                // ) : row.status == 30 ? (
                //         <el-tag type="warning">退款失败</el-tag>
                // ) : (<span></span>)
                // }
            };
        },
        components: {
             Bread,
             returnMoneyModel
        },
        methods: {
             orderDetFn(row){
                  row.id = row.orderId
                this.$emit("orderDetFn",row);
            },
             afterSaleDetailFn(row){
                this.$emit("afterSaleDetailFn",row);
            },
            //导出
            exForm() {
                this.exportHandle();
            },
            //重置
            resetForm(formName) {
                this.timeArr = [];
                this.dataForm.startTime = "";
                this.dataForm.endTime = "";
                this.$refs[formName].resetFields();
                this.page = 1;
                this.limit = 10;
                this.getDataList();
            },
            //条件查询
            getData() {
                this.dataForm.startTime = this.timeArr && this.timeArr[0];
                this.dataForm.endTime = this.timeArr && this.timeArr[1];
                this.page = 1;
                this.limit = 10;
                this.getDataList();
            },
            //查看详情
            handleGoodDet(id) {
                const obj = {
                    aftersaleSn: id
                };
                returnDetail(obj).then(res => {
                    if (res.code == 200) {
                        this.isOrderDet = false;
                        console.log(res.data);
                        this.aftersale = res.data.aftersaleApplyDTO;
                        this.saleGoods = res.data.aftersaleGoodsDTOList;
                        this.returnInfo = res.data.aftersaleReturnDTO;
                        this.saleAuditLog = res.data.aftersaleAuditLogDTOList[0]; //商家审核数据
                        this.adminAuditLog = res.data.aftersaleAuditLogDTOList[1] ||''; //平台审核数据
                        this.logList = res.data.aftersaleLogListDTOList; //操作日志
                        this.piclist = this.aftersale.aftersalePics.split(",");
                    } else {
                        this.$message({
                            type: "warning",
                            message: res.msg
                        });
                    }
                });
            },
            //返回上一级
            // changePage() {
            //     this.isOrderDet = !this.isOrderDet;
            //     // console.log("列表页面");
            //     this.$emit("showListFn");
            // },
             // 同意退货
             returnMoneyFn(row){
                this.returnMoneyVisible = true;
                this.$nextTick(() => {
                   this.$refs.returnMoneyCompon.init(row)
                })
            },
        }
    };
</script>
<style lang="scss" scoped>
    .creater {
        display: inline-block;
        width: 80px;
        margin: 0 15px;
    }
    .el-table--border {
        margin-top: 20px;
    }
    .el-radio-group {
        margin-top: 20px;
    }
    .orderState {
        /* width: 100%; */
        border: 1px solid #d1d1d1;
        height: 80px;
        display: flex;
        align-items: center;
    }
    .imglist {
        width: 100px;
        height: 100px;
    }
    .right {
        margin-right: 15px;
    }
    .orderState div {
        margin-left: 5%;
    }
    .orderState div .nums {
        color: red;
    }
    .buyerInfo {
        flex-direction: column;
    }
    .buyerInfo,
    .sellerInfo,
    .goodsLog,
    .goods,
    .operationList {
        border: 1px solid #e1e1e1;
        margin-top: 10px;
        padding: 10px 10px 20px 10px;
    }
    .inforTit {
        width: 100px;
        font-weight: 600;
        text-align: right;
        display: inline-block;
    }
    .inforRight {
        margin-left: 40px;
        display: inline-block;
    }
    .buyerInfo span,
    .sellerInfo span,
    .goodsLog span {
        margin-top: 20px;
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
