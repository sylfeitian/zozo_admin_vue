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
                :rules="dataRule"
                ref="addForm"
                @keyup.enter.native="dataFormSubmit('addForm')"
                label-width="120px"
        >
            <el-form-item label="仓库名称：" prop="">
                <span>{{dataForm.name}}</span>
            </el-form-item>
            <el-form-item label="仓库种类：" prop="">
                <span>{{dataForm.desc}}</span>
            </el-form-item>
            <el-form-item label="仓库负责人：" prop="">
                <span>{{dataForm.charge}}</span>
            </el-form-item>
            <el-form-item label="负责人联系方式：" prop="" :label-width="formLabelWidth">
                <span>{{dataForm.tel}}</span>
            </el-form-item>
            <el-form-item label="仓库所在地：" prop="desc" :label-width="formLabelWidth">
                <span>{{dataForm.address}}</span>
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
        name: "model-show-data",
        data () {
            return {
                visible : false,
                loading : false,
                dataForm: {},
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
                this.title="查看仓库详情";
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

<style scoped>

</style>