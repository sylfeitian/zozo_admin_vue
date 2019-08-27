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
        <el-form-item label="领取开始时间："  prop="startTime">
        	<!--:default-time="startsecond"-->
            	<el-date-picker
                v-model="dataForm.startTime"
                type="date"
                value-format="yyyy-MM-dd"
                clearable
                :picker-options="pickerOptions0"
                placeholder="请选择时间："
                style="width:220px;">
            </el-date-picker>
      </el-form-item>
      <el-form-item label=""  prop="value1" class="artvalue12time">  
						<el-time-picker
							v-if="value1isshow"
						  v-model="dataForm.value1"
					    :picker-options="value1Time"
					    @blur ="artvalue1time"
					    placeholder="选择时间">
  					</el-time-picker>
     </el-form-item>
       
      
      
      
      <el-form-item label="领取结束时间：" prop="endTime">
            <el-date-picker
                v-model="dataForm.endTime"
                type="date"
                value-format="yyyy-MM-dd"
                clearable
                :picker-options="pickerOptions1"
                placeholder="请选择时间："
                style="width:220px;">
            </el-date-picker>
    	</el-form-item>
    	<el-form-item label="" prop="value2" class="artvalue12time">
            <el-time-picker
            	v-if="value2isshow"
						  v-model="dataForm.value2"
						  :picker-options="value2Time"
						  :disabled = "value2timedisabled"
						  @focus ="artvalue2time"
						  placeholder="选择时间">
						</el-time-picker>
    	</el-form-item>
    	
    
        <el-form-item class="artfromitem" label="使用门槛：" prop="totalnumber">
        		<div>单笔订单满</div>
            <el-input v-model="dataForm.totalnumber"  type="number"  max="1000000" placeholder="0"  style="width:400px;"></el-input>
        		<div>元可用（输入“0”为无门槛优惠券）</div>
        </el-form-item>
        <el-form-item class="artfromitem" label="每人限领：" prop="men">
            <el-input v-model="dataForm.onlyNum" :disabled="true" type="number"  max="1000000" placeholder="1"  style="width:400px;"></el-input>
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
    props: ['type','editSatusId'],
  data () {
    return {
        saveLoading: false,
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
               if (this.dataForm.endTime) {   //先选的结束时间
                  return time.getTime() > new Date(this.dataForm.endTime).getTime()  || time.getTime() < Date.now() - 8.64e7;
               }else{//还没有选择结束时间的时候，让他只能选择今天之后的时间包括今天
                   return time.getTime() < Date.now() - 8.64e7
               } 
     
             }
        },
         pickerOptions1: {
                disabledDate: (time) => {
                    if(this.dataForm.startTime){
                      return time.getTime() < new Date(this.dataForm.startTime).getTime() - 8.64e7;//可以选择同一天
                    }else if(!this.dataForm.startTime){
											return time.getTime() < Date.now() - 8.64e7
										}
                }
            },
					value1isshow: false,
					value2isshow: false,
					value1Time:{},
					value2Time:{},
					value2timedisabled: false,
//    startsecond: vueFilter.formHMS(Date.now()),  //当前时间
    }
  },
  components:{
  	
  },
  created(){
      if(!this.type){
            this.getInfo();//判断为编辑时获取详情
        }else{
            this.dataForm = {
                onlyNum:'1',//限领数
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
            }
        }
      this.demo();
  },
  watch:{
  	dataForm:{ //监听的对象
    	deep:true, //深度监听设置为 true
    	handler:function(newV,oldV){
    		//选择了开始时间
				if(newV.startTime){   
	      	this.value1isshow = true;
	      	var currentTime = vueFilter.dateToStr();
	      	//选择的是今天
	      	if(this.dataForm.startTime.substr(0,10) == currentTime.substr(0,10)){
	      		this.value1Time = {
					      selectableRange: `${currentTime.substr(11)} - 23:59:59`
						};
	      	}else{
	      		this.value1Time = {
					      selectableRange: '00:00:00 - 23:59:59'
						};
	      	}
	   		}else{
	     		this.value1isshow = false;
		  		this.dataForm.value1 = '';
	     	}
	   		
	   		
				//选择了结束时间
				if(newV.endTime){    
	      	this.value2isshow = true;
	   		}else{    //清空了结束时间
	     		this.value2isshow = false;
		  		this.dataForm.value2 = '';
	     	}    		
     	}
		}
	
  },
  methods: {
        //编辑详情接口方法
        getInfo(){

        },
        //返回
        goList(){
            this.$emit('changePage')
        },
        artvalue1time(){
            if(this.dataForm.value1){  
                this.value2timedisabled = false;
            }else{
                this.value2timedisabled = true;
            }
        },
        artvalue2time(){
            this.value2timedisabled = false;
            if(this.dataForm.value1 && this.dataForm.startTime == this.dataForm.endTime){    //选择了开始时间      日期是同一天
                this.value2Time = {
                    selectableRange: `${vueFilter.dateToStr(this.dataForm.value1).substr(10)} - 23:59:59`
                };
            }else if(this.dataForm.value1){
                this.value2Time = {
                    selectableRange: `00:00:00- 23:59:59`
                };
            }else{
                this.value2Time = {
                    selectableRange: `00:00:00- 23:59:59`
                };
                this.value2timedisabled = true;
                this.$message('请先选择开始时间');
            }
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
