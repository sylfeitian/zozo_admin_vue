<template>
  <div>
    <Bread :breaddata="breaddata" :index = "'1'" @changePage = "changePage"></Bread>
    
    <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
	    <el-tab-pane label="普通优惠券" name="first">
	    	<add-coupon-pt></add-coupon-pt>
	    </el-tab-pane>
	    <el-tab-pane label="积分优惠券" name="second">
	    	<add-coupon-jf></add-coupon-jf>
	    </el-tab-pane>
	    <el-tab-pane label="新会员专享" name="third">
	    	<add-coupon-vip></add-coupon-vip>
	    </el-tab-pane>
	  </el-tabs>
    
		
    
    
    
  </div>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import { businessPageUrl } from '@/api/url'
import { storeGrade } from '@/api/api'
import Bread from "@/components/bread";
import vueFilter from '@/utils/filter'
import addCouponJf from './addcouponjf'
import addCouponPt from './addcouponpt'
import addCouponVip from './addcouponvip'
var validnumber =(rule, value,callback)=>{
    if (value/1 > 1000000){
      callback(new Error('请输入1000000以内的数字'))
    }else if(value.indexOf('.') != -1){
    	callback(new Error('只能输入整数'))
    }else if(value <= 0){
    	callback(new Error('只能输入大于的数'))
    }else {
      callback()
    }
};
var validmoney =(rule, value,callback)=>{
    if (value/1 > 1000000){
      callback(new Error('请输入1000000以内的数字'))
    }else if(value <= 0){
    	callback(new Error('只能输入大于的数'))
    }else if(value.indexOf('.') != -1 && value.substr(value.indexOf('.') + 1).length > 2){
    	callback(new Error('小数点后只能有两位'))
    }else {
      callback()
    }
};
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
          getDataListURL: businessPageUrl,
          getDataListIsPage: true,
          exportURL: '/admin-api/store/export',
          deleteURL: '/admin-api/store',
          deleteIsBatch: true,
          // deleteIsBatchKey: 'id'
      },
      dataForm: {},
      breaddata: ["营销管理", "优惠券","添加优惠券"],
      saveLoading: false,
      activeName2: 'first',
      dataForm:{
        "gcName": "",//分类名称 ,
        "brandId": 0,//品牌ID ,
        "totalnumber": "", //总发行量
        // "gcIdpath": "",//层级path ,
        "gcParentId": 0,//父ID ,
        "gcSort": 0,// 排序 ,
        "attrIds":[],//属性关联数组 ,
        "specIds":[],//规格关联数组 ,
        "storeId": 0,//店铺ID
        // "id":''
        "money":0,
    	},
    	dataRule : {
        gcName : [
            { required: true, message: '必填项不能为空', trigger: 'blur' },
        ],
        time : [
        		{ required: true, message: '必填项不能为空', trigger: 'blur' },
        ],
        men: [
        		{ required: true, message: '必填项不能为空', trigger: 'blur' },
        ],
        totalnumber :[
        		{ required: true, message: '必填项不能为空', trigger: 'blur' },
        		{ validator: validnumber, trigger: 'blur' },
        ],
        money :[
        		{ required: true, message: '必填项不能为空', trigger: 'blur' },
        		{ validator: validmoney, trigger: 'blur' },
        ],
        gcParentId : [
            { required: true, message: '必填项不能为空', trigger: 'blur' },
        ],
        gcSort : [
            { required: true, message: '必填项不能为空', trigger: 'blur' },
        ],
      },
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7; //如果没有后面的-8.64e7就是不可以选择今天的
        }
      },
//    startsecond: vueFilter.formHMS(Date.now()),  //当前时间
    }
  },
  components:{
  	Bread,addCouponJf,addCouponPt,addCouponVip
  },
  created(){
      let obj = {
            params:{
                page:1,
                limit:100,
            }
        }
      storeGrade(obj).then((res)=>{
          console.log('商家等级',res)
            if(res.code == 200 && res.data.list){
                this.storeGradeList = res.data.list
            }
      })
      this.demo();
  },
  methods: {
	  		handleClick(tab, event) {
	        console.log(tab, event);
	     	},
  			changePage(){
  				this.$emit('artcouponno')
  			},
        showDetail(id){
	    	this.$emit("showDetail",id);
        },
        addOrAdit(id){
            this.$emit("addOrAdit",id);
        },
        reset() {
            this.dataForm = {};
            this.getDataList();
        },
        addCoupon(){
        	this.$emit('artcoupon')
        },
        demo(){
        	function placeholderPic(){
						var w = document.documentElement.offsetWidth;
						document.documentElement.style.fontSize=w/20+'px';
					}
						placeholderPic();
					window.onresize=function(){
						placeholderPic();
					}
        },
        //开始结束时间
		    acttime(){
		    	this.dataForm.strTime = this.valuetime[0];
		    	this.dataForm.endTime = this.valuetime[1];
		    },
        
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
