<template>
  <div>
      <!-- 列表 -->
      <keep-alive>
        <list v-if='showStatus'  @showDetailFun='showDetailFun'></list>
      </keep-alive>
      <!-- 查看 -->
      <detail ref="detailCompon" v-if='!showStatus' @showListFun='showListFun' ></detail>
  </div>
</template>

<script>
import list from './list'
import detail from "./detail";

export default {
  data () {
    return {
        // activityId:'',
        showStatus: true,
    }
  },
  components:{
  	list,detail
  },
  methods: {
      showDetailFun(row){
          this.showStatus = false;
          // this.activityId = id;
          this.$nextTick(()=>{
            this.$refs.detailCompon.init(row);
          })
      },
      showListFun(){
          this.showStatus = true;
      }
  }
};
</script>
<style lang="scss" scoped>

</style>
