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
                        :loading="loading"
                        @change="changeSelect">
                    <el-option
                            v-for="(item,index) in selectAllOption"
                            :key="item.index"
                            :label="item.styleName"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="已关联副风格标签：" prop="styleName">
               <div class="elTagWarp">
                    <el-tag closable
                            v-for="(item,index) in dataArray"
                            :key="item.index"
                            :label="item.styleName"
                            :value="item.id"
                            @close="handleClose(item)"
                            class="tag">
                    {{item.styleName}}
                    </el-tag>
               </div>
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
    import { backScanShopStyleUnion, shopStyleUnion, searchShopStyleSubList } from '@/api/api'
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
                selectAllOption:[], //
                selectdOption:[],
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
                this.getStyleSubList();
                this.backScan();
                this.$nextTick(() => {
                    this.$refs['addForm'].resetFields();
                    // this.getApplyPullList();
                })
            },
            // 下拉列表
            getStyleSubList(){
                var obj  = {
                    id:this.row.id,
                    styleName:this.row.styleName,
                }
                searchShopStyleSubList(obj).then((res)=>{
                    if(res.code == 200){
                        this.selectAllOption = res.data;
                    }else{

                    }
                })
            },
            // 已关联风格标签回显
            backScan(){
                var obj  = {
                    id:this.row.id,
                    styleName:this.row.styleName
                }
                backScanShopStyleUnion(obj).then((res)=>{
                    if(res.code == 200){
                        this.dataArray = res.data;
                        //  已选过得风格标签，要从下拉列表中去除
                       var selectAllOption =  this.selectAllOption.filter((item,index)=>{
                            var _index = this.dataArray.findIndex((item2,index2)=>{
                                return item.id == item2.id
                            })
                            if(_index==-1){
                                return true
                            }else{
                                return false
                            }
                        })
                        this.selectAllOption = selectAllOption;
                    }else{

                    }
                })
            },
            // 下拉切换风格标签
            changeSelect (val) {
                console.log(val);
                console.log(this.value);
                // 找到下拉选中的obj
                var obj = this.selectAllOption.find((item,index)=>{
                    return item.id == val;
                });

                  // 查看选中的obj，是否在已关联的已选过的
                var index =  this.dataArray.findIndex((item,index)=>{
                    return item.id == val;
                });
                // 如果以前没选过
                if(index==-1){
                    // 从下拉中去掉已选的
                    var selectAllOption = this.selectAllOption.filter((item,index)=>{
                        return item.id != val;
                    });
                    this.selectAllOption = selectAllOption;

                     //  已关联的新增一条
                    this.dataArray.unshift(obj)
                    this.dataForm.styleName = "";
                }
            },
            // 取消选择风格标签
            handleClose(item) {
                this.dataArray.splice(this.dataArray.indexOf(item), 1);
                // 如果下拉中已有，不在追加
                 var index = this.selectAllOption.findIndex((item2,index2)=>{
                    return item2.id == item.id;
                });
                if(index==-1){
                    this.selectAllOption.push(item);
                }
            },
            // 提交
            dataFormSubmit(formName){
                // alert([this.dataForm.name,this.dataForm.domainAddress]);
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let ids = new Array();
                        this.dataArray.forEach((item, index)=>{
                            ids.push(item.id)
                        });
                        this.loading = true;
                        var obj = {
                            ids: ids,
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
                this.$parent.subDataVisible = false;
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

<style lang="scss" scoped>
    /deep/ .el-form-item__label {
        width: 130px!important;
    }
    /deep/ .el-form-item__content {
        margin-left: 130px!important;
    }
    .tag {
        width: 28%;

    }
    /deep/ .el-icon-close {
        margin-left: 20% !important;
    }
    /*.tag + .tag {*/
    /*    margin-right: 0;*/
    /*    margin-left: 30px;*/
    /*}*/
    .elTagWarp{
        display: flex;
        flex-wrap: wrap;
    }
</style>