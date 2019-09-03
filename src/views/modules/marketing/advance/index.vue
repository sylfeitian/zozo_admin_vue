<template>
  <div>
      <!-- 列表 -->
      <activitylist v-if='showStatus&&!detailStatus'  @addAditFun='addAditFun' @showDetail='showDetail'></activitylist>
      <!-- 添加商品 -->
      <addgoods v-if='!showStatus&&!detailStatus' @addGoodsActivity="addGoodsActivity" @showDetail='showDetail' :activityId="activityId"></addgoods>
      <!-- 查看 -->
      <detailgoods v-if="detailStatus&&!showStatus" @addAditFun='addAditFun' @detailno="detailno" :activityId="activityId"></detailgoods>

  </div>
</template>

<script>
import activitylist from './activitylist'
import addgoods from "./addgoods";
import detailgoods from "./detailgoods";

export default {
  data () {
    return {
        activityId:'',
        detailStatus:false,
        showStatus: true,
    }
  },
  components:{
  	activitylist,addgoods,detailgoods
  },
  methods: {
      addAditFun(id){
        console.log('??????',id)
        this.showStatus = false;
        this.detailStatus = false;
        this.activityId = id;
      },
      detailno(){
        this.detailStatus = false;
        this.showStatus = true;
      },
      showDetail(id){
        this.detailStatus = true;
        this.showStatus = false;
        this.activityId = id
      },
      addGoodsActivity(){
          this.showStatus = true;
      }
  }
};
</script>
<style lang="scss" scoped>

</style>
