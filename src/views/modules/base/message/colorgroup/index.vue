<template>
    <div>
        <Bread  :breaddata="breaddata"></Bread>
        <el-form :inline="true" class="grayLine topGapPadding" :model="dataForm" @keyup.enter.native="getDataList()" >
            <el-form-item label="颜色组ID：">
                <el-input v-model="dataForm.colorGroupId" ></el-input>
            </el-form-item>
            <el-form-item label="颜色组名称：">
                <el-input v-model="dataForm.colorGroup" ></el-input>
            </el-form-item>
            <el-form-item>
                <el-button  class="btn" type="primary" @click="getDataList()">查询</el-button>
                <el-button   class="btn" type="primary" plain @click="reset()">重置条件</el-button>
            </el-form-item>
        </el-form>
        <el-button @click="addOrEditHandle()"  class="btn" type="primary" style="float: right;">导入信息</el-button>
        <el-table width="100%" :data="dataList" border v-loading="dataListLoading" style="width: 100%;margin-top: 60px">
            <el-table-column prop="colorGroupId" label="颜色组ID" align="center"></el-table-column>
            <el-table-column prop="japanGroup" label="日本颜色组名称" align="center"></el-table-column>
            <el-table-column prop="colorGroup" label="颜色组名称" align="center"></el-table-column>
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
                breaddata: [ "商品管理", "颜色组"],
                dataForm: {
                    colorGroupId:"",//颜色组id
                    colorGroup: "",//颜色组名称
                },
                value: '',
                form: {
                    japanGroup: "",//日本颜色组名称
                    colorGroup: ""//颜色组名称
                },
                addEditDataVisible:false,
                formLabelWidth: '120px',
                dataListLoading: false,
                dataList: [],
            }
        },
        components: {
            Bread,
            addEditData
        },
        methods: {
            reset() {
                this.dataForm.colorsName = "";//颜色组名称
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