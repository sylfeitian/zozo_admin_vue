<template>
  <div>
    	<el-form :model="dataForm" label-width="140px" 	:rules="dataRule" class="demo-ruleForm" ref="addForm">
        <el-form-item label="优惠券名称：" prop="gcName">
            <el-input v-model="dataForm.gcName" type="text" maxlength="50" placeholder="请输入50字以内的内容" show-word-limit style="width:400px;"></el-input>
        </el-form-item>
        <el-form-item label="总发行量：" prop="totalnumber">
            <el-input v-model="dataForm.totalnumber" type="number"  max="1000000" placeholder="1000"  style="width:400px;"></el-input>
        </el-form-item>
        <el-form-item label="面额：" prop="money">
             <el-input placeholder="20" v-model="dataForm.money" show-word-limit style="width:220px;">
					    <template slot="append">元</template>
					  </el-input>
					  <div>面值只能是数值，0.01-1000000，限2位小数</div>
        </el-form-item>
        <el-form-item label="领取时间："  prop="startTime">
        	<el-date-picker
			      v-model="dataForm.startTime"
			      type="datetimerange"
            :picker-options="pickerOptions0"
			      range-separator="至"
			      start-placeholder="开始日期"
			      end-placeholder="结束日期">
			    </el-date-picker>
    		</el-form-item>
      
        <el-form-item class="artfromitem" label="使用门槛：" prop="totalnumber">
        		<div>单笔订单满</div>
            <el-input v-model="dataForm.totalnumber"  type="number"  max="1000000" placeholder="0"  style="width:400px;"></el-input>
        		<div>元可用（输入“0”为无门槛优惠券）</div>
        </el-form-item>
        <el-form-item class="artfromitem" label="每人限领：" prop="men">
            <el-input v-model="dataForm.totalnumber" type="number"  max="1000000" placeholder="1"  style="width:400px;"></el-input>
            <div>张 &nbsp;&nbsp;&nbsp;&nbsp; 0代表不限制，每人最多限制5张</div>
        </el-form-item>
        <el-form-item label="有效期：" prop="totalnumber">
            <el-input v-model="dataForm.totalnumber" type="number"  max="1000000" placeholder="1000"  style="width:400px;"></el-input>
        </el-form-item>
        <el-form-item label="备注：" prop="datatextarea">
           <el-input
						  type="textarea"
						  placeholder="请输入内容"
						  v-model="dataForm.datatextarea"
						  maxlength="300"
						  style="width:400px;">
						</el-input>
        </el-form-item>
        <el-form-item>
            <el-button @click="goList()">返回</el-button>
            <el-button type="primary" @click="dataFormSubmit('addForm')" :loading="saveLoading">{{saveLoading?"提交中...":"确认"}}</el-button>
        </el-form-item>
		</el-form>
  </div>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import { businessPageUrl } from '@/api/url'
import { storeGrade } from '@/api/api'
import vueFilter from '@/utils/filter'
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
      saveLoading: false,
      activeName2: 'first',
      datatextarea:'',
      dataForm:{
        "gcName": "",//分类名称 ,
        "totalnumber": "", //总发行量
        "gcParentId": 0,//父ID ,
        "gcSort": 0,// 排序 ,
        "attrIds":[],//属性关联数组 ,
        "specIds":[],//规格关联数组 ,
        "storeId": 0,//店铺ID
        "money":0,
        startTime:'',
        endTime:'',    
        value1:'',
        value2:'',
    	},
    	dataRule : {
        gcName : [
            { required: true, message: '必填项不能为空', trigger: 'blur' },
        ],
        startTime : [
        		{ required: true, message: '必填项不能为空', trigger: 'blur' },
        ],
        endTime : [
        		{ required: true, message: '必填项不能为空', trigger: 'blur' },
        ],
        value1 : [
        		{ required: true, message: '必填项不能为空', trigger: 'blur' },
        ],
        value2 : [
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
        disabledDate: (time) => {
        	console.log(time.getTime() );
        	console.log(Date.now());
          return time.getTime() < Date.now() - 8.64e7
        }
      },
    }
  },
  components:{
  	
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
  watch:{

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
.artvalue12time{
	 margin: -55px 0 0 231px;
}   
</style>
