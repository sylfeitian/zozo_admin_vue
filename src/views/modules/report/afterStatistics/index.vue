<template>
    <div>
        <Bread  :breaddata="breaddata"></Bread>
        <el-form
                :inline="true"
                class="grayLine topGapPadding"
                :model="dataForm"
                @keyup.enter.native="getDataList()"
        >
            <el-form-item label="售后单号：">
                <el-input v-model.trim="dataForm.aftersaleSn" placeholder="请输入售后单号" clearable ></el-input>
            </el-form-item>
            <el-form-item label="订单号：">
                <el-input v-model.trim="dataForm.orderSn" placeholder="请输入订单号" clearable ></el-input>
            </el-form-item>
            <el-form-item label="商品名称：">
                <el-input v-model.trim="dataForm.goodsName" placeholder="请输入商品名称" clearable ></el-input>
            </el-form-item>
            <el-form-item label="商品ID：">
                <el-input v-model.trim="dataForm.spuid" placeholder="请输入spuID" clearable></el-input>
            </el-form-item>
            <el-form-item label="申请时间：">
                <el-date-picker
                        v-model="valuetime1"
                        type="datetimerange"
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd  HH:mm:ss"
                        :default-time="['00:00:00', '23:59:59']"
                        @blur='acttime1'>
                </el-date-picker>
            </el-form-item>
            <el-form-item label="退款时间：">
                <el-date-picker
                        v-model="valuetime2"
                        type="datetimerange"
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd  HH:mm:ss"
                        :default-time="['00:00:00', '23:59:59']"
                        @blur='acttime2'>
                </el-date-picker>
            </el-form-item>
            <el-form-item  label="退款路径：">
                <el-select v-model="dataForm.payType" placeholder="请选择">
                    <el-option
                            v-for="item in operateShopStore"
                            :key="item.payType"
                            :label="item.name"
                            :value="item.payType">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item  label="售后类型：">
                <el-select v-model="dataForm.refundType" placeholder="请选择">
                    <el-option
                            v-for="item in operateShopStore2"
                            :key="item.refundType"
                            :label="item.name"
                            :value="item.refundType">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item  label="售后状态：">
                <el-select v-model="dataForm.status" placeholder="请选择">
                    <el-option
                            v-for="item in operateShopStore3"
                            :key="item.status"
                            :label="item.name"
                            :value="item.status">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button class="btn" type="primary" @click="getData()">搜索</el-button>
                <el-button class="btn"type="primary" plain @click="reset()" >重置</el-button>
            </el-form-item>
            <el-form-item>
                <importAndExport :importAndExportOptions="importAndExportOptions" :dataForm="dataForm"  @getDataList="getDataList"></importAndExport>
            </el-form-item>
        </el-form>
        <el-table
                width="100%"
                :data="dataList"
                border
                v-loading="dataListLoading"
                style="width: 100%;"
        >
            <el-table-column prop="aftersaleSn" label="售后单号" align="center"></el-table-column>
            <el-table-column prop="orderSn" label="订单号" align="center"></el-table-column>
            <el-table-column prop="applyDate" label="申请时间" align="center"></el-table-column>
            <el-table-column prop="returnDate" label="退款时间" align="center"></el-table-column>
            <el-table-column prop="status" label="售后状态" align="center">
                   <!-- （退货退款 10待审核、20待退货、30待入库、40待退款、50退款中、60退款完成、70退款失败、80售后取消） 仅退款（10退款中、20退款完成、30退款失败） -->
                    <template slot-scope="scope">
                        <div v-if="scope.row.aftersaleType == 0" >
                            <el-tag v-if="scope.row.auditStatus==0" type="danger">待审核</el-tag>
                            <el-tag v-else-if="scope.row.auditStatus==2" type="danger">审核不通过</el-tag>
                            <el-tag v-else-if="scope.row.auditStatus==3" type="danger">已取消</el-tag>
                            <!-- 审核通过 -->
                            <div  v-else-if="scope.row.auditStatus==1">
                                <el-tag v-if="scope.row.status==10" type="danger">待退货</el-tag>
                                <el-tag v-else-if="scope.row.status==20" type="danger">待入库</el-tag>
                                <el-tag v-else-if="scope.row.status==30" type="danger">待退款</el-tag>
                                <el-tag v-else-if="scope.row.status==40" type="danger">退款中</el-tag>
                                <el-tag v-else-if="scope.row.status==50" type="danger">退款完成</el-tag>
                                <el-tag v-else-if="scope.row.status==60" type="danger">退款失败</el-tag>
                                <el-tag v-else-if="scope.row.status==70" type="danger">售后取消</el-tag>
                            </div>
                        </div>
                        <div v-if="scope.row.aftersaleType == 1" >
                            <el-tag v-if="scope.row.status==10" type="danger">退款中</el-tag>
                            <el-tag v-else-if="scope.row.status==20" type="danger">退款完成</el-tag>
                            <el-tag v-else-if="scope.row.status==30" type="danger">退款失败</el-tag>
                        </div>
                    </template>
            </el-table-column>
            <el-table-column prop="aftersaleType" label="售后类型" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.aftersaleType == 0" >退货退款</span>
                    <span v-if="scope.row.aftersaleType == 1" >仅退款</span>
                </template>
            </el-table-column>
            <el-table-column prop="payTypeDec" label="退款路径" align="center">
                <!-- <template slot-scope="scope">
                    <span v-if="scope.row.payTypeDec == 1" >微信支付</span>
                    <span v-if="scope.row.payTypeDec == 2" >支付宝</span>
                </template> -->
            </el-table-column>
            <el-table-column prop="realRefundAmount" label="退款金额" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.status==50 || (scope.row.status==20&&scope.row.aftersaleType == 1)">￥{{scope.row.realRefundAmount}}</span>
                    <span v-else>￥0.00</span>
                </template>
            </el-table-column>
            <el-table-column prop="skuid" label="SKUID" align="center"></el-table-column>
            <el-table-column prop="goodsName" label="商品名称" align="center"></el-table-column>
            <el-table-column prop="spuid" label="商品ID（SPU）" align="center"></el-table-column>
            <el-table-column prop="storeName" label="店铺" align="center"></el-table-column>
            <el-table-column prop="brandName" label="品牌" align="center"></el-table-column>
            <el-table-column prop="reason" label="售后原因" align="center"></el-table-column>
            <el-table-column prop="goodsNum" label="退款数量" align="center"></el-table-column>
            <el-table-column prop="realSalePrice" label="退款金额（件）" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.status==50 || (scope.row.status==20&&scope.row.aftersaleType == 1)">￥{{scope.row.realSalePrice}}</span>
                    <span v-else>￥0.00</span>
                </template>
            </el-table-column>
            <el-table-column prop="JpCancelOrderSn" label="日方取消订单号" align="center"></el-table-column>

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
    </div>
</template>

<script>
    import mixinViewModule from '@/mixins/view-module'
    import Bread from "@/components/bread";
    import importAndExport from "@/components/import-and-export"
    import {afterStorePage} from "@/api/url"
    import {afterExportRegisterUrl} from "@/api/io.js"
    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                mixinViewModuleOptions: {
                    getDataListURL: afterStorePage,
                    getDataListIsPage: true,
                    exportURL: "",
                    // deleteURL: deleteAttributeUrl,
                    deleteIsBatch: true,
                    deleteIsBatchKey: "id"
                },
                importAndExportOptions:{
                    exportUrl:afterExportRegisterUrl,//导出接口
                    exportWord:"导出数据",
                },
                breaddata: [ "报表中心", "售后统计"],
                operateShopStore:[ {payType: '', name: '全部' },{ payType: 'alipay', name: '支付宝' },{ payType: 'wechat', name: '微信' }],//统计维度
                operateShopStore2:[{refundType:"",name:"全部"},{refundType:"0",name:"退货退款"},{refundType:"1",name:"仅退款"}],
                operateShopStore3:[{status:"",name:"全部"},{status:"0",name:"待审核"},{status:"10",name:"待退货"},{status:"20",name:"待入库"},{status:"30",name:"待退款"},{status:"50",name:"退款完成"},{status:"70",name:"售后取消"}],
                valuetime1:"",
                valuetime2:"",
                dataForm: {
                    aftersaleSn:"",
                    orderSn:"",
                    goodsName:"",
                    spuid:"",
                    applyStartTime:"",
                    applyEndTime:"",
                    refundStartTime:"",
                    refundEndTime:"",
                    payType:"",
                    refundType:"",
                    status:""
                },
                dataList: [],
                dataListLoading: false,
            }
        },
        components: {
            Bread,
            importAndExport
        },
        watch:{
            //商品名称搜索框可输入中英文、数字、常用字符，统一最多可输入300字符；2个字符等于1个汉字
            'dataForm.goodsName':function(newV,oldV) {
                                var chineseCount = 0,characterCount = 0;
                                for (let i = 0; i < newV.length; i++) {
                                    if (/^[\u4e00-\u9fa5]*$/.test(newV[i])) { //汉字
                                        chineseCount = chineseCount + 2;
                                    } else { //字符
                                        characterCount = characterCount + 1;
                                    }
                                    var count = chineseCount + characterCount;
                                    if (count > 300) { //输入字符大于300的时候过滤
                                        this.dataForm.goodsName = newV.substr(0,(chineseCount/2+characterCount)-1)
                                    }
                                }
                            },
            // ID类搜索框仅可输入数字、英文，最多可输入30个字符
            'dataForm.aftersaleSn':function(newV,oldV) {
                            for(let i=0;i<newV.length;i++){
                                if(!/[a-zA-Z0-9\s]/.test(newV[i])){
                                    this.dataForm.aftersaleSn = newV.replace(newV[i],"")
                                }
                            }
                            if(newV.length>30){
                                this.dataForm.aftersaleSn = newV.substr(0,30)
                            }
                        },
            'dataForm.orderSn':function(newV,oldV) {
                            for(let i=0;i<newV.length;i++){
                                if(!/[a-zA-Z0-9\s]/.test(newV[i])){
                                    this.dataForm.orderSn= newV.replace(newV[i],"")
                                }
                            }
                            if(newV.length>30){
                                this.dataForm.orderSn= newV.substr(0,30)
                            }
                        },
            'dataForm.spuid':function(newV,oldV) {
                for(let i=0;i<newV.length;i++){
                    if(!/[a-zA-Z0-9\s]/.test(newV[i])){
                        this.dataForm.spuid = newV.replace(newV[i],"")
                    }
                }
                if(newV.length>30){
                    this.dataForm.spuid = newV.substr(0,30)
                }
            }
        },
        created () {
            this.getDataList();
        },
        methods: {
            getData() {
                this.page =1;
                this.getDataList();
            },
            acttime1(){
                this.dataForm.applyStartTime = this.valuetime1[0] || '';
                this.dataForm.applyEndTime = this.valuetime1[1] || '';
            },
            //开始结束时间
            acttime2(){
                this.dataForm.refundStartTime = this.valuetime2[0] || '';
                this.dataForm.refundEndTime = this.valuetime2[1] || '';
            },
            // 重置
            reset() {
                this.valuetime1 = "";
                this.valuetime2 = "";
                this.dataForm = {
                        aftersaleSn:"",
                        orderSn:"",
                        goodsName:"",
                        spuid:"",
                        applyStartTime:"",
                        applyEndTime:"",
                        refundStartTime:"",
                        refundEndTime:"",
                        payType:"",
                        refundType:"",
                        status:""
                };
                this.getDataList();
            },
        }
    }
</script>

<style scoped>

</style>