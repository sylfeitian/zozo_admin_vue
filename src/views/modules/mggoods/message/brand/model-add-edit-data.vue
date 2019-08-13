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
            <el-form-item label="品牌ID：">
                <span>{{dataForm.japanId}}</span>
            </el-form-item>
            <el-form-item label="日本品牌名称：">
                <span>{{dataForm.japanName}}</span>
            </el-form-item>
            <el-form-item label="日本品牌描述：">
                <span>{{dataForm.japanDesc}}</span>
            </el-form-item>
            <el-form-item label="品牌名称：" prop="name" :label-width="formLabelWidth">
                <el-input v-model="dataForm.name" placeholder="请输入品牌名称"></el-input>
            </el-form-item>
            <el-form-item label="品牌描述：" prop="desc" :label-width="formLabelWidth">
                <el-input type="textarea" v-model="dataForm.desc" placeholder="请输入品牌描述"></el-input>
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
                dataForm: {
                    japanId: "",//品牌ID
                    japanName: "",//日本品牌名称
                    name: "",//品牌名称
                    japanDesc: "",//日本品牌描述
                    desc: "",//品牌描述
                    state: ""//是否可售
                },
                dataRule : {
                    name : [
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
        components:{
        },
        computed:{},
        mounted(){},
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
            // 编辑回显
            // backScan(){
            //     var obj  = {
            //         id:this.row.id,
            //         japanId:this.row.japanId,
            //         japanName:this.row.japanName,
            //         name:this.row.name,
            //         japanDesc:this.row.japanDesc,
            //         desc:this.row.desc,
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
                            "japanName":  this.dataForm.japanName,
                            "name":  this.dataForm.name,
                            "japanDesc":  this.dataForm.japanDesc,
                            "desc":  this.dataForm.desc,
                            "state":  this.dataForm.state,
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
    /deep/.el-textarea {
        width: 100%;
    }
</style>