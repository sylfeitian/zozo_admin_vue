<template>
    <div>
        <Bread :breaddata="breaddata" @changePage="goBack" :index="'2'"></Bread>

       <div  v-loading="dataListLoading">
            <!-- 分割线------------------------------------------------ -->
            <h3>商品信息</h3>
            <el-table
                        width="100%"
                        :data="goodsInfo"
                        border=""
                        v-loading="dataListLoading1"
                        style="width: 100%;margin-top:20px;margin-bottom:60px;"
                >
                    <el-table-column label="商品图片" align="center">\
                        <template slot-scope="scope">
                            <img :src="scope.row.goodsImage | filterImgUrl" alt=""  style="width:80px;height:80px">
                        </template>
                    </el-table-column>
                    <el-table-column prop="goodsName" label="商品名称" align="center"></el-table-column>
                    <el-table-column prop="brandName" label="品牌" align="center"></el-table-column>
                    <el-table-column prop="storeName" label="店铺" align="center"></el-table-column>
                    <el-table-column prop="specName" label="规格" align="center"></el-table-column>
                    <el-table-column prop="goodsNum" label="数量" align="center"></el-table-column>
                    <el-table-column prop="sellPrice" label="商品售价" align="center">
                        <template slot-scope="scope">
                            <span>￥{{scope.row.sellPrice}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="dicountAmount" label="折扣" align="center">
                        <template slot-scope="scope">
                            <span>￥{{scope.row.dicountAmount}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="couponAmount" label="优惠券" align="center">
                        <template slot-scope="scope">
                            <span>￥{{scope.row.couponAmount}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="reduceAmount" label="满减金额" align="center">
                        <template slot-scope="scope">
                            <span>￥{{scope.row.reduceAmount}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="payAmount" label="实付金额" align="center">
                        <template slot-scope="scope">
                            <span>￥{{scope.row.payAmount}}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分割线------------------------------------------------ -->
                <h3>售后单信息</h3>
                <el-form
                        class="saleOrderInfo"
                        label-width="120px"
                        style="margin-bottom:40px;"
                >
                    <div class="formWarp formWarp1">
                            <el-form-item label="售后单号：" >
                                <span>{{returnInfo.aftersaleSn}}</span>
                            </el-form-item>
                            <el-form-item label="售后状态：">
                                <!-- 售后状态 退货退款（10待退货、20待入库、30待退款、40退款中、50退款完成、60退款失败、70售后取消） 仅退款（10退款中、20退款完成、30退款失败） , -->
                                <span v-if="returnInfo.auditStatus==0">待审核</span>
                                <span v-else-if="returnInfo.auditStatus==2">售后取消</span><!-- 审核不通过 -->
                                 <span v-else-if="returnInfo.auditStatus==3">售后取消</span><!-- 已取消 -->
                                <!-- 审核通过 -->
                                <div v-else-if="returnInfo.auditStatus==1">
                                    <span v-if="returnInfo.status==10">待退货</span>
                                    <span v-else-if="returnInfo.status==20">待入库</span>
                                    <span v-else-if="returnInfo.status==30">待退款</span>
                                    <span v-else-if="returnInfo.status==40">退款中</span>
                                    <span v-else-if="returnInfo.status==50">退款完成</span>
                                    <span v-else-if="returnInfo.status==60">退款失败</span>
                                    <span v-else-if="returnInfo.status==70">售后取消</span>
                                    <span v-else-if="returnInfo.status==80">推送日本异常</span>
                                </div>
                                <!-- <span v-if="returnInfo.status==10">退款中</span>
                                <span v-else-if="returnInfo.status==20">退款完成</span>
                                <span v-else-if="returnInfo.status==30">退款失败</span> -->
                            </el-form-item>

                            <el-form-item label="订单编号：" >
                                <span>{{returnInfo.orderSn}}</span>
                                <span @click="changeOrderDetFn(row)" style="margin-left: 20px;color: #2260D2;cursor:pointer;">查看</span>
                            </el-form-item>

                            <el-form-item label="申请时间：">
                            <span>{{returnInfo.createDate}}</span>
                            </el-form-item>

                            <el-form-item label="会员账号：" >
                                <span>{{returnInfo.memberName}}</span>
                            </el-form-item>

                            <el-form-item label="联系人：" >
                                <span>{{returnInfo.contacts }}</span>
                            </el-form-item>

                            <el-form-item label="联系方式：" >
                                <span>{{returnInfo.contactsPhone }}</span>
                            </el-form-item>



                            <el-form-item label="问题描述：" >
                                <span>{{returnInfo.aftersaleExplain }}</span>
                            </el-form-item>

                            <el-form-item label="图片：" >
                                <div v-for="(item,index) in aftersalePics ">
                                    <img id="oImg" :src="item | filterImgUrl" alt="" style="height:80px;width:auto" @click="handlePictureCardPreview(item)">
                                </div>
                            </el-form-item>
                    </div>

                    <div class="formWarp formWarp2">
                            <el-form-item label="退款金额：" >
                                <span v-if='returnInfo.shouldRefundAmount'>¥{{returnInfo.shouldRefundAmount}}</span>
                            </el-form-item>

                            <el-form-item label="确认退款金额：" >
                                <div v-if="row.auditStatus!=0">
                                     <span v-if='returnInfo.refundAmount'>¥{{returnInfo.refundAmount}}</span>
                                </div>
                               <!-- 审核时才能编辑 -->
                               <div v-else>
                                     <el-input-number v-if="returnInfo.refundAmount == ''" v-model="returnInfo.shouldRefundAmount"  :precision="2" :step="1" :min="0" :max="parseFloat(returnInfo.shouldRefundAmount)" controls-position="right"></el-input-number>
                                     <el-input-number v-else v-model="returnInfo.refundAmount"  :precision="2" :step="1" :min="0" :max="parseFloat(returnInfo.shouldRefundAmount)" controls-position="right"></el-input-number>
                               </div>
                            </el-form-item>

                            <el-form-item label="退货原因：" >
                                <span  v-if="row.auditStatus!=0">{{returnInfo.aftersaleReason}}</span>
                                  <!-- 审核时才能编辑 -->
                                <el-select
                                    v-else
                                    placeholder="请选择"
                                    loading-text="加载中···"
                                    @change ='changeWarehouse'>
                                    <el-option
                                        v-for="item in returnrReasonlist"
                                        :key="item.id"
                                        :label="item.content"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="退货仓：" >
                                <span v-if="row.auditStatus!=0">{{returnInfo.warehouse}}</span>
                                 <!-- 审核时才能编辑 -->
                                <el-select
                                    v-else
                                    v-model="returnInfo.warehouseId"
                                    placeholder="请选择"
                                    loading-text="加载中···"
                                    @change ='changeWarehouse'>
                                    <el-option
                                        v-for="item in warehouseList"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="收货人姓名：" >
                                <span>{{returnInfo.receiptName}}</span>
                            </el-form-item>

                            <el-form-item label="所在区域：" >
                            <span>{{returnInfo.province}} {{returnInfo.city}} {{returnInfo.area}}</span>
                            </el-form-item>

                            <el-form-item label="详细地址：" >
                            <span>{{returnInfo.address}}</span>
                            </el-form-item>

                            <el-form-item label="联系电话：" >
                            <span>{{returnInfo.receiptPhone}}</span>
                            </el-form-item>
                    </div>

                    <div class="formWarp formWarp3">
                        <el-form-item label="处理备注：" >
                            <span v-if="row.auditStatus!=0">{{returnInfo.remark}}</span>
                            <!-- 审核时才能编辑 -->
                            <el-input v-else v-model="returnInfo.remark" style="width:400px;"></el-input>
                        </el-form-item>
                    </div>
                </el-form>
           <el-dialog :visible.sync="dialogVisible" class="imgPreview">
               <img :style="{width:oImgWidth,height:oImgHeight}" :src="dialogImageUrl" alt="">
           </el-dialog>
                <!-- 分割线------------------------------------------------ -->
                <h3>操作日志</h3>
                <el-table
                    width="100%"
                    :data="logs"
                    border=""
                    v-loading="dataListLoading3"
                    style="width: 100%;maigin-top:20px;margin-bottom:40px;"
                >
                    <el-table-column prop="creator" label="操作者：" align="center"></el-table-column>
                    <el-table-column prop="createDate" label="操作时间：" align="center"></el-table-column>
                    <el-table-column prop="status" label="操作时售后单状态：" align="center">
                        <template slot-scope="scope">
                             <el-tag v-if="scope.row.status==0" type="danger">待审核</el-tag>
                            <el-tag v-else-if="scope.row.status==10" type="danger">待退货</el-tag>
                            <el-tag v-else-if="scope.row.status==20" type="danger">待入库</el-tag>
                            <el-tag v-else-if="scope.row.status==30" type="danger">待退款</el-tag>
                            <el-tag v-else-if="scope.row.status==40" type="danger">退款中</el-tag>
                            <el-tag v-else-if="scope.row.status==50" type="danger">退款完成</el-tag>
                            <el-tag v-else-if="scope.row.status==60" type="danger">退款失败</el-tag>
                            <el-tag v-else-if="scope.row.status==70" type="danger">售后取消</el-tag>
                            <span  v-else="info">——</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" min-width="100" align="center">
                        <template slot-scope="scope">
                                <span>{{scope.row.message}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="remark" label="备注" align="center"></el-table-column>
                </el-table>
                <!-- 待审核时候显示 -->
                <div class="bottomBtns" v-if="row.auditStatus ==0">
                    <el-button type="primary" @click="exammineFn(1)">通过</el-button>
                    <el-button type="danger"  @click="exammineFn(0)">不通过</el-button>
                </div>
                <!-- 待入库时候显示 -->
                <div class="bottomBtns" v-else-if="row.auditStatus ==1 && row.status ==20">
                    <el-button type="primary" @click="confirmGoodsFn(1)">确认收货</el-button>
                    <el-button type="danger"  @click="confirmGoodsFn(0)">未收货</el-button>
                </div>
                <!-- 待退款时显示 -->
                <div class="bottomBtns" v-if="row.auditStatus ==1 && row.status ==30">
                    <el-button type="primary" @click="returnMoneyFn(1)">同意退款</el-button>
                    <el-button type="danger" @click="returnMoneyFn(0)">拒绝退款</el-button>
                </div>
       </div>
        <!-- 详情 -->
        <orderDet v-if="orderDetVisible" ref="orderDetCompon" @orderDetListFn="orderDetListFn"  :breaddata="subBreaddata"></orderDet>
        <!-- 审核 -->
        <exammine v-if="exammineVisible" ref="exammineCompon" @searchDataList="getAfterSaleDetail"></exammine>
        <!-- 确认收货 -->
        <confirmGoodsModel v-if="confirmGoodsVisible" ref="confirmGoodsCompon" @searchDataList="getAfterSaleDetail"></confirmGoodsModel>
         <!-- 退款 -->
        <returnMoneyModel v-if="returnMoneyVisible" ref="returnMoneyCompon" @searchDataList="getAfterSaleDetail"></returnMoneyModel>
    </div>
</template>

<script>
    import {aftersaleReturnDetail,wareListByType,aftersaleReturnrReason,backScanWare  } from "@/api/api";
    import Bread from "@/components/bread";
    import exammine from '../modules-return/model-exammine.vue'
    import confirmGoodsModel from '../modules-return/model-confirm-goods.vue'
    import returnMoneyModel from "../modules-return/model-return-money";
    import orderDet from "../modules/orderDet"
    export default {
        data () {
            return {
                row:'',
                orderDetVisible:false,
                dataListLoading:false,
                dataListLoading1:false,
                dataListLoading2:false,
                dataListLoading3:false,
                exammineVisible:false,
                confirmGoodsVisible:false,
                returnMoneyVisible:false,
                goodsInfo:[],
                logs:[],
                returnInfo:{},
                 aftersalePics:[],
                warehouseList:[],
                returnrReasonlist:[],
                dialogImageUrl: '',
                dialogVisible: false,
                oImgWidth:'',
                oImgHeight:'',
                subBreaddata:[],
            }
        },
        props: ['breaddata'],
        components:{
            Bread,
            exammine,
            confirmGoodsModel,
            returnMoneyModel,
            orderDet
        },
        watch: {
            'returnInfo.remark': function (newV, oldV) {
                if(!newV){
                    return;
                }
                var chineseCount = 0, characterCount = 0;
                for (let i = 0; i < newV.length; i++) {
                    if (/^[\u4e00-\u9fa5]*$/.test(newV[i])) { //汉字
                        chineseCount = chineseCount + 2;
                    } else { //字符
                        characterCount = characterCount + 1;
                    }
                    var count = chineseCount + characterCount;
                    if (count > 600) { //输入字符大于600的时候过滤
                        this.returnInfo.remark = newV.toString().substr(0, (chineseCount / 2 + characterCount) - 1)
                    }
                }
            },
        },
        methods:{
             init(row){
                // row.aftersaleSn = 111;
                this.row = row;
                this.getAfterSaleDetail();
                // 售后状态 退货退款（10待审核、20待退货、30待入库、40待退款、50退款中、60退款完成、70退款失败、80售后取消）；仅退款（10退款中、20退款完成、30退款失败）
               if(this.row.auditStatus==0){
                   //只有待审核才能选择退货仓下拉
                    this.getWareListByType();
                    //只有待审核才能获取退换货原因下拉
                    this.getReason();
                }
            },
            orderDetListFn(){

            },
            // 点击放大图片
            handlePictureCardPreview(url) {
                // 拿到原图的宽高
                this.oImgWidth = document.getElementById("oImg").naturalWidth;
                this.oImgHeight = document.getElementById("oImg").naturalHeight;
                this.dialogVisible = true;
                if(url){
                    if(/http/.test(url)){
                        this.dialogImageUrl = url;
                    }else{
                        this.dialogImageUrl = window.SITE_CONFIG['imgURL'] + "" +url;
                    }
                }else{
                    this.dialogImageUrl = "http://morefun.image.alimmdn.com/xiaoBai/default.png"
                }


            },
            //详情页展示判断
            changeOrderDetFn(row) {
                console.log(row)
                // this.orderDetVisible = true;
                row.id = row.orderId;
                this.$emit("changeOrderDetFn", row);
                // this.$nextTick(()=>{
                //     this.$refs.orderDetCompon.init(row);
                // })
            },
            // 详情回显
            getAfterSaleDetail(){
                var obj  = {
                    aftersaleSn:this.row.aftersaleSn,
                }
                this.dataListLoading = true;
                aftersaleReturnDetail(obj).then((res)=>{
                    this.dataListLoading = false;
                    console.log(res);
                    if(res.code=200){
                        this.returnInfo = res.data.returnInfo
                         this.aftersalePics = this.returnInfo.aftersalePics.split(",");
                        this.logs = res.data.logs
                        if(Object.prototype.toString.call(res.data.goodsInfo) === "[object Array]"){
                            this.goodsInfo = res.data.goodsInfo
                        }else{
                            this.goodsInfo = [res.data.goodsInfo]
                        }

                        if(this.returnInfo){
                            this.row.auditStatus = this.returnInfo.auditStatus;
                             this.row.status = this.returnInfo.status;
                        }
                    }else{
                        this.$message({
                            message:res.msg,
                            type: 'error',
                            duration: 800,
                        })
                    }
                })
            },
            // 获取仓库下拉列表
            getWareListByType(){
                var obj = {
                    type:1,//库类型 0 发货仓 1退货仓
                }
                wareListByType(obj).then((res)=>{
                    console.log(res);
                    if(res.code==200){
                        this.warehouseList = res.data
                    }
                })
            },
            // 获取退换货原因
            getReason(){
                aftersaleReturnrReason().then((res)=>{
                    if(res.code==200){
                        this.returnrReasonlist = res.data;
                    }
                })
            },
            // 切换仓库时候，下面的信息也要跟着变
            changeWarehouse(val){
                console.log(val);
                var obj = {
                    id:val,//库类型 0 发货仓 1退货仓
                }
                backScanWare(obj).then((res)=>{
                    console.log(res);
                    if(res.code==200){
                        // Object.assign(this.returnInfo,res.data);
                        this.returnInfo.remareceiptNamerk = res.data.name;//收货人姓名
                        // 所在区域
                        this.returnInfo.receiptName = res.data.name// 省
                        this.returnInfo.province = res.data.provinceName// 省
                        this.returnInfo.city = res.data.cityName// 市
                        this.returnInfo.area = res.data.areaName// 区
                        this.returnInfo.address = res.data.addressInfo// 详细地址
                        this.returnInfo.receiptPhone = res.data.phone// 联系电话
                    }
                })
            },
             // 审核
            exammineFn(operating){
                console.log(this.returnInfo);
                if(!this.returnInfo.aftersaleReasonId){
                    this.$message.warning("请选择退换原因!");
                    return;
                }
                var row = {
                    operating:operating,// 操作 0不通过 1通过 ,
                    aftersaleSn:this.row.aftersaleSn,//售后单号 ,
                    realRefundAmount: this.returnInfo.refundAmount,//实际退款金额 ,
                    remark: this.returnInfo.remark,//处理备注
                    warehouseId: this.returnInfo.warehouseId, //退货仓id
                    aftersaleReasonId:this.returnInfo.aftersaleReasonId //退货原因id
                }
                this.exammineVisible = true;
                this.$nextTick(() => {
                   this.$refs.exammineCompon.init(row)
                })
            },
            // 确认收货
            confirmGoodsFn(isComfirm){
                var row = {
                    isComfirm:isComfirm, // 收货类型 0未收货 1确认收货
                    aftersaleSn:this.row.aftersaleSn,
                }
                this.confirmGoodsVisible = true;
                this.$nextTick(() => {
                   this.$refs.confirmGoodsCompon.init(row)
                })
            },
            // 同意退款
             returnMoneyFn(isAgree){
                 var row = {
                    isAgree:isAgree,// 退款类型 1同意退款 0决绝退款
                    aftersaleSn:this.row.aftersaleSn,
                }
                this.returnMoneyVisible = true;
                this.$nextTick(() => {
                   this.$refs.returnMoneyCompon.init(row)
                })
            },
            goBack(){
                this.$emit("orderDetListFn");
            }

        }
    }
</script>

<style  lang="scss" scoped>
.bottomBtns{
    text-align: center;
    position: fixed;
    bottom: 20px;
    width: 216px;
    left: 50%;
    z-index: 22;
    background-color: white;
}
.saleOrderInfo{
    .formWarp{
        // margin: 20px auto;
    }
    .el-form-item {
        border-top:1px solid #ebeef5;
        border-left:1px solid #ebeef5;
        border-right:1px solid #ebeef5;
        margin-bottom: 0 !important;
    }
    /deep/ .el-form-item__label{
        border-right:1px solid #ebeef5;
        background-color: #f5f7fa;
        width: 120px!important;
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }
    /deep/ .el-form-item__content{
        width: 1302px;
        margin-left: 0!important;
        padding-left:20px;
    }
}
// /deep/ .el-dialog{
//      width: fit-content !important;
// }
// .imgPreview{
//     width: fit-content !important;
// }
/deep/ .el-form-item.el-form-item--default {
    display: flex;
    justify-content: flex-start;
}
</style>
