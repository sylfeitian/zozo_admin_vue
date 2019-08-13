<template>
    <div>
        <index :status="radio1"></index>
    </div>
</template>
<script>
import index from "../list/index";

export default {
  data() {
      return{
          "radio1": 10
      }
    
  },
  components: { index }
};
</script>
<style lang="scss" scoped>
</style>
