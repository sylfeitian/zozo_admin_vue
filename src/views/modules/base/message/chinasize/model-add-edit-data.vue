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
                label-width="120px">
            <el-form-item label="品牌ID：">
                <span>{{dataForm.brandId}}</span>
            </el-form-item>
            <el-form-item label="品牌名称：" prop="brandName">
                <el-input v-model="dataForm.brandName" maxlength="60" placeholder="请输入属性名称"></el-input>
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
    export default {
        name: "model-add-edit-data",
        data () {
            return {
                visible : false,
                loading : false,
                dataForm : {
                    brandId:'',
                    brandName:'',
                },
                options: [{
                    value: '选项1',
                    label: 'S'
                }, {
                    value: '选项2',
                    label: 'M'
                }, {
                    value: '选项3',
                    label: 'L'
                },{
                    value: '选项4',
                    label: 'XL'
                },{
                    value: '选项5',
                    label: 'XXL'
                },{
                    value: '选项6',
                    label: '3XL'
                }],
                dataRule : {
                    brandName : [
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
                this.row = row;
                if(row){
                    this.title="编辑品牌";
                    this.backScan();
                }else{
                    this.title="新建品牌"

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
            //         brandName:this.row.brandName,
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
                // console.log(this.dataForm);
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        var obj={
                            "chinaSize": this.dataForm.chinaSize,
                            "storeId": 0,
                            "japanSize": this.dataForm.japanSize
                        }
                        if(this.row) obj.id = this.row.id
                        //var fn = this.row?updateAftertemplate:addAftertemplate;
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