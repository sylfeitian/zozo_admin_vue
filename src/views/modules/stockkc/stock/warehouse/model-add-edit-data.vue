<template>
    <el-dialog
            class="model-add-edit-data"
            :title="title"
            :close-on-click-modal="false"
            :visible.sync="visible"
            :before-close="closeDialog"
            width="40%"
    >
        <el-form
                :model="dataForm"
                :rules="dataRule"
                ref="addForm"
                @keyup.enter.native="dataFormSubmit('addForm')"
                label-width="120px"
        >
            <el-form-item label="仓库名称：" prop="warehouseName">
                <el-input v-model="dataForm.warehouseName" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="仓库种类：" prop="type">
                <el-select v-model="dataForm.type" placeholder="请选择">
                    <el-option label="发货仓" :value="0"></el-option>
                    <el-option label="退货仓" :value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="仓库负责人：" prop="name">
                <el-input v-model="dataForm.name" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="负责人联系方式：" prop="phone" :label-width="formLabelWidth">
                <el-input v-model="dataForm.phone" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="仓库所在地：" prop="addressInfo" :label-width="formLabelWidth">
                <el-select
                        v-model="dataForm.provinceId"
                        placeholder="省"
                        loading-text="加载中···"
                        @visible-change="getGoodsClass(0)"
                >
                    <!-- 省级 -->
                    <el-option
                            v-for="item in goodscalssOption0"
                            :key="item.id"
                            :label="item.areaName"
                            :value="item.id"
                    ></el-option>
                </el-select>
                <el-select
                        v-model="dataForm.cityId"
                        placeholder="市"
                        @visible-change="getGoodsClass(1)"
                >
                    <el-option
                            v-for="item in goodscalssOption1"
                            :key="item.id"
                            :label="item.areaName"
                            :value="item.id"
                    ></el-option>
                </el-select>
                <el-select
                        v-model="dataForm.areaId"
                        placeholder="县"
                        @visible-change="getGoodsClass(2)"
                >
                    <el-option
                            v-for="item in goodscalssOption2"
                            :key="item.id"
                            :label="item.areaName"
                            :value="item.id"
                    ></el-option>
                </el-select>
                <el-select
                        v-model="dataForm.stressId"
                        placeholder="街道/街道"
                >
                    <el-option
                            v-for="item in goodscalssOption3"
                            :key="item.id"
                            :label="item.areaName"
                            :value="item.id"
                    ></el-option>
                </el-select>
                <el-input type="textarea" v-model="dataForm.desc" placeholder="请输入详细地址" :rows="4" style="margin-top: 20px;"></el-input>
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
    import { backScanWare,addWare, updataWare } from '@/api/api'
    export default {
        name: "model-add-edit-data",
        data () {
            return {
                visible : false,
                loading : false,
                dataForm: {
                    provinceId: "",
                    cityId: "",
                    areaId: "",
                    streetId: ""
                },
                goodscalssOption0: [],
                goodscalssOption1: [],
                goodscalssOption2: [],
                goodscalssOption3: [],
                dataRule : {
                    name : [
                        { required: true, message: '必填项不能为空', trigger: 'blur' },
                    ]
                },
                optionsApplication: [],
                optionsRight: [],
                title:'',
                row:"",
                formLabelWidth: '120px'
            }
        },
        methods: {
            init (row) {
                this.visible = true;
                this.row = row;
                if(row){
                    this.title="编辑仓库";
                    this.backScan();
                }else{
                    this.title="添加仓库"

                }
                this.$nextTick(() => {
                    this.$refs['addForm'].resetFields();
                    // this.getApplyPullList();
                })
            },
            dataFormCancel(){
                this.visible = false;
                this.closeDialog();
            },
            closeDialog() {
                this.$parent.addEditDataVisible = false;
            },
            // 编辑回显
            backScan(){
                var obj  = {
                    id:this.row.id,
                    warehouseName:this.row.warehouseName,
                    type:this.row.type,
                    name:this.row.name,
                    phone:this.row.phone
                }
                backScanWare(obj).then((res)=>{
                    if(res.code == 200){
                        Object.assign(this.dataForm,res.data);

                    }else{

                    }
                })
            },
            // 提交
            dataFormSubmit(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        var obj={
                            "warehouseName": this.dataForm.warehouseName,
                            "type": this.dataForm.type,
                            "name": this.dataForm.name,
                            "phone":this.dataForm.phone,
                            // "brandValueDTOList": this.dataForm.brandValueDTOList,
                            // "brandApply": 0,
                            // "brandSort": 0,
                            // "storeId": 0
                        }

                        if(this.row) obj.id = this.row.id
                        var fn = this.row?updataWare:addWare;
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
        }
    }
</script>

<style lang="scss" scoped>
    /deep/ .el-form-item__label {
        width: 130px!important;
    }
    /deep/ .el-form-item__content{
        margin-left: 130px!important;
    }
    /deep/ .el-select--default{
        width: 146px!important;
    }
</style>