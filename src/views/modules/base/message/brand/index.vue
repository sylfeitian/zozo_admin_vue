<template>
    <div>
        <Bread  :breaddata="breaddata"></Bread>
        <el-form :inline="true" class="grayLine topGapPadding" :model="dataFormShow" @keyup.enter.native="getDataList()" >
            <!-- <el-scrollbar style="height:90px;margin-right: 30px;"> -->
            <el-form-item label="品牌ID：">
                <el-input v-model.trim="dataFormShow.idJp" maxlength="30" placeholder="请输入ID"></el-input>
            </el-form-item>
            <el-form-item label="品牌名称：">
                <el-input v-model.trim="dataFormShow.brandName" placeholder="请输入品牌名称"></el-input>
            </el-form-item>
            <el-form-item label="日本状态：">
                <el-select v-model="dataFormShow.processFlag" placeholder="请选择">
                    <el-option
                        v-for="item in processFlagOptions"
                        :key="item.id"
                        :label="item.label"
                        :value="item.id"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button  class="btn" type="primary" @click="getData">搜索</el-button>
                <el-button  class="btn" type="primary" plain @click="reset()" >重置</el-button>
            </el-form-item>
        </el-form>
        <!-- <el-button  @click="uploadHandle()" class="btn" type="primary">导入信息</el-button> -->
         <importAndExport :btType="'primary'" :importAndExportOptions="importAndExportOptions" :dataForm="dataForm" @getDataList="getDataList"></importAndExport>
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
            <el-table-column prop="processFlag" label="日本状态" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.processFlag == 0">正常</span>
                    <span v-if="scope.row.processFlag == 1">删除</span>
                </template>
            </el-table-column>
<!--            <el-table-column prop="state" label="是否可售" align="center"></el-table-column>-->
            <el-table-column label="操作" align="center" width="180">
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
        <!-- <upload v-if="uploadVisible" ref="upload" @refreshDataList="getDataList"></upload> -->
    </div>
</template>

<script>
    // import Upload from './import_model'
    import importAndExport from "@/components/import-and-export"
    import addEditData from './model-add-edit-data'
    //import importModal from './import_model'
    import mixinViewModule from '@/mixins/view-module'
    import Bread from "@/components/bread";
    import { shopBrandUrl,deleteShopBrandUrl } from '@/api/url'
    import { shopBrandImport} from '@/api/io'
    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                importAndExportOptions:{
                    importUrl:shopBrandImport,//导入接口
                    importWord:"导入信息",
                    // exportUrl:exportRegisterUrl,//导出接口
                    // exportWord:"导出数据",
                },
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
                dataForm:{

                },
                dataFormShow: {
                    idJp: "",
                    brandName: "",
                    processFlag: "all"
                },
                value: '',
                formLabelWidth: '120px',
                addEditDataVisible:false,
                dataListLoading: false,
                // uploadVisible: false,
                check: null,
                processFlagOptions: [
                    { id:"all",label:"全部"},
                    { id: "0", label: "正常" },
                    { id: "1", label: "删除" }
                ],
            }
        },
        components: {
            Bread,
            addEditData,
            // Upload,
            importAndExport
        },
        // ID类搜索框仅可输入数字、英文，最多可输入30个字符
        watch:{
            'dataFormShow.idJp':function(newV,oldV) {
                for(let i=0;i<newV.length;i++){
                    if(!/[a-zA-Z0-9\s]/.test(newV[i])){
                        this.dataFormShow.idJp = newV.replace(newV[i],"")
                    }
                }
                if(newV.length>30){
                    this.dataFormShow.idJp = newV.substr(0,30)
                }
            },
            'dataFormShow.brandName':function(newV,oldV) {
                var chineseCount = 0,characterCount = 0;
                for (let i = 0; i < newV.length; i++) {
                    if (/^[\u4e00-\u9fa5]*$/.test(newV[i])) { //汉字
                        chineseCount = chineseCount + 2;
                    } else { //字符
                        characterCount = characterCount + 1;
                    }
                    var count = chineseCount + characterCount;
                    if (count > 300) { //输入字符大于300的时候过滤
                        this.dataFormShow.brandName = newV.substr(0,(chineseCount/2+characterCount)-1)
                    }
                }
            },
        },
        created () {
            this.getDataList();
        },
        // watch:{
        //     check: function(){
        //         this.idJp = this.idJp.replace(/[^\a-\z\A-\Z0-9]/g, '');
        //     }
        // },
        methods: {
            getData(){
                this.dataForm = {};
                this.page = 1;
                for(let key in this.dataFormShow){
                    this.$set(this.dataForm,`${key}`,this.dataFormShow[key]);
                }
                console.log(this.dataForm);
                this.getDataList()
            },
            reset() {
                this.dataFormShow.idJp = "";
                this.dataFormShow.brandName = "";
                this.dataFormShow.processFlag = "";
                this.dataForm.idJp = "";
                this.dataForm.brandName = "";
                this.dataForm.processFlag = "";
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
            // uploadHandle () {
            //     this.uploadVisible = true;
            //     this.$nextTick(() => {
            //         this.$refs.upload.init()
            //     })
            // }
        }
    }
</script>

<style lang="scss" scoped>
    /deep/ .cell{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>