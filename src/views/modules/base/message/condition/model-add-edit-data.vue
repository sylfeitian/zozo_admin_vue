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
            label-width="140px"
        >
            <el-form-item label="日本分类条件ID：">
                <span>{{dataForm.idJp}}</span>
            </el-form-item>
            <el-form-item label="日本分类条件信息：">
                <span>{{dataForm.nameJp}}</span>
            </el-form-item>
            <el-form-item label="分类条件信息：" prop="name" :label-width="formLabelWidth">
                <el-input v-model.trim="dataForm.name" auto-complete="off" maxlength="250"></el-input>
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
    import { getTagInfo,uploadtag}  from '@/api/api.js'
    export default {
        name: "model-add-edit-data",
        data () {
            return {
                visible : false,
                loading : false,
                dataForm: {
                    // conditionId: "",//日本分类条件ID
                    // japanCondition: "",//日本分类条件信息
                    // conditionName: "",//分类条件信息
                    idJp: "",
                    nameJp: "",
                    name: "",
                },
                dataRule : {
                    conditionName : [
                        { required: true, message: '必填项不能为空', trigger: 'blur' },
                    ],
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
                    this.title="编辑分类条件信息";
                    this.backScan();
                }else{
                    this.title="新建分类条件信息"

                }
                this.$nextTick(() => {
                    this.$refs['addForm'].resetFields();
                    // this.getApplyPullList();
                })
            },
            //编辑回显
            backScan(){
                var obj  = {
                    id:this.row.id,
                }
                getTagInfo(obj).then((res)=>{
                    if(res.code == 200){
                        Object.assign(this.dataForm,res.data);
                    }else{

                    }
                })
            },
            // 提交
            dataFormSubmit(formName){
                // alert([this.^,this.dataForm.domainAddress]);
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        var obj = {
                            "id":  this.row.id,
                            // "name":  encodeURI(encodeURI(this.dataForm.name)),
                            // "name":  encodeURI(this.dataForm.name),
                            "name":  this.dataForm.name,
                        }
                        uploadtag(obj).then((res) => {
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
    /*    margin-left: 20px!important;*/
    /*}*/
    .title {
        margin-left: -98px;
    }
</style>