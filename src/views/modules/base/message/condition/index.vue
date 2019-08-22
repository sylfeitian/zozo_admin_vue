<template>
    <div>
        <Bread :breaddata="breaddata"></Bread>
        <el-form :inline="true" class="grayLine topGapPadding" :model="dataForm" @keyup.enter.native="getDataList()" >
            <el-form-item label="分类条件ID：">
                <el-input v-model="dataForm.conditionId" ></el-input>
            </el-form-item>
            <el-form-item label="分类条件名称：">
                <el-input v-model="dataForm.conditionName" ></el-input>
            </el-form-item>
            <el-form-item>
                <el-button  class="btn" type="primary" @click="getDataList()">查询</el-button>
                <el-button   class="btn"type="primary" plain @click="reset()" >重置条件</el-button>
                <el-button @click="addOrEditHandle()"  class="btn" type="primary" style="float: right;">导入信息</el-button>
            </el-form-item>
        </el-form>
        <el-table width="100%" :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
            <el-table-column prop="conditionId" label="分类条件ID" align="center"></el-table-column>
            <el-table-column prop="japanCondition" label="日本分类条件名称" align="center"></el-table-column>
            <el-table-column prop="conditionName" label="分类条件名称" align="center"></el-table-column>
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
                breaddata: [ "商品管理", "分类条件信息"],
                dataForm: {
                    conditionId: "",//分类条件ID
                    conditionName: "",//分类条件信息名称
                },
                value: '',
                addEditDataVisible:false,
                formLabelWidth: '120px'
            }
        },
        components: {
            Bread,
            addEditData
        },
        methods: {
            reset() {
                this.dataForm.conditionName = "";//分类条件信息名称
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