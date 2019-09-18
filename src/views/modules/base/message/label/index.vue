<template>
    <div>
        <Bread :breaddata="breaddata"></Bread>
        <el-form
            :inline="true"
            class="grayLine topGapPadding"
            :model="dataFormShow"
            @keyup.enter.native="getDataList()"
        >
            <!-- <el-scrollbar style="height:90px;margin-right: 30px;"> -->
            <el-form-item label="风格标签名称：">
                <el-input v-model="dataFormShow.styleName" placeholder="标签名称" ></el-input>
            </el-form-item>
            <el-form-item  label="风格标签分类：">
                <el-select v-model="dataFormShow.styleType" placeholder="请选择">
                    <el-option
                            v-for="item in options"
                            :key="item.id"
                            :label="item.label"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button class="btn" type="primary" @click="getData()">搜索</el-button>
                <el-button class="btn"type="primary" plain @click="reset()" >重置</el-button>
            </el-form-item>
        </el-form>
        <el-button @click="addOrEditHandle()" class="btn" type="primary">新增风格标签</el-button>
        <el-table
            width="100%"
            :data="dataList"
            border
            v-loading="dataListLoading"
            style="width: 100%;margin-top: 10px;"
        >
            <el-table-column label="序号" width="140" align="center">
                <template slot-scope="scope">
                    <span>{{scope.$index+1}}</span>
                    <!-- {{scope.$index+1+(parseInt(params.currentPage)-1)* parseInt(params.currentPageSize) }} -->
                </template>
            </el-table-column>
            <el-table-column prop="styleName" label="风格标签名称" align="center"></el-table-column>
            <el-table-column label="风格标签类型" align="center">
                <template slot-scope="scope">
                    <span  v-if="scope.row.styleType==0">主标签</span>
                    <span  v-else-if="scope.row.styleType==1">副标签</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="300">
                <template slot-scope="scope">
                    <el-button type="text" @click="addOrEditHandle(scope.$index, scope.row)" size="mini">编辑</el-button>
                    <el-button v-if="scope.row.styleType==0" type="text" @click="showHandle(scope.$index, scope.row)" size="mini">管理副风格标签</el-button>
                    <el-button v-if="scope.row.styleType==1" type="text" @click="showHandleMain(scope.$index, scope.row)" size="mini">管理主风格标签</el-button>
                    <el-button class="artdanger" @click.native.prevent="deleteHandle(scope.row.id)"type="text"size="mini">删除</el-button>
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
        <!-- 弹窗, 副标签 -->
        <subData  v-if="subDataVisible" ref="subDataCompon" @searchDataList="getDataList"></subData>
        <!-- 弹窗, 主标签 -->
        <mainData  v-if="mainDataVisible" ref="mainDataCompon" @searchDataList="getDataList"></mainData>
    </div>
</template>

<script>
    import mixinViewModule from '@/mixins/view-module'
    import Bread from "@/components/bread";
    import addEditData from './model-add-edit-data'
    import subData from './model-sub-label'
    import mainData from './model-main-label'
    import { shopStyleUrl, deleteShopStyle } from '@/api/url'
    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                mixinViewModuleOptions: {
                    getDataListURL: shopStyleUrl,
                    activatedIsNeed: false,
                    getDataListIsPage: true,
                    // exportURL: '/admin-api/log/login/export',
                    deleteURL: deleteShopStyle,
                    deleteIsBatch: false,
                    deleteIsBatch: true,
                    deleteIsBatchKey: 'id'
                },
                breaddata: [ "基础资料管理", "风格标签管理"],
                options: [{
                    id: '0',
                    label: '主标签'
                }, {
                    id: '1',
                    label: '副标签'
                }],
                dataList: [],
                dataListLoading: false,
                dataFormShow: {
                    styleName: "",//标签名称
                    styleType: ""//标签分类
                },
                addEditDataVisible:false,
                subDataVisible:false,
                mainDataVisible:false,
                isIndeterminate: false,
                checkAll: false,
            }
        },
        components: {
            Bread,
            subData,
            addEditData,
            mainData
        },
        created () {
            this.dataFormShow.styleType = this.options && this.options[0].id;
            this.dataForm.styleType = this.options && this.options[0].id;
            this.getDataList();
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
            // 重置
            reset() {
                this.dataFormShow.styleName = "";//标签名称
                this.dataFormShow.styleType = this.options[0].id;//标签分类
                this.dataForm.styleName = "";//标签名称
                this.dataForm.styleType = this.options[0].id;//标签分类
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
            showHandle(index=-1,row=""){
                this.setSubDataVisible(true);
                this.$nextTick(() => {
                    this.$refs.subDataCompon.init(row)
                })
            },
            setSubDataVisible(boolargu){
                this.subDataVisible =  boolargu;
            },
            showHandleMain(index=-1,row=""){
                this.setMainDataVisible(true);
                this.$nextTick(() => {
                    this.$refs.mainDataCompon.init(row)
                })
            },
            setMainDataVisible(boolargu){
                this.mainDataVisible =  boolargu;
            },
        }
    }
</script>

<style lang="scss" scoped>
    .bottomFun {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .bottomFunLeft {
            width: 450px;
            display: flex;
            align-items: center;
        }
    }
    /deep/ .cell {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>