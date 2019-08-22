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
            <el-form-item label="颜色组ID：">
                <span>{{dataForm.id}}</span>
            </el-form-item>
            <el-form-item label="日本颜色组名称：">
                <span>{{dataForm.nameJp}}</span>
            </el-form-item>
            <el-form-item label="颜色组名称：" prop="name" :label-width="formLabelWidth">
                <el-input v-model="dataForm.name" auto-complete="off"></el-input>
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
    import { backScanColorcategory,updateColorcategory } from '@/api/api'
    export default {
        name: "model-add-edit-data",
        data () {
            return {
                visible : false,
                loading : false,
                dataForm: {
                    id: "",//颜色组ID
                    nameJp: "",//日本品牌名称
                    name: "",//颜色组名称
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
                    this.title="编辑颜色组";
                    this.backScan();
                }else{
                    this.title="新建颜色组"

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
                    nameJp:this.row.nameJp,
                    name:this.row.name
                }
                backScanColorcategory(obj).then((res)=>{
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
                        var fn = updateColorcategory;
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
    /*    margin-left: 34px!important;*/
    /*}*/
    .title {
        margin-left: -86px;
    }
</style>