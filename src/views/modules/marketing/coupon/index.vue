<template>
  <div>
      <!-- 列表 -->
      <coupon v-if='couponIsshow&&!detailStatus'  @artcoupon='testFather(arguments)' @showDetail='showDetail'></coupon>
      <!-- 新增编辑 -->
      <addcoupon v-if='!couponIsshow&&!detailStatus' @artcouponno='artcouponno' :editSatusId="editSatusId" :editType="editType"></addcoupon>
      <!-- 查看 -->
      <detailcoupon v-if="detailStatus" ref="detailCompon" @detailno="detailno"></detailcoupon>

  </div>
</template>

<script>
import coupon from './coupon'
import addcoupon from "./addcoupon";
import detailcoupon from "./detailcoupon";

export default {
  data () {
    return {
      detailStatus:false,
      couponIsshow: true,
      editSatusId:'',//判断是否编辑
      editType:'',//优惠券类型
      detailId:'',//详情id
    }
  },
  components:{
  	coupon,addcoupon,detailcoupon
  },
  created(){
  	
  },
  
  methods: {
      testFather(vals){
        this.couponIsshow = false;
        if(vals){
          this.editSatusId = vals[0];
          this.editType = vals[1]
        }
      },
      detailno(){
        this.detailStatus = false;
      },
      artcouponno(){
      	this.couponIsshow = true;
      },
      showDetail(row){
        this.detailStatus = true;
          this.$nextTick(()=>{
              this.$refs.detailCompon.init(row);
          })
      }
  }
};
</script>
<style lang="scss" scoped>

</style>
