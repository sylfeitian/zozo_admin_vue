<template>
    <div>
        <div  v-show="showPage==1" v-loading="dataListLoading">
            <Bread :breaddata="breaddata" @changePage="changePage" :index="'1'"></Bread>
            <el-form
                    :inline="true"
                    class="grayLine topGapPadding"
                    :model="dataForm"
                    @keyup.enter.native="getDataList()"
            >
                <!-- 上层button组 -->
                <el-form-item style="width: 100%;text-align: right;padding-right: 6%;">
                    <!-- <el-button class="btn" type="primary" @click="clearancFailureFn()"  v-if="orderBase.orderStatus==80">清关失败</el-button> -->
                    <!-- <el-button class="btn" type="primary" @click="writeLogisticsInfo()" v-if="orderBase.orderStatus==80">填写物流信息</el-button> -->
                    <el-button class="btn" type="primary" @click="lookLogistics()" v-if="orderBase.orderStatus==110 || orderBase.orderStatus==130 || orderBase.orderStatus==140">查看物流</el-button>
                    <el-button class="btn" type="primary" @click="modifyReciverInfo()" v-if="orderBase.orderStatus==10 || orderBase.orderStatus==30 || orderBase.orderStatus==40 || orderBase.orderStatus==50 || orderBase.orderStatus==60 || orderBase.orderStatus==90 || orderBase.orderStatus==100">修改收货人信息</el-button>
                    <el-button class="btn" type="primary" @click="exammineFn()" v-if="orderBase.orderStatus==30">审核</el-button>
                    <el-button class="btn" type="primary" @click="remarkInfoFn()" >备注信息</el-button>
                    <el-button class="btn" type="primary" @click="cancleOrderFn()"  v-if="orderBase.orderStatus==50 || orderBase.orderStatus==90 || orderBase.orderStatus==100">取消订单</el-button>
                    <!-- JD申报失败 -->
                    <el-button class="btn" type="primary"  @click="declareSthFn({},'jd')"   v-if="orderBase.orderStatus==100">重新申报</el-button>
                    <!-- tudo lakala申报失败,申报失败需要重新申报，和JD申报失败重新申报调不一样的接口  -->
                    <el-button class="btn" type="primary"  @click="declareSthFn({},'lakala')"  v-if="orderBase.orderStatus==50">重新申报</el-button>
                </el-form-item>
                <!-- step步骤 -->
                <el-steps align-center :active="active" style="margin-top: 20px;">
                    <!-- <el-step title="提交订单" icon="el-icon-document" description=""></el-step>
                    <el-step title="付款成功" icon="el-icon-mobile-phone" description=""></el-step>
                    <el-step title="代发货" icon="el-icon-goods" description=""></el-step>
                    <el-step title="待收货" icon="el-icon-time" description=""></el-step>
                    <el-step :title="orderBase.orderStatus==0?'订单取消':'交易完成'" icon="el-icon-circle-check-outline" description=""></el-step>
                    <el-step title="完成评价" icon="el-icon-star-on" description=""></el-step> -->
                    <el-step :title="item.name" :description="item.time?item.time:item.childName" v-for="(item,index) in scheduleList" :key="index"></el-step>
                </el-steps>

                <!-- 订单信息 -->
                <p class="title">订单信息</p>
                <el-row>
                    <el-col :span="5"><div class="grid-content bg-purple-light">订单编号</div></el-col>
                    <el-col :span="5"><div class="grid-content bg-purple-light">支付方式</div></el-col>
                    <el-col :span="4"><div class="grid-content bg-purple-light">订单状态</div></el-col>
                    <el-col :span="5"><div class="grid-content bg-purple-light">订单类型</div></el-col>
                    <el-col :span="5"><div class="grid-content bg-purple-light">会员账号</div></el-col>
                </el-row>
                <el-row>
                    <el-col :span="5"><div class="grid-content">{{orderBase.orderSn}}</div></el-col>
                    <el-col :span="5"><div class="grid-content" >{{orderBase.paymentName}}</div></el-col>
                    <el-col :span="4">
                        <div class="grid-content">
                            <!-- 待付款 -->
                            <span v-if="orderBase.orderStatus==10">待付款</span>
                            <!-- 待发货 -->
                            <span v-else-if="orderBase.orderStatus==20">付款中</span>
                            <span v-else-if="orderBase.orderStatus==30">待审核</span>
                            <span v-else-if="orderBase.orderStatus==40">lakala申报中</span>
                            <span v-else-if="orderBase.orderStatus==50">lakala申报失败</span>
                            <span v-else-if="orderBase.orderStatus==60">待日方发货</span>
                            <!-- 待收货 -->
                            <span v-else-if="orderBase.orderStatus==70">日方取消订单</span> 
                            <span v-else-if="orderBase.orderStatus==80">JD申报中</span>
                            <span v-else-if="orderBase.orderStatus==90 || orderBase.orderStatus==100">JD申报失败</span>
                            <span v-else-if="orderBase.orderStatus==110">清关中</span>
                            <span v-else-if="orderBase.orderStatus==120">清关失败 </span>
                            <span v-else-if="orderBase.orderStatus==130">待收货 </span>
                            <!-- 已完成 -->
                            <span v-else-if="orderBase.orderStatus==140">交易完成</span>
                            <span v-else-if="orderBase.orderStatus==0">已取消</span>
                        </div>
                    </el-col>
                    <el-col :span="5"><div class="grid-content">{{orderBase.orderType}}</div></el-col>
                    <el-col :span="5"><div class="grid-content" @click="controlShowPage(2)" style="color:#02A7F0;cursor: pointer;">{{orderBase.memberName}}</div></el-col>
                </el-row>
                <el-row>
                    <el-col :span="4"><div class="grid-content bg-purple-light">物流公司</div></el-col>
                    <el-col :span="4"><div class="grid-content bg-purple-light">物流单号</div></el-col>
                    <el-col :span="4"><div class="grid-content bg-purple-light">实名认证信息</div></el-col>
                    <el-col :span="4"><div class="grid-content bg-purple-light">日本订单号</div></el-col>
                    <el-col :span="4"><div class="grid-content bg-purple-light">日方发货时间</div></el-col>
                    <el-col :span="4"><div class="grid-content bg-purple-light">第三方支付编号</div></el-col>
                </el-row>
                <el-row>
                    <el-col :span="4"><div class="grid-content">{{orderBase.transportName}}</div></el-col>
                    <el-col :span="4"><div class="grid-content">{{orderBase.logisticsSn}}</div></el-col>
                    <el-col :span="4" v-if="authenticationInfo">
                        <div class="grid-content" style="display:flex;flex-direction: column;align-items: center;line-height: 24px;">
                            <span>{{authenticationInfo.memberRealName}}</span>
                            <span>
                                {{authenticationInfo.idCard}}
                                <!-- {{authenticationInfo.idCard&&authenticationInfo.idCard.length==18?
                                authenticationInfo.idCard.substring(0,12)+"*******":
                                authenticationInfo.idCard}} -->
                                <span style="color:#02A7F0;cursor: pointer;" @click="lookMemberDeatilInfo">查看</span>
                            </span>
                        </div>
                    </el-col>
                    <el-col :span="4"><div class="grid-content">{{orderBase.orderSnJp}}</div></el-col>
                    <el-col :span="4"><div class="grid-content">{{orderBase.deliveryTime}}</div></el-col>
                     <el-col :span="4"><div class="grid-content">{{orderBase.tradeSn}}</div></el-col>
                </el-row>
                <el-row>
                    <el-col :span="5"><div class="grid-content bg-purple-light">描述</div></el-col>
                    <el-col :span="19"><div class="grid-content">{{orderBase.orderMessage}}</div></el-col>
                </el-row>
                <el-dialog title="身份证信息" :visible.sync="dialogVisible" width="30%" v-if="memberDeatilInfo">
                    <h3>身份证号码： </h3>
                    <p>{{memberDeatilInfo.idCard}}</p>

                    <h3>身份证正反面：</h3>
                    <div class="idCardWarp"> 
                        <img :src="memberDeatilInfo.idcartPositiveUrl  | filterImgUrl" alt="">
                        <img :src="memberDeatilInfo.idcartReverseUrl | filterImgUrl" alt="">
                    </div>
                </el-dialog>

                <!-- 收货人信息 -->
                <p>
                    <span class="title">收货人信息</span>
                    <span style="margin-left: 20px;color: #2260D2;cursor: pointer;" @click="showUserDetail">查看详情</span>
                </p>
                <el-row>
                    <el-col :span="8"><div class="grid-content bg-purple-light">收货人</div></el-col>
                    <el-col :span="8"><div class="grid-content bg-purple-light">手机号码</div></el-col>
                    <el-col :span="8"><div class="grid-content bg-purple-light">收货地址</div></el-col>
                </el-row>
                <el-row>
                    <el-col :span="8"><div class="grid-content" v-if="receiverInfo">{{receiverInfo.memberRealName}}</div></el-col>
                    <el-col :span="8"><div class="grid-content" v-if="receiverInfo && receiverInfo.mobPhone">{{receiverInfo.mobPhone}}</div></el-col>
                    <!-- <el-col :span="8"><div class="grid-content" v-if="receiverInfo">{{receiverInfo.province}}{{receiverInfo.city}}{{receiverInfo.area}}{{receiverInfo.townArea}}</div></el-col> -->
                    <el-col :span="8"><div class="grid-content" v-if="receiverInfo">{{receiverInfo.areaInfo}}<!-- {{receiverInfo.address}} --></div></el-col>
                </el-row>

                <modelUserInforDetail v-if="modelUserInforDetailVisible" ref="modelUserInforDetailCompon"></modelUserInforDetail>

                <!-- 订单信息 -->
                <p class="title">商品信息</p>
                <el-table
                    width="100%"
                    :data="orderGoods"
                    border
                    v-loading="dataListLoading"
                    style="width: 90%;margin-left: 5%;"
                >
                    <el-table-column label="序号" width="70" align="center">
                            <template slot-scope="scope">
                                <span>{{scope.$index+1}}</span>
                            </template>
                    </el-table-column>

                    <el-table-column prop="" label="商品图片" align="center">
                        <template slot-scope="scope">
                            <img :src="scope.row.goodsImage | filterImgUrl" style="width:80px;height:80px;" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="goodsName" label="商品名称" align="center"></el-table-column>
                    <el-table-column prop="brandName" label="品牌" align="center"></el-table-column>
                    <el-table-column prop="storeName" label="店铺" align="center"></el-table-column>
                    <el-table-column prop="specName" label="规格" align="center"></el-table-column>
                    <el-table-column prop="goodsNum" label="数量" align="center"></el-table-column>
                    <el-table-column prop="sellPrice" label="商品售价" align="center">
                        <template slot-scope="scope">
                            ￥{{scope.row.sellPrice?scope.row.sellPrice:'0.00'}}
                        </template>
                    </el-table-column>

                    <el-table-column prop="reduceAmount" label="折扣" align="center">
                        <template slot-scope="scope">
                            ￥{{scope.row.dicountAmount?scope.row.dicountAmount:'0.00'}}
                        </template>
                    </el-table-column>

                    <el-table-column prop="couponAmount" label="优惠券" align="center">
                        <template slot-scope="scope">
                            ￥{{scope.row.couponAmount?scope.row.couponAmount:'0.00'}}
                        </template>
                    </el-table-column>

                    <el-table-column prop="reduceAmount" label="满减金额" align="center">
                        <template slot-scope="scope">
                            ￥{{scope.row.reduceAmount?scope.row.reduceAmount:'0.00'}}
                        </template>
                    </el-table-column>

                    <el-table-column prop="realSalePrice" label="实付金额" align="center">
                        <template slot-scope="scope">
                            ￥{{scope.row.realSalePrice?scope.row.realSalePrice:'0.00'}}
                        </template>
                    </el-table-column>
                </el-table>

                <!-- 优惠信息 -->
                <p class="title">优惠信息</p>
                <el-table
                        width="100%"
                        :data="preferInfo"
                        border
                        v-loading="dataListLoading"
                        style="width: 40%;margin-left: 5%;"
                >
                    <el-table-column label="序号" width="140" align="center">
                        <template slot-scope="scope">
                            <span>{{scope.$index+1}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column prop="type" label="优惠种类" align="center">
                    </el-table-column>

                    <el-table-column prop="content" label="优惠内容" align="center">
                    </el-table-column>
                </el-table>

                <!-- 费用信息 -->
                <p class="title">费用信息</p>
                <el-table
                        width="100%"
                        :data="moneyInfo"
                        border
                        v-loading="dataListLoading"
                        style="width: 40%;margin-left: 5%;"
                >
                    <el-table-column prop="" label="商品总价" align="center">
                        <template slot-scope="scope">
                            ￥{{scope.row.goodsAmount?scope.row.goodsAmount:'0.00'}}
                        </template>
                    </el-table-column>

                    <el-table-column prop="" label="折扣金额" align="center">
                        <template slot-scope="scope">
                            ￥{{scope.row.dicountAmount?scope.row.dicountAmount:'0.00'}}
                        </template>
                    </el-table-column>

                    <el-table-column prop="" label="优惠券" align="center">
                        <template slot-scope="scope">
                            ￥{{scope.row.couponAmount?scope.row.couponAmount:'0.00'}}
                        </template>
                    </el-table-column>

                    <el-table-column prop="" label="满减优惠" align="center">
                        <template slot-scope="scope">
                            ￥{{scope.row.reduceAmount?scope.row.reduceAmount:'0.00'}}
                        </template>
                    </el-table-column>

                    <el-table-column prop="orderAmount" label="应付款金额" align="center">
                        <template slot-scope="scope">
                            ￥{{scope.row.orderAmount?scope.row.orderAmount:'0.00'}}
                        </template>
                    </el-table-column>
                </el-table>

                <!-- 订单记录 -->
                <p class="title">订单记录</p>
                <el-table
                        width="100%"
                        :data="orderLogs"
                        border
                        v-loading="dataListLoading"
                        style="width: 90%;margin-left: 5%;"
                >
                    <el-table-column prop="creator" label="操作者" align="center" width="150"></el-table-column>
                    <el-table-column prop="createDate" label="操作时间" align="center"></el-table-column>
                    <el-table-column prop="orderStatus" label="操作时订单状态" align="center">
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
                            <span v-else-if="scope.row.orderStatus==120">清关失败 </span>
                            <span v-else-if="scope.row.orderStatus==130">待收货 </span>
                            <!-- 已完成 -->
                            <span v-else-if="scope.row.orderStatus==140">交易完成</span>
                            <span v-else-if="scope.row.orderStatus==0">已取消</span>
                            <span v-else>——</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="statusInfo" label="操作内容" align="center"></el-table-column>
                    <el-table-column prop="remark" label="备注" align="center" width="600"></el-table-column>
                </el-table>
            </el-form>
        </div>
        <!-- 申报 -->
        <declareSth v-if="declareSthVisible" ref="declareSthCompon" @searchDataList="getOrderDetail"></declareSth>
        <!-- 弹窗, 新建 -->
        <!-- <orderData  v-if="orderDataVisible" ref="addEditData" @searchDataList="getDataList"></orderData> -->
        <!-- 清关失败 -->
        <clearancFailure v-if="clearancFailureVisible" ref="clearancFailureCompon" @searchDataList="getOrderDetail"></clearancFailure>
         <!-- 填写物流 -->
        <writeLogisticsInfo v-if="writeLogisticsInfoVisible" ref="writeLogisticsInfoCompon"  @searchDataList="getOrderDetail"></writeLogisticsInfo>
        <!-- 查看物流 -->
        <logistics v-if="logisticsVisible" ref="logisticsCompon"></logistics>
        <!-- 修改收货人信息 -->
        <reciverInfo v-if="reciverInfoVisible" ref="reciverInfoCompon" @searchDataList="getOrderDetail"></reciverInfo>
         <!-- 审核 -->
        <exammine v-if="exammineVisible" ref="exammineCompon" @searchDataList="getOrderDetail"></exammine>
        <!-- 备注信息 -->
        <remarkInfo v-if="remarkInfoVisible" ref="remarkInfoCompon" @searchDataList="getOrderDetail"></remarkInfo>
         <!-- 取消订单弹框 -->  
        <cancleOrder v-if="cancleOrderVisible" ref="cancleOrderCompon" @searchDataList="getOrderDetail"></cancleOrder>

        <tabFn  v-if="showPage==2" @controlShowPage="controlShowPage" ref="tabFnCompon" :breaddata="nextBreaddata" :index="index" :showTab='false'></tabFn>
    </div>
</template>
<script>
    import tabFn from "@/views/modules/mgvip/list/tabFn"
    // import mixinViewModule from '@/mixins/view-module'
    import Bread from "@/components/bread";
    import declareSth from '../modules/model-declare-sth.vue'
    import modelUserInforDetail from "./model-userInfor-detail"
    import Clipboard from "clipboard";
    // import orderData from './model-order-data'
    
    import clearancFailure from '../modules/model-clearanc-failure.vue'
    import writeLogisticsInfo from '../modules/model-write-logistics-info.vue'
    import logistics from '../modules/model-logistics.vue'
    import reciverInfo from '../modules/model-reciverInfo.vue'
    import exammine from '../modules/model-exammine.vue'
    import remarkInfo from '../modules/model-remark-info.vue'
    import cancleOrder from '../modules/model-cancle-order.vue'
     
    import {orderDetail,memberDeatilInfo } from "@/api/api";
    export default {
        // mixins: [mixinViewModule],
        data() {
            return {
                showPage:1,
                modelUserInforDetailVisible:false,
                dialogVisible:false,
                active:0,
                textarea: "",
                dataListLoading:false,
                dialogFormVisible: false,
                clearancFailureVisible:false,
                writeLogisticsInfoVisible:false,
                logisticsVisible:false,
                reciverInfoVisible:false,
                exammineVisible:false,
                remarkInfoVisible:false,
                cancleOrderVisible:false,
                declareSthVisible:false,
                dataForm: {},
                orderDataVisible: false,
                authenticationInfo:"", //是个弹框
                orderBase:{},
                orderGoods:[],
                moneyInfo:[],//费用信息
                orderLogs:[],
                preferInfo:[],
                receiverInfo:{},
                scheduleList:[],
                row:"",
                memberDeatilInfo:'',
                nextBreaddata: ["订单管理", "BC订单管理", "订单详情","会员信息"],
                index:"2",
                };
        },
        components: {
            Bread,
            modelUserInforDetail,
            // orderData,
            clearancFailure,
            writeLogisticsInfo,
            logistics,
            reciverInfo,
            exammine,
            remarkInfo,
            cancleOrder,
            declareSth,
            tabFn
        },
        props: ["data", "addressInfo", "orderLog","packageInfo",'breaddata'],
        methods: {
            init(row){
                console.log(row);
                // row.id = 123666;
                this.row = row;
                this.getOrderDetail();    
            },
            controlShowPage(num){
                this.showPage =num;
                var row  = {
                    id: this.orderBase.memberId
                }
                if(num==2){
                    this.$nextTick(()=>{
                    row.activeName = "vipDetail" 
                    this.$refs.tabFnCompon.init(row);
                })
            }
           },
            showUserDetail(){
                this.modelUserInforDetailVisible = true;
                this.$nextTick(()=>{
                    this.$refs.modelUserInforDetailCompon.init(this.orderBase);
                })
            },
            lookMemberDeatilInfo(){
                this.dialogVisible = true;
                var obj  = {
                    params:{
                        memberId:this.orderBase.memberId,
                        orderId:this.orderBase.orderId,
                    }
                }
                memberDeatilInfo(obj).then((res)=>{
                    if(res.code==200){
                        this.memberDeatilInfo = res.data;
                    }
                })
            },
            getOrderDetail(){
                var obj = {
                    id:this.row.id,
                }
                this.dataListLoading = true;
                orderDetail(obj).then((res)=>{
                    this.dataListLoading = false;
                    console.log(res);
                    if(res.code==200 && res.data){
                        this.authenticationInfo = res.data.authenticationInfo;
                        this.orderBase = res.data.orderBase;
                        this.orderGoods = res.data.orderGoods;
                        // 商品总价  goodsAmount           
                        //  折扣金额  dicountAmount       
                        //  优惠券  couponAmount    
                        //  满减  reduceAmount   
                        //  应付金额 orderAmount
                         this.moneyInfo = [{
                                goodsAmount:this.orderBase.goodsAmount,
                                dicountAmount:this.orderBase.dicountAmount,
                                couponAmount:this.orderBase.couponAmount,
                                reduceAmount:this.orderBase.reduceAmount,
                                orderAmount:this.orderBase.orderAmount
                         }]
                        this.orderLogs = res.data.orderLogs;
                        this.preferInfo = res.data.preferInfo;
                        this.receiverInfo = res.data.receiverInfo;
                        if(res.data.scheduleList.length){
                            this.active = res.data.scheduleList.length;
                        }else{
                            this.active = 0;
                        }
                        this.scheduleList = res.data.scheduleList;
                        for(var i= res.data.scheduleList.length;i<6;i++){
                             this.scheduleList.push({})
                        }
                        // switch(this.orderBase.orderStatus){
                        //     case 10:
                        //         // 待支付
                        //         this.active = 0
                        //         break;
                        //     case 20:
                        //         // 待发货
                        //         this.active = 2
                        //         break;
                        //     case 30:
                        //         // 待收货
                        //          this.active = 3
                        //         break;
                        //     case 40:
                        //         // 交易成功
                        //          this.active = 4
                        //         break;
                        //     case 0:
                        //         // 订单取消
                        //          this.active = 4
                        //         break;
                        // }
                    }else{
                        this.$message({
                            message:res.msg,
                            type: 'error',
                            duration: 800,
                        })
                    }
                })
            },
            changePage(){
                this.goList();
            },
            //页面跳转 1-列表页
            goList() {
                this.$emit("orderDetListFn");
            },

            //添加备注
            // addRemarks() {
            //     this.dialogFormVisible = !this.dialogFormVisible;
            // },
            // 物流信息
            orderDataHandle(index=-1,row=""){
                this.setOrderDataVisible(true);
                this.$nextTick(() => {
                    this.$refs.orderData.init(row)
                })
            },
            setOrderDataVisible(boolargu){
                this.orderDataVisible =  boolargu;
            },
            // 清关失败
            clearancFailureFn(){
                this.clearancFailureVisible = true;
                this.$nextTick(() => {
                    this.$refs.clearancFailureCompon.init(this.row)
                })
            },
            // 填写物流信息
            writeLogisticsInfo(){
                this.writeLogisticsInfoVisible = true;
                this.$nextTick(() => {
                    this.$refs.writeLogisticsInfoCompon.init(this.row)
                })
            },
            // 查看物流弹框
            lookLogistics(){
                this.logisticsVisible = true;
                 this.$nextTick(() => {
                    this.$refs.logisticsCompon.init(this.orderBase.logisticsSn)
                })
            },
            // 修改收货人信息
            modifyReciverInfo(){
                this.reciverInfoVisible = true;
                 this.$nextTick(() => {
                   this.$refs.reciverInfoCompon.init(this.orderBase,this.receiverInfo,this.row)
                })
            },
            // 审核
            exammineFn(){
                this.exammineVisible = true;
                this.$nextTick(() => {
                   this.$refs.exammineCompon.init(this.row)
                })
            },
            // 备注信息
            remarkInfoFn(){
                this.remarkInfoVisible = true;
                this.$nextTick(() => {
                   this.$refs.remarkInfoCompon.init(this.orderBase)
                })
            },
             // 取消订单
           cancleOrderFn(){
                this.cancleOrderVisible = true;
                this.$nextTick(() => {
                   this.$refs.cancleOrderCompon.init(this.row)
                })
            },
             // 审核
            declareSthFn(row,type){
                row = this.row
                this.declareSthVisible = true;
                this.$nextTick(() => {
                   this.$refs.declareSthCompon.init(row,type)
                })
            },
        }
    };
</script>
<style lang="scss" scoped>
    .idCardWarp{
        text-align: center;
        img{
            width:316px;
            height: 200px;
            margin-bottom: 10px;
        }
    }
    .creater {
        display: inline-block;
        width: 80px;
        margin: 0 15px;
    }
    .el-textarea {
        width: 30%;
    }
    .inforTit{
        width: 100px;
        font-weight: 600;
        text-align: left;
        color:#333;
        display: inline-block;
    }
    .title{
        font-size: 16px;
        font-weight: 700;
    }
    #bar {
        border: none;
        margin-right: 10px;
        min-width: 180px;
        display: inline-block;
    }
    .orderDe {
        /* border: 1px solid #333; */
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .el-textarea {
        width: 100%;
    }
    .el-table {
        margin-top: 20px;
    }
    .title {
        margin-left: 5%;
    }
    .el-row {
        width: 90%;
        margin-left: 5%;
    }
    .bg-purple-light {
        background: #f5f7fa;
    }
    .grid-content {
        border: 1px solid #ebeef5;
        height: 54px;
        line-height: 54px;
        text-align: center
    }
    .grayLine{
        border-bottom: 0!important;
    }
</style>
