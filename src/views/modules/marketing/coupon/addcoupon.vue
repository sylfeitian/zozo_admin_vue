<template>
  <div>
    <Bread :breaddata="breaddata" :index = "'1'" @changePage = "changePage"></Bread>
    <!-- 判断为编辑情况下不需tab切换 -->
    <add-coupon-pt v-if="editSatusId&&editType == '普通优惠券'" :editSatusId="editSatusId" @changePage = "changePage"></add-coupon-pt>
    <add-coupon-jf v-if="editSatusId&&editType == '积分兑换券'" :editSatusId="editSatusId" @changePage = "changePage"></add-coupon-jf>
    <add-coupon-vip v-if="editSatusId&&editType == '新会员专享'" :editSatusId="editSatusId" @changePage = "changePage"></add-coupon-vip>
    <!-- 判断为新增情况下需要tab切换 -->
    <el-tabs v-if="!editSatusId" v-model="activeName2" type="card" @tab-click="handleClick">
	    <el-tab-pane label="普通优惠券" name="first">
	    	<add-coupon-pt :type="type" v-if="showLable == '普通优惠券'" @changePage = "changePage"></add-coupon-pt>
	    </el-tab-pane>
	    <el-tab-pane label="积分兑换券" name="second">
	    	<add-coupon-jf :type="type" v-if="showLable == '积分兑换券'" @changePage = "changePage"></add-coupon-jf>
	    </el-tab-pane>
	    <el-tab-pane label="新会员专享" name="third">
	    	<add-coupon-vip :type="type" v-if="showLable == '新会员专享'" @changePage = "changePage"></add-coupon-vip>
	    </el-tab-pane>
	</el-tabs>

  </div>
</template>

<script>
import Bread from "@/components/bread";
import addCouponJf from './addcouponjf'
import addCouponPt from './addcouponpt'
import addCouponVip from './addcouponvip'
export default {
    // props: ['editSatusId','editType'],//editSatusId:优惠券id    editType:优惠券类型
    data () {
        return {
            showLable:'普通优惠券',
            breaddata: ["营销管理", "优惠券","添加优惠券"],
            activeName2: 'first',
            type:'status',
			editSatusId:"",//优惠券id
			editType:'',//优惠券类型
			row:'',
        }
    },
    components:{
        Bread,addCouponJf,addCouponPt,addCouponVip
    },
    created(){
        // this.demo();
        // console.log('新增页编辑id',this.editSatusId)
    },
    // watch:{
    //     type(newValue,oldValue){
    //         console.log('newValue',newValue)
    //     },
    // },
    methods: {
			init(row){
				console.log(row);
				if(row){
					//	编辑
					this.row = row;
					this.editSatusId = row.id;
					this.editType = row.editType;
					this. breaddata= ["营销管理", "优惠券","编辑"+row.editType+"优惠券"]
					// this. breaddata= ["营销管理", "优惠券","编辑优惠券"]
				}else{
					//	新增
					this.editSatusId = "";
					this.showLable ="普通优惠券";
					this. breaddata= ["营销管理", "优惠券","添加优惠券"]
				}
			},
            handleClick(tab, event) {
                console.log(tab.label)
                this.showLable = tab.label
            },
            //返回列表页面
            changePage(){
                this.$emit('artcouponno')
            },
            // demo(){
            //     function placeholderPic(){
            //         var w = document.documentElement.offsetWidth;
            //         document.documentElement.style.fontSize=w/20+'px';
            //     }
            //         placeholderPic();
            //     window.onresize=function(){
            //         placeholderPic();
            //     }
            // },
    }
};
</script>
<style lang="scss" scoped>
.el-input {
  width: 170px;
  height: 40px;
}

/*------------------------修改type=number的样式------------------------------------------------*/
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
}
input[type="number"]{
    -moz-appearance: textfield;
}

.artfromitem{
	/deep/ .el-form-item__content{
	 	display: flex;
	 	.el-input.el-input--default{
	 		margin: 0 10px;
	 	}
	}
}
.el-form-item__content>div{
	color: #999999;
}
</style>
