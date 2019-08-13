<template>
  <div>
       <coupon v-if='couponIsshow' @artcoupon = 'artcoupon'></coupon>
       <addcoupon v-else @artcouponno='artcouponno'></addcoupon>
  </div>
</template>

<script>
import coupon from './coupon'
import addcoupon from "./addcoupon";
  
export default {
  data () {
    return {
      couponIsshow: true,
    }
  },
  components:{
  	coupon,addcoupon
  },
  created(){
  	
  },
  methods: {
      artcoupon(){
      	this.couponIsshow = false;
      },
      artcouponno(){
      	this.couponIsshow = true;
      }
  }
};
</script>
<style lang="scss" scoped>

</style>
