<template>
    <div>
        <keep-alive>
            <list v-if="mainVisible" ref="listCompon" @orderDetFn="orderDetFn" @afterSaleDetailFn="afterSaleDetailFn"></list>
        </keep-alive>
        <orderDet v-if="orderDetVisible" ref="orderDetCompon" @orderDetListFn="orderDetListFn"  :breaddata="subBreaddata"></orderDet>
        <afterSaleDetail v-if="afterSaleDetailVisible" ref="afterSaleDetailCompon" @orderDetListFn="orderDetListFn" @changeOrderDetFn="changeOrderDetFn" :breaddata="subBreaddata2"></afterSaleDetail>
    </div>
</template>

<script>
    import list from "./list"
    import orderDet from "../modules/orderDet"
    import afterSaleDetail from "./afterSaleDetail"
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
            changeOrderDetFn(row) {
                this.orderDetVisible = true;
                this.mainVisible = false;
                this.afterSaleDetailVisible = false;
                this.$nextTick(()=>{
                    this.$refs.orderDetCompon.init(row);
                })
            }

        }
    }
</script>

<style>
</style>