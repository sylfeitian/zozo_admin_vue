<template>
    <el-dialog
            title="添加黑名单"
            :visible.sync="outerVisible"
            :before-close="closecancel"
            width="50%"
    >
        <el-form label-width="100px"
                 :model="dataForm" 
                 :rules="dataRule"
                 ref="addForm">
        	<div class="formItemWarp" >
                <el-radio v-model="dataForm.type" :label="0">
                    <span  style="color:transparent">0</span>
                </el-radio>
                <el-form-item label="账号：" style="width: 100%;" prop="memberName">
                        <el-input v-model.trim="dataForm.memberName" placeholder="请输入"></el-input>
                </el-form-item>
            </div>

            <div class="formItemWarp">
                <el-radio v-model="dataForm.type" :label="1">
                    <span  style="color:transparent">0</span>
                </el-radio>
                <el-form-item label="收货地址："  prop="provinceId">
	                <el-select
	                        v-model="dataForm.provinceId"
	                        placeholder="省"
	                        loading-text="加载中···"
	                        @visible-change="changeArea(dataForm.provinceId, 1)"
	                >
	                    <!-- 市级 -->
	                    <el-option
	                            v-for="item in optionsArea1"
	                            :key="item.id"
	                            :label="item.name"
	                            :value="item.id"
	                    ></el-option>
	                </el-select>
	                <el-select
	                        v-model="dataForm.cityId"
	                        placeholder="市"
	                        @visible-change="changeArea(dataForm.cityId, 2)"
	                >
	                    <el-option
	                            v-for="item in optionsArea2"
	                            :key="item.id"
	                            :label="item.name"
	                            :value="item.id"
	                    ></el-option>
	                </el-select>
	                <el-select
	                        v-model="dataForm.areaId"
	                        placeholder="县"
	                         @visible-change="changeArea(dataForm.areaId, 3)"
	                >
	                    <el-option
	                            v-for="item in optionsArea3"
	                            :key="item.id"
	                            :label="item.name"
	                            :value="item.id"
	                    ></el-option>
	                </el-select>
	                <el-select 
                        v-model="dataForm.stressId" placeholder="镇"
                        @visible-change="changeArea(dataForm.stressId,4)">
	                    <el-option
                            v-for="item in optionsArea4"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
	                    ></el-option>
	                </el-select>
	            </el-form-item>
            </div>
            
            <el-form-item  style="margin-left:60px;margin-top:10px">
                <el-input
                    type="textarea"
                    :rows="3"
                    placeholder="请输入详情地址"
                    v-model="dataForm.address">
                </el-input>
            </el-form-item>
            <el-form-item label="封禁原因：" style="margin-left:60px" >
                <el-input
                type="text"
                maxlength="20"
                placeholder="请输入内容"
                v-model="dataForm.remark">
                </el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="dataFormSubmit('addForm')">{{loading?"保存中...":"保存"}}</el-button>
        </div>
    </el-dialog>
</template>
<script>
    import { isMobile } from "@/utils/validate";
    import {  addBlcaklist, areaList, proList } from "@/api/api";
    import {areaFirst,areaByParentId} from "@/api/api.js"
    export default {
        components: {},
        data() {
                var validateMobile = (rule, value, callback) => {
                    if (!isMobile(value)) {
                    return callback(new Error('请输入正确的手机号!'))
                    }
                    callback()
                }
            return {
                loading:false,
                value: [],
                outerVisible: true,
                innerVisible: false,
                dialogVisible: "",
                form: {},
                dataForm: {
                     "memberName": "",//会员账号(11位手机号) ,
                     "addressIds": "",//逗号隔开 （地址省市县） ,
                     "address": "",//地址街道等信息 ,
                     "remark": "",//封禁原因 ,
                     "type": 0,// 类型:0:账户，1：地址
                     provinceId:'',
                     cityId:'',
                     areaId:'',
                     stressId:'',
                },
                optionsArea1: [],
                optionsArea2: [],
                optionsArea3: [],
                optionsArea4: [],
                dataRule : {
			        memberName : [
                      { required: true, message: '账号必填项', trigger: 'blur' },
                       { validator: validateMobile, trigger: 'blur'},
                    ],
                    provinceId : [
			          { required: true, message: '省份必填项', trigger: 'blur' },
			        ],
				},
            };
        },
        props: [],
		watch:{
			'dataForm.memberName':function(newV,oldV) {
				if(newV){
					// 删除非数字的输入
					this.dataForm.memberName=newV.replace(/[^\d]/g,'')
				}
				if(newV.length>11){
					this.dataForm.memberName = newV.substr(0,11)
				}
			}
		},
		created(){
        },
        methods: {
        	artfocus(){
        	},
            init() {
                this.outerVisible = true;
                this.$nextTick(() => {
                    this.$refs['addForm'].resetFields();
                    this.dataForm.memberName = "";
                    this.dataForm.addressIds = "";
                    this.dataForm.address = "";
                    this.dataForm.remark = "";
                    this.dataForm.type = 0;
                     this.getFirstData();
				})
            },
            // 获取第一级地区数据
            getFirstData(){
                areaFirst().then((res)=>{
                    console.log(res);
                    if(res.code==200){
                        this.optionsArea1 = res.data;
                    }
                })
            },
            // 切换地区获取下级联动地区数据
            changeArea(id,argu2,reset=true){
                if(!id){
                    return
                }
                var obj ={
                    id:id
                }
                if(argu2==1 && reset){
                    this.dataForm.cityId = "";
                    this.dataForm.areaId = "";
                    this.dataForm.stressId = "";
                    this.optionsArea2 = []
                    this.optionsArea3 = []
                    this.optionsArea4 = []
                }else if(argu2==2 && reset){
                    this.dataForm.areaId = "";
                    this.dataForm.stressId = "";
                    this.optionsArea3 = []
                    this.optionsArea4 = []
                }else if(argu2==3 && reset){
                    this.dataForm.stressId = "";
                    this.optionsArea4 = []
                }else if(argu2==4 && reset){
                    // 选到最后一级了
                }
                areaByParentId(obj).then((res)=>{
                    console.log(res);
                    if(res.code==200){
                        if(argu2==1){
                            this.optionsArea2 = res.data;
                        }else if(argu2==2){
                            this.optionsArea3 = res.data;
                        }else if(argu2==3){
                            this.optionsArea4 = res.data;
                        }else if(argu2==4){
                             // 选到最后一级了

                        }
                    }
                })
            },
            closeInner() {
                this.innerVisible = false;
                this.form.phone = "";
            },
            handleChange(value) {
                console.log(value);
            },
            closecancel(done){
            	done();
            },
            //取消
            cancel() {
                this.outerVisible = false;
                // this.$emit("refreshDataList");
                //回传主页面。false
            },
            //重置密码
           	dataFormSubmit(formName){
                if(this.loading) return;
                var  addressIds = this.dataForm.provinceId; //省
                if(this.dataForm.cityId){
                    addressIds += ","+this.dataForm.cityId;//市
                    if(this.dataForm.areaId){
                        addressIds += ","+this.dataForm.areaId;//区
                        if(this.dataForm.stressId){
                            addressIds += ","+this.dataForm.stressId;//街
                        }
                    }
                }
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                            console.log(this.memberInfo, "111", this.dataForm);
                            var obj = {
                                "memberName": this.dataForm.memberName,//会员账号(11位手机号) ,
                                "addressIds": addressIds,//逗号隔开 （地址省市县） ,
                                "address": this.dataForm.address,//地址街道等信息 ,
                                "remark": this.dataForm.remark,//封禁原因 ,
                                "type": 0,// 类型:0:账户，1：地址
                                //  "id": 0,//主键 ,
                                //  "createDateEnd": "string",//封禁时间 ,
                                // "createDateStart": "string",// 封禁时间 ,
                                // "page": "1",//当前页码，从1开始 ,
                                // "limit": "10",//每页显示记录数
                            };
                            this.loading = true;
                            addBlcaklist(obj).then(res => {
                                this.loading = false;
                                if (res.code == 200) {
                                    this.$message({
                                        message: res.msg,
                                        type: "success",
                                        duration: 1000
                                    });
                                    this.$emit("refreshDataList");
                                    this.cancel();
                                    this.$parent.addOrUpdateVisible = false;
                                } else {
                                    this.$message({
                                        message: res.msg,
                                        type: "error",
                                        duration: 1000
                                    });
                                }
                            });
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
	.el-radio{
		margin-left: 30px;
	}
	.el-select {
        width: 15%;
    }
    .header {
        text-align: center;
        font-weight: bold;
    }
    .el-input {
        // width: 50%;
    }
    .el-dialog {
        width: 40% !important;
    }
    .rest {
        margin-left: 15px;
        display: inline-block;
        padding: 8px 10px;
        color: dodgerblue;
    }
    .dialog-footer {
        width: 91%;
    }
    /* /deep/.el-dialog {
      width: 30% !important;
    } */
    .el-form {
        width: 100%;
    }
    /* .restPass{text-align: center;} */

    .formItemWarp{
        display:flex;
        align-items: center;
        .el-form-item{
            margin-top: 7px !important;
            margin-bottom: 7px !important;
        }
    }
</style>
