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
            <el-form-item label="订单号：" prop="specSerial">
                <el-input v-model="dataForm.specSerial" placeholder="请输入订单号" clearable></el-input>
            </el-form-item>
            <!--            <el-form-item label="商户名称：" prop="storeName">-->
            <!--                <el-input v-model="dataForm.storeName" placeholder="商户名称" clearable></el-input>-->
            <!--            </el-form-item>-->
            <el-form-item label="会员账号：" prop="memberName">
                <el-input v-model="dataForm.memberName" placeholder="请输入会员账号" clearable></el-input>
            </el-form-item>
            <el-form-item label="售后状态：" prop="paymentStatus">
                <el-select v-model="dataForm.paymentStatus" placeholder="请选择">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="未付款" value="0"></el-option>
                    <el-option label="已付款" value="1"></el-option>
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
                <el-button class="btn" type="primary" @click="getData()">查询</el-button>
                <el-button
                        class="btn"
                        type="primary"
                        plain
                        @click="resetForm('dataForm')"
                        style="color:#999999FF;"
                >重置</el-button>
            </el-form-item>
            <br>
            <!-- <el-form-item>
                      <el-button calss="btn" @click="exForm()" style="color:#999999FF;">导出</el-button>
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
            <el-table-column prop="specSerial" label="订单编号" align="center"></el-table-column>
            <!--            <el-table-column prop="goodsName" label="商品名称" align="center"></el-table-column>-->
            <el-table-column prop="memberName" label="会员账号" align="center"></el-table-column>
            <el-table-column prop="createDate" label="申请时间" align="center"></el-table-column>
            <el-table-column prop="number" label="售后数量" align="center" width="100"></el-table-column>
            <el-table-column prop="refundAmount" label="退款金额" align="center">
                <template slot-scope="scope">￥{{scope.row.refundAmount}}</template>
            </el-table-column>
            <el-table-column
                    prop="aftersaleStatus"
                    label="售后状态"
                    align="center"
                    :formatter="statusRules"
            ></el-table-column>
            <el-table-column label="操作" min-width="100" align="center">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" @click="handleGoodDet(scope.row.aftersaleSn)">审核</el-button>
                    <el-button size="mini" type="text" @click="handleGoodDet(scope.row.aftersaleSn)">确认收货</el-button>
                    <el-button size="mini" type="text" @click="handleGoodDet(scope.row.aftersaleSn)">同意退款</el-button>
                    <el-button size="mini" type="text" @click="handleGoodDet(scope.row.aftersaleSn)">查看</el-button>
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
</template>
<script>
    import Bread from "@/components/bread";
    import { returngoods, exportsales } from "@/api/url";
    import { returnDetail } from "@/api/api";
    import mixinViewModule from "@/mixins/view-module";
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
                status: [
                    { title: "所有退货订单", id: "" },
                    { title: "待退货入库", id: "3" },
                    { title: "退款中", id: "4" },
                    { title: "退款成功", id: "5" },
                    { title: "用户取消", id: "1" }
                ],
                tableData: [],
                timeArr: "", //下单时间
                dataForm: {
                    aftersaleSn: "",
                    specSerial: "",
                    storeName: "",
                    memberName: "",
                    goodnum: "",
                    startTime: "",
                    endTime: ""
                },
                piclist: [],
                changeVal: "",
                totalPage: 0,
                dataListLoading: false,
                detailOrList: true,
                goodsData: [], //售后商品table
                saleGoods: [], //售后申请数据
                params: {
                    currentPage: 1, //当前页数
                    currentPageSize: 10 //每页显示的条数
                },
                statusRules: function(row, column) {
                    return row.aftersaleStatus == 1 ? (
                        <el-tag type="danger">用户取消</el-tag>
                ) : row.aftersaleStatus == 2 ? (
                        <el-tag type="info">退款失败</el-tag>
                ) : row.aftersaleStatus == 3 ? (
                        <el-tag type="warning">待退货入库</el-tag>
                ) : row.aftersaleStatus == 4 ? (
                        <el-tag type="warning">退款中</el-tag>
                ) : row.aftersaleStatus == 5 ? (
                        <el-tag type="success">退款成功</el-tag>
                ) : row.aftersaleStatus == 6 ? (
                        <el-tag type="info">换货失败</el-tag>
                ) : row.aftersaleStatus == 7 ? (
                        <el-tag type="warning">待换货入库</el-tag>
                ) : row.aftersaleStatus == 8 ? (
                        <el-tag type="warning">换货出库中</el-tag>
                ) : (
                    <el-tag type="success">换货成功</el-tag>
                );
                }
            };
        },
        components: { Bread },
        methods: {
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
            changePage() {
                this.isOrderDet = !this.isOrderDet;
                // console.log("列表页面");
                this.$emit("showListFn");
            }
        }
    };
</script>
<style scoped>
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
</style>
