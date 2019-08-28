<template>
  <div>
      <!-- 列表 -->
      <list v-if='showStatus'  @showDetailFun='showDetailFun'></list>
      <!-- 查看 -->
      <detail v-else @showListFun='showListFun' :activityId="activityId"></detail>
  </div>
</template>

<script>
import list from './list'
import detail from "./detail";

export default {
  data () {
    return {
        activityId:'',
        showStatus: true,
    }
  },
  components:{
  	list,detail
  },
  methods: {
      showDetailFun(id){
          this.showStatus = false;
          this.activityId = id;
      },
      showListFun(){
          this.showStatus = true;
      }
  }
};
</script>
<style lang="scss" scoped>

</style>
