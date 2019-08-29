<template>
  <div>
      <!-- 精品分类主页面 -->
      <list v-if='showStatus'  @goodsListFun='goodsListFun'></list>
      <!-- 商品列表页面 -->
      <goodslist v-else @showListFun='showListFun' :classId="classId"></goodslist>
  </div>
</template>

<script>
import list from './list'
import goodslist from "./goodslist";

export default {
  data () {
    return {
        classId:'',
        showStatus: true,
    }
  },
  components:{
  	list,goodslist
  },
  methods: {
      goodsListFun(id){
          this.showStatus = false;
          this.classId = id;
      },
      showListFun(){
          this.showStatus = true;
      }
  }
};
</script>
<style lang="scss" scoped>

</style>
