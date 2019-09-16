<template>
  <div>
      <!-- 列表 -->
      <list v-if='showStatus'  @showDetailFun='showDetailFun'></list>
      <!-- 查看 -->
      <detail ref="detailCompon" v-else @showListFun='showListFun' ></detail>
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
