<template>
    <el-dialog
            class="model-add-edit-data"
            title="售卖品牌"
            :close-on-click-modal="false"
            :visible.sync="visible"
            width="50%"
    >
        <el-form
                :model="dataForm"
                ref="addForm"
                @keyup.enter.native="dataFormSubmit('addForm')"
                label-width="120px"
        >
            <el-form-item>
                <el-input v-model.trim="dataForm.brandName" placeholder="请输入品牌名称"></el-input>
                <el-button class="btn" type="primary" @click="handleClick()">搜索</el-button>
            </el-form-item>
            <el-table
                    width="100%"
                    :data="dataList"
                    border
                    v-loading="dataListLoading"
                    style="width: 100%"
            >
                <el-table-column prop="brandName" label="品牌名称" align="center"></el-table-column>
                <el-table-column prop="enableCnFlag" label="可售状态" width="200" align="center">
                     <template slot-scope="scope">
                         <span v-if="scope.row.enableCnFlag==0">不可售</span>
                         <span v-else-if="scope.row.enableCnFlag==1">可售</span>
                    </template>
                </el-table-column>
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
    import { pageByStoreUrl } from "@/api/url";

    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                 mixinViewModuleOptions: {
                    getDataListURL: pageByStoreUrl,
                    activatedIsNeed: false,    // 此页面是否在激活（进入）时，调用查询数据列表接口？
                    getDataListIsPage: true,
                    // exportURL: "/admin-api/shopStore",
                    // deleteURL: "/admin-api/shopStore",
                    // deleteIsBatch: true
                    // // deleteIsBatchKey: 'id'
                },
                visible : false,
                loading : false,
                uploading:false,
                dataList: [],
                dataListLoading: false,
                dataForm: {
                    brandName: "",//品牌名称
                     storeId:"",
                },
                formLabelWidth: '120px'
            }
        },
        methods: {
            init (row) {
                this.visible = true;
                this.row = row;
                this.dataList = [];
                this.page =1;
                 this.limit = 10;
                this.total =0;
                this.$nextTick(() => {
                    this.$refs['addForm'].resetFields();
                     this.backScan();
                    // this.getApplyPullList();
                })
            },
            // 编辑回显
            backScan(){
                this.dataForm.storeId = this.row.id,
                this.getDataList();
                console.log(this.row);
            },
            // 搜索
            handleClick(){
                this.$refs['addForm'].resetFields();
                this.getDataList();
            }
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