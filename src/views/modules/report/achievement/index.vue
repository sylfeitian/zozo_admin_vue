<template>
    <div>
        <Bread  :breaddata="breaddata"></Bread>
        <el-form
                :inline="true"
                class="grayLine topGapPadding"
                :model="dataForm"
                @keyup.enter.native="getDataList()"
        >
            <el-form-item  label="统计维度：">
                <el-select v-model="dataForm.dimension" placeholder="请选择">
                    <el-option
                            v-for="item in operateShopStore"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="时间：">
                <el-date-picker
                        v-model="dataForm.startTime"
                        :type="dataForm.dimension=='month'? 'month' : dataForm.dimension=='year' ? 'year' : 'date'"
                        :value-format="dataForm.dimension=='month' ? 'yyyy-MM':dataForm.dimension=='year' ? 'yyyy':'yyyy-MM-dd'"
                        placeholder="开始日期"
                        >
                </el-date-picker>
                <span style="margin: 0px 5px;">~</span>
                <el-date-picker
                        v-model="dataForm.endTime"
                        :type="dataForm.dimension=='month'? 'month' : dataForm.dimension=='year' ? 'year' : 'date'"
                        :value-format="dataForm.dimension=='month' ? 'yyyy-MM':dataForm.dimension=='year' ? 'yyyy':'yyyy-MM-dd'"
                        placeholder="结束日期"
                        >
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button class="btn" type="primary" @click="getData()">搜索</el-button>
                <el-button class="btn"type="primary" plain @click="reset()" >重置</el-button>
            </el-form-item>
        </el-form>
        <el-form>
            <el-form-item>
                <!-- <el-button @click="" class="btn" type="primary">导出</el-button> -->
                <importAndExport :importAndExportOptions="importAndExportOptions" :dataForm="dataForm"  @getDataList="getDataList"></importAndExport>
            </el-form-item>
        </el-form>
        <el-table
                width="100%"
                :data="dataList"
                border
                v-loading="dataListLoading"
                style="width: 100%;"
        >
            <el-table-column prop="statisticsTime" label="日期" align="center"></el-table-column>
            <el-table-column prop="orderNum" label="订单数量" align="center"></el-table-column>
            <el-table-column prop="goodsNum" label="商品数量" align="center"></el-table-column>
            <el-table-column prop="goodsAmount" label="订单金额" align="center"></el-table-column>
            <el-table-column prop="orderAmount" label="订单支付金额" align="center"></el-table-column>
            <el-table-column prop="dicountAmount" label="订单折扣金额" align="center"></el-table-column>
            <el-table-column prop="couponAmount" label="优惠券金额" align="center"></el-table-column>
            <el-table-column prop="reduceAmount" label="满减优惠金额" align="center"></el-table-column>
            <el-table-column prop="cancelOrderNum" label="已取消订单数" align="center"></el-table-column>
            <el-table-column prop="cancelOrderAmount" label="已取消订单金额" align="center"></el-table-column>
            <el-table-column prop="aftersaleNum" label="退单数量" align="center"></el-table-column>
            <el-table-column prop="aftersaleAmount" label="退单金额" align="center"></el-table-column>
            <el-table-column prop="customerAmount" label="客单价" align="center"></el-table-column>
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
    import Bread from "@/components/bread";
    import importAndExport from "@/components/import-and-export"
    import {statisticsPerformancePage} from "@/api/url"
    import {statisticsPerformanceExport} from "@/api/io"
    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                 importAndExportOptions:{
                    // importUrl:colorImportExcel,//导入接口
                    // importWord:"导入信息",
                    exportUrl:statisticsPerformanceExport,//导出接口
                    exportWord:"导出",
                },
                mixinViewModuleOptions: {
                    getDataListURL: statisticsPerformancePage,
                    getDataListIsPage: true,
                    exportURL: "",
                    // deleteURL: deleteAttributeUrl,
                    deleteIsBatch: true,
                    deleteIsBatchKey: "id"
                },
                breaddata: [ "报表中心", "业绩统计"],
                operateShopStore:[
                    { id: 'day', name: '按天' },
                    { id: 'month', name: '按月' },
                    { id: 'year', name: '按年' },
                    { id: 'summary', name: '汇总' }
                ],//统计维度
                // timeArr:[], //搜索时间数据
                dataForm: {
                    startTime:"",
                    endTime:"",
                    dimension:"day",// 维度 day天 month月 year年 summary汇总
                },
                dataList: [],
                dataListLoading: false,
            }
        },
        components: {
            Bread,
            importAndExport
        },
        watch:{
            'dataForm.dimension':function(newV,oldV){
                this.dataForm.startTime=""
                this.dataForm.endTime=""
            }
        },
        methods: {
            getData() {
                // summary
                if(this.dataForm.dimension=="summary" && this.dataForm.startTime=="" &&  this.dataForm.endTime==""){
                   this.$message.warning("请选择时间");
                   return;
                }
                this.page =1;
                this.getDataList();
            },
            // 重置
            reset() {
                this.dataForm.startTime="";
                this.dataForm.endTime="";
                this.dataForm.dimension="day"
                this.getDataList();
            },
        }
    }
</script>

<style scoped>

</style>