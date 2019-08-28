<template>
    <div>
        <Bread :breaddata="breaddata" :index = "'1'" @changePage = "changePage"></Bread>
        <table>
            <thead>
                <tr>
                    <th>活动名称</th>
                    <th>满减规则</th>
                    <th>活动状态</th>
                    <th>活动时间</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>满100减10</td>
                    <td>满100减10</td>
                    <td>进行中</td>
                    <td>2017-07-31 13:00:00 至2017-08-19 13:00:00</td>
                </tr>
            </tbody>
        </table>

        <el-card shadow="never" style="margin-bottom:20px;">
            <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" >
                <el-form-item label="会员账号：" style="margin-bottom:0 !important;">
                    <el-input v-model="dataForm.storeId"  placeholder="请输入会员账号" clearable></el-input>
                </el-form-item>
                <el-form-item label="订单编号：" style="margin-bottom:0 !important;">
                    <el-input v-model="dataForm.storeId" placeholder="请输入订单编号" clearable></el-input>
                </el-form-item>
                <el-form-item style="margin-bottom:0 !important;float:right;">
                    <el-button  class="btn" type="primary" @click="getDataList()">查询</el-button>
                    <el-button class="btn"  type="primary" plain @click="reset()" plain>重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        
        <el-table
            :data="dataList"
            v-loading="dataListLoading"
            border
            style="width: 100%">
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
                label="会员账号"
                width="180">
            </el-table-column>
             <el-table-column
                prop="createDate"
                label="使用时间"
                width="180">
            </el-table-column>
            <el-table-column
                prop="creator"
                label="订单编号">
            </el-table-column>
            <el-table-column
                prop="account"
                label="订单总金额">
            </el-table-column>
            <el-table-column
                prop="gradeName"
                label="订单满减后价格">
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
    </div>
</template>

<script>
    import mixinViewModule from '@/mixins/view-module'
    import { businessPageUrl } from '@/api/url'
    import { storeGrade } from '@/api/api'
    import Bread from "@/components/bread";
    export default {
        mixins: [mixinViewModule],
        props: ['activityId'],
        components:{Bread},
        data () {
            return {
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
                breaddata: ["营销管理", "满减活动","满减活动详情"],
                dataForm: {
                    status:'',
                    storeId:'',
                },
                activitesstates: [{ id: '', name: "全部" },{ id: 1, name: "未开始" },{ id: 2, name: "进行中" },{ id: 3, name: "已结束" },{ id: 4, name: "待审核" }],

            }
        },
        created(){
            console.log('详情id=======',this.activityId) 
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
            }
        }
    };
</script>
<style lang="scss" scoped>
    table,table tr th, table tr td { border:1px solid #ebeef5; }
    table{
        width: 100%; 
        text-align: center; 
        border-collapse: collapse;
        margin-bottom: 20px;
        td,th{
            padding: 16px 0;
            min-width: 190px;
        }
    }
</style>
