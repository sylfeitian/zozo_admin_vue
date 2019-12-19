<template>
    <div>
        <!-- <button @click="getData">123132</button> -->
        <keep-alive>
            <list v-if="showPage==1" ref="listCompon" @controlShowPage="controlShowPage" ></list>
        </keep-alive>
        <tabFn  v-if="showPage==2" @controlShowPage="controlShowPage" ref="tabFnCompon" :breaddata="nextBreaddata" :index="index" :showTab="true"></tabFn>
    </div>
</template>

<script>
    
    import list from "./list"
    import tabFn from "./tabFn"
    export default {
        data () {
            return {
                showPage:1,//
                nextBreaddata: ["会员管理", "会员列表"],
                index:"1",
                // orderDetVisible:false,
                // afterSaleDetailVisible:false,
                // subBreaddata:["订单管理", "退货退款", "退货退款列表","订单详情"],
                // subBreaddata2:["订单管理", "退货退款", "退货退款列表","退货退款详情"],
            }
        },
        components:{
            list,
            tabFn,
            
        },
        methods:{
           controlShowPage(num,row){
              this.showPage =num;
              if(row){
                this.$nextTick(()=>{
                  this.$refs.tabFnCompon.init(row);
                })
              }
             
           },
        }
    }
</script>

<style>
</style>