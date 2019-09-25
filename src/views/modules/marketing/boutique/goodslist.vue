<template>
    <div>
        <Bread :breaddata="breaddata" :index = "'1'" @changePage = "changePage"></Bread>
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" >
            <el-form-item label="商品货号：">
                <el-input v-model="dataForm.storeId"  placeholder="请输入商品货号" clearable></el-input>
            </el-form-item>
            <el-form-item label="商品名称：">
                <el-input v-model="dataForm.storeId" placeholder="请输入商品名称" clearable maxlength="300"></el-input>
            </el-form-item>
            <el-form-item >
                <el-button  class="btn" type="primary" @click="getDataList()">搜索</el-button>
                <el-button class="btn"  type="primary" plain @click="reset()" plain>重置</el-button>
            </el-form-item>
            <el-form-item style="float:right">
                <el-button type="primary">批量删除</el-button>
                <el-button type="primary">保存排序</el-button>
                <el-button type="primary" @click="activiVisible = true">添加商品</el-button>
            </el-form-item>
        </el-form>
        
        <el-table
           :data="dataList"
            v-loading="dataListLoading"
            @selection-change="dataListSelectionChangeHandle"
            border
            style="width: 100%">
            <el-table-column 
                type="selection" 
                header-align="center" 
                align="center" 
                width="50">
            </el-table-column>
            <!-- <el-table-column
                type="index"
                prop="$index"
                align="center"
                label="序号"
                width="70">
                <template slot-scope="scope">
                    {{scope.$index+1+(parseInt(page)-1)* parseInt(limit) }}
                </template>
            </el-table-column> -->
            <el-table-column
                prop="id"
                label="商品ID"
                width="180">
            </el-table-column>
             <el-table-column
                prop="createDate"
                label="排序"
                width="180">
            </el-table-column>
            <el-table-column
                prop="creator"
                label="商品名称"
                min-width="300">
            </el-table-column>
            <el-table-column
                prop="account"
                label="所属分类">
            </el-table-column>
            <el-table-column
                prop="gradeName"
                label="销售价格">
            </el-table-column>
            <el-table-column
                prop="address"
                label="操作">
                <template slot-scope="scope">
                    <el-button class="artdanger" type="text" size="small">删除</el-button>
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


        <!-- 新增编辑分类弹框 -->
        <el-dialog
            title="添加商品"
            :visible.sync="activiVisible"
            class="activiDialog"
            width="70%">
            <el-form :inline="true" :model="listdataForm">
                <el-form-item label="商品货号/商品货号：">
                    <el-input v-model="listdataForm.storeId"  placeholder="请输入商品货号" clearable></el-input>
                </el-form-item>
                <el-form-item label="选择分类：">
                    <el-input v-model="listdataForm.storeId" placeholder="请输入" clearable></el-input>
                </el-form-item>
                <el-form-item >
                    <el-button  class="btn" type="primary">搜索</el-button>
                    <el-button class="btn"  type="primary" plain>重置</el-button>
                    <el-button class="btn"  type="primary">选择全部</el-button>
                </el-form-item>
            </el-form>
            <el-table
                :data="dataList"
                v-loading="dataListLoading"
                border
                style="width: 100%">
                <el-table-column
                    prop="creator"
                    label="商品名称"
                    min-width="300">
                </el-table-column>
                <el-table-column
                    prop="account"
                    label="商品ID">
                </el-table-column>
                <el-table-column
                    prop="gradeName"
                    label="所属分类">
                </el-table-column>
                <el-table-column
                    prop="gradeName"
                    label="价格">
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="操作">
                    <template slot-scope="scope">
                        <el-checkbox @change="changeCheck($event,scope.row.id)"></el-checkbox>
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
        </el-dialog>
    </div>
</template>

<script>
    import mixinViewModule from '@/mixins/view-module'
    import { businessPageUrl } from '@/api/url'
    import { storeGrade } from '@/api/api'
    import Bread from "@/components/bread";
    export default {
        mixins: [mixinViewModule],
        props: ['classId'],
        components:{Bread},
        data () {
            return {
                dds:'12121212',
                mixinViewModuleOptions: {
                    getDataListURL: businessPageUrl,
                    getDataListIsPage: true,
                    exportURL: '/admin-api/store/export',
                    deleteURL: '/admin-api/store',
                    deleteIsBatch: true,
                    // deleteIsBatchKey: 'id'
                },
                dataListLoading:false,
                dataList:[],
                breaddata: ["营销管理", "精选分类","添加商品"],
                dataForm: {
                    status:'',
                    storeId:'',
                },
                activiVisible:false,
                listdataForm:{
                    storeId:'',
                }
            }
        },
        created(){
            console.log('详情id=======',this.classId) 
        },
        methods: {
            //返回
            changePage(){
                this.$emit('showListFun')
            },
            reset(){
                this.dataForm = {
                    status:'',
                    storeId:'',
                }
                this.getDataList();
            },
            changeCheck($event,id){
                // $event当前状态值选中为true,未选中为false，id：为你要操作的分类id
                console.log('??????',$event,id)
            }
        }
    };
</script>
<style lang="scss" scoped>
    
</style>
