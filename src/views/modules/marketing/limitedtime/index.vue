<template>
  <div>
      <!-- 列表 -->
      <list v-if="mainVisible" ref="listCompon" @showDetail="showDetail"></list>
      <!-- 查看 -->
      <detail v-if="detailVisible" ref="detailCompon" @showList="showList"></detail>

  </div>
</template>

<script>
import list from "./list";
import detail from "./detail";

export default {
  data () {
    return {
        detailVisible:false,
        mainVisible: true,
    }
  },
  components:{
  	list,detail
  },
  methods: {
    showDetail(row){
        this.detailVisible = true;
        this.mainVisible = false;
        this.$nextTick(()=>{
            this.$refs.detailCompon.init(row);
        })
    },
    showList(){
        this.detailVisible = false;
        this.mainVisible = true;
        this.$nextTick(()=>{
            this.$refs.listCompon.getDataList();
        })
    }
  }
};
</script>
<style lang="scss" scoped>

</style>
