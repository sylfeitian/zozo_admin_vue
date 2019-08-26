<template>
  <div>
      <!-- 列表 -->
      <activitylist v-if='showStatus&&!detailStatus'  @addAditFun='addAditFun(arguments)' @showDetail='showDetail'></activitylist>
      <!-- 添加商品 -->
      <addgoods v-if='!showStatus&&!detailStatus'></addgoods>
      <!-- 查看 -->
      <detailgoods v-if="detailStatus"></detailgoods>

  </div>
</template>

<script>
import activitylist from './activitylist'
import addgoods from "./addgoods";
import detailgoods from "./detailgoods";

export default {
  data () {
    return {
      detailStatus:false,
      showStatus: true,
    }
  },
  components:{
  	activitylist,addgoods,detailgoods
  },
  methods: {
      addAditFun(vals){
        this.showStatus = false;
        // if(vals){
        //   this.editSatusId = vals[0];
        //   this.editType = vals[1]
        // }
      },
      detailno(){
        this.detailStatus = false;
      },
      artcouponno(){
      	this.showStatus = true;
      },
      showDetail(id){
        // console.log('??????',id)
        this.detailStatus = true;
        // this.detailId = id
      }
  }
};
</script>
<style lang="scss" scoped>

</style>
