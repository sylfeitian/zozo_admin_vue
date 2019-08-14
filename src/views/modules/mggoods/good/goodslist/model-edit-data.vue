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
            <el-form-item label="选择一级分类：">
                <el-select v-model="dataForm.conditionName" placeholder="请选择">
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="选择二级分类：">
                <el-select v-model="dataForm.conditionName" placeholder="请选择">
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item style="text-align: center;margin-left: -120px!important;">
                <el-button type="primary" @click="dataFormSubmit('addForm')"
                           :loading="loading">{{loading ? "提交中···" : "确定"}}</el-button>
                <el-button  @click="dataFormCancel()">返回</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
    export default {
        name: "model-edit-data",
        data () {
            return {
                visible : false,
                loading : false,
                dataForm: {},
                dataRule : {
                    selectName : [
                        { required: true, message: '必填项不能为空', trigger: 'blur' },
                    ]
                },
                options: [{
                    value: '选项1',
                    label: '全部'
                }, {
                    value: '选项2',
                    label: '已售完'
                }, {
                    value: '选项3',
                    label: '未售完'
                }],
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
                    this.title="编辑分类";
                    this.backScan();
                }else{
                    this.title="新建分类"

                }
                this.$nextTick(() => {
                    this.$refs['addForm'].resetFields();
                    // this.getApplyPullList();
                })
            },
        }
    }
</script>

<style scoped>

</style>