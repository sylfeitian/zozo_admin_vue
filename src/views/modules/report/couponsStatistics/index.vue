<template>
    <div>
        <Bread  :breaddata="breaddata"></Bread>
        <el-form
                :inline="true"
                class="grayLine topGapPadding"
                :model="dataForm"
                @keyup.enter.native="getDataList()"
        >
            <el-form-item label="有效期：">
                <el-date-picker
                        v-model="valuetime"
                        type="daterange"
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd"
                        @blur='acttime'>
                </el-date-picker>
            </el-form-item>
            <el-form-item  label="优惠券类型：">
                <el-select v-model="dataForm.type" placeholder="请选择">
                    <el-option
                            v-for="item in operateShopStore"
                            :key="item.type"
                            :label="item.name"
                            :value="item.type">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button class="btn" type="primary" @click="getData()">搜索</el-button>
                <el-button class="btn"type="primary" plain @click="reset()" >重置</el-button>
            </el-form-item>
            <el-form-item>
                <importAndExport :btType="'primary'" :downType="2" :importAndExportOptions="importAndExportOptions" :dataForm="dataForm"  @getDataList="getDataList"></importAndExport>
            </el-form-item>
        </el-form>
        <el-table
                width="100%"
                :data="dataList"
                border
                v-loading="dataListLoading"
                style="width: 100%;"
        >
            <el-table-column prop="validityTime" label="有效期" align="center"></el-table-column>
            <el-table-column prop="type" label="优惠券类型" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.type == 0" >普通优惠券</span>
                    <span v-if="scope.row.type == 1" >新会员优惠券</span>
                    <span v-if="scope.row.type == 2" >积分优惠券</span>
                </template>
            </el-table-column>
            <el-table-column prop="num" label="优惠券数量" align="center"></el-table-column>
            <el-table-column prop="price" label="优惠券金额（RMB）" align="center"></el-table-column>
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
    import importAndExport from "@/components/import-and-export"
    import Bread from "@/components/bread";
    import {couponStorePage} from "@/api/url"
    import {couponsExportRegisterUrl} from "@/api/io.js"
    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                mixinViewModuleOptions: {
                    getDataListURL: couponStorePage,
                    getDataListIsPage: true,
                    // exportURL: "",
                    // deleteURL: deleteAttributeUrl,
                    deleteIsBatch: true,
                    deleteIsBatchKey: "id"
                },
                importAndExportOptions:{
                    exportUrl:couponsExportRegisterUrl,//导出接口
                    exportWord:"导出数据",
                },
                breaddata: [ "报表中心", "优惠券统计"],
                operateShopStore:[{ type: '0', name: '普通优惠券' },{ type: '1', name: '新会员优惠券' },{ type: '2', name: '积分优惠券' }],//统计维度
                valuetime: "", //搜索时间数据
                dataForm: {
                    startTime:"",
                    endTime:"",
                    type:""
                },
                dataList: [],
                dataListLoading: false,
            }
        },
        components: {
            Bread,
            importAndExport
        },
        created () {
            this.getDataList();
        },
        methods: {
            acttime(){
                this.dataForm.startTime = this.valuetime[0] || '';
                this.dataForm.endTime = this.valuetime[1] || '';
            },
            getData() {
                this.page =1;
                this.getDataList();
            },
            // 重置
            reset() {
                this.valuetime = "";
                this.dataForm = {
                    startTime:"",
                    endTime:"",
                    type:""
                },
                this.getDataList();
            },
        }
    }
</script>

<style scoped>

</style>