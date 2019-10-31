<template>
    <div>
        <list v-if="mainVisible" ref="listCompon" @orderDetFn="orderDetFn"></list>
        <orderDet v-if="orderDetVisible" ref="orderDetCompon" @orderDetListFn="orderDetListFn" :breaddata="subBreaddata"></orderDet>
    </div>
</template>

<script>
    import list from "./list"
    import orderDet from "../modules/orderDet"
    import Bread from "@/components/bread";
    export default {
        data () {
            return {
                mainVisible:true,
                orderDetVisible:false,
                subBreaddata:["订单管理", "评论管理","订单详情"],
            }
        },
        components: {
            Bread,
            list,
            orderDet
        },
        methods: {
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
        },
    }
</script>

<style lang="scss" scoped>

</style>