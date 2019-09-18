<template>
    <div>
        <Bread :breaddata="breaddata" :index = "'1'" @changePage = "changePage"></Bread>
        <table>
            <thead>
                <tr>
                    <th colspan="5" style="font-weight:400;background: #f5f7fa;padding-left:20px;text-align: left;">优惠券明细</th>
                </tr>
                <tr>
                    <th>活动名称</th>
                    <th>优惠券类型</th>
                    <th>使用门槛</th>
                    <th>面值</th>
                    <th>活动状态</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{{dataInfo.name}}</td>
                    <td>
                        <span v-if="dataInfo.type ==0">普通优惠券</span>
                        <span v-if="dataInfo.type ==1">新人专享券</span>
                        <span v-if="dataInfo.type ==2">积分兑换券</span>
                    </td>
                    <td>{{dataInfo.threshold}}</td>
                    <td>{{dataInfo.faceValue}}</td>
                    <td>
                        <span v-if="dataInfo.state ==0">未开始</span>
                        <span v-if="dataInfo.state ==1">进行中</span>
                        <span v-if="dataInfo.state ==2">已结束</span>
                    </td>
                </tr>
            </tbody>
            <thead>
                <tr>
                    <th>活动时间</th>
                    <th>总发行量</th>
                    <th>已领取</th>
                    <th>已使用</th>
                    <th>未使用</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{{dataInfo.getStartTime}} ~ {{dataInfo.getEndTime}}</td>
                    <td>{{dataInfo.totalNums}}</td>
                    <td>{{dataInfo.receivedNum}}</td>
                    <td>{{dataInfo.usedNum}}</td>
                    <td>{{dataInfo.unUsedNum}}</td>
                </tr>
                <tr>
                    <td style="font-weight: bold;padding: 24px 0;">备注</td>
                    <td colspan="4" style="text-align: left;padding: 24px 0;">{{dataInfo.bei}}</td>
                </tr>
            </tbody>
        </table>


        <el-form :inline="true" class="grayLine topGapPadding" :model="dataForm" @keyup.enter.native="getDataList()" >
            <el-form-item  label="活动状态：">
                <el-select v-model="dataForm.untitled" clearable  placeholder="请选择">
                    <el-option
                        v-for="item in activitesstates"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="订单编号：">
                <el-input v-model="dataForm.orderSn" placeholder="请输入订单编号" clearable></el-input>
            </el-form-item>

            <el-form-item>
                <el-button  class="btn" type="primary" @click="getDataList()">搜索</el-button>
                <el-button class="btn"  type="primary" plain @click="reset()" plain>重置</el-button>
            </el-form-item>
        </el-form>
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
                prop="memberId"
                label="会员账号"
                width="180">
            </el-table-column>
            <el-table-column
                prop="createDate"
                label="领取时间">
            </el-table-column>
            <el-table-column
                prop="untitled"
                label="当前状态">
                <template slot-scope="scope">
                    <span  v-if="scope.row.untitled==0">未使用</span>
                    <span  v-if="scope.row.untitled==3">已使用</span>
                    <span  v-if="scope.row.untitled==4">已过期</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="usedTime"
                label="使用时间"
                width="180">
            </el-table-column>
            <el-table-column
                prop="orderSn"
                label="订单编号">
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
    import { businessPageUrl, activityMemberCouponsPage } from '@/api/url'
    import { backScanActivity } from '@/api/api'
    import Bread from "@/components/bread";
    export default {
        mixins: [mixinViewModule],
        props: ['detailId'],
        components:{Bread},
        data () {
            return {
                mixinViewModuleOptions: {
                    getDataListURL: activityMemberCouponsPage,
                    activatedIsNeed: false,
                    getDataListIsPage: true,
                    exportURL: '/admin-api/store/export',
                    deleteURL: '/admin-api/store',
                    deleteIsBatch: true,
                    // deleteIsBatchKey: 'id'
                },
                dataListLoading:false,
                dataList:[],
                breaddata: ["营销管理", "优惠券","优惠券明细"],
                dataForm: {
                    untitled:'',
                    orderSn:'',
                },
                activitesstates: [{ id: '', name: "全部" },{ id: 0, name: "未使用" },{ id: 3, name: "已使用" },{ id: 4, name: "已过期" }],
                row:'',
                dataInfo:{},
            }
        },
        created(){
            console.log('详情id=======',this.detailId);
            this.getDataListURL
        },
        methods: {
            //返回
            init(row){
                this.row = row;
                console.log(row);
                this.mixinViewModuleOptions.getDataListURL = activityMemberCouponsPage+ row.id;
                this.dataForm.id = this.row.id;
                this.backScan();
                this.getDataList()
            },
            backScan(){
                var obj  = {
                    id:this.row.id,
                }
                backScanActivity(obj).then((res)=>{
                    if(res.code == 200){
                        this.dataInfo= res.data;
                    }else{
                        this.dataInfo = {};
                    }
                })

            },
            //返回
            changePage(){
                this.$emit('detailno')
            },
            reset(){
                this.dataForm = {
                    untitled:'',
                    orderSn:'',
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
