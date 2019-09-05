<template>
    <el-dialog
        class="model-add-edit-data"
        :title="title"
        :close-on-click-modal="false"
        :visible.sync="visible"
        :before-close="closeDialog"
        width="30%"
    >
        <el-form
                :model="dataForm"
                :rules="dataRule"
                ref="addForm"
                label-width="100px">
            <el-form-item label="尺码名称：" prop="name">
                  <el-input v-model="dataForm.name " maxlength="20"  show-word-limit  placeholder="请输入尺码性名称"></el-input>
            </el-form-item>
            <el-form-item label="排序：" prop="sort">
                 <el-input-number v-model="dataForm.sort" :step="1" :min="0"></el-input-number><br>
                 <span>数字越大越靠前</span>
            </el-form-item>
            <el-form-item style="text-align: center;margin-left: -120px!important;">
                <el-button type="primary" @click="dataFormSubmit('addForm')"
                           :loading="loading">{{loading ? "提交中···" : "确定"}}</el-button>
                <el-button  @click="dataFormCancel()">返回</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
    import {sizeCnAddAndUpdate} from "@/api/api.js"
    export default {
        name: "model-add-edit-data",
        data () {
            return {
                visible : false,
                loading : false,
                dataForm : {
                    name:'',
                    sort :0,
                },
                dataRule : {
                    name : [
                        { required: true, message: '必填项不能为空', trigger: 'blur' },
                    ],
                    sort : [
                        { required: true, message: '必填项不能为空', trigger: 'blur' },
                    ]
                },
                optionsApplication: [],
                optionsRight: [],
                title:'',
                row:"",
                formLabelWidth: '120px'
            }
        },
        methods: {
            init (row) {
                this.visible = true;
                this.$nextTick(() => {
                    if(row){
                        this.title="编辑尺码";
                        this.row = row;
                        this.dataForm.sort = this.row.sort;
                        this.dataForm.name = this.row.name;
                    }else{
                        this.title="添加尺码"
                        this.dataForm.sort = 0;
                        this.dataForm.name = "";

                    }
                })
            },
            //编辑回显
            // backScan(){
            //     var obj  = {
            //         id:this.row.id,
            //         brandName:this.row.brandName,
            //     }
            //     backScanAftertemplate(obj).then((res)=>{
            //         if(res.code == 200){
            //             Object.assign(this.dataForm,res.data);
            
            //         }else{
            
            //         }
            //     })
            // },
            // 提交
            dataFormSubmit(formName){
                // alert([this.dataForm.name,this.dataForm.domainAddress]);
                // console.log(this.dataForm);
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        var obj={
                            "id":  this.row?this.row.id:'',
                            "name":  this.dataForm.name,
                            "sort":  this.dataForm.sort 
                        }
                        sizeCnAddAndUpdate(obj).then((res) => {
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
            dataFormCancel(){
                this.visible = false;
                this.closeDialog();
            },
            closeDialog() {
                this.$parent.addEditDataVisible = false;
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