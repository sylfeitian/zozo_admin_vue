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
            <el-form-item label="禁用词名称：" prop="" :label-width="formLabelWidth">
                <el-input v-model="dataForm.colorsName" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item style="text-align: center;margin-left: -120px!important;">
                <el-button  @click="dataFormCancel()">取消</el-button>
                <el-button type="primary" @click="dataFormSubmit('addForm')"
                           :loading="loading">{{loading ? "提交中···" : "确定"}}</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
    export default {
        data () {
            return {
                visible : false,
                loading : false,
                dataForm: {},
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
                this.row = row;
                if(row){
                    this.title="编辑禁用词语";
                    this.backScan();
                }else{
                    this.title="添加禁用词语"

                }
                this.$nextTick(() => {
                    this.$refs['addForm'].resetFields();
                    // this.getApplyPullList();
                })
            },
            //编辑回显
            // backScan(){
            //     var obj  = {
            //         id:this.row.id,
            //         colorsId:this.row.colorsId,
            //         colorGroup:this.row.colorGroup,
            //         colorsName:this.row.colorsName,
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
                // alert([this.dataForm.name,this.dataForm.domainAddress]);
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        var obj = {
                            "japanGroup":  this.dataForm.japanGroup,
                            "colorGroup":  this.dataForm.colorGroup,
                            "japanName":  this.dataForm.japanName,
                            "colorsName":  this.dataForm.colorsName,
                        }
                        if(this.row) obj.id = this.row.id
                        //var fn = this.row?updateBrand:addBrand;
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