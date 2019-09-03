<template>
  <div>
      <!-- Q&A配置主页面 -->
      <list v-if='showStatus'  @mainListFun='mainListFun'></list>
      <!-- 商品列表页面 -->
      <detail v-else @showListFun='showListFun' :configId="configId"></detail>
  </div>
</template>

<script>
import list from './list'
import detail from "./detail";

export default {
  data () {
    return {
        configId:'',
        showStatus: true,
    }
  },
  components:{
  	list,detail
  },
  methods: {
      mainListFun(id){
          this.showStatus = false;
          this.configId = id;
      },
      showListFun(){
          this.showStatus = true;
      }
  }
};
</script>
<style lang="scss" scoped>

</style>
