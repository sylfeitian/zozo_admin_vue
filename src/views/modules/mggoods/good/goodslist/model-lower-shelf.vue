<template>
<el-dialog
        class="model-add-edit-data"
        :title="row.showWeb == 2 ?'上架': row.showWeb == 0 ?'上架': '下架' "
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
            <el-form-item label="下架：" prop="" v-if="row.showWeb == 1">
                <el-radio-group v-model="dataForm.showType">
                    <el-radio :label="0">立即下架</el-radio>
                    <el-radio :label="1">定时下架</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="上架：" prop="" v-if="row.showWeb == 2">
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
    import { showGoods } from '@/api/api'
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
                row:"",
                formLabelWidth: '120px',
                shelfTime: '',
            }
        },
        // props:["idJp"],
        methods: {
            init (row) {
                this.visible = true;
                this.$nextTick(() => {
                    if(row){
                        this.row = row;
                        // console.log(this.dataForm)
                        // this.backScan();
                    }else{
                    }
                })
            },
            // 编辑回显
            backScan(){
                
            },
            // 控制上下架
            // cotrolGoodsShow(type, rowOrstatus) {
            // var ids = [];
            // var showWeb = 0;
            // if (type == "batch") {
            //     //批量
            //     if (this.multipleSelection.length == 0) {
            //     this.$message({
            //         message: "请选择商品",
            //         type: "warning",
            //         duration: 1500
            //     });
            //     return;
            //     }
            //     ids = this.getIds();
            //     showWeb = rowOrstatus;
            // } else {
            //     //单个  
            //     // (不可售商品不能上架)
            //     if( (rowOrstatus.showWeb==0 || rowOrstatus.showWeb==2 ) && rowOrstatus.sellState==0){
            //         this.$message({
            //         message: "不可售商品不能上架",
            //         type: "warning",
            //         duration: 1500
            //         });
            //         return;
            //     }
            //     ids = [rowOrstatus.id];
            //     showWeb = rowOrstatus.showWeb == 1 ? 2 : 1;
            // }
            // var obj = {
            //     ids: ids,
            //     showWeb: showWeb
            // };

            // let that = this
            // var msg = showWeb == 1? "是否确定上架操作": "是否确定下架操作";
            // this.$confirm(msg, '提示', {
            //     confirmButtonText: '确定',
            //     cancelButtonText: '取消',
            //     type: 'warning'
            // }).then(() => {
            //     // that.upAndDownGoods(obj,showWeb);
            // }).catch(() => {
            // });

            // },
            // 执行上下架
            // upAndDownGoods(obj,showWeb){
            //     showGoods(obj).then(res => {
            //     let status = "";
            //     let msg = "";
            //     if (res.code == "200") {
            //         status = "success";
            //         msg = showWeb == 1 ? "商品上架成功" : "商品下架成功";
            //         this.getDataList();
            //     } else {
            //         status = "error";
            //         msg = res.msg;
            //     }
            //     this.$message({
            //         message: msg,
            //         type: status,
            //         duration: 1500
            //     });
            //     });
            // },
            // 提交
            dataFormSubmit(formName){
                // alert([this.dataForm.name,this.dataForm.domainAddress]);
                // console.log(this.dataForm);
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        var obj={
                            id: this.row.id,
                            showWeb: 2,
                            showType:this.dataForm.showType,
                            shelfTime:this.dataForm.shelfTime,
                            shelfTime:""
                        }
                         this.saveLoading = true;
                         if (this.dataForm.showType == 1){ obj.shelfTime= this.shelfTime}
                         if (this.row.showWeb == 0 || this.row.showWeb == 2) { obj.showWeb= 1 }
                         var fn = showGoods;
                        fn(obj).then((res) => {
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