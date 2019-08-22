<template>
    <div>
        <Bread  :breaddata="breaddata"></Bread>
        <el-button @click="addOrEditHandle()"  class="btn" type="primary" style="float: right;">导入信息</el-button>
        <el-table width="100%" :data="dataList" @sort-change="dataListSortChangeHandle" border v-loading="dataListLoading" style="width: 100%;margin-top: 70px">
            <el-table-column prop="SelectId" label="分类id" align="center"></el-table-column>
            <el-table-column prop="japanSelect" label="日本分类名称" align="center"></el-table-column>
            <el-table-column prop="updateTime" label="更新时间" align="center"></el-table-column>
            <el-table-column prop="selectName" label="分类名称" align="center"></el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button @click.native.prevent="addOrEditHandle(scope.$index, scope.row)"type="text"size="mini">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
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
        <!-- 弹窗, 新建 -->
        <addEditData  v-if="addEditDataVisible" ref="addEditData" @searchDataList="getDataList"></addEditData>
    </div>
</template>

<script>
    import mixinViewModule from '@/mixins/view-module'
    import Bread from "@/components/bread";
    import addEditData from './model-add-edit-data'
    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                breaddata: [ "商品管理", "日本分类"],
                dataForm: {
                    selectName: "",//分类名称
                },
                value: '',
                form: {
                    japanSelect: "",//日本分类名称
                    selectName: ""//分类名称
                },
                addEditDataVisible:false,
            }
        },
        components: {
            Bread,
            addEditData
        },
        methods: {
            reset() {
                this.dataForm.selectName = "";//商品名称/商品货号
                this.getDataList();
            },
            // 新建和编辑
            addOrEditHandle(index=-1,row=""){
                this.setAddEditDataVisible(true);
                this.$nextTick(() => {
                    this.$refs.addEditData.init(row)
                })
            },
            setAddEditDataVisible(boolargu){
                this.addEditDataVisible =  boolargu;
            }
        }
    }
</script>

<style scoped>
    .grayLine{
        border-bottom: 0!important;
    }
</style>