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
                <span>{{dataForm.idJp}}</span>
            </el-form-item>
            <el-form-item label="日本品牌名称：">
                <span>{{dataForm.brandNameJp}}</span>
            </el-form-item>
            <el-form-item label="日本品牌描述：">
                <span>{{dataForm.descriptionJp}}</span>
            </el-form-item>
            <el-form-item label="品牌名称：" prop="brandName" :label-width="formLabelWidth">
                <el-input v-model.trim.trim="dataForm.brandName" placeholder="请输入品牌名称"></el-input>
            </el-form-item>
            <el-form-item label="品牌描述：" prop="description" :label-width="formLabelWidth">
                <el-input type="textarea" v-model="dataForm.description" placeholder="请输入品牌描述"></el-input>
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
    import { backScanShopBrand,updataShopBrand } from '@/api/api'
    export default {
        name: "model-add-edit-data",
        data () {
            return {
                visible : false,
                loading : false,
                dataForm: {
                    id:"",
                    idJp: "",//品牌ID
                    brandNameJp: "",//日本品牌名称
                    descriptionJp: "",//日本品牌描述
                    description: "",//品牌描述
                    brandName: ""//品牌名称
                },
                dataRule : {
                    brandName : [
                        { required: true, message: '必填项不能为空', trigger: 'blur' },
                    ],
                    // description : [
                    //     { required: true, message: '必填项不能为空', trigger: 'blur' },
                    // ]
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
            backScan(){
                var obj  = {
                    id:this.row.id,
                    idJp:this.row.idJp,
                    brandNameJp:this.row.brandNameJp,
                    descriptionJp:this.row.descriptionJp,
                    brandName:this.row.brandName,
                    description:this.row.description
                }
                backScanShopBrand(obj).then((res)=>{
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
                            // "idJp":  this.dataForm.idJp,
                            // "brandNameJp":  this.dataForm.brandNameJp,
                            // "descriptionJp":  this.dataForm.descriptionJp,
                            "brandName":  this.dataForm.brandName,
                            "description":  this.dataForm.description,
                        }
                        if(this.row) obj.id = this.row.id
                        var fn = updataShopBrand;
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