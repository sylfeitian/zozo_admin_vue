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
      
        <el-form-item class="artfromitem" label="使用门槛：" prop="threshold">
        		<div>单笔订单满</div>
            <el-input v-model="dataForm.threshold"  type="number"  max="1000000" placeholder="0"  style="width:400px;"></el-input>
        		<div>元可用（输入“0”为无门槛优惠券）</div>
        </el-form-item>
        <el-form-item class="artfromitem" label="每人限领：" prop="limitNum">
            <el-input v-model="dataForm.limitNum" type="number"  max="1000000" placeholder="1"  style="width:400px;"></el-input>
            <div>张 &nbsp;&nbsp;&nbsp;&nbsp; 0代表不限制，每人最多限制5张</div>
        </el-form-item>
        <el-form-item label="有效期：" prop="totalNums">
<!--            <el-input v-model="dataForm.totalNums" type="number"  max="1000000" placeholder="1000"  style="width:400px;"></el-input>-->
            <span>日期范围</span>&nbsp;
<!--            <el-date-picker-->
<!--                    v-model="dataForm.startTime"-->
<!--                    type="datetime"-->
<!--                    placeholder="选择日期时间">-->
<!--            </el-date-picker>-->
            <el-date-picker
                    v-model="valuetime"
                    type="datetimerange"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    align="right"
                    unlink-panels
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @blur='acttime'>
            </el-date-picker>
            <br>
            <span>固定天数</span>&nbsp;
            <el-input placeholder="20" v-model="dataForm.validityDays" show-word-limit style="width:220px;">
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
import { updateActivityNormal, editActivityNormal, backScanActivity } from '@/api/api'
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
var validfaceValue =(rule, value,callback)=>{
    if (value/1 > 1000000){
      callback(new Error('请输入1000000以内的数字'))
    }else if(value <= 0){
    	callback(new Error('只能输入大于0的数'))
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
                limitNum:'',
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
                limitNum: [
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
                    console.log(time.getTime() );
                    console.log(Date.now());
                  return time.getTime() < Date.now() - 8.64e7
                }
            },
            row:"",
            valuetime:"",
        }
    },
    components:{
        
    },
    created(){
        console.log('999999',this.type,this.editSatusId)
        if(!this.type){
            this.getInfo();//判断为编辑时获取详情
        }else{
            this.dataForm = {
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
            console.log('=====',this.type)
            this.$emit('changePage')
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
