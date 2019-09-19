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
                ref="addForm"
                @keyup.enter.native="dataFormSubmit('addForm')"
                label-width="120px"
        >
            <el-form-item label="同义词：">
                <el-input type="textarea" v-model="dataForm.name" placeholder="" :rows="4"></el-input>
                <span style="color: #999999;">多词请用英文逗号“,”隔开</span>
            </el-form-item>
<!--            <el-form-item style="text-align: center;margin-left: -120px!important;">-->
<!--                <el-button type="primary" @click="dataFormSubmit('addForm')"-->
<!--                           :loading="loading">{{loading ? "提交中···" : "确定"}}</el-button>-->
<!--                <el-button  @click="dataFormCancel()">返回</el-button>-->
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
    import { editShopsynonym,shopsynonymSave, backScanShopsynonym } from '@/api/api'
    export default {
        name: "model-add-edit-data",
        data () {
            return {
                visible : false,
                loading : false,
                dataForm: {
                    name: "",//同义词
                },
                title:'',
                row:"",
                formLabelWidth: '120px'
            }
        },
        methods: {
            init (row) {
                this.visible = true;
                this.row = row;
                if(row){
                    this.title="编辑同义词";
                    this.backScan();
                }else{
                    this.title="新建同义词"

                }
                this.$nextTick(() => {
                    this.$refs['addForm'].resetFields();
                    // this.getApplyPullList();
                })
            },
            // 编辑回显
            backScan(){
                var obj  = {
                    id:this.row.id,
                    name:this.row.name,
                }
                backScanShopsynonym(obj).then((res)=>{
                    if(res.code == 200){
                        Object.assign(this.dataForm,res.data);

                    }else{

                    }
                })
            },
            // 提交
            dataFormSubmit(formName){
                // alert([this.dataForm.name,this.dataForm.domainAddress]);
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        var obj = {
                            "name":  this.dataForm.name,
                        }
                        if(this.row) obj.id = this.row.id
                        var fn = this.row?editShopsynonym:shopsynonymSave;
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
            dataFormCancel(){
                this.visible = false;
                this.closeDialog();
            },
            closeDialog() {
                this.$parent.addDataVisible = false;
            },
        }
    }
</script>

<style lang="scss" scoped>
    /deep/ .el-form-item__label {
        width: 60px!important;
    }
    /deep/ .el-form-item__content {
        margin-left: 60px!important;
    }
</style>