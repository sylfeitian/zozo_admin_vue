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
                    style="width: 100%;margin-top:20px;margin-bottom:40px;"
            >
                <el-table-column label="商品图片" align="center">\
                    <template slot-scope="scope">
                        <img :src="scope.row.goodsImage | filterImgUrl" alt="" style="width:80px;height:80px">
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
                <div  class="formWarp formWarp1">
                    <el-form-item label="售后单号：" >
                        <span>{{returnInfo.aftersaleSn}}</span>
                    </el-form-item>
                    <el-form-item label="售后状态：">
                        <span v-if="returnInfo.status==10">退款中</span>
                        <span v-else-if="returnInfo.status==20">退款完成</span>
                        <span v-else-if="returnInfo.status==30">退款失败</span>
                    </el-form-item>

                    <el-form-item label="订单编号：" >
                        <span>{{returnInfo.orderSn}}</span>
                    </el-form-item>
                    
                    <el-form-item label="申请时间：">
                    <span>{{returnInfo.createDate}}</span>
                    </el-form-item>

                <el-form-item label="会员账号：" >
                        <span>{{returnInfo.memberName}}</span>
                    </el-form-item>

                <el-form-item label="退款金额：" >
                        <span v-if="returnInfo.shouldRefundAmount">¥{{returnInfo.shouldRefundAmount}}</span>
                    </el-form-item>
                </div>
            </el-form>
            <!-- 分割线------------------------------------------------ -->
            <h3>操作日志</h3>
            <el-table
                width="100%"
                :data="logs"
                border=""
                v-loading="dataListLoading3"
                style="width: 100%;maigin-top:20px;"
            >
                <el-table-column prop="creator" label="操作者：" align="center"></el-table-column>
                <el-table-column prop="createDate" label="操作时间：" align="center"></el-table-column>
                <el-table-column prop="status" label="操作时售后单状态：" align="center">
                    <template slot-scope="scope">
                         <el-tag v-if="scope.row.status==0" type="info">待审核</el-tag>
                        <el-tag v-else-if="scope.row.status==10" type="info">退款中</el-tag>
                        <el-tag v-else-if="scope.row.status==20" type="info">退款完成</el-tag>
                        <el-tag v-else-if="scope.row.status==20" type="info">退款失败</el-tag>
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
        </div>
    </div>
</template>

<script>
    import {aftersaleReturnDetail} from "@/api/api";
    import Bread from "@/components/bread";
    export default {
        data () {
            return {
                row:'',
                dataListLoading:false,
                dataListLoading1:false,
                dataListLoading2:false,
                dataListLoading3:false,
                goodsInfo:[],
                logs:[],
                returnInfo:"",
               
            }
        },
        props: ['breaddata'],
        components:{
            Bread,
        },
        methods:{
            init(row){
                // row.aftersaleSn = 111;
                this.row = row;
                this.getAfterSaleDetail();
               
            },
            getAfterSaleDetail(){
                var obj  = {
                    aftersaleSn:this.row.aftersaleSn,
                }
                 this.dataListLoading  = true;
                aftersaleReturnDetail(obj).then((res)=>{
                     this.dataListLoading  = false;
                    console.log(res);
                    if(res.code=200){
                        this.returnInfo = res.data.returnInfo
                        this.logs = res.data.logs
                        if(Object.prototype.toString.call(res.data.goodsInfo) === "[object Array]"){
                            this.goodsInfo = res.data.goodsInfo
                        }else{
                            this.goodsInfo = [res.data.goodsInfo]
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
            goBack(){
                this.$emit("orderDetListFn");
            }

        }
    }
</script>

<style  lang="scss" scoped>
.saleOrderInfo{
    .formWarp{
        margin: 20px auto;
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
    }
    /deep/  .el-form-item__content{
        padding-left:20px;
    }
}
</style>