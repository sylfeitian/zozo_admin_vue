<template>
    <el-dialog
            class="model-add-edit-data"
            :title="title"
            :close-on-click-modal="false"
            :visible.sync="visible"
            :before-close="closeDialog"
            width="30%"
    >
        <el-form
                :model="dataForm"
                ref="addForm"
                @keyup.enter.native="dataFormSubmit('addForm')"
                label-width="120px"
        >
            <el-form-item  label="关联副风格标签：">
                <el-select
                        v-model="dataForm.styleName"
                        filterable
                        placeholder="请输入关键词"
                        :loading="loading">
                    <el-option
                            v-for="item in dataArray"
                            :key="item.id"
                            :label="item.styleName"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="已关联副风格标签：" prop="styleName">
                <el-tag closable
                        v-for="item in dataArray"
                        :key="item.id"
                        :label="item.styleName"
                        :value="item.id">
                {{item.styleName}}
                </el-tag>
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
    import { backScanShopStyleUnion, shopStyleUnion } from '@/api/api'
    import cloneDeep from 'lodash/cloneDeep'
    export default {
        name: "model-add-edit-data",
        data () {
            return {
                visible : false,
                loading : false,
                uploading:false,
                title:'',
                dataForm: {
                    styleName: "",
                    styleType: "",
                },
                value:[],
                value2:[],
                row:"",
                dataArray:[],
                formLabelWidth: '120px'
            }
        },
        created () {
            // this.dataForm.styleType = this.options[0].id;
        },
        methods: {
            init (row) {
                this.visible = true;
                this.row = row;
                this.title="管理副风格标签";
                this.backScan();
                this.$nextTick(() => {
                    this.$refs['addForm'].resetFields();
                    // this.getApplyPullList();
                })
            },
            //编辑回显
            backScan(){
                var obj  = {
                    id:this.row.id,
                    styleName:this.row.styleName,
                    styleType:this.row.styleType,
                }
                backScanShopStyleUnion(obj).then((res)=>{
                    if(res.code == 200){
                        this.dataArray = res.data;
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
                            "styleName":  this.dataForm.styleName,
                        }
                        if(this.row) obj.id = this.row.id
                        var fn = shopStyleUnion;
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
            //关闭弹窗
            dataFormCancel(){
                this.visible = false;
                this.closeDialog();
            },
            closeDialog() {
                this.$parent.addEditDataVisible = false;
            },
            // remoteMethod(query) {
            //     if (query !== '') {
            //         this.loading = true;
            //         setTimeout(() => {
            //             this.loading = false;
            //             this.dataArray = this.list.filter(item => {
            //                 return item.styleName.toLowerCase()
            //                     .indexOf(query.toLowerCase()) > -1;
            //             });
            //         }, 200);
            //     } else {
            //         this.dataArray = cloneDeep(this.list);
            //     }
            // }
        }
    }
</script>

<style scoped>
    /deep/ .el-form-item__label {
        width: 130px!important;
    }
    /deep/ .el-form-item__content {
        margin-left: 130px!important;
    }
</style>