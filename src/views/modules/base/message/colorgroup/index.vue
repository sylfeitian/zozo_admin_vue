<template>
    <div>
        <Bread  :breaddata="breaddata"></Bread>
        <el-form :inline="true" class="grayLine topGapPadding" :model="dataFormShow" @keyup.enter.native="getDataList()" >
            <el-form-item label="颜色组ID：">
                <el-input v-model="dataFormShow.idJp" maxlength="30" ></el-input>
            </el-form-item>
            <el-form-item label="颜色组名称：">
                <el-input v-model="dataFormShow.name" ></el-input>
            </el-form-item>
            <el-form-item>
                <el-button  class="btn" type="primary" @click="getData()">搜索</el-button>
                <el-button   class="btn" type="primary" plain @click="reset()">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- <el-button @click="addOrEditHandle()"  class="btn" type="primary">导入信息</el-button> -->
         <importAndExport :importAndExportOptions="importAndExportOptions" :dataForm="dataForm"></importAndExport>
        <el-table width="100%" :data="dataList" border v-loading="dataListLoading" style="width: 100%;margin-top: 10px">
            <el-table-column prop="idJp" label="颜色组ID" align="center"></el-table-column>
            <el-table-column prop="nameJp" label="日本颜色组名称" align="center"></el-table-column>
            <el-table-column prop="name" label="颜色组名称" align="center"></el-table-column>
            <el-table-column label="操作" align="center" width="180">
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
    import { colorcategoryUrl } from '@/api/url'
    import importAndExport from "@/components/import-and-export"
    import { colorcategoryImportExcel} from '@/api/io'
    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                 importAndExportOptions:{
                    importUrl:colorcategoryImportExcel,//导入接口
                    importWord:"导入信息",
                    // exportUrl:exportRegisterUrl,//导出接口
                    // exportWord:"导出数据",
                },
                mixinViewModuleOptions: {
                    getDataListURL: colorcategoryUrl,
                    getDataListIsPage: true,
                    // exportURL: '/admin-api/log/login/export',
                    // deleteURL: deleteShopStyle,
                    deleteIsBatch: false,
                    deleteIsBatch: true,
                    deleteIsBatchKey: 'id'
                },
                breaddata: [ "商品管理", "颜色组"],
                dataForm:{

                },
                dataFormShow: {
                    idJp: null,//颜色组id
                    name: null,//颜色组名称
                },
                value: '',
                addEditDataVisible:false,
                formLabelWidth: '120px',
                dataListLoading: false,
                dataList: [],
            }
        },
        components: {
            Bread,
            addEditData,
            importAndExport
        },
        // ID类搜索框仅可输入数字、英文，最多可输入30个字符
        watch:{
            'dataFormShow.idJp':function(newV,oldV) {
                for(let i=0;i<newV.length;i++){
                    if(!/[a-zA-Z0-9]/.test(newV[i])){
                        this.dataFormShow.idJp = newV.replace(newV[i],"")
                    }
                }
                if(newV.length>30){
                    this.dataFormShow.idJp = newV.substr(0,30)
                }
            }
        },
        methods: {
            getData(){
                this.page =1;
                this.dataForm = {};
                for(let key in this.dataFormShow){
                    this.$set(this.dataForm,`${key}`,this.dataFormShow[key]);
                }
                console.log(this.dataForm);
                this.getDataList()
            },
            reset() {
                this.dataFormShow.idJp = null;
                this.dataFormShow.name = null;
                this.dataForm.idJp = null;
                this.dataForm.name = null;
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

<style lang="scss" scoped>
    /deep/ .cell {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>