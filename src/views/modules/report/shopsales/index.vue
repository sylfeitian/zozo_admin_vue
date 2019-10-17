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
                <el-select v-model="dataForm.dimension" placeholder="请选择:">
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
                        v-model="timeArr"
                        type="daterange"
                        value-format="yyyy-MM-dd"
                        align="left"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                ></el-date-picker>
            </el-form-item>

            <el-form-item label="店铺名称：">
                <el-select
                v-model="dataForm.storeId"
                filterable
                placeholder="请选择店铺"
                :loading="loading"
                >
                <el-option
                    v-for="(item,index) in selectStoreOption"
                    :key="item.index"
                    :label="item.storeName"
                    :value="item.id"
                ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="品牌名称：">
                <el-select
                v-model="dataForm.brandId"
                filterable
                placeholder="请选择品牌"
                :loading="loading"
                >
                <el-option
                    v-for="(item,index) in selectBrandOption"
                    :key="item.id"
                    :label="item.brandName"
                    :value="item.id"
                ></el-option>
                </el-select>
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
            <el-table-column prop="statistics" label="日期" align="center"></el-table-column>
            <el-table-column prop="storeName" label="店铺名称" align="center"></el-table-column>
            <el-table-column prop="brandName" label="品牌名称" align="center"></el-table-column>
            <el-table-column prop="skuTotal" label="品牌商品总量(SKU)" align="center"></el-table-column>
            <el-table-column prop="saleTotal" label="销售数量" align="center"></el-table-column>
            <el-table-column prop="realPrice" label="销售金额" align="center"></el-table-column>
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
    import {statisticsStorePage} from "@/api/url"
    import mixinViewModule from '@/mixins/view-module'
    import Bread from "@/components/bread";
    import importAndExport from "@/components/import-and-export"
    import {searchStoreName,searchBrandName} from "@/api/api";
    import { statisticsStoreExport } from "@/api/io";
    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                  importAndExportOptions:{
                    // importUrl:colorImportExcel,//导入接口
                    // importWord:"导入信息",
                    exportUrl:statisticsStoreExport,//导出接口
                    exportWord:"导出",
                },
                mixinViewModuleOptions: {
                    getDataListURL: statisticsStorePage,
                    getDataListIsPage: true,
                    exportURL: "",
                    // deleteURL: deleteAttributeUrl,
                    deleteIsBatch: true,
                    deleteIsBatchKey: "id"
                },
                breaddata: [ "报表中心", "店铺销量统计"],
                operateShopStore:[
                    { id: "0", name: '明细' },
                    { id: "1", name: '汇总' }
                ],//统计维度
                timeArr: "", //搜索时间数据
                dataForm: {
                    statisticsStart:"",//统计开始时间
                    statisticsEnd:"",//统计结束时间
                    brandId:'',//品牌id
                    storeId:'',//店铺id
                    dimension:"0",//统计维度
                },
                dataList: [],
                loading:false,
                dataListLoading: false,
                selectStoreOption: [],
                selectBrandOption: []
            }
        },
        components: {
            Bread,
            importAndExport
        },
        // watch:{
        //     timeArr(val){
        //         if(!val){
        //             this.dataForm.statisticsStart = '';
        //             this.dataForm.statisticsEnd = '';
        //         }
        //     }
        // },
        created() {
            this.getStoreList();// 获取店铺下拉
            this.getBrandList();// 获取品牌下拉
        },
        methods: {
            getData() {
                if(this.timeArr && this.timeArr.length==2){
                    this.dataForm.statisticsStart =  this.timeArr[0];
                    this.dataForm.statisticsEnd = this.timeArr[1];
                }else{
                    this.dataForm.statisticsStart = ""
                    this.dataForm.statisticsEnd = ""
                }
                if(this.dataForm.dimension == "0"){//如果统计维度是明细的话
                }else{//如果统计维度是汇总的话，时间必填
                    if( this.timeArr==""  || this.timeArr.length!=2){
                        this.$message.warning("请选择时间再查询!");
                        return
                    }
                }
                 this.page =1;
                this.getDataList();
                
            },
            // 获取店铺下拉
            getStoreList(){
                searchStoreName().then(res => {
                    if (res.code == 200) {
                        this.selectStoreOption = res.data;
                    }
                });
            },
            // 获取品牌下拉
            getBrandList(){
                searchBrandName().then(res => {
                    if (res.code == 200) {
                        this.selectBrandOption = res.data;
                    }
                });
            },
            // 重置
            reset() {
                this.dataForm.statisticsStart = ""
                this.dataForm.statisticsEnd = ""
                this.timeArr = [];
                this.dataForm.brandId = ""
                this.dataForm.storeId = ""
                this.dataForm.dimension = "0"
                this.getDataList();
            },
        }
    }
</script>

<style scoped>

</style>