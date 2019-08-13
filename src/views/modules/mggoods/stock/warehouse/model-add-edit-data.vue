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
            <el-form-item label="仓库名称：" prop="">
                <el-input v-model="dataForm.name" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="仓库种类：" prop="">
                <el-select v-model="dataForm.sizeFeeling" placeholder="" style="width: 598px!important;">
                    <el-option label="退货仓" value="">退货仓</el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="仓库负责人：" prop="">
                <el-input v-model="dataForm.name" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="负责人联系方式：" prop="" :label-width="formLabelWidth">
                <el-input v-model="dataForm.name" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="仓库所在地：" prop="desc" :label-width="formLabelWidth">
                <el-select
                        disabled
                        v-model="dataForm.memberAreaid"
                        placeholder="省"
                        loading-text="加载中···"
                        @visible-change="getGoodsClass(0)"
                >
                    <!-- 市级 -->
                    <el-option
                            v-for="item in goodscalssOption0"
                            :key="item.id"
                            :label="item.areaName"
                            :value="item.id"
                    ></el-option>
                </el-select>
                <el-select
                        disabled
                        v-model="dataForm.memberCityid"
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
                        disabled
                        v-model="dataForm.memberProvinceid"
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
                        disabled
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
    export default {
        name: "model-add-edit-data",
        data () {
            return {
                visible : false,
                loading : false,
                dataForm: {
                    memberAreaid: "",
                    memberCityid: "",
                    memberProvinceid: "",
                    stressId: ""
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