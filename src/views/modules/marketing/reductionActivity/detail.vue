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
                    <td>{{dataInfo.title}}</td>
                    <td>满{{dataInfo.limitPrice}}减{{dataInfo.reducePrice}}</td>
                    <td>
                        <span v-if="dataInfo.state ==0">未开始</span>
                        <span v-else-if="dataInfo.state ==1">进行中</span>
                        <span v-else="dataInfo.state ==2">已结束</span>
                    </td>
                    <td>{{dataInfo.startTime}} 至 {{dataInfo.endTime}}</td>
                </tr>
            </tbody>
        </table>

        <el-card shadow="never" style="margin-bottom:20px;">
            <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" >
                <el-form-item label="会员账号：" style="margin-bottom:0 !important;">
                    <el-input v-model.trim="dataForm.memberName"  placeholder="请输入会员账号" clearable></el-input>
                </el-form-item>
                <el-form-item label="订单编号：" style="margin-bottom:0 !important;">
                    <el-input v-model.trim="dataForm.orderSn" placeholder="请输入订单编号" clearable></el-input>
                </el-form-item>
                <el-form-item style="margin-bottom:0 !important;float:right;">
                    <el-button  class="btn" type="primary" @click="getDataList()">搜索</el-button>
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
                prop="memberName"
                label="会员账号"
                 align="center"
                width="180">
            </el-table-column>
             <el-table-column
                prop="createDate"
                label="使用时间"
                 align="center"
                width="180">
            </el-table-column>
            <el-table-column
                prop="orderSn"
                 align="center"
                label="订单编号">
            </el-table-column>
            <el-table-column
                prop="goodsAmount"
                 align="center"
                label="订单总金额">
                 <template slot-scope="scope">
                   ￥{{scope.row.goodsAmount}}
                </template>
            </el-table-column>
            <el-table-column
             align="center"
                prop="orderAmount"
                label="订单满减后价格">
                 <template slot-scope="scope">
                    ￥{{scope.row.goodsAmount}}
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
    </div>
</template>

<script>
    import { activityReduceDetailById}  from '@/api/api.js'
    import mixinViewModule from '@/mixins/view-module'
    import { reduceOrderUrl } from '@/api/url'
    import { storeGrade } from '@/api/api'
    import Bread from "@/components/bread";
    export default {
        mixins: [mixinViewModule],
        components:{Bread},
        data () {
            return {
                mixinViewModuleOptions: {
                    getDataListURL: reduceOrderUrl,
                    activatedIsNeed:false,
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
                    reductionId:'',
                    memberName:'',
                    orderSn:'',
                },
                activitesstates: [{ id: '', name: "全部" },{ id: 1, name: "未开始" },{ id: 2, name: "进行中" },{ id: 3, name: "已结束" },{ id: 4, name: "待审核" }],
                row:'',
                dataInfo:{},
            }
        },
        created(){
            this.getDataListURL
        },
        methods: {
            //返回
            init(row){
                this.row = row;
                console.log(row); 
                this.mixinViewModuleOptions.getDataListURL = reduceOrderUrl+ row.id;
                this.dataForm.reductionId = this.row.id;
                this.backScan();
                this.getDataList()
            },
             backScan(){
                var obj  = {
                    id:this.row.id,
                }
                activityReduceDetailById(obj).then((res)=>{
                    if(res.code == 200){
                        this.dataInfo= res.data;
                    }else{
                        this.dataInfo = {};
                    }
                })
              
            },
            changePage(){
                this.$emit('showListFun')
            },
            reset(){
                this.dataForm.memberName = ""
                this.dataForm.memberName =""
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
