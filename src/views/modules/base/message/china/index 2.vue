<template>
  <div>
      <list v-if="showListVisible" @hiddenList="hiddenList"></list>
  </div>
</template>
<script>
import list  from "./list";


export default {
  data() {
    return {
      showListVisible:true,
      dataArray:[],
    };
  },
  components: {
    list,
  },
  created () {
  },
  methods: {
    showList(){
         this.showListVisible = true;
    },
    hiddenList(row){
        this.showListVisible = false;
        this.$nextTick(()=>{
          this.$refs.addEditData.init(row);
        })

    },
  }
}
</script>
