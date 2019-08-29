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
            <el-form-item label="京东分类ID：">
                <span>{{dataForm.id}}</span>
            </el-form-item>
            <el-form-item label="京东分类名称：">
                <span>{{dataForm.categoryName}}</span>
            </el-form-item>
            <el-form-item label="关联分类：" prop="name" :label-width="formLabelWidth">
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
    import { backScanJdCate,updateCategory } from '@/api/api'
    export default {
        name: "model-add-edit-data",
        data () {
            return {
                visible : false,
                loading : false,
                dataForm: {
                    id:"",//分类ID
                    categoryName: "",//京东分类名称
                    name: "",//分类名称
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
                console.log(row)
                this.title="编辑分类";
                this.backScan();
                this.$nextTick(() => {
                    this.$refs['addForm'].resetFields();
                    // this.getApplyPullList();
                })
            },
            //编辑回显
            backScan(){
                var obj  = {
                    id:this.row.label,
                    categoryName:this.row.categoryName,
                    name:this.row.name
                }
                backScanJdCate(obj).then((res)=>{
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
                            "id":  this.dataForm.id,
                            "name":  this.dataForm.name,
                        }
                        if(this.row) obj.id = this.row.id
                        var fn = updateCategory;
                        fn(obj).then((res) => {
                            console.log(res)
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