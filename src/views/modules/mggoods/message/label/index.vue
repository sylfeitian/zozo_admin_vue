<template>
    <div>
        <Bread :breaddata="breaddata"></Bread>
        <el-form
            :inline="true"
            class="grayLine topGapPadding"
            :model="dataForm"
            @keyup.enter.native="getDataList()"
        >
            <!-- <el-scrollbar style="height:90px;margin-right: 30px;"> -->
            <el-form-item label="风格标签名称：">
                <el-input v-model="dataForm.styleName" placeholder="标签名称" ></el-input>
            </el-form-item>
            <el-form-item  label="风格标签分类：">
                <el-select v-model="dataForm.styleType" placeholder="请选择">
                    <el-option
                            v-for="item in options"
                            :key="item.id"
                            :label="item.label"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button class="btn" type="primary" @click="getDataList()">查询</el-button>
                <el-button class="btn"type="primary" plain @click="reset()" >重置条件</el-button>
            </el-form-item>
            <el-button @click="addOrEditHandle()" class="btn" type="primary" style="float: right;">新增标签</el-button>
        </el-form>
        <el-table
            width="100%"
            :data="dataList"
            border
            v-loading="dataListLoading"
            style="width: 100%"
        >
            <el-table-column label="序号" width="140" align="center">
                <template slot-scope="scope">
                    <span>{{scope.$index+1}}</span>
                    <!-- {{scope.$index+1+(parseInt(params.currentPage)-1)* parseInt(params.currentPageSize) }} -->
                </template>
            </el-table-column>
            <el-table-column prop="labelName" label="风格标签名称" align="center"></el-table-column>
            <el-table-column prop="styleType" label="风格标签类型" align="center"></el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button type="text" @click="addOrEditHandle(scope.$index, scope.row)" size="mini">编辑</el-button>
                    <el-button type="text" @click.native.prevent="addOrEditHandle" size="mini">管理副风格标签</el-button>
                    <el-button class="artdanger" @click.native.prevent="deleteHandle(scope.row.id)"type="text"size="mini">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="bottomFun">
            <div class="bottomFunLeft">
                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                <el-button class="btn" type="primary" @click="deleteHandle(scope.row.id)" style="margin-left: 20px;">批量删除</el-button>
            </div>
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
        </div>
        <!-- 弹窗, 新建 -->
        <addEditData  v-if="addEditDataVisible" ref="addEditData" @searchDataList="getDataList"></addEditData>
    </div>
</template>

<script>
    import mixinViewModule from '@/mixins/view-module'
    import Bread from "@/components/bread";
    import addEditData from './model-add-edit-data'
    import { shopStyleUrl, deleteShopStyle } from '@/api/url'
    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                mixinViewModuleOptions: {
                    getDataListURL: shopStyleUrl,
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
                dataForm: {
                    styleName: "",//标签名称
                    styleType: ""//标签分类
                },
                addEditDataVisible:false,
                isIndeterminate: false,
                checkAll: false,
            }
        },
        components: {
            Bread,
            addEditData
        },
        created () {
            this.dataForm.styleType = this.options[0].id;
            this.getDataList();
        },
        methods: {
            // 重置
            reset() {
                this.dataForm.styleName = "";//标签名称
                this.dataForm.styleType = "";//标签分类
                this.getDataList();
            },
            handleCheckAllChange(val) {
                this.checkednodeslist = val ? this.dataList : [];  //dataList  nodeslist
                this.isIndeterminate = false;
                console.log(this.checkednodeslist + '当前选中的复选框')
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
        }
    }
</script>

<style lang="scss" scoped>
    @import "@/element-ui/theme-variables.scss";
    .grayLine{
        border-bottom: 0!important;
    }
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
</style>