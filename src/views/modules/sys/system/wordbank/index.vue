<template>
    <div>
        <Bread :breaddata="breaddata"></Bread>
        <div class="mod-sys__user">
            <el-form :inline="true" :model="dataForm" class="grayLine" @keyup.enter.native="getDataList()">
                <el-form-item label="中文词汇：">
                    <el-input v-model="dataForm.chineseVocabulary" placeholder="请输入中文搜索" clearable></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button  class="btn" type="primary" @click="getDataList">查询</el-button>
                    <el-button  class="btn" type="primary" plain @click="reset()" >重置</el-button>
                </el-form-item>
            </el-form>
            <el-form :inline="true" :model="dataForm" class="grayLine" @keyup.enter.native="getDataList()">
                <el-form-item>
                    <el-button @click="addOrEditHandle()" type="primary">添加对照词</el-button>
                    <el-button @click="getData()" type="primary">导入</el-button>
                    <el-button @click="getData()">下载模板</el-button>
                </el-form-item>
            </el-form>
            <el-radio-group v-model="activeName" @change="handleClick">
                <el-radio-button label="">商品详情</el-radio-button>
                <el-radio-button label="two">材质</el-radio-button>
            </el-radio-group>
            <el-table
                    v-loading="dataListLoading"
                    :data="dataList"
                    border
                    @selection-change="dataListSelectionChangeHandle"
                    @sort-change="dataListSortChangeHandle"
                    style="width: 100%;margin-top: 10px;">
                <el-table-column
                        type="index"
                        prop="$index"
                        label="序号"
                        align="center"
                        width="70">
                    <template slot-scope="scope">
                        {{scope.$index+1+(parseInt(page)-1)* parseInt(limit) }}
                    </template>
                </el-table-column>
                <el-table-column prop="chineseVocabulary" label="中文词汇" header-align="center" align="center"></el-table-column>
                <el-table-column prop="japaneseWord" label="对照日文词汇" header-align="center" align="center"></el-table-column>
                <el-table-column prop="createDate" label="添加时间" header-align="center" align="center">
                </el-table-column>
                <el-table-column :label="$t('handle')" header-align="center" align="center">
                    <template slot-scope="scope" v-if="scope.row.superAdmin!==1">
                        <el-button type="text" size="small" @click.native.prevent="addOrEditHandle(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" class="artdanger" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    :current-page="page"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="limit"
                    :total="total"
                    layout="total, sizes, prev, pager, next, jumper"
                    @size-change="pageSizeChangeHandle"
                    @current-change="pageCurrentChangeHandle">
            </el-pagination>
            <!-- 弹窗, 新建 -->
            <addEditData  v-if="addEditDataVisible" ref="addEditData" @searchDataList="getDataList"></addEditData>
        </div>
    </div>
</template>

<script>
    import addEditData from './model-add-edit-data'
    import mixinViewModule from '@/mixins/view-module'
    import Bread from "@/components/bread";
    import { syslexiconUrl,deleteSyslexicon,exportSyslexicon } from '@/api/url'

    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                mixinViewModuleOptions: {
                    getDataListURL: syslexiconUrl,
                    getDataListIsPage: true,
                    deleteURL: deleteSyslexicon,
                    exportURL: exportSyslexicon,
                    deleteIsBatch: false,
                    deleteIsBatch: true,
                    deleteIsBatchKey: 'id'
                },
                breaddata: ["系统管理", "词库"],
                dataForm: {
                    chineseVocabulary:""
                },
                addEditDataVisible: false,
                changeVal: "",
                activeName: "",
            }
        },
        components: {
            addEditData,
            Bread
        },
        created() {
            this.handleClick();
            this.activeName =  this.status == undefined ? "" : this.status;
            this.dataForm.lexiconType = this.status == undefined ? "" : this.status;
            this.getDataList()
        },
        methods:{
            handleClick(tab,val) {
                if(tab== ""){
                    this.dataForm.lexiconType = "1"
                }else if(tab== "two"){
                    this.dataForm.lexiconType = "2"
                }
                this.changeVal = val;
                console.log(this.changeVal)
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
            reset(){
                this.dataForm.chineseVocabulary = "";
                this.getDataList();
            },
        }
    }
</script>
<style lang="scss" scoped>
    .grayLine{
        border-bottom: 0!important;
    }
</style>