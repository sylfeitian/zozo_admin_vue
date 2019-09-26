<template>
    <div>
        <Bread :breaddata="breaddata"></Bread>
        <!--:inline="true"-->
        <el-form
            v-loading="loading"
            :model="dataForm"
            :rules="dataRule"
            ref="addForm"
            label-width="120px"
             class="demo-form-inline"
        >
            <el-form-item style="background-color: #f3f3f3;">
                <p style="margin-left: -100px;">客服审单设置</p>
            </el-form-item>
            <el-form-item label="留言审核开关：" prop="isLeaveMessage">
                <el-switch
                        v-model="dataForm.isLeaveMessage"
                        active-color="#1890ff"
                        inactive-color="#ff4949"
                ></el-switch>
            </el-form-item>
            <el-form-item label="黑名单审核开关：" prop="isEnableBlacklist">
                <el-switch
                        v-model="dataForm.isEnableBlacklist"
                        active-color="#1890ff"
                        inactive-color="#ff4949"
                ></el-switch>
            </el-form-item> 
            <!--@keydown.native="artonkeydown('minAmount')"  @keyup.native="artonkeyup" -->
            <el-form-item class="artAmount" label="订单有效金额范围：" prop="minAmount" :label-width="formLabelWidth">
                <el-input  @keydown.native="artonkeydown('minAmount')"  @keyup.native="artonkeyup"   v-model="dataForm.minAmount"  placeholder="请输入" style="width: 160px;"></el-input>
                <span> ~ </span>
            </el-form-item>
            <!-- @keydown.native="artonkeydown('maxAmount')"  @keyup.native="artonkeyup"-->
            <el-form-item  class="artAmount artmaxAmount" prop="maxAmount" :label-width="formLabelWidth">
                <el-input  @keydown.native="artonkeydown('maxAmount')"  @keyup.native="artonkeyup"  v-model="dataForm.maxAmount"  placeholder="请输入" style="width: 160px;"></el-input>

            </el-form-item>
            
            
            <el-form-item style="background-color: #f3f3f3;">
                <p style="margin-left: -100px;">订单设置</p>
            </el-form-item>
            <el-form-item class="artAmount" label="未支付订单失效时间：" prop="expirationTimeMinute" :label-width="formLabelWidth">
                <el-input type="text" v-model="dataForm.expirationTimeMinute"  placeholder="请输入" style="width: 111px;"></el-input>
                <span> 分（min）</span>
            </el-form-item>  
            <el-form-item  class="artAmount artmaxAmount" prop="expirationTimeSecond" :label-width="formLabelWidth">
				<el-input type="text" v-model="dataForm.expirationTimeSecond"  placeholder="请输入" style="width: 111px;"></el-input>
                <span> 秒（s）</span>
            </el-form-item>
            
            
            <el-form-item label="自动确认收货时间：" prop="autoConfirmReceiptTime" :label-width="formLabelWidth">
                <el-input type="text" v-model="dataForm.autoConfirmReceiptTime"  placeholder="请输入" style="width: 250px;"></el-input>
                <span> 天（day）</span>
                <span style="color: #999999;">发货后自动确认收货时间</span>
            </el-form-item>
            <!-- <el-form-item label="售后时间：" prop="saleafterStopTime" :label-width="formLabelWidth">
                <el-input type="number" maxlength='3' v-model="dataForm.saleafterStopTime"  placeholder="请输入" style="width: 250px;"></el-input>
                <span> 天（day）</span>
                <span style="color: #999999;">确认收货后可申请售后的时间</span>
            </el-form-item> -->
            <el-form-item label="单笔订单最小金额：" prop="auditOrderMinAmount" :label-width="formLabelWidth">
                <el-input type="text" v-model="dataForm.auditOrderMinAmount"  placeholder="请输入" style="width: 250px;"></el-input>
                <span> 元（RMB）</span>
                <span style="color: #999999;">低于该金额时将无法提交订单</span>
            </el-form-item>
            <el-form-item style="background-color: #f3f3f3;">
                <p style="margin-left: -100px;">价格设置</p>
            </el-form-item>
            <el-form-item label="今日汇率：" prop="" :label-width="formLabelWidth">
                <p style="margin-top: 10px;padding: 2px 15px;background: #f1deab;display: inline-block;">{{ratenum}}</p>
            </el-form-item>
            <el-form-item label="上调幅度：" prop="riseIn" :label-width="formLabelWidth">
                <el-input type="text" v-model="dataForm.riseIn" auto-complete="off" placeholder="请输入" style="width: 250px;"></el-input>
                <span> % </span>
            </el-form-item>
            <el-form-item label="加价率：" prop="" :label-width="formLabelWidth">
            	<div class="artaddrate" v-for="(item,index) in rate" :key="index">
            		<el-input type="number"  v-model="rate[index-1] && rate[index-1].end || item.start"  :disabled="datadisabled" auto-complete="off" placeholder="0" style="width: 150px;"></el-input>
	                <span> —— </span>
	                <el-input v-if="rate.length==1 || index!=rate.length-1" type="number"  @blur="actendnum(item.end,item.start)" v-model="item.end"  placeholder="请输入" style="width: 150px;"></el-input>
                    <el-input v-else :disabled="true"   placeholder="..." style="width: 150px;"></el-input>
	                <span> 元（日元） </span>
	                <el-input type="number"  @blur="actratenum(item.rate)" v-model="item.rate" placeholder="请输入加价率" style="width: 100px;"></el-input>
	                <span> % </span>  
	                <span v-if="rate.length-1 == index" > 
	                	&nbsp; &nbsp;
	                	<i @click="artaddclick" class="el-icon-circle-plus"></i>
	                	&nbsp; &nbsp;
	                	<i v-if="rate.length-1 == index && rate.length>2" @click="deladdclick" class="el-icon-remove-outline"></i>
	                </span>
            	</div>
            </el-form-item>
            <el-form-item label="" prop="" :label-width="formLabelWidth">
            	<div class="artinfo">
            		金额区间不可重复 <br/>
            		金额区间最大值不可大于下一区间的最小值<br/>
            		第一区间最小值默认为0且不可修改
            	</div>
            </el-form-item>
          

             <el-form-item style="background-color: #f3f3f3;">
                <p style="margin-left: -100px;">倒挂阈值</p>
            </el-form-item>
             <el-form-item label="阈值：" prop="vpt" :label-width="formLabelWidth">
                <el-input type="number" v-model="dataForm.vpt " auto-complete="off" placeholder="请输入" style="width: 250px;"></el-input>
                <span> % </span>
            </el-form-item>

              <el-form-item  v-if="!loading" style="text-align: center;margin-left: -120px!important; margin-top: 50px; margin-bottom: 50px;">
                <el-button type="primary" @click="dataFormSubmit('addForm')">{{saveLoading?"保存中...":"保存"}}</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import Bread from "@/components/bread";
    import imgCropper from "@/components/model-photo-cropper";
    import { uploadPicBase64 } from '@/api/api'
    import quillEditorImg from "@/components/quillEditor"
    import { addsetting ,gethomepageRate,getStrategySetting } from "@/api/api"
    
	
    export default {
        data () {
	        var validmoney =(rule, value,callback)=>{
			    if (value/1 > 1000000){
			      callback(new Error('请输入1000000以内的数字'))
			    }else if(value <= 0){
			    	callback(new Error('只能输入大于0的数'))
			    }else if(value.toString().indexOf('.') != -1 && value.toString().substr(value.toString().indexOf('.') + 1).length > 2){
			    	callback(new Error('小数点后只能有两位'))
			    }else if(this.dataForm.maxAmount && value/1 > this.dataForm.maxAmount){
			      callback(new Error('最小值应该小于最大值'))
			    }else {
			      callback()
			    }
			};
			var valid =(rule, value,callback)=>{
			    if(value.toString().indexOf('.') != -1 && value.toString().substr(value.toString().indexOf('.') + 1).length > 2){
			    	callback(new Error('小数点后只能有两位'))
			    }else {
			      callback()
			    }
			};
	        var maxvalidmoney =(rule, value,callback)=>{
			    if (value/1 < this.dataForm.minAmount){
			      callback(new Error('最大值应该大于最小值'))
			    }else {
			      callback()
			    }
			};
			var validriseIn =(rule, value,callback)=>{
			    if(value.toString().indexOf('.') != -1 && value.toString().substr(value.toString().indexOf('.') + 1).length > 4){
			    	callback(new Error('小数点后只能有四位'))
			    }else if(value/1 > 100){
			      callback('最大值100')
			    }else {
			      callback()
			    }
            };
            var validVpt =(rule, value,callback)=>{
			    if(value.toString().indexOf('.') != -1 && value.toString().substr(value.toString().indexOf('.') + 1).length > 4){
			    	callback(new Error('小数点后只能有四位'))
			    }else if(value/1 > 100){
			      callback('最大值100')
			    }else {
			      callback()
			    }
            };
			var validnum0 =(rule, value,callback)=>{
			    if(value/1 < 0){
			      callback('该值应该大于0')
			    }else {
			      callback()
			    }
			};
			var validnummax =(rule, value,callback)=>{
			    if(value.toString().indexOf('.') !==-1){// 存在小数点
			        if(value.length>9){
                        callback('最高可输入6位数,可输入2位小数')
                    }else{
                        callback()
                    }
			    }else {// 不存在小数点
                    if(value.length>6){
                        callback('最高可输入6位数')
                    }else{
                        callback()
                    }
			    }
			};
			var validnumdian =(rule, value,callback)=>{
//				console.log(rule,value)
				var valuestr = value +'';
				if(valuestr && valuestr.indexOf('.') != -1 && valuestr.length > valuestr.indexOf('.') + 3){ //小数点只能输入两位
					this.dataForm[rule.field] =  valuestr.substring(0,valuestr.indexOf('.') + 3);
        		}
			     callback()
			};  
			var validnumreg =(rule, value,callback)=>{ //输入小数点后    前移一位再输入小鼠酒店  没用
				var reg = /(^[\-0-9][0-9]*(.[0-9]+)?)$/;
        		var pattern = new RegExp(reg);
        		var valuestr = value +'';
        		var lastchar = valuestr.substr(valuestr.length-1,1)
				this.dataForm[rule.field] =  parseFloat(valuestr) || '';
        		if(!(valuestr.indexOf('.') == -1) && e.key == '.'){    //存在小数点了
        			this.dataForm[this.lastname] = this.lastval;
        		}
        		
        		if(pattern.test(e.key) || e.key == '.' ){
        		}else{  //非数字
        			this.dataForm[this.lastname] =  parseFloat(this.lastval) || '';
                }
                 callback()
			};
            return {
                datadisabled: true,
                loading:false,
                saveLoading:false,
                breaddata: ["系统管理", "策略设置"],
                dataForm: {
                	isLeaveMessage: 0, //留言审核开关    0关  1开
                	isEnableBlacklist: 0, //黑名单审核开关   0关  1开
                	minAmount:'', //订单最小金额
                	maxAmount:'', //订单最大金额
                	expirationTimeMinute:'',  //订单失效时间   分
                	expirationTimeSecond:'',  //订单失效时间   秒
                	autoConfirmReceiptTime:'', //自动确认收货时间
                	saleafterStopTime:'',  //售后截至时间
                	auditOrderMinAmount:'', //单笔订单最小金额
                	riseIn:'', //上调幅度
                    addPriceRate:'', //加价符
                    vpt:'',//阈值
                },
                ratenum:'',
                rate:[{
                	start: 0,
                	end:'',
                	rate:'',
                }],
                disable: false,
                dataRule : {
                    minAmount : [
                        { required: true, message: '必填项不能为空', trigger: 'blur' },
                        // { min:0, max:1000000, message: '最大可输入1000000', trigger: 'blur' },
                        { validator: validmoney, trigger: 'blur' },
                        { validator: validnumdian, trigger: 'change' },
//                      { validator: validnumreg, trigger: 'change' },
                    ],
                    maxAmount : [
                        { required: true, message: '必填项不能为空', trigger: 'blur' },
                        // { min:0, max:1000000, message: '最大可输入1000000', trigger: 'blur' },
                        { validator: validmoney, trigger: 'blur' },
                        { validator: maxvalidmoney, trigger: 'blur' },
                        { validator: validnumdian, trigger: 'change' },
                    ],
                    expirationTimeMinute : [   
                        { required: true, message: '必填项不能为空', trigger: 'blur' },
                        { validator: validnum0, trigger: 'blur' },
                    ],
                    expirationTimeSecond : [
                        { required: true, message: '必填项不能为空', trigger: 'blur' },
                        { validator: validnum0, trigger: 'blur' },
                    ],
                    autoConfirmReceiptTime : [
                        { required: true, message: '必填项不能为空', trigger: 'blur' },
                        { validator: validnum0, trigger: 'blur' },
                    ],
                    saleafterStopTime : [
                        { required: true, message: '必填项不能为空', trigger: 'blur' },
                        { validator: validnum0, trigger: 'blur' },
                    ],
                    auditOrderMinAmount: [
                        { required: true, message: '必填项不能为空', trigger: 'blur' },
                       	{ validator: valid, trigger: 'blur' },
                       	{ validator: validnum0, trigger: 'blur' },
                       	{ validator: validnummax, trigger: 'blur' },

                    ],
                    riseIn: [
                        { required: true, message: '必填项不能为空', trigger: 'blur' },
                       	{ validator: validriseIn, trigger: 'blur' },
                       	{ validator: validnum0, trigger: 'blur' },
                    ],
                    vpt:[
                        { required: true, message: '必填项不能为空', trigger: 'blur' },
                        { validator: validVpt, trigger: 'blur' },
                       	{ validator: validnum0, trigger: 'blur' },
                    ]
                },
                formLabelWidth: '120px',
                dialogImageUrl: "",
                dialogVisible: false,
                uploading:false,
                actendnumflag:false,
                actratenumflag:false,
                lastval:'',
                lastname:'',
            }
        },
        components: {
            quillEditorImg,
            imgCropper,
            Bread
        },
        watch:{
            // 订单有效金额范围
            'dataForm.minAmount':function(newV,oldV) {
                for(let i=0;i<newV.length;i++){
                    // 删除非数字和小数点之外的输入
                    if(/[^\d|\.]/g.test(newV[i])){
                        this.dataForm.minAmount = newV.replace(newV[i],"")
                    }
                }
                // 有小数点 截取0到小数点后2位间的数据
               if(newV.toString().indexOf('.') !== -1){
                    this.dataForm.minAmount=newV.toString().substr(0,newV.toString().indexOf('.')+3)
               }
            },
            'dataForm.maxAmount':function(newV,oldV) {
                for(let i=0;i<newV.length;i++){
                    // 删除非数字和小数点之外的输入
                    if(/[^\d|\.]/g.test(newV[i])){
                        this.dataForm.maxAmount = newV.replace(newV[i],"")
                    }
                }
                // 有小数点 截取0到小数点后2位间的数据
                if(newV.toString().indexOf('.') !== -1){
                    this.dataForm.maxAmount=newV.toString().substr(0,newV.toString().indexOf('.')+3)
                }
            },
            // 分
            'dataForm.expirationTimeMinute':function(newV,oldV) {
                for (let i = 0; i < newV.length; i++) {
                    // 只能输入数字,限2位数
                    if (!/[0-9]/g.test(newV[i])) {
                        this.dataForm.expirationTimeMinute = newV.replace(newV[i], "")
                    }
                    if(newV.length>2){
                        this.dataForm.expirationTimeMinute = newV.substr(0,2)
                    }
                }
            },
            // 秒
            'dataForm.expirationTimeSecond':function(newV,oldV) {
                for (let i = 0; i < newV.length; i++) {
                    // 只能输入数字,限2位数
                    if (!/[0-9]/g.test(newV[i])) {
                        this.dataForm.expirationTimeSecond = newV.replace(newV[i], "")
                    }
                    if(newV.length>2){
                        this.dataForm.expirationTimeSecond = newV.substr(0,2)
                    }
                }
            },
            // 自动确认收货时间
            'dataForm.autoConfirmReceiptTime':function(newV,oldV) {
                for (let i = 0; i < newV.length; i++) {
                    // 只能输入数字,限3位数
                    if (!/[0-9]/g.test(newV[i])) {
                        this.dataForm.autoConfirmReceiptTime = newV.replace(newV[i], "")
                    }
                    if(newV.length>3){
                        this.dataForm.autoConfirmReceiptTime = newV.substr(0,3)
                    }
                }
            },
            // 单笔订单最小金额
            'dataForm.auditOrderMinAmount':function(newV,oldV) {
                for (let i = 0; i < newV.length; i++) {
                    // 只能输入数字
                    if (!/[0-9|\.]/g.test(newV[i])) {
                        this.dataForm.auditOrderMinAmount = newV.replace(newV[i], "")
                    }
                    if(newV.toString().indexOf('.') !== -1){// 截取到小数点后2位
                        this.dataForm.auditOrderMinAmount=newV.toString().substr(0,newV.toString().indexOf('.')+3)
                    }else{// 没有小数点
                        if(newV.length>6){
                            this.dataForm.auditOrderMinAmount = newV.substr(0,6)
                        }
                    }
                }
            },
            // 上调幅度
            'dataForm.riseIn':function(newV,oldV) {
                for(let i=0;i<newV.length;i++){
                    // 只能输入数字
                    if(!/[0-9|\.]/g.test(newV[i])){
                        this.dataForm.riseIn = newV.replace(newV[i],"")
                    }
                }
            },
        },
        created(){
            this.getData();
        },
        methods: {   
            getData(){
               // 获取汇率
                this.getrate();
                // 回显数据
                this.backScandata();
            },
        	artonkeyup(e){
	            if(e.key == 'Backspace' || e.key == "Delete"){
	              	return;
	            }
	            var reg = /(^[\-0-9][0-9]*(.[0-9]+)?)$/;
	            var pattern = new RegExp(reg);
	            if(!(this.lastval.indexOf('.') == -1) && e.key == '.'){    //存在小数点了
	              this.dataForm[this.lastname] = this.lastval;
	            }
	            
	            if(pattern.test(e.key) || e.key == '.' ){
	            }else{  //非数字
	              this.dataForm[this.lastname] =  parseFloat(this.lastval) || '';
	            }
//	            if(e.key == 'Shift'){
//	            	console.log(this.lastval);
//	            	console.log(parseFloat(this.lastval));
//	              	this.dataForm[this.lastname] =  parseFloat(this.lastval) || '';
//	            }
          	},
	        artonkeydown(str){   //输入前的值
	            this.lastval = this.dataForm[str]+'';
	            this.lastname = str;
	        },
            // 获取汇率
        	getrate(){
        		gethomepageRate().then((res)=>{
        			if(res && res.code == 200){
        				console.log(res);
        				this.ratenum =res.data.rate;
        			}else{
        				this.$message(res.msg)
        			}
        		}).catch(()=>{
        			this.$message("服务器错误")
        		})
            },
            // 回显数据
            backScandata(){
                this.loading = true;
                getStrategySetting({}).then((res)=>{
                    this.loading = false;
                    // console.log(res);
                    if(res.code==200){
                        // this.dataForm = res.data;
                        var dataForm = JSON.parse(res.data.value);
                        Object.assign(this.dataForm,dataForm);
                        // this.rate = JSON.parse(this.dataForm.addPriceRate);
                         this.rate =this.dataForm.addPriceRate;
                        console.log("回显数据");
                        console.log(this.dataForm);
                    }
                })
            },
        	actendnum(val,start){
        		this.actendnumflag = true;
        		if(val > 100000000){
        			this.$message("最大值为100000000");
        		}else if(val.indexOf('.') != -1 && val.substr(val.indexOf('.') + 1).length > 2){
			    	this.$message('小数点后只能有两位');
			    }else if(val*1 <= start*1){
			    	this.$message('最大值应该大于最小值');
			    }else{
			    	this.actendnumflag = false;
			    }
        	},
        	actratenum(val){   //加价率
        		this.actratenumflag = true;
        		if(val > 100 || val < 0){
        			this.$message("加价率应为0-100之间");
        		}else if(val.toString().indexOf('.') != -1 && val.substr(val.toString().indexOf('.') + 1).length > 4){
			    	this.$message('小数点后只能有四位');
			    }else{
			    	this.actratenumflag = false;
			    }
        	},
            artaddclick(){   //添加一个加价率
        		if( this.actendnumflag || this.actratenumflag){
	        		this.$message("加价率填写有误,请先修改再添加");
	        		return;
                }
                if(this.rate.length!=1) this.rate[this.rate.length-1].end = ""
        		var num = this.rate.length!=1 ?this.rate.length-2:0;        		
        		if(this.rate[num] && this.rate[num].end && this.rate[num].rate){
        			let obj = {
        				start : this.rate[num].end,
        				end : '',
        				rate : ''
        			}
        			this.rate.push(obj);
        		}else{
        			this.$message("请先填写本行")
        		}
        		
        	},
        	deladdclick(){ //删除一个加价率
        		this.rate.pop();
        	},
            artmessageContent(messageContent){
                this.dataForm.messageContent = messageContent;
            },
            init (id) {
                console.log(this.id)
            },
            GiftUrlHandle(val){
                console.log("base64上传图片接口");
                console.log(val);
                this.uploadPic(val);
            },
            //上传图片
            uploadPic(base64){
                const params = { "imgStr": base64 };
                const that = this;
                this.uploading = true;
                return new Promise(function(resolve){
                    uploadPicBase64(params).then(res =>{
                        that.uploading = false
                        if(res && res.code == "200"){
                            var url = res.data.url
                            that.dataForm.gcPic = url;
                            // that.currentIndex = -1;//不能这样写，防止网络延迟
                            resolve("true")
                        }else {
                            // that.currentIndex = -1;//不能这样写，防止网络延迟
                            resolve("false")
                        }
                    })
                });
            },
            changePage(){
                this.$emit("addList");
            },
            dataFormSubmit(formName){
            	if( this.actendnumflag || this.actratenumflag){
	        		this.$message("加价率填写有误");
	        		return;
	        	}
            	if( !(this.rate[this.rate.length-1].rate) ){
                    this.$message("加价率是必填项");
                    return;
                }
                console.log(this.$refs[formName]);
            	this.$refs[formName].validate((valid) => {
			        if (valid) {
                        // this.dataForm.addPriceRate = JSON.stringify(this.rate);
                        this.dataForm.addPriceRate = this.rate;
                        this.saveLoading = true;
			            addsetting(this.dataForm).then((res)=>{
                            this.saveLoading = false;
                            console.log(res);
                            this.getData();
                            this.$message(res.msg);
			            }).catch(()=>{
                            this.saveLoading = false;
			            	this.$message(res.msg);
			            })
			        } else  {
			          setTimeout(()=>{
			            var isError= document.getElementsByClassName("is-error");
			            isError[0].querySelector('input').focus();
			          },100);
			          return false;
			        }
			    });
            	
            }
        }
    }
</script>

<style scoped>
    /deep/ .el-form-item__content {
    	margin-left: 170px !important;
        line-height: 20px!important;
    }
    /*/deep/ .upload-box {*/
    /*    border: 0!important;*/
    /*}*/
    /*/deep/ .el-button {*/
    /*    width: 150px;*/
    /*}*/
    /deep/ .el-switch__core {
        margin-top: 20px;
    }
    /deep/ .el-form-item__label {
        width: 170px!important;
    }
    .artAmount{
    	display: inline-block;
    	width: 350px;
    	
    }
    /deep/.artmaxAmount>div{
    	margin-left: 0px !important;
    }
    
    .artaddrate:nth-of-type(n+1){
    	margin-top: 10px;
    }
    
    .artinfo{
    	/*margin-top: 30px;*/
    	color: #ccc;
    }
</style>