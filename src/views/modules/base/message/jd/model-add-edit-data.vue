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
            <el-form-item label="关联分类：" prop="ids" :label-width="formLabelWidth">
                <el-tree
                        ref="treeCategory"
                        :data="data"
                        show-checkbox
                        node-key="id"
                        :default-expanded-keys="expandedKeys"
                        :default-checked-keys="checkedKeys"
                        :props="defaultProps">
                </el-tree>
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
    import { backScanJdCate,updateCategory,categoryListById } from '@/api/api'
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
                    ids:'',
                },
                dataRule : {
                    // name : [
                    //     { required: true, message: '必填项不能为空', trigger: 'blur' },
                    // ],
                    ids : [
                        { required: true, message: '必填项不能为空', trigger: 'blur' },
                    ],
                },
                optionsApplication: [],
                optionsRight: [],
                title:'',
                row:"",
                formLabelWidth: '120px',
                data:[],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                expandedKeys:[],
                checkedKeys:[],
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
                this.getcategoryListById();
                this.$nextTick(() => {
                    this.$refs['addForm'].resetFields();
                    // this.getApplyPullList()
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
                        var ids= []
                        Object.assign(this.dataForm,res.data);
                        res.data.relateList.forEach((item,index)=>{
                            ids.push(item.id)
                        })
                        this.expandedKeys = ids;
                        this.checkedKeys =  ids;
                    }else{

                    }
                })
            },
            getcategoryListById(){
                var obj  = {
                    id:this.row.label,
                }
                categoryListById(obj).then((res)=>{
                    if(res.code == 200) {
                        var level1=[];
                        // level1 = res.data.find((item, index)=>{
                        //     return item.parentId == 0
                        // });
                        res.data.forEach((item, index)=>{
                            if( item.parentId == 0){
                                item.label = item.name;
                                item.children = [];
                                level1.push(item);

                            }
                        });
                        level1.forEach((item, index)=>{
                            res.data.forEach((item2, index2)=>{
                                if(item2.parentId == item.id){
                                    item2.label = item2.name;
                                    item2.children = "",
                                    item.children.push(item2)
                                }
                            })
                        })
                       this.data = level1
                    }
                })
            },

            // 提交
            dataFormSubmit(formName){
                var ids = this.$refs.treeCategory.getCheckedKeys(true);
                if(ids && ids.length!=0){
                     this.dataForm.ids = "至少勾选了一个tree,验证通过";
                }else{
                    this.dataForm.ids = "";//必选，验证不通过
                }
                // alert([this.dataForm.name,this.dataForm.domainAddress]);
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        var obj = {
                            id:this.row.id,
                            ids: ids
                        }
                        updateCategory(obj).then((res) => {
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