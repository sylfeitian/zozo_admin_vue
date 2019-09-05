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
            <el-form-item label="选择一级分类：">
                <el-select
                        v-model="dataForm.firstCategory"
                        filterable
                        placeholder="请输入关键词"
                        :loading="loading"
                        @change="changeFirstCategoryFn"
                >
                    <el-option
                            v-for="(item,index) in selectFirstCategory"
                            :key="item.index"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="选择二级分类：">
                <el-select v-model="dataForm.secondCategory"
                           filterable
                           placeholder="请输入关键词"
                           :loading="loading"
                >
                    <el-option
                            v-for="item in selectSecondCategory"
                            :key="item.index"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
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
    import { backScanCategorys, saveZozogoods } from '@/api/api'
    export default {
        name: "model-edit-data",
        data () {
            return {
                visible : false,
                loading : false,
                dataForm: {
                    firstCategory: "",
                    secondCategory: "",
                },
                dataRule : {
                    selectName : [
                        { required: true, message: '必填项不能为空', trigger: 'blur' },
                    ]
                },
                title:'',
                row:"",
                selectFirstCategory:[],
                selectSecondCategory:[],
                formLabelWidth: '120px'
            }
        },
        props:["id"],
        methods: {
            init (row) {
                this.visible = true;
                this.row = row;
                console.log(row)
                this.title="选择分类";
                this.backScan();
                this.$nextTick(() => {
                    this.$refs['addForm'].resetFields();
                    // this.getApplyPullList();
                })
            },
            //编辑回显
            backScan(){
                var obj  = {
                    id:this.dataForm.id,
                    name:this.dataForm.name,
                }
                backScanCategorys(obj).then((res)=>{
                    this.selectFirstCategory = res;
                    this.selectSecondCategory = res.list.name;
                })
            },
            changeFirstCategoryFn(val){
                var itemObj = this.selectFirstCategory.find((item,index)=>{
                    return item.id == val;
                })
                this.dataForm.secondCategory = "";
                this.selectSecondCategory = itemObj.list;
            },
            // 提交
            dataFormSubmit(formName){
                // alert([this.dataForm.name,this.dataForm.domainAddress]);
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        var obj = {
                            "id":  this.dataForm.id,
                            "firstCategory":  this.dataForm.firstCategory,
                            "secondCategory":  this.dataForm.secondCategory,
                        }
                        // if(this.row) obj.id = this.row.id
                        var fn = saveZozogoods;
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
            closeDialog() {
                console.log("关闭窗口");
                this.$parent.addEditDataVisible = false;
            },
            dataFormCancel(){
                this.visible = false;
                this.closeDialog();
            },
        }
    }
</script>

<style lang="scss" scoped>
    /deep/ .el-input .el-input--default .el-input--suffix {
        width: 300px!important;
    }
</style>