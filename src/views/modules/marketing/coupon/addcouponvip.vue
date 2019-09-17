<template>
  <div>
    	<el-form :model="dataForm" label-width="140px" 	:rules="dataRule" class="demo-ruleForm" ref="addForm">
        <el-form-item label="优惠券名称：" prop="name">
            <el-input v-model="dataForm.name" type="text" maxlength="50" placeholder="请输入50字以内的内容" show-word-limit style="width:400px;"></el-input>
        </el-form-item>
        <el-form-item label="总发行量：" prop="totalNums">
            <el-input v-model="dataForm.totalNums" type="number"  max="1000000" placeholder="1000"  style="width:400px;"></el-input>
        </el-form-item>
        <el-form-item label="面额：" prop="faceValue">
             <el-input placeholder="20" v-model="dataForm.faceValue" show-word-limit style="width:220px;">
					    <template slot="append">元</template>
					  </el-input>
					  <div>面值只能是数值，0.01-1000000，限2位小数</div>
        </el-form-item>
<!--        <el-form-item label="领取开始时间："  prop="getStartTime">-->
<!--        	&lt;!&ndash;:default-time="startsecond"&ndash;&gt;-->
<!--            	<el-date-picker-->
<!--                v-model="dataForm.getStartTime"-->
<!--                type="date"-->
<!--                value-format="yyyy-MM-dd"-->
<!--                clearable-->
<!--                :picker-options="pickerOptions0"-->
<!--                placeholder="请选择时间："-->
<!--                style="width:220px;">-->
<!--            </el-date-picker>-->
<!--      </el-form-item>-->
<!--      <el-form-item label=""  prop="value1" class="artvalue12time">-->
<!--						<el-time-picker-->
<!--							v-if="value1isshow"-->
<!--						  v-model="dataForm.value1"-->
<!--					    :picker-options="value1Time"-->
<!--					    @blur ="artvalue1time"-->
<!--					    placeholder="选择时间">-->
<!--  					</el-time-picker>-->
<!--     </el-form-item>-->
<!--      <el-form-item label="领取结束时间：" prop="getEndTime">-->
<!--            <el-date-picker-->
<!--                v-model="dataForm.getEndTime"-->
<!--                type="date"-->
<!--                value-format="yyyy-MM-dd"-->
<!--                clearable-->
<!--                :picker-options="pickerOptions1"-->
<!--                placeholder="请选择时间："-->
<!--                style="width:220px;">-->
<!--            </el-date-picker>-->
<!--    	</el-form-item>-->
<!--    	<el-form-item label="" prop="value2" class="artvalue12time">-->
<!--            <el-time-picker-->
<!--            	v-if="value2isshow"-->
<!--						  v-model="dataForm.value2"-->
<!--						  :picker-options="value2Time"-->
<!--						  :disabled = "value2timedisabled"-->
<!--						  @focus ="artvalue2time"-->
<!--						  placeholder="选择时间">-->
<!--						</el-time-picker>-->
<!--    	</el-form-item>-->
            <el-form-item label="领取开始时间："  prop="getStartTime">
                <el-date-picker
                        v-model="dataForm.getStartTime"
                        type="datetime"
                        placeholder="选择开始时间"
                        style="width: 200px">
                </el-date-picker>
            </el-form-item>

            <el-form-item label="领取结束时间："  prop="getEndTime">
                <el-date-picker
                        v-model="dataForm.getEndTime"
                        type="datetime"
                        placeholder="选择结束时间"
                        style="width: 200px">
                </el-date-picker>
            </el-form-item>
        <el-form-item class="artfromitem" label="每人限领：" prop="men">
            <span>1张</span>
        </el-form-item>
        <el-form-item class="artfromitem" label="使用门槛：" prop="threshold">
        		<div>单笔订单满</div>
            <el-input v-model="dataForm.threshold"  type="number"  max="1000000" placeholder="0"  style="width:400px;"></el-input>
        		<div>元可用（输入“0”为无门槛优惠券）</div>
        </el-form-item>
        <el-form-item label="有效期：" prop="validityDays">
            <el-input v-model="dataForm.validityDays" placeholder="领取后到期天数" show-word-limit style="width:220px;">
                <template slot="append">天</template>
            </el-input>
        </el-form-item>
        <el-form-item label="备注：" prop="bei">
           <el-input
						  type="textarea"
						  placeholder="请输入内容"
						  v-model="dataForm.bei"
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
    import cloneDeep from 'lodash/cloneDeep'
    import vueFilter from '@/utils/filter'
    import { updateActivityNewMember, editActivityNewMember, backScanActivity } from '@/api/api'
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
    var validfaceValue =(rule, value,callback)=>{
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
        bei:'',
        dataForm:{
            name: "",//分类名称 ,
            totalNums: "", //总发行量
            gcParentId: 0,//父ID ,
            gcSort: 0,// 排序 ,
            attrIds:[],//属性关联数组 ,
            specIds:[],//规格关联数组 ,
            storeId: 0,//店铺ID
            faceValue:0,
            getStartTime:'',
            getEndTime:'',
            value1:'',
            value2:'',
    	},
    	dataRule : {
            name : [
                { required: true, message: '必填项不能为空', trigger: 'blur' },
            ],
            getStartTime : [
                    { required: true, message: '必填项不能为空', trigger: 'blur' },
            ],
            getEndTime : [
                    { required: true, message: '必填项不能为空', trigger: 'blur' },
            ],
            value1 : [
                    { required: true, message: '必填项不能为空', trigger: 'blur' },
            ],
            value2 : [
                    { required: true, message: '必填项不能为空', trigger: 'blur' },
            ],
            threshold: [
                    { required: true, message: '必填项不能为空', trigger: 'blur' },
            ],
            validityDays: [
                { required: true, message: '必填项不能为空', trigger: 'blur' },
            ],
            totalNums :[
                    { required: true, message: '必填项不能为空', trigger: 'blur' },
                    { validator: validnumber, trigger: 'blur' },
            ],
            faceValue :[
                    { required: true, message: '必填项不能为空', trigger: 'blur' },
                    { validator: validfaceValue, trigger: 'blur' },
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
               if (this.dataForm.getEndTime) {   //先选的结束时间
                  return time.getTime() > new Date(this.dataForm.getEndTime).getTime()  || time.getTime() < Date.now() - 8.64e7;
               }else{//还没有选择结束时间的时候，让他只能选择今天之后的时间包括今天
                   return time.getTime() < Date.now() - 8.64e7
               } 
     
             }
        },
         pickerOptions1: {
                disabledDate: (time) => {
                    if(this.dataForm.getStartTime){
                      return time.getTime() < new Date(this.dataForm.getStartTime).getTime() - 8.64e7;//可以选择同一天
                    }else if(!this.dataForm.getStartTime){
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
                name: "",//分类名称 ,
                totalNums: "", //总发行量
                gcParentId: 0,//父ID ,
                gcSort: 0,// 排序 ,
                attrIds:[],//属性关联数组 ,
                specIds:[],//规格关联数组 ,
                storeId: 0,//店铺ID
                faceValue:0,
                getStartTime:'',
                getEndTime:'',
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
				if(newV.getStartTime){
	      	this.value1isshow = true;
	      	var currentTime = vueFilter.dateToStr();
	      	//选择的是今天
	      	if(this.dataForm.getStartTime.substr(0,10) == currentTime.substr(0,10)){
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
				if(newV.getEndTime){
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
          var obj  = {
              id: this.editSatusId,
          };
          backScanActivity(obj).then((res)=>{
              console.log(res);
              if(res.code==200){
                  this.dataForm = res.data;
              }
          })
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
            if(this.dataForm.value1 && this.dataForm.getStartTime == this.dataForm.getEndTime){    //选择了开始时间      日期是同一天
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
            this.dataForm.getStartTime = this.valuetime[0];
            this.dataForm.getEndTime = this.valuetime[1];
        },
      // 提交
      dataFormSubmit(formName){
          // alert([this.dataForm.name,this.dataForm.domainAddress]);
          this.$refs[formName].validate((valid) => {
              if (valid) {
                  this.loading = true;
                  var obj = {
                      bei:  this.dataForm.bei,
                      faceValue:  this.dataForm.faceValue,
                      getEndTime:  this.dataForm.getEndTime,
                      getStartTime:  this.dataForm.getStartTime,
                      name:  this.dataForm.name,
                      threshold:  this.dataForm.threshold,
                      totalNums:  this.dataForm.totalNums,
                      validityDays:  this.dataForm.validityDays,
                  }
                  if(this.row) obj.id = this.row.id
                  var fn = this.row?editActivityNewMember:updateActivityNewMember;
                  fn(obj).then((res) => {
                      this.loading = false;
                      // alert(JSON.stringify(res));
                      let status = null;
                      if(res.code == "200"){
                          status = "success";
                          this.visible = false;
                          this.$emit('searchDataList');
                          this.closeDialog();

                      }else{
                          status = "error";
                      }

                      this.$message({
                          message: res.msg,
                          type: status,
                          duration: 1500
                      })
                  })
              } else {
                  //console.log('error 添加失败!!');
                  return false;
              }
          })
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
