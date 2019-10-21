<template>
  <div>
      <!-- 秒杀活动主页面 -->
      <list v-if='showStatus'  @timelistFun='timelistFun' @detailistFun='detailistFun' @addlistFun='addlistFun'></list>
      <!-- 秒杀时间段页面 -->
      <timelist v-if='!showStatus&&timelistStatus' @timeshowList='timeshowList'></timelist>
      <!-- 查看商品列表页面 -->
      <detailist v-if='!showStatus&&detailistStatus' @detailshowList='detailshowList'  @addlistFun='addlistFun' :activityId="activityId" :activityState="activityState"></detailist>
      <!-- 添加秒杀商品页面 -->
      <addlist v-if='!showStatus&&addlistStatus' @addshowList='addshowList' @detailistFun='detailistFun' @addlistFun='addlistFun' :activityId="activityId"></addlist>
       <!--  -->
  </div>
</template>

<script>
    import list from './list'
    import timelist from "./timelist";
    import detailist from "./detailist";
    import addlist from "./addlist";

    export default {
        components:{
            list,timelist,detailist,addlist
        },
        data () {
            return {
                activityId:'',
                showStatus: true,
                timelistStatus:false,
                detailistStatus:false,
                addlistStatus:false,
                activityState:'',
            }
        },
        methods: {
            //显示秒杀时间段页面
            timelistFun(){
                this.showStatus = false;
                this.timelistStatus = true;
            },
            timeshowList(){
                this.showStatus = true;
                this.timelistStatus = false;
            },
            //显示查看商品列表页面
            detailistFun(id,state){
                this.showStatus = false;
                this.detailistStatus = true;
                this.addlistStatus = false;
                this.activityId = id;
                this.activityState = state;
            },
            detailshowList(){
                this.showStatus = true;
                this.detailistStatus = false;
            },
            //显示添加秒杀商品页面
            addlistFun(id){
                this.showStatus = false;
                this.detailistStatus = false;
                this.addlistStatus = true;
                this.activityId = id;
            },
            addshowList(){
                this.showStatus = true;
                this.addlistStatus = false;
            }
           
        }
    };
</script>
<style lang="scss" scoped>

</style>
