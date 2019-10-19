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
                    <el-input v-model.trim.trim="dataForm.title" placeholder="请输入50字以内的标题" :maxlength="100"  show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="开始时间：" prop="startTime">
                    <el-date-picker
                        v-model="dataForm.startTime"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择开始时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间：" prop="endTime">
                    <el-date-picker
                        v-model="dataForm.endTime"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择结束时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="开售时间：" prop="presellTime">
                    <el-date-picker
                        v-model="dataForm.presellTime"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择结束时间">
                    </el-date-picker><br>
                    <span style="color:#c0c4cc">开售时间必须在活动时间区间内</span>
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
    import {addPresellActivity,editPresellActivity,backScanPresellActivityDetail} from "@/api/api.js"
    export default {
        name: "model-add-edit-data",
        data () {
            var validateTime = (rule, value, callback) => {
                console.log(this.startTime);
                if(new  Date(this.dataForm.startTime).getTime()>new Date(this.dataForm.endTime).getTime()){
                    console.log("123123123123");
                    callback(new Error("开始时间不能小于结束时间"))
                }else{
                     console.log("22222222");
                    callback();
                }
            };
            var validatePresellTime = (rule, value, callback) => {
                if(new Date(value).getTime() < new Date(this.dataForm.startTime).getTime() || new Date(this.value).getTime()>new Date(this.dataForm.endTime).getTime() ){
                    callback(new Error("开售时间必须在活动时间区间内"))
                }else{
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
                         { validator: validateTime, trigger: 'blur' }
                    ],
                    endTime : [
                        { required: true, message: '必填项不能为空', trigger: 'blur' },
                         { validator: validateTime, trigger: 'blur' }
                    ],
                    presellTime:[
                         { required: true, message: '必填项不能为空', trigger: 'blur' },
                         { validator: validatePresellTime, trigger: 'blur' }
                    ]
                },
                dataForm:{
                    title:'',
                    startTime:'',
                    endTime:'',
                    presellTime:'',
                    checkList:[1,2],
                    couponsLimit:true,//是否与优惠券活动共享：0 不共享 1 共享 ,
                    reduceLimit:true,//是否与满减活动共享：0 不共享 1 共享 ,
                },
                row:'',
            }
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
                backScanPresellActivityDetail(obj).then((res)=>{
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
                            presellTime:this.dataForm.presellTime,// 开售时间 ,
                            couponsLimit:0,//是否与优惠券活动共享：0 不共享 1 共享 ,
                            reduceLimit:0,//是否与满减活动共享：0 不共享 1 共享 ,
                        }
                         this.saveLoading = true;
                         if(this.row){ obj.id= this.row.id}
                         var fn = this.row?editPresellActivity:addPresellActivity;
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