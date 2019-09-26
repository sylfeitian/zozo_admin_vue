<template>
  <div>
      <!-- 精品分类主页面 -->
      <list v-if='showStatus'  @goodsListFun='goodsListFun'></list>
      <!-- 商品列表页面 -->
      <goodslist v-else @showListFun='showListFun' ref="goodsListComon" ></goodslist>
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
      goodsListFun(row){
          this.showStatus = false;
          this.$nextTick(()=>{
            this.$refs.goodsListComon.init(row);
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
