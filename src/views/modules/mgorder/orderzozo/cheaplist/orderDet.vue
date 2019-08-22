<template>
    <div>
        <Bread :breaddata="orderDetData" @changePage="changePage" :index="'1'"></Bread>
        <el-form
                :inline="true"
                class="grayLine topGapPadding"
                :model="dataForm"
                @keyup.enter.native="getDataList()"

        >
            <el-form-item style="margin-left: 60%;">
                <el-button class="btn" type="primary" @click="orderDataHandle()">查看物流</el-button>
                <el-button class="btn" type="primary" @click="reset()" >修改收货人信息</el-button>
                <el-button class="btn" type="primary" @click="getDataList()">审核</el-button>
                <el-button class="btn" type="primary" @click="reset()" >备注信息</el-button>
                <el-button class="btn" type="primary" @click="getDataList()">取消订单</el-button>
            </el-form-item>
            <el-steps align-center style="margin-top: 20px;">
                <el-step title="提交订单" icon="el-icon-document" description=""></el-step>
                <el-step title="付款成功" icon="el-icon-mobile-phone" description=""></el-step>
                <el-step title="代发货" icon="el-icon-goods" description=""></el-step>
                <el-step title="待收货" icon="el-icon-time" description=""></el-step>
                <el-step title="交易完成" icon="el-icon-circle-check-outline" description=""></el-step>
                <el-step title="完成评价" icon="el-icon-star-on" description=""></el-step>
            </el-steps>
            <p class="title">订单信息</p>
            <el-row>
                <el-col :span="5"><div class="grid-content bg-purple-light">订单编号</div></el-col>
                <el-col :span="5"><div class="grid-content bg-purple-light">支付方式</div></el-col>
                <el-col :span="4"><div class="grid-content bg-purple-light">订单状态</div></el-col>
                <el-col :span="5"><div class="grid-content bg-purple-light">订单类型</div></el-col>
                <el-col :span="5"><div class="grid-content bg-purple-light">会员账号</div></el-col>
            </el-row>
            <el-row>
                <el-col :span="5"><div class="grid-content">{{}}</div></el-col>
                <el-col :span="5"><div class="grid-content">{{}}</div></el-col>
                <el-col :span="4"><div class="grid-content">{{}}</div></el-col>
                <el-col :span="5"><div class="grid-content">{{}}</div></el-col>
                <el-col :span="5"><div class="grid-content">{{}}</div></el-col>
            </el-row>
            <el-row>
                <el-col :span="5"><div class="grid-content bg-purple-light">物流公司</div></el-col>
                <el-col :span="5"><div class="grid-content bg-purple-light">物流单号</div></el-col>
                <el-col :span="4"><div class="grid-content bg-purple-light">实名认证信息</div></el-col>
                <el-col :span="5"><div class="grid-content bg-purple-light"></div></el-col>
                <el-col :span="5"><div class="grid-content bg-purple-light"></div></el-col>
            </el-row>
            <el-row>
                <el-col :span="5"><div class="grid-content">{{}}</div></el-col>
                <el-col :span="5"><div class="grid-content">{{}}</div></el-col>
                <el-col :span="4"><div class="grid-content">{{}}</div></el-col>
                <el-col :span="5"><div class="grid-content"></div></el-col>
                <el-col :span="5"><div class="grid-content"></div></el-col>
            </el-row>
            <el-row>
                <el-col :span="5"><div class="grid-content bg-purple-light">描述</div></el-col>
                <el-col :span="19"><div class="grid-content">{{}}</div></el-col>
            </el-row>
            <p>
                <span class="title">收货人信息</span>
                <span style="margin-left: 20px;color: #2260D2;">查看详情</span>
            </p>
            <el-row>
                <el-col :span="8"><div class="grid-content bg-purple-light">收货人</div></el-col>
                <el-col :span="8"><div class="grid-content bg-purple-light">手机号码</div></el-col>
                <el-col :span="8"><div class="grid-content bg-purple-light">收货地址</div></el-col>
            </el-row>
            <el-row>
                <el-col :span="8"><div class="grid-content">{{}}</div></el-col>
                <el-col :span="8"><div class="grid-content">{{}}</div></el-col>
                <el-col :span="8"><div class="grid-content">{{}}</div></el-col>
            </el-row>
            <p class="title">商品信息</p>
            <el-table
                    width="100%"
                    :data="dataList"
                    border
                    v-loading="dataListLoading"
                    style="width: 90%;margin-left: 5%;"
            >
                <el-table-column prop="" label="商品图片" align="center"></el-table-column>
                <el-table-column prop="" label="商品名称" align="center"></el-table-column>
                <el-table-column prop="" label="品牌" align="center"></el-table-column>
                <el-table-column prop="" label="店铺" align="center"></el-table-column>
                <el-table-column prop="" label="规格" align="center"></el-table-column>
                <el-table-column prop="" label="数量" align="center"></el-table-column>
                <el-table-column prop="" label="商品售价" align="center"></el-table-column>
                <el-table-column prop="" label="折扣" align="center"></el-table-column>
                <el-table-column prop="" label="优惠券" align="center"></el-table-column>
                <el-table-column prop="" label="满减金额" align="center"></el-table-column>
                <el-table-column prop="" label="实付金额" align="center"></el-table-column>
            </el-table>
            <p class="title">优惠信息</p>
            <el-table
                    width="100%"
                    :data="dataList"
                    border
                    v-loading="dataListLoading"
                    style="width: 40%;margin-left: 5%;"
            >
                <el-table-column label="序号" width="140" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.$index+1}}</span>
                        <!-- {{scope.$index+1+(parseInt(params.currentPage)-1)* parseInt(params.currentPageSize) }} -->
                    </template>
                </el-table-column>
                <el-table-column prop="" label="优惠种类" align="center"></el-table-column>
                <el-table-column prop="" label="优惠类型" align="center"></el-table-column>
            </el-table>
            <p class="title">费用信息</p>
            <el-row>
                <el-col :span="5"><div class="grid-content bg-purple-light">商品总价</div></el-col>
                <el-col :span="5"><div class="grid-content bg-purple-light">折扣金额</div></el-col>
                <el-col :span="4"><div class="grid-content bg-purple-light">优惠券</div></el-col>
                <el-col :span="5"><div class="grid-content bg-purple-light">满减优惠</div></el-col>
                <el-col :span="5"><div class="grid-content bg-purple-light">应付款金额</div></el-col>
            </el-row>
            <el-row>
                <el-col :span="5"><div class="grid-content">{{}}</div></el-col>
                <el-col :span="5"><div class="grid-content">{{}}</div></el-col>
                <el-col :span="4"><div class="grid-content">{{}}</div></el-col>
                <el-col :span="5"><div class="grid-content">{{}}</div></el-col>
                <el-col :span="5"><div class="grid-content">{{}}</div></el-col>
            </el-row>
            <p class="title">订单记录</p>
            <el-table
                    width="100%"
                    :data="dataList"
                    border
                    v-loading="dataListLoading"
                    style="width: 90%;margin-left: 5%;"
            >
                <el-table-column prop="" label="操作者" align="center" width="150"></el-table-column>
                <el-table-column prop="" label="操作时间" align="center"></el-table-column>
                <el-table-column prop="" label="操作时订单状态" align="center"></el-table-column>
                <el-table-column prop="" label="操作内容" align="center"></el-table-column>
                <el-table-column prop="" label="备注" align="center" width="600"></el-table-column>
            </el-table>
        </el-form>
        <!-- 弹窗, 新建 -->
        <orderData  v-if="orderDataVisible" ref="addEditData" @searchDataList="getDataList"></orderData>
    </div>
</template>
<script>
    import mixinViewModule from '@/mixins/view-module'
    import Bread from "@/components/bread";
    import Clipboard from "clipboard";
    import orderData from './model-order-data'

    export default {
        mixins: [mixinViewModule],
        data() {
            return {
                textarea: "",
                dialogFormVisible: false,
                orderDetData: ["订单管理", "BC订单管理", "订单详情"],
                dataForm: {},
                orderDataVisible: false
            };
        },
        components: {
            Bread,
            orderData
        },
        props: ["data", "addressInfo", "orderLog","packageInfo"],
        methods: {
            changePage(){
                this.goList();
            },
            //页面跳转 1-列表页
            goList() {
                this.$emit("addoraditList");
            },

            //添加备注
            addRemarks() {
                this.dialogFormVisible = !this.dialogFormVisible;
            },
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
        }
    };
</script>
<style scoped>
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
