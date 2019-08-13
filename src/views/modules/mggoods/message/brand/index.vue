<template>
    <div>
        <Bread  :breaddata="breaddata"></Bread>
        <el-form :inline="true" class="grayLine topGapPadding" :model="dataForm" @keyup.enter.native="getDataList()" >
            <!-- <el-scrollbar style="height:90px;margin-right: 30px;"> -->
            <el-form-item label="品牌ID：">
                <el-input v-model="dataForm.id" ></el-input>
            </el-form-item>
            <el-form-item label="品牌名称：">
                <el-input v-model="dataForm.name" ></el-input>
            </el-form-item>
            <el-form-item>
                <el-button  class="btn" type="primary" @click="getDataList()">查询</el-button>
                <el-button  class="btn"type="primary" plain @click="reset()" >重置条件</el-button>
            </el-form-item>
        </el-form>
        <el-button  @click="uploadHandle()" class="btn" type="primary" style="float: right;margin-top: -64px;">导入信息</el-button>
        <el-table
                width="100%"
                :data="dataList"
                border
                v-loading="dataListLoading"
                @sort-change="dataListSortChangeHandle"
                @selection-change="dataListSelectionChangeHandle"
                style="width: 100%;">
            <el-table-column prop="id" label="品牌ID" align="center"></el-table-column>
            <el-table-column prop="japanName" label="日本品牌名称" align="center"></el-table-column>
            <el-table-column prop="name" label="品牌名称" align="center"></el-table-column>
            <el-table-column prop="japanDesc" label="日本品牌描述" align="center"></el-table-column>
            <el-table-column prop="desc" label="品牌描述" align="center"></el-table-column>
<!--            <el-table-column prop="state" label="是否可售" align="center"></el-table-column>-->
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
        <!-- 弹窗, 上传文件 -->
        <upload v-if="uploadVisible" ref="upload" @refreshDataList="getDataList"></upload>
    </div>
</template>

<script>
    import Upload from './import_model'
    import addEditData from './model-add-edit-data'
    //import importModal from './import_model'
    import mixinViewModule from '@/mixins/view-module'
    import Bread from "@/components/bread";
    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                breaddata: [ "商品管理", "品牌"],
                dataForm: {
                    japanName: "",//日本品牌名称
                    name: "",//品牌名称
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
                value: '',
                formLabelWidth: '120px',
                addEditDataVisible:false,
                dataList: [],
                dataListLoading: false,
                uploadVisible: false,
            }
        },
        components: {
            Bread,
            addEditData,
            Upload
        },
        methods: {
            // importExcel: function () {
            //     this.import_modal = true;
            //     //this.setimport_modal(true);
            // },
            // setimport_modal(boolargu){
            //     this.import_modal =  boolargu;
            // },
            reset() {
                this.dataForm.name = "";//品牌名称
                this.dataForm.state = "";//是否可售
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
            },
            // 上传文件
            uploadHandle () {
                this.uploadVisible = true
                this.$nextTick(() => {
                    this.$refs.upload.init()
                })
            }
        }
    }
</script>

<style scoped>
    .grayLine{
        border-bottom: 0!important;
    }
</style>