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
            <el-form-item label="上架：" prop="" v-if="row.showWeb == 2 || row.showWeb == 0">
                <el-radio-group v-model="dataForm.showType">
                    <el-radio :label="0">立即上架</el-radio>
                    <el-radio :label="1">定时上架</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="选择时间：" prop="shelfTime" v-if="dataForm.showType==1">
                <el-date-picker
                    v-model="dataForm.shelfTime"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :disabled="dataForm.showType == 0"
                    :picker-options="pickerOptions"
                    placeholder="选择日期时间"
                    @change="afterTime">
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
                    showWeb: "",//1上级，2下架
                },
                // showType: 0,//0:立即，1：定时 ,
                optionsApplication: [],
                optionsRight: [],
                row:"",
                formLabelWidth: '120px',
                pickerOptions: {
                    disabledDate(time) {
                      return time.getTime() < Date.now() - 8.64e7;
                    }
                },// 日期组件 设置项
                shelfTime: '',
            }
        },
        // props:["idJp"],
        methods: {
            init (row) {
                this.visible = true;
                this.dataForm.shelfTime = new Date();
                this.dataForm.showType = 0
                this.dataForm.showWeb = ""
                this.$nextTick(() => {
                    if(row){
                        this.row = row;
                        // console.log(this.dataForm)
                        // this.backScan();
                    }else{
                    }
                })
            },
            filterTime(value){
                function add0(m){return m<10?'0'+m:m }
                var time = new Date(value);
                var y = time.getFullYear();
                var m = time.getMonth()+1;
                var d = time.getDate();
                var h = time.getHours();
                var mm = time.getMinutes();
                var s = time.getSeconds();
                        return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s)
                    // return y+'-'+add0(m)+'-'+add0(d)
            },
            afterTime(){
                console.log(this.dataForm.shelfTime);
                if(new Date(this.dataForm.shelfTime).getTime() < new Date().getTime()){
                    this.dataForm.shelfTime = this.filterTime(new Date());
                }
            },
            // 提交
            dataFormSubmit(formName){
                // alert([this.dataForm.name,this.dataForm.domainAddress]);
                // console.log(this.dataForm);
                 this.afterTime();
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        var obj={
                            id: this.row.id,
                            showWeb:  this.row.showWeb == 1?2:1,//1上级，2下架
                            showType:this.dataForm.showType,//0:立即，1：定时 ,
                            shelfTime:this.dataForm.showType == 1?this.filterTime(this.dataForm.shelfTime):'',//选择时间
                        }
                         this.saveLoading = true;
                        showGoods(obj).then((res) => {
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