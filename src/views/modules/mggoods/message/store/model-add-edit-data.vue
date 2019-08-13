<template>
    <el-dialog
            class="model-add-edit-data"
            title="售卖品牌"
            :close-on-click-modal="false"
            :visible.sync="visible"
            width="40%"
    >
        <el-form
                :model="dataForm"
                ref="addForm"
                @keyup.enter.native="dataFormSubmit('addForm')"
                label-width="120px"
        >
            <el-form-item>
                <el-input v-model="dataForm.labelName" placeholder="请输入品牌名称"></el-input>
                <el-button class="btn" type="primary" @click="handleClick()">搜索</el-button>
            </el-form-item>
            <el-table
                    width="100%"
                    :data="dataList"
                    border
                    v-loading="dataListLoading"
                    style="width: 100%"
            >
                <el-table-column prop="labelName" label="品牌名称" align="center"></el-table-column>
                <el-table-column prop="state" label="可售状态" width="200" align="center"></el-table-column>
            </el-table>
        </el-form>
        <!-- 分页 -->
        <el-pagination
                @size-change="pageSizeChangeHandle"
                @current-change="pageCurrentChangeHandle"
                :current-page="page"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="limit"
                :total="total"
                layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
    </el-dialog>
</template>

<script>
    import mixinViewModule from '@/mixins/view-module'
    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                visible : false,
                loading : false,
                uploading:false,
                dataList: [],
                dataListLoading: false,
                dataForm: {
                    labelName: "",//品牌名称
                },
                formLabelWidth: '120px'
            }
        },
        methods: {
            init (row) {
                this.visible = true;
                this.row = row;
                if(row){
                    //this.title="编辑标签";
                    this.backScan();
                }else{
                    //this.title="新建标签"

                }
                this.$nextTick(() => {
                    this.$refs['addForm'].resetFields();
                    // this.getApplyPullList();
                })
            },
            // closeDialog() {
            //     this.$parent.addEditDataVisible = false;
            // },
        }
    }
</script>

<style lang="scss" scoped>
    @import "@/element-ui/theme-variables.scss";
    /deep/.el-input {
        width:auto;
    }
    /deep/.el-form-item__content {
        margin-left: 0!important;
    }
</style>