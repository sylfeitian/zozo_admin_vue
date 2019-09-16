<template>
    <div>
        <Bread :breaddata="breaddata" :index = "'1'" @changePage = "changePage"></Bread>
        <el-form
                :inline="true"
                class="grayLine topGapPadding"
                :model="dataForm"
                @keyup.enter.native="getDataList()"
        >
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
                    <td>{{dataForm.name}}</td>
                    <td>{{dataForm.type}}</td>
                    <td>{{dataForm.threshold}}</td>
                    <td>{{dataForm.faceValue}}</td>
                    <td>{{dataForm.state}}</td>
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
                    <td>2019-06-06 18:23:01 ~ 2019-06-28 12:21:21</td>
                    <td>10000</td>
                    <td>1821</td>
                    <td>1221</td>
                    <td>777</td>
                </tr>
                <tr>
                    <td style="font-weight: bold;padding: 24px 0;">备注</td>
                    <td colspan="4" style="text-align: left;padding: 24px 0;">该优惠券属于叠加优惠券，和满减某某活动可同时使用，请注意</td>
                </tr>
            </tbody>
        </table>
        </el-form>


        <el-form :inline="true" class="grayLine topGapPadding" :model="dataForm" @keyup.enter.native="getDataList()" >
            <el-form-item  label="活动状态：">
                <el-select v-model="dataForm.status" clearable  placeholder="请选择">
                    <el-option
                        v-for="item in activitesstates"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="订单编号：">
                <el-input v-model="dataForm.storeId" placeholder="请输入订单编号" clearable></el-input>
            </el-form-item>

            <el-form-item>
                <el-button  class="btn" type="primary" @click="getDataList()">查询</el-button>
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
                prop="id"
                label="会员账号"
                width="180">
            </el-table-column>
            <el-table-column
                prop="account"
                label="领取时间">
            </el-table-column>
            <el-table-column
                prop="gradeName"
                label="当前状态">
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
        props: ['detailId'],
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
                breaddata: ["营销管理", "优惠券","优惠券明细"],
                dataForm: {
                    status:'',
                    storeId:'',
                },
                activitesstates: [{ id: '', name: "全部" },{ id: 1, name: "未开始" },{ id: 2, name: "进行中" },{ id: 3, name: "已结束" },{ id: 4, name: "待审核" }],

            }
        },
        created(){
            console.log('详情id=======',this.detailId)
        },
        methods: {
            //返回
            changePage(){
                this.$emit('detailno')
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
