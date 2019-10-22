<template>
<el-dialog
        class="model-add-edit-data"
        :title="type == 2 ?'上架': type == 0 ?'上架': '下架' "
        :close-on-click-modal="false"
        :visible.sync="visible"
        :before-close="closeDialog"
        width="26%"
    >
        <el-form
            :model="dataForm"
            ref="addForm"
            @keyup.enter.native="dataFormSubmit('addForm')"
            label-width="120px"
        >
            <el-form-item label="下架：" prop="" v-if="type == 1">
                <el-radio-group v-model="dataForm.showType">
                    <el-radio :label="0">立即下架</el-radio>
                    <el-radio :label="1">定时下架</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="上架：" prop="" v-if="type == 0">
                <el-radio-group v-model="dataForm.showType">
                    <el-radio :label="0">立即上架</el-radio>
                    <el-radio :label="1">定时上架</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="选择时间：" prop="shelfTime">
                <el-date-picker
                    v-model="shelfTime"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :disabled="dataForm.showType == 0"
                    placeholder="选择日期时间">
                </el-date-picker>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dataFormCancel()">取消</el-button>
            <el-button type="primary" @click="dataFormSubmit('addForm')"
                         :loading="loading">{{loading ? "提交中···" : "确定"}}</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import { showBatchGoods } from '@/api/api'
    // import {  } from '@/api/url'
    export default {
        name: "list",
        data () {
            return {
                // mixinViewModuleOptions: {
                //     getDataListURL: registerUrl,
                //     getDataListIsPage: true,
                //     // exportURL: '/admin-api/log/login/export',
                //     // deleteURL: deleteWare,
                //     deleteIsBatch: false,
                //     deleteIsBatch: true,
                //     deleteIsBatchKey: 'id'
                // },
                visible : false,
                loading : false,
                saveLoading : false,
                dataForm: {
                    shelfTime: "",//选择时间
                    showType: 0,//0:立即，1：定时 ,
                    showWeb: ""
                },
                // showType: 0,//0:立即，1：定时 ,
                optionsApplication: [],
                optionsRight: [],
                formLabelWidth: '120px',
                shelfTime: '',
                type:'',
                dataListSelections:[],
            }
        },
        // props:["idJp"],
        methods: {
            init (dataListSelections,type) {
                this.visible = true;
                this.type  = type;
                this.dataListSelections  = dataListSelections;
                this.dataForm.shelfTime =""
                this.dataForm.showType =0
                this.dataForm.showWeb =""
                this.$nextTick(() => {
                    
                })
            },
            // 编辑回显
            backScan(){
                
            },
            // 提交
            dataFormSubmit(formName){
                // alert([this.dataForm.name,this.dataForm.domainAddress]);
                // console.log(this.dataForm);
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        var ids = [];
                        this.dataListSelections.forEach((item,index)=>{
                            ids.push(item.id);
                        })
                        var obj={
                            ids: ids.join(","),
                            showWeb: 2,//1上级，2下架
                            showType:this.dataForm.showType,//0:立即，1：定时 ,
                            shelfTime:"",//选择时间
                        }
                         this.saveLoading = true;
                         if (this.dataForm.showType == 1){ obj.shelfTime= this.shelfTime}
                         if (this.type == 0) { obj.showWeb= 1 }
                        showBatchGoods(obj).then((res) => {
                            this.saveLoading = false;
                            let msg = "";
                            // alert(JSON.stringify(res));
                            let status = null;
                            if(res.code == "200"){
                                status = "success";
                                this.visible = false;
                                this.$emit('searchDataList');
                                this.closeDialog();
//                              msg = showWeb == 1 ? "商品上架成功" : "商品下架成功";
								msg = res.msg;
//                              this.getDataList();
                            }else{
                                status = "error";
                                msg = res.msg;
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
                this.$parent.modelLowerShelfVisible = false;
            },
        }
    }
</script>

<style lang="scss" scoped>

</style>