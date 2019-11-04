<template>
<el-dialog
        class="model-add-edit-data"
        title="提示"
        :close-on-click-modal="false"
        :visible.sync="visible"
        :before-close="closeDialog"
        width="26%"
    >
    <div style="padding-left:10%">
        <h3>要上架的商品有未下载的图片，您确认要上架?</h3>
    </div>
<el-dialog
        class="model-add-edit-data"
        :title="type == 1 ?'上架': '下架' "
        :close-on-click-modal="false"
        :visible.sync="innerVisible"
        :before-close="closeDialog"
        width="26%"
        append-to-body
    >
        <el-form
            :model="dataForm"
            ref="addForm"
            @keyup.enter.native="dataFormSubmit('addForm')"
            label-width="120px"
        >
            <el-form-item label="下架：" prop="" v-if="type == 0">
                <el-radio-group v-model="dataForm.showType">
                    <el-radio :label="0">立即下架</el-radio>
                    <el-radio :label="1">定时下架</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="上架：" prop="" v-if="type == 1">
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
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="change()">确定</el-button>
    </div>
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
                innerVisible: false,
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
                pickerOptions: {
                    disabledDate(time) {
                      return time.getTime() < Date.now() - 8.64e7;
                    }
                },// 日期组件 设置项
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
                this.dataForm.shelfTime = new Date();
                this.dataForm.showType =0
                this.dataForm.showWeb =""
                this.$nextTick(() => {
                    
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
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        var ids = [];
                        this.dataListSelections.forEach((item,index)=>{
                            ids.push(item.id);
                        })
                        var obj={
                            ids: ids.join(","),
                            showWeb: this.type == 1?1:2,//1上级，2下架
                            showType:this.dataForm.showType,//0:立即，1：定时 ,
                            shelfTime:this.dataForm.showType == 1?this.filterTime(this.dataForm.shelfTime):'',//选择时间
                        }
                        this.saveLoading = true;
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
                this.innerVisible = false;
                this.closeDialog();
            },
            closeDialog() {
                this.$parent.modelLowerShelfVisible = false;
            },
            // 触发里面弹框
            change() {
                this.innerVisible = true;
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>