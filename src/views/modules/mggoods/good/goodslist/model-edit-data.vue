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
                        v-model="dataForm.firstCategoryId"
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
                <el-select v-model="dataForm.secondCategoryId"
                           filterable
                           placeholder="请输入关键词"
                           :loading="loading"
                           @change="changeSecondCategoryFn"
                >
                    <el-option
                            v-for="item in selectSecondCategory"
                            :key="item.index"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
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
    import { backScanCategorys, saveZozogoods } from '@/api/api'
    export default {
        name: "model-edit-data",
        data () {
            return {
                visible : false,
                loading : false,
                dataForm: {
                    firstCategory: "",
                    firstCategoryId: "",
                    secondCategory: "",
                    secondCategoryId: "",
                },
                dataRule : {
                    selectName : [
                        { required: true, message: '必填项不能为空', trigger: 'blur' },
                    ]
                },
                title:'',
                selectFirstCategory:[],
                selectSecondCategory:[],
                formLabelWidth: '120px',
            }
        },
        props:["id"],
        methods: {
            init (row) {
                this.visible = true;
                this.title="选择分类";
                //回显第一二级数据
                this.dataForm.firstCategoryId =  this.$parent.dataForm.firstCategoryId
                this.dataForm.secondCategoryId =  this.$parent.dataForm.secondCategoryId

                this.backScan();
                this.$nextTick(() => {
                    this.$refs['addForm'].resetFields();
                    // this.getApplyPullList();
                })
            },
            //编辑回显
            backScan(){
                var obj  = {}
                backScanCategorys(obj).then((res)=>{
                    //找第一级下拉
                    this.selectFirstCategory = res.data;
                    var itemObj = this.selectFirstCategory.find((item,index)=>{
                        return item.id ==this.dataForm.firstCategoryId;
                    })
                    //找第二级下拉
                    this.selectSecondCategory = itemObj.list;
                })
            },
            //切换第一级
            changeFirstCategoryFn(val){
                var itemObj = this.selectFirstCategory.find((item,index)=>{
                    return item.id == val;
                })
                 console.log(itemObj);
                //找到第一级选中的数据
                this.dataForm.firstCategoryId = itemObj.id;
                this.dataForm.firstCategory = itemObj.name;
                //清空第二级数据
                this.dataForm.secondCategoryId = "";
                this.dataForm.secondCategory = "";
                //找第二级下拉
                this.selectSecondCategory = itemObj.list? itemObj.list:[]
            },
            //切换第二级
            changeSecondCategoryFn(val){
                var itemObj = this.selectSecondCategory.find((item,index)=>{
                    return item.id == val;
                })
                 // 找到第二级选中的数据
                this.dataForm.secondCategoryId = itemObj.id;
                this.dataForm.secondCategory = itemObj.name;
            },
            // 提交
            dataFormSubmit(formName){
                // alert([this.dataForm.name,this.dataForm.domainAddress]);
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$parent.dataForm.firstCategory = this.dataForm.firstCategory;
                        this.$parent.dataForm.firstCategoryId =this.dataForm.firstCategoryId;
                        this.$parent.dataForm.secondCategoryId = this.dataForm.secondCategoryId;
                        this.$parent.dataForm.secondCategory = this.dataForm.secondCategory;
                        this.closeDialog();
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