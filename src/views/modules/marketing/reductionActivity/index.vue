<template>
  <div>
      <!-- 列表 -->
      <list v-if='showStatus'  @addAditFun='addAditFun'></list>
      <!-- 查看 -->
      <detail v-else ></detail>
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
      
  }
};
</script>
<style lang="scss" scoped>

</style>
