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
                <el-select v-model="dataForm.statisticsType" placeholder="请选择">
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
                        :default-time="['00:00:00', '23:59:59']"
                ></el-date-picker>
            </el-form-item>
            <el-form-item label="商品名称：">
                <el-input v-model.trim="dataForm.goodsName" placeholder="请输入商品名称" clearable maxlength="300"></el-input>
            </el-form-item>
            <el-form-item label="商品ID：">
                <el-input v-model.trim="dataForm.idJp" placeholder="请输入spuID" clearable maxlength="30" ></el-input>
            </el-form-item>
            
            <el-form-item label="店铺名称：">
                <el-select
                v-model="dataForm.storeId"
                filterable
                placeholder="请选择店铺"
                :loading="loadingStore"
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
                :loading="loadingBrand"
                >
                <el-option
                    v-for="(item,index) in selectBrandOption"
                    :key="item.id"
                    :label="item.brandName"
                    :value="item.id"
                ></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="分类：">
                <el-cascader
                :options="selectCategoryOption"
                v-model="classList"
                change-on-select
                :clearable="true"
                :props="props"
                @change="handleChange"
                ></el-cascader>
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
            <el-table-column prop="" label="日期" align="center">
                <template slot-scope="scope">
                    <span>{{scope.row.startTime}}</span>
                    <span v-if="scope.row.startTime && scope.row.endTime">~</span>
                    <span>{{scope.row.endTime }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="spuid" label="商品ID(SPU)" align="center"></el-table-column>
            <el-table-column prop="goodsName" label="商品名称" align="center"></el-table-column>
            <el-table-column prop="skuid" label="SKUID" align="center"></el-table-column>
            <el-table-column prop="" label="商品图片" align="center">
                <template slot-scope="scope">
                    <img
                        :src="scope.row.mainImageUrl | filterImgUrl"
                        alt=""
                        style=" object-fit: contain;width: 70px;height:70px;border-radius:100px;"
                    >
                </template>
            </el-table-column>
            <el-table-column prop="category" label="商品分类" align="center"></el-table-column>
            <el-table-column prop="brandName" label="品牌" align="center"></el-table-column>
            <el-table-column prop="storeName" label="所属店铺" align="center"></el-table-column>
            <el-table-column prop="sellNum" label="销售数量(件)" align="center"></el-table-column>
            <el-table-column prop="amount" label="销售金额" align="center"></el-table-column>
            <el-table-column prop="sellPrice" label="当前售价(元)" align="center"></el-table-column>
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
    import {statisticsGoodsPage} from "@/api/url"
     import {statisticsExport} from "@/api/io"
     import {searchStoreName,searchBrandName,backScanCategorys} from "@/api/api";
    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                importAndExportOptions:{
                    // importUrl:colorImportExcel,//导入接口
                    // importWord:"导入信息",
                    exportUrl:statisticsExport,//导出接口
                    exportWord:"导出",
                },
                mixinViewModuleOptions: {
                    getDataListURL: statisticsGoodsPage,
                    getDataListIsPage: true,
                    exportURL: "",
                    // deleteURL: deleteAttributeUrl,
                    deleteIsBatch: true,
                    deleteIsBatchKey: "id"
                },
                breaddata: [ "报表中心", "商品销量统计"],
                operateShopStore:[
                    { id: '0', name: '明细' },
                    { id: '1', name: '汇总' }
                ],//统计维度
                timeArr: "", //搜索时间数据
                dataForm: {
                    startTime:"",
                    endTime:"",
                    statisticsType:'0',//统计维度：0：明细，1：汇总
                    goodsName:"",//商品名称
                    idJp:"",//商品ID
                    storeId:"",//商品ID
                    brandId:"",//商品ID
                    goodsTypeId:"",//商品ID
                },
                dataList: [],
                dataListLoading: false,
                loadingStore:false,
                loadingBrand:false,
                props: {
                    label: "name",
                    value: "id",
                    children: "list"
                },
                classList: [],
                selectStoreOption: [],
                selectCategoryOption: [],
                selectBrandOption: []
            }
        },
        components: {
            Bread,
            importAndExport
        },
        watch:{
            // timeArr(val){
            //     if(!val){
            //         this.dataForm.startCreateDate = '';
            //         this.dataForm.endCreateDate = '';
            //     }
            // },
            // ID类搜索框仅可输入数字、英文，最多可输入30个字符
            'dataForm.id':function(newV,oldV) {
                for(let i=0;i<newV.length;i++){
                    if(!/[a-zA-Z0-9\s]/.test(newV[i])){
                        this.dataForm.id = newV.replace(newV[i],"")
                    }
                }
                if(newV.length>30){
                    this.dataForm.id = newV.substr(0,30)
                }
            }
        },
        created() {
            this.getStoreList();// 获取店铺下拉
            this.getBrandList();// 获取品牌下拉
            this.getCategorysList();//获取分类下拉
        },
        methods: {
            getData() {
                if(this.timeArr && this.timeArr.length==2){
                    this.dataForm.startTime = this.timeArr && this.timeArr[0];
                    this.dataForm.endTime = this.timeArr && this.timeArr[1];
                }else{
                    this.dataForm.startTime = "";
                    this.dataForm.endTime = "";
                }
                if(this.dataForm.statisticsType == "0"){//如果统计维度是明细的话
                }else{//如果统计维度是汇总的话，时间必填
                    if( this.timeArr==""  || this.timeArr.length!=2){
                        this.$message.warning("请选择时间再查询!");
                        return
                    }
                }
                this.page =1;
                this.getDataList();
            },
             handleChange() {
            if (this.classList.length != 0) {
                this.dataForm.goodsTypeId = this.classList[this.classList.length - 1];
            }
            console.log(this.dataForm.goodsTypeId);
            },
            // 获取店铺下拉
            getStoreList(){
                this.loadingStore = true;
                searchStoreName().then(res => {
                    this.loadingStore = false;
                    if (res.code == 200) {
                        this.selectStoreOption = res.data;
                    }
                });
            },
            // 获取品牌下拉
            getBrandList(){
                this.loadingBrand= true;
                searchBrandName().then(res => {
                     this.loadingBrand= false;
                    if (res.code == 200) {
                        this.selectBrandOption = res.data;
                    }
                });
            },
            // 获取分类下拉
            getCategorysList() {
                var obj = {
                    // id: this.dataForm.id,
                    // categoryName: this.dataForm.categoryName
                };
                backScanCategorys(obj).then(res => {
                    if (res.code == 200) {
                        this.selectCategoryOption = res.data ? res.data : [];
                        // console.log( this.selectCategoryOption);
                        this.selectCategoryOption.forEach((item, index) => {
                            item.list &&
                            item.list.forEach((item2, index2) => {
                                item2.list = "";
                            });
                        });
                        } else {
                    }
                });
            },
            // 重置
            reset() {
                this.timeArr = [];
                this.dataForm.startTime ="";
                this.dataForm.endTime ="";
                this.dataForm.statisticsType = "0";
                this.dataForm.goodsName = "";
                this.dataForm.idJp = ""
                this.dataForm.storeId = ""
                this.dataForm.brandId = ""
                this.dataForm.goodsTypeId = "";
                this.classList = [];
                this.page = 1;
                this.getDataList();
            },
        }
    }
</script>

<style scoped>

</style>