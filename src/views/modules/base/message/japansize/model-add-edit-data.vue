<template>
    <el-dialog
        class="model-add-edit-data"
        :title="title"
        :close-on-click-modal="false"
        :visible.sync="visible"
        :before-close="closeDialog"
        width="26%"
    >
        <el-form
            :model="dataForm"
            :rules="dataRule"
            ref="addForm"
            @keyup.enter.native="dataFormSubmit('addForm')"
            label-width="120px"
        >
            <el-form-item label="日本尺码ID：">
                <span>{{dataForm.idJp}}</span>
            </el-form-item>
            <el-form-item label="日本尺码名称：">
                <span>{{dataForm.nameJp}}</span>
            </el-form-item>
            <el-form-item label="尺码名称：" prop="name" :label-width="formLabelWidth">
                <el-input v-model.trim="dataForm.name" auto-complete="off"></el-input>
            </el-form-item>
<!--            <el-form-item style="text-align: center;">-->
<!--                <el-button type="primary" @click="dataFormSubmit('addForm')"-->
<!--                           :loading="loading">{{loading ? "提交中···" : "确定"}}</el-button>-->
<!--                <el-button @click="dataFormCancel()">取消</el-button>-->
<!--            </el-form-item>-->
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dataFormCancel()">取消</el-button>
            <el-button type="primary" @click="dataFormSubmit('addForm')"
                       :loading="loading">{{loading ? "提交中···" : "确定"}}</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import { editsizejptag } from '@/api/api'
    import cloneDeep from 'lodash/cloneDeep'
    export default {
        name: "model-add-edit-data",
        data () {
            return {
                visible : false,
                loading : false,
                dataForm: {
                    sizeId: "",//尺码ID
                    japanSize: "",//日本尺码名称
                    sizeName: "",//尺码名称
                },
                dataRule : {
                    name : [
                        { required: true, message: '必填项不能为空', trigger: 'blur' },
                    ],
                },
                optionsApplication: [],
                optionsRight: [],
                title:'',
                row:"",
                formLabelWidth: '120px'
            }
        },
        components:{
        },
        computed:{},
        mounted(){},
        methods: {
            init (row) {
                this.visible = true;
                this.dataForm =cloneDeep(row);
                this.title="编辑尺码";
               
                this.$nextTick(() => {
                    this.$refs['addForm'].resetFields();
                    // this.getApplyPullList();
                })
            },

            //编辑回显
            // backScan(){
            //     var obj  = {
            //         id:this.row.id,
            //         sizeId:this.row.sizeId,
            //         japanSize:this.row.japanSize,
            //         sizeName:this.row.sizeName,
            //     }
            //     backScanAftertemplate(obj).then((res)=>{
            //         if(res.code == 200){
            //             Object.assign(this.dataForm,res.data);
            //
            //         }else{
            //
            //         }
            //     })
            // },
            // 提交
            dataFormSubmit(formName){
                 this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        console.log(this.dataForm);
                        editsizejptag(this.dataForm).then((res) => {
                            this.loading = false;
                            let status = null;
                            if(res.code == "200"){
                                status = "提交成功";
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
            },
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