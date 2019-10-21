<template>
   <!-- 新增编辑活动弹框 -->
    <el-dialog
        :title="title"
        :visible.sync="visible"
        :close-on-click-modal = "false"
        :show-close = "false"
        class="activiDialog"
        width="40%">
            <el-form :model="dataForm" :rules="dataRule" ref="addForm"  label-width="120px" v-loading="loading">
                <el-form-item label="活动标题：" prop="title">
                    <el-input v-model.trim="dataForm.title" placeholder="最多可输入100个汉字"></el-input>
                </el-form-item>
                <el-form-item label="开始时间：" prop="startTime">
                    <el-date-picker
                        v-model="dataForm.startTime"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :picker-options="pickerOptions0"
                        placeholder="选择开始时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间：" prop="endTime">
                    <el-date-picker
                        v-model="dataForm.endTime"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :picker-options="pickerOptions1"
                        placeholder="选择结束时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="活动限制：">
                        <el-checkbox v-model="dataForm.couponsLimit" :disabled="true" ></el-checkbox>不可同时使用优惠券
                        <el-checkbox  v-model="dataForm.reduceLimit" :disabled="true"></el-checkbox>不可同时参加满减活动
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer" v-if="!loading">
                <el-button @click="dataFormCancel()">取 消</el-button>
                <el-button type="primary" @click="dataFormSubmit('addForm')" :loading="saveLoading">{{saveLoading?"提交中...":"确 定"}}</el-button>
            </span>
    </el-dialog>
</template>

<script>
    import {addLimitActivity,editLimitActivity,backScanLimitActivityDetail} from "@/api/api.js"
    export default {
        name: "model-add-edit-data",
        data () {
            var validateTime = (rule, value, callback) => {
                console.log(this.startTime);
                if(new  Date(this.dataForm.startTime).getTime()>new Date(this.dataForm.endTime).getTime()){
                    callback(new Error("开始时间不能大于结束时间"))
                } else{
                    callback();
                }
            };
            var validateTimestart = (rule, value, callback) => {
                console.log(this.startTime);
                if(new Date().getTime() > new Date(this.dataForm.startTime).getTime()){
                	callback(new Error("开始时间必须大于今日当前时间"))
				} else{
                    callback();
                }
            };
            return {
                visible : false,
                loading : false,
                saveLoading:false,
                title:'',
                dataRule : {
                    title : [
                        { required: true, message: '必填项不能为空', trigger: 'blur' },
                    ],
                    startTime : [
                        { required: true, message: '必填项不能为空', trigger: 'blur' },
                        { validator: validateTime, trigger: 'blur' },
                        { validator: validateTimestart, trigger: 'blur' }
                    ],
                    endTime : [
                        { required: true, message: '必填项不能为空', trigger: 'blur' },
                        { validator: validateTime, trigger: 'blur' }
                    ],
                },
                dataForm:{
                    title:'',
                    startTime:'',
                    endTime:'',
                    checkList:[1,2],
                    couponsLimit:true,//是否与优惠券活动共享：0 不共享 1 共享 ,
                    reduceLimit:true,//是否与满减活动共享：0 不共享 1 共享 ,
                },
                row:'',
                pickerOptions0: { 
			         disabledDate(time) {
			            return time.getTime() < Date.now() - 8.64e7;//如果没有后面的-8.64e7就是不可以选择今天的 
			         }
			  	},
			  	pickerOptions1: {
	                disabledDate: (time) => {
	                    return time.getTime() < new Date(this.dataForm.startTime).getTime()- 8.64e7;//减去一天的时间代表可以选择同一天;
	                }
	            },
            }
        },
         watch: {
          'dataForm.title':function(newV,oldV) {
                          var chineseCount=0;
                          for(let i=0;i<newV.length;i++){
                              if(/^[\u4e00-\u9fa5]*$/.test(newV[i])){ //只能输入汉字
                                  chineseCount=chineseCount+1;
                              }else {
                                  this.dataForm.goodsName=newV.replace(newV[i],'')
                              }
                              if(chineseCount>100){ //最大输入100字
                                  this.dataForm.title = newV.substr(0,100)
                              }
                          }
                      },
                  },
        methods: {
            init (row) {
                this.visible = true;
                this.saveLoading = false;
                this.$nextTick(() => {
                    if(row){
                        this.row = row;
                        this.title = "编辑活动";
                        this.backScan();
                    }else{
                        this.title = "添加活动"
                    }
                })
            },
            //编辑回显
            backScan(){
                var obj  = {
                    id:this.row.id,
                }
                this.loading = true;
                backScanLimitActivityDetail(obj).then((res)=>{
                    this.loading = false;
                    if(res.code == 200){
                        Object.assign(this.dataForm,res.data);
                        this.dataForm.couponsLimit = true;
                        this.dataForm.reduceLimit = true;
                    }
                })
            },
            // 提交
            dataFormSubmit(formName){
                // alert([this.dataForm.name,this.dataForm.domainAddress]);
                // console.log(this.dataForm);
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        var obj={
                            endTime: this.dataForm.endTime,
                            startTime: this.dataForm.startTime,
                            title: this.dataForm.title,
                            couponsLimit:0,//是否与优惠券活动共享：0 不共享 1 共享 ,
                            reduceLimit:0,//是否与满减活动共享：0 不共享 1 共享 ,
                        }
                         this.saveLoading = true;
                         if(this.row){ obj.id= this.row.id}
                         var fn = this.row?editLimitActivity:addLimitActivity;
                        fn(obj).then((res) => {
                            this.saveLoading = false;
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
            dataFormCancel(){
                this.visible = false;
                this.closeDialog();
            },
            closeDialog() {
                this.$parent.modelAddOrEditVisible = false;
            }
        }
    }
</script>

<style scoped>
    /*/deep/.el-form-item__content:nth-child(1) {*/
    /*    margin-left: 50px!important;*/
    /*}*/
    .title {
        margin-left: -70px;
    }
</style>