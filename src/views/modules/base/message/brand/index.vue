<template>
    <div>
        <Bread  :breaddata="breaddata"></Bread>
        <el-form :inline="true" class="grayLine topGapPadding" :model="dataFormShow" @keyup.enter.native="getDataList()" >
            <!-- <el-scrollbar style="height:90px;margin-right: 30px;"> -->
            <el-form-item label="品牌ID：">
                <el-input v-model="dataFormShow.idJp" ></el-input>
            </el-form-item>
            <el-form-item label="品牌名称：">
                <el-input v-model="dataFormShow.brandName" ></el-input>
            </el-form-item>
            <el-form-item>
                <el-button  class="btn" type="primary" @click="getData">查询</el-button>
                <el-button  class="btn" type="primary" plain @click="reset()" >重置</el-button>
            </el-form-item>
        </el-form>
        <el-button  @click="uploadHandle()" class="btn" type="primary">导入信息</el-button>
        <el-table
                width="100%"
                :data="dataList"
                border
                v-loading="dataListLoading"
                @sort-change="dataListSortChangeHandle"
                @selection-change="dataListSelectionChangeHandle"
                style="width: 100%;margin-top: 10px;">
            <el-table-column prop="idJp" label="品牌ID" align="center"></el-table-column>
            <el-table-column prop="brandNameJp" label="日本品牌名称" align="center"></el-table-column>
            <el-table-column prop="brandNameGlo" label="全球名称" align="center"></el-table-column>
            <el-table-column prop="brandName" label="品牌名称" align="center"></el-table-column>
            <el-table-column prop="descriptionJp" label="日本品牌描述" align="center"></el-table-column>
            <el-table-column prop="description" label="品牌描述" align="center"></el-table-column>
<!--            <el-table-column prop="state" label="是否可售" align="center"></el-table-column>-->
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button @click.native.prevent="addOrEditHandle(scope.$index, scope.row)" type="text" size="mini">编辑</el-button>
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
    import { shopBrandUrl,deleteShopBrandUrl } from '@/api/url'
    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                mixinViewModuleOptions: {
                    getDataListURL: shopBrandUrl,
                    getDataListIsPage: true,
                    // exportURL: '/admin-api/log/login/export',
                    deleteURL: deleteShopBrandUrl,
                    deleteIsBatch: false,
                    deleteIsBatch: true,
                    deleteIsBatchKey: 'id'
                },
                breaddata: [ "商品管理", "品牌"],
                dataFormShow: {
                    idJp: "",
                    brandName: "",
                },
                value: '',
                formLabelWidth: '120px',
                addEditDataVisible:false,
                dataListLoading: false,
                uploadVisible: false,
            }
        },
        components: {
            Bread,
            addEditData,
            Upload
        },
        created () {
            this.getDataList();
        },
        methods: {
            getData(){
                this.dataForm = {};
                for(let key in this.dataFormShow){
                    this.$set(this.dataForm,`${key}`,this.dataFormShow[key]);
                }
                console.log(this.dataForm);
                this.getDataList()
            },
            reset() {
                this.dataFormShow.idJp = "";
                this.dataFormShow.brandName = "";
                this.dataForm.idJp = "";
                this.dataForm.brandName = "";
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
                this.uploadVisible = true;
                this.$nextTick(() => {
                    this.$refs.upload.init()
                })
            }
        }
    }
</script>

<style scoped>

</style>