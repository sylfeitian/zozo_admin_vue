<template>
   <!-- 新增编辑活动弹框 -->
    <el-dialog
        :title="title"
        :visible.sync="visible"
        :close-on-click-modal = "false"
        :show-close = "false"
        class="activiDialog"
        width="40%">
            <el-form :model="dataForm" :rules="dataRule" ref="addFrom"  label-width="120px" v-loading="loading">
                <el-form-item label="分类名称：" prop="title">
                    <el-input v-model.trim="dataForm.title" placeholder="最多可输入4个汉字" :maxlength="4"></el-input>
                </el-form-item>
                <el-form-item label="排序：" prop="sort">
                    <el-input-number style="width:140px;margin-right:20px;" :controls="false" v-model="dataForm.sort" placeholder="0~99999" :min="0" :max="99999" ></el-input-number>数字越大越靠前
                </el-form-item>
                <el-form-item label="是否启用：" prop="stopFlag">
                <el-radio-group v-model="dataForm.stopFlag">
                        <el-radio :label="0">启用</el-radio>
                        <el-radio :label="1">停用</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer" v-if="!loading">
                <el-button @click="dataFormCancel()">取 消</el-button>
                <el-button type="primary" @click="dataFormSubmit('addFrom')" :loading="saveLoading">{{saveLoading?'提交中...':'确 定'}}</el-button>
            </span>
    </el-dialog>
</template>

<script>
    import {categoryactivityAdd,categoryactivityUpdate,backScanCategoryactivityDetail} from "@/api/api.js"
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
                    sort: [
                        { required: true, message: '必填项不能为空', trigger: 'blur' },
                        //  { validator: validateTime, trigger: 'blur' }
                    ],
                    stopFlag:[
                         { required: true, message: '必填项不能为空', trigger: 'blur' },
                        //  { validator: validatePresellTime, trigger: 'blur' }
                    ]
                },
                dataForm:{
                    title:'',
                    sort:'',
                    stopFlag:0,//0:启用，1：停用 ,
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
                backScanCategoryactivityDetail(obj).then((res)=>{
                    this.loading = false;
                    if(res.code == 200){
                        Object.assign(this.dataForm,res.data);
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
                            "sort":this.dataForm.sort,
                            "stopFlag":  this.dataForm.stopFlag,
                            "title": this.dataForm.title,
                        }
                         this.saveLoading = true;
                         if(this.row){ obj.id= this.row.id}
                         var fn = this.row?categoryactivityUpdate:categoryactivityAdd;
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