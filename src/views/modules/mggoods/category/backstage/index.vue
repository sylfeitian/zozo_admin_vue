<template>
  <div>
      <list v-if="showListVisible" @hiddenList="hiddenList"></list>
      <addEditData ref="addEditData" v-if="!showListVisible" @showList="showList" :dataArray="dataArray"></addEditData>
   
  </div>
</template>
<script>
import list  from "./list";
import addEditData from "./add-edit-data";


export default {
  data() {
    return {
      showListVisible:true,
      dataArray:[],
    };
  },
  components: {
    addEditData,
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
