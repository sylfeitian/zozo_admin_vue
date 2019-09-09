<template>
    <div>
        <Bread :breaddata="breaddata"></Bread>
        <!--:inline="true"-->
        <el-form
            v-loading="loading"
            :model="dataForm"
            :rules="dataRule"
            ref="addForm"
            @keyup.enter.native="dataFormSubmit('addForm')"
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
            <el-form-item class="artAmount" label="订单有效金额范围：" prop="minAmount" :label-width="formLabelWidth">
                <el-input type="number" v-model="dataForm.minAmount"  placeholder="请输入" style="width: 160px;"></el-input>
                <span> ~ </span>
            </el-form-item>
            <el-form-item  class="artAmount artmaxAmount" prop="maxAmount" :label-width="formLabelWidth">
                <el-input type="number" v-model="dataForm.maxAmount"  placeholder="请输入" style="width: 160px;"></el-input>
            </el-form-item>
            
            
            <el-form-item style="background-color: #f3f3f3;">
                <p style="margin-left: -100px;">订单设置</p>
            </el-form-item>
            <el-form-item class="artAmount" label="未支付订单失效时间：" prop="expirationTimeMinute" :label-width="formLabelWidth">
                <el-input type="number" maxlength='2' v-model="dataForm.expirationTimeMinute"  placeholder="请输入" style="width: 111px;"></el-input>
                <span> 分（min）</span>
            </el-form-item>  
            <el-form-item  class="artAmount artmaxAmount" prop="expirationTimeSecond" :label-width="formLabelWidth">
				<el-input type="number" maxlength='2'  v-model="dataForm.expirationTimeSecond"  placeholder="请输入" style="width: 111px;"></el-input>
                <span> 秒（s）</span>
            </el-form-item>
            
            
            <el-form-item label="自动确认收货时间：" prop="autoConfirmReceiptTime" :label-width="formLabelWidth">
                <el-input type="number" maxlength='3' v-model="dataForm.autoConfirmReceiptTime"  placeholder="请输入" style="width: 250px;"></el-input>
                <span> 天（day）</span>
                <span style="color: #999999;">发货后自动确认收货时间</span>
            </el-form-item>
            <el-form-item label="售后时间：" prop="saleafterStopTime" :label-width="formLabelWidth">
                <el-input type="number" maxlength='3' v-model="dataForm.saleafterStopTime"  placeholder="请输入" style="width: 250px;"></el-input>
                <span> 天（day）</span>
                <span style="color: #999999;">确认收货后可申请售后的时间</span>
            </el-form-item>
            <el-form-item label="单笔订单最小金额：" prop="auditOrderMinAmount" :label-width="formLabelWidth">
                <el-input type="number" maxlength='6' v-model="dataForm.auditOrderMinAmount"  placeholder="请输入" style="width: 250px;"></el-input>
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
                <el-input type="number" v-model="dataForm.riseIn" auto-complete="off" placeholder="请输入" style="width: 250px;"></el-input>
                <span> % </span>
            </el-form-item>
            <el-form-item label="加价率：" prop="" :label-width="formLabelWidth">
            	<div class="artaddrate" v-for="(item,index) in rate" :key="index">
            		<el-input type="number"  v-model="rate[index-1] && rate[index-1].end || item.start"  :disabled="datadisabled" auto-complete="off" placeholder="0" style="width: 150px;"></el-input>
	                <span> —— </span>
	                <el-input type="number"  @blur="actendnum(item.end,item.start)" v-model="item.end"  placeholder="请输入" style="width: 150px;"></el-input>
	                <span> 元（日元） </span>
	                <el-input type="number"  @blur="actratenum(item.rate)" v-model="item.rate" placeholder="请输入加价率" style="width: 100px;"></el-input>
	                <span> % </span>  
	                <span v-if="rate.length-1 == index" > 
	                	&nbsp; &nbsp;
	                	<i @click="artaddclick" class="el-icon-circle-plus"></i>
	                	&nbsp; &nbsp;
	                	<i v-if="rate.length-1 == index && rate.length>1" @click="deladdclick" class="el-icon-remove-outline"></i>
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
			    }else if(value.toString().indexOf('.') != -1 && value.toString().substr(value.indexOf('.') + 1).length > 2){
			    	callback(new Error('小数点后只能有两位'))
			    }else if(this.dataForm.maxAmount && value/1 > this.dataForm.maxAmount){
			      callback(new Error('最小值应该小于最大值'))
			    }else {
			      callback()
			    }
			};
			var valid =(rule, value,callback)=>{
			    if(value.toString().indexOf('.') != -1 && value.toString().substr(value.indexOf('.') + 1).length > 2){
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
			    if(value.toString().indexOf('.') != -1 && value.toString().substr(value.indexOf('.') + 1).length > 4){
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
                    ],
                    maxAmount : [
                        { required: true, message: '必填项不能为空', trigger: 'blur' },
                        // { min:0, max:1000000, message: '最大可输入1000000', trigger: 'blur' },
                        { validator: validmoney, trigger: 'blur' },
                        { validator: maxvalidmoney, trigger: 'blur' },
                    ],
                    expirationTimeMinute : [   
                        { required: true, message: '必填项不能为空', trigger: 'blur' },
                        // { min: 1, max: 2, message: '最大长度是2位', trigger: 'blur' },
                        { validator: validnum0, trigger: 'blur' },
                    ],
                    expirationTimeSecond : [
                        { required: true, message: '必填项不能为空', trigger: 'blur' },
                        // { min: 1, max: 2, message: '最大长度是2位', trigger: 'blur' },
                        { validator: validnum0, trigger: 'blur' },
                    ],
                    autoConfirmReceiptTime : [
                        { required: true, message: '必填项不能为空', trigger: 'blur' },
                        // { min: 1, max: 3, message: '最大长度是3位', trigger: 'blur' },
                        { validator: validnum0, trigger: 'blur' },
                    ],
                    saleafterStopTime : [
                        { required: true, message: '必填项不能为空', trigger: 'blur' },
                        // { min: 1, max: 3, message: '最大长度是3位', trigger: 'blur' },
                        { validator: validnum0, trigger: 'blur' },
                    ],
                    auditOrderMinAmount: [
                        { required: true, message: '必填项不能为空', trigger: 'blur' },
                       	// { min: 2, max: 6, message: '最大长度是6位', trigger: 'blur' },
                       	{ validator: valid, trigger: 'blur' },
                       	{ validator: validnum0, trigger: 'blur' },
                    ],
                    riseIn: [
                        { required: true, message: '必填项不能为空', trigger: 'blur' },
                       	{ validator: validriseIn, trigger: 'blur' },
                       	{ validator: validnum0, trigger: 'blur' },
                    ],
                },
                formLabelWidth: '120px',
                dialogImageUrl: "",
                dialogVisible: false,
                uploading:false,
                actendnumflag:false,
                actratenumflag:false,
            }
        },
        components: {
            quillEditorImg,
            imgCropper,
            Bread
        },
        created(){
            // 获取汇率
            this.getrate();
            // 回显数据
            this.backScandata();
        },
        methods: {
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
                        this.dataForm = JSON.parse(res.data.value);
                        this.rate = JSON.parse(this.dataForm.addPriceRate);
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
        		}else if(val.indexOf('.') != -1 && val.substr(val.indexOf('.') + 1).length > 4){
			    	this.$message('小数点后只能有四位');
			    }else{
			    	this.actratenumflag = false;
			    }
        	},
        	artaddclick(){   //添加一个加价率
        		if( this.actendnumflag || this.actratenumflag){
	        		this.$message("本行加价率填写有误,请先修改再添加");
	        		return;
	        	}
        		var num = this.rate.length-1;        		
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
            	if( !(this.rate[this.rate.length-1].end * this.rate[this.rate.length-1].rate) ){
                    this.$message("加价率是必填项");
                    return;
            	}
            	this.$refs[formName].validate((valid) => {
			        if (valid) {
                        this.dataForm.addPriceRate = JSON.stringify(this.rate);
                        this.saveLoading = true;
			            addsetting(this.dataForm).then((res)=>{
                            this.saveLoading = false;
                            console.log(res);
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
    	margin-top: 30px;
    	color: #ccc;
    }
</style>