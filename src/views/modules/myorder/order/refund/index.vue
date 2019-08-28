<template>
    <div>
        <list v-if="mainVisible" ref="listCompon" @orderDetFn="orderDetFn"></list>
        <orderDet v-if="orderDetVisible" ref="orderDetCompon" @orderDetListFn="orderDetListFn" :breaddata="subBreaddata"></orderDet>
    </div>
</template>

<script>
    import list from "./list"
    import orderDet from "../modules/orderDet"
    export default {
        data () {
            return {
                mainVisible:true,
                orderDetVisible:false,
                subBreaddata:["订单管理", "订单管理", "订单列表","订单详情"],
            }
        },
        components:{
            list,
            orderDet
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
                this.$nextTick(()=>{
                    this.$refs.listCompon.getDataList();
                })
            }

        }
    }
</script>

<style>
</style>