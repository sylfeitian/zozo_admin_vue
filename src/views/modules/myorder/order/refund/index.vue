<template>
    <div>
        <!-- <button @click="getData">123132</button> -->
        <list v-if="mainVisible" ref="listCompon" @orderDetFn="orderDetFn" @afterSaleDetailFn="afterSaleDetailFn"></list>
        <orderDet v-if="orderDetVisible" ref="orderDetCompon" @orderDetListFn="orderDetListFn"  :breaddata="subBreaddata"></orderDet>
        <afterSaleDetail v-if="afterSaleDetailVisible" ref="afterSaleDetailCompon" @orderDetListFn="orderDetListFn"  :breaddata="subBreaddata2"></afterSaleDetail>
    </div>
</template>

<script>
    import list from "./list"
    import orderDet from "../modules/orderDet"
    import afterSaleDetail from "./afterSaleDetail"
    import {getDataApi} from "@/api/api.js"
    export default {
        data () {
            return {
                mainVisible:true,
                orderDetVisible:false,
                afterSaleDetailVisible:false,
                subBreaddata:["订单管理", "退货退款", "退货退款列表","订单详情"],
                subBreaddata2:["订单管理", "退货退款", "退货退款列表","退货退款详情"],
            }
        },
        components:{
            list,
            orderDet,
            afterSaleDetail
        },
        methods:{
            orderDetFn(row){
                this.orderDetVisible = true;
                this.mainVisible = false;
                this.$nextTick(()=>{
                    this.$refs.orderDetCompon.init(row);
                })
            },
            orderDetListFn(){
                this.orderDetVisible = false;
                this.mainVisible = true;
                this.afterSaleDetailVisible = false
                this.$nextTick(()=>{
                    this.$refs.listCompon.getDataList();
                })
            },
            afterSaleDetailFn(row){
                this.orderDetVisible = false;
                this.mainVisible = false;
                this.afterSaleDetailVisible = true;
                this.$nextTick(()=>{
                    this.$refs.afterSaleDetailCompon.init(row);
                })

            },
            // getData(){
            //     var obj = {
            //         marginLever: 100,
            //         price: "9069.00",
            //         priceType: 1,//0是立即，1是委托
            //         side: 0,//0 duo   1 shao
            //         stopLossPrice: null,
            //         stopProfitPrice: null,
            //         symbol: "BTC/USDT",
            //         volume: 1, //
            //     }
            //     getDataApi(obj).then(res => {
                    
            //     });
            // }

        }
    }
</script>

<style>
</style>