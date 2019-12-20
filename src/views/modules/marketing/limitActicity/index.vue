<template>
  <div>
      <!-- 列表 -->
      <keep-alive>
        <activitylist v-if='showStatus&&!detailStatus'  @addAditFun='addAditFun' @showDetail='showDetail'></activitylist>
      </keep-alive>
      <!-- 添加商品 -->
      <addgoods v-if='!showStatus&&!detailStatus' ref="addGoodsCompon" @addGoodsActivity="addGoodsActivity" @showDetail='showDetail' :activityId="activityId"></addgoods>
      <!-- 查看 -->
      <detailgoods v-if="detailStatus&&!showStatus" ref="detailGoodsCompon" @addAditFun='addAditFun' @detailno="detailno" :activityId="activityId"></detailgoods>

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
      addAditFun(row){
        console.log('??????',row)
        this.showStatus = false;
        this.detailStatus = false;
        // this.activityId = row.id;
        this.$nextTick(()=>{
          this.$refs.addGoodsCompon.init(row);
        })
      },
      detailno(){
        this.detailStatus = false;
        this.showStatus = true;
      },
      showDetail(row){
        this.detailStatus = true;
        this.showStatus = false;
        // this.activityId = id
        this.$nextTick(()=>{
          this.$refs.detailGoodsCompon.init(row);
        })
      },
      addGoodsActivity(){
          this.showStatus = true;
      }
  }
};
</script>
<style lang="scss" scoped>

</style>
