<template>
    <div>
        <Bread :breaddata="breaddata" @changePage="changePage" :index="'1'"></Bread>
        <div>
            <el-form :inline="true" :model="dataForm" class="grayLine" @keyup.enter.native="getDataList()">
                <el-form-item label="商品名称：">
                    <el-input v-model.trim="dataForm.goodsName" placeholder="请输入商品名称"></el-input>
                </el-form-item>
                <el-form-item label="商品ID：">
                    <el-input v-model.trim="dataForm.idJp" placeholder="请输入spuID"></el-input>
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
                <el-form-item label="店铺名称：">
                    <el-select
                    v-model="dataForm.storeId"
                    filterable
                    clearable
                    placeholder="请输入店铺名称"
                    @change="changeStore"
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
                    clearable
                    placeholder="请输入品牌名称"
                    @change="changeBrand"
                    >
                    <el-option
                        v-for="(item,index) in selectBrandOption"
                        :key="item.id"
                        :label="item.brandName"
                        :value="item.id"
                    ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="上架状态：">
                    <el-select v-model="dataForm.showWeb" placeholder="请选择">
                    <el-option
                        v-for="item in showOptions"
                        :key="item.id"
                        :label="item.label"
                        :value="item.id"
                    ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="可售状态：">
                    <el-select v-model="dataForm.sellState" placeholder="请选择">
                    <el-option
                        v-for="item in stateOptions"
                        :key="item.id"
                        :label="item.label"
                        :value="item.id"
                    ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button  class="btn" type="primary" @click="getDataList">搜索</el-button>
                    <el-button  class="btn" type="primary" plain @click="reset()" >重置</el-button>
                </el-form-item>
            </el-form>
            <el-form>
            <el-form-item>
                    <!-- <el-button @click="" class="btn" type="primary">导出</el-button> -->
                    <importAndExport :btType="'primary'" :downType="2" :importAndExportOptions="importAndExportOptions" :dataForm="dataForm"  @getDataList="getDataList"></importAndExport>
                </el-form-item>
            </el-form>
            <el-table
                    v-loading="dataListLoading"
                    :data="dataList"
                    border
                    style="width: 100%;margin-top: 10px;">
                <el-table-column
                        type="index"
                        prop="$index"
                        label="序号"
                        align="center"
                        width="70">
                    <template slot-scope="scope">
                        {{scope.$index+1+(parseInt(page)-1)* parseInt(limit) }}
                    </template>
                </el-table-column>
                <el-table-column label="商品ID" align="center" width="180">
                    <template slot-scope="scope">
                        <div>
                            {{scope.row.spuIdJp}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="goodsName" label="商品名称" align="center">
                    <template slot-scope="scope">
                    <div :title="scope.row.goodsName">{{scope.row.goodsName}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="storeName" label="所属店铺" align="center">
                    <template slot-scope="scope">
                    <div>{{scope.row.storeName}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="brandName" label="所属品牌" align="center">
                    <template slot-scope="scope">
                    <div>{{scope.row.brandName}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="sellPrice" label="标准价" align="center">
                    <template slot-scope="scope">
                        <div>￥{{scope.row.sellPrice?scope.row.sellPrice:'0.00'}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="discountPrice" label="促销价" align="center">
                    <template slot-scope="scope">
                        <div>￥{{scope.row.discountPrice?scope.row.discountPrice:'0.00'}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="上架状态" align="center" min-width="100">
                    <template slot-scope="scope">
                    <el-tag v-if="scope.row.showWeb==0" type="info">待上架</el-tag>
                    <el-tag v-if="scope.row.showWeb==1" type="success">已上架</el-tag>
                    <el-tag v-if="scope.row.showWeb==2" type="warning">已下架</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="可售状态" align="center">
                    <template slot-scope="scope">
                    <div>
                        <span v-if="scope.row.sellState == 1">可售</span>
                        <span v-if="scope.row.sellState == 0">不可售</span>
                    </div>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    :current-page="page"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="limit"
                    :total="total"
                    layout="total, sizes, prev, pager, next, jumper"
                    @size-change="pageSizeChangeHandle"
                    @current-change="pageCurrentChangeHandle">
            </el-pagination>
            <!-- 弹窗, 新建 -->
        </div>
    </div>
</template>

<script>
    import mixinViewModule from '@/mixins/view-module'
    import Bread from "@/components/bread";
    import { getseckillJpGoods } from '@/api/url'
    import importAndExport from "@/components/import-and-export"
    import { limitedtimeExport } from "@/api/io";
    import { searchStoreName, searchBrandName, backScanCategorys } from "@/api/api";

    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                importAndExportOptions:{
                    // importUrl:colorImportExcel,//导入接口
                    // importWord:"导入信息",
                    exportUrl:limitedtimeExport,//导出接口
                    exportWord:"导出",
                },
                mixinViewModuleOptions: {
                    activatedIsNeed: true,
                    getDataListURL: getseckillJpGoods,
                    getDataListIsPage: true,
                    deleteURL: "",
                    deleteIsBatch: true,
                    deleteIsBatchKey: 'id'
                },
                classList: [],
                props: {
                    label: "name",
                    value: "id",
                    children: "list"
                },
                breaddata: ["营销管理", "限时折扣", "查看商品"],
                dataForm: {
                    goodsName: "", //商品名称/商品货号
                    idJp: "", //id
                    categoryId: "", //分类
                    storeName: "", //店铺名称
                    brandName: "", //品牌名称
                    sellState: "", //是否可售
                    showWeb: "", //上下架状态:0：待上架，1：已上架，2：下架 ,
                },
                showOptions: [
                    {id:"",label:"全部"},
                    { id: "0", label: "待上架" },
                    { id: "1", label: "已上架" },
                    { id: "2", label: "已下架" }
                ],
                stateOptions: [{id:"",label:"全部"},{ id: "0", label: "不可售" }, { id: "1", label: "可售" }],
                dataListLoading: false,
                selectStoreOption: [],
                selectCategoryOption: [],
                selectBrandOption: [],
                row:""
            }
        },
        components: {
            Bread,
            importAndExport
        },
        watch: {
            // ID类搜索框仅可输入数字、英文，最多可输入30个字符
            "dataForm.idJp": function(newV, oldV) {
                for (let i = 0; i < newV.length; i++) {
                    if (!/[a-zA-Z0-9\s]/.test(newV[i])) {
                    this.dataForm.idJp = newV.replace(newV[i], "");
                    }
                }
                if(newV.length>30){
                    this.dataForm.idJp = newV.substr(0,30)
                }
            },
            'dataForm.goodsName':function(newV,oldV) {
                var chineseCount = 0,characterCount = 0;
                for (let i = 0; i < newV.length; i++) {
                    if (/^[\u4e00-\u9fa5]*$/.test(newV[i])) { //汉字
                    chineseCount = chineseCount + 2;
                    } else { //字符
                    characterCount = characterCount + 1;
                    }
                    var count = chineseCount + characterCount;
                    if (count > 300) { //输入字符大于300的时候过滤
                    this.dataForm.goodsName = newV.substr(0,(chineseCount/2+characterCount)-1)
                    }
                }
            },
            'dataForm.brandId':function(newV,oldV) {
                var chineseCount = 0,characterCount = 0;
                for (let i = 0; i < newV.length; i++) {
                    if (/^[\u4e00-\u9fa5]*$/.test(newV[i])) { //汉字
                        chineseCount = chineseCount + 2;
                    } else { //字符
                        characterCount = characterCount + 1;
                    }
                    var count = chineseCount + characterCount;
                    if (count > 300) { //输入字符大于300的时候过滤
                        this.dataForm.brandId = newV.substr(0,(chineseCount/2+characterCount)-1)
                    }
                }
            },
            'dataForm.storeId':function(newV,oldV) {
                var chineseCount = 0,characterCount = 0;
                for (let i = 0; i < newV.length; i++) {
                    if (/^[\u4e00-\u9fa5]*$/.test(newV[i])) { //汉字
                        chineseCount = chineseCount + 2;
                    } else { //字符
                        characterCount = characterCount + 1;
                    }
                    var count = chineseCount + characterCount;
                    if (count > 300) { //输入字符大于300的时候过滤
                        this.dataForm.storeId = newV.substr(0,(chineseCount/2+characterCount)-1)
                    }
                }
            }
        },
        created() {
            this.backScan();
            this.backScan1();
            this.backScan2();
        },
        methods: {
            init (row){
                this.row = row;
                this.dataForm.seckillId = row.id;
                this.getDataList()
            },
            //下拉改变时触发
            handleChange() {
                if (this.classList.length != 0) {
                    this.dataForm.categoryId = this.classList[
                        this.classList.length - 1
                    ];
                }
                console.log(this.dataForm.categoryId);
            },
            changeStore(val) {
                this.$set(this.dataForm, "storeId", val);
                this.selectStoreOption = [].concat(this.selectStoreOption);
            },
            changeBrand(val) {
                this.$set(this.dataForm, "brandId", val);
                this.selectBrandOption = [].concat(this.selectBrandOption);
            },
            //回显
            backScan() {
                searchStoreName().then(res => {
                    if (res.code == 200) {
                        this.selectStoreOption = res.data;
                    } else {
                    }
                });
            },
            backScan1() {
                searchBrandName().then(res => {
                    if (res.code == 200) {
                        this.selectBrandOption = res.data;
                    } else {
                    }
                });
            },
            backScan2() {
                var obj = {
                    id: this.dataForm.id,
                    categoryName: this.dataForm.categoryName
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
            showList(id){
                this.$emit("showList",id);
            },
            // 重置
            reset(){
                this.dataForm.goodsName = ""; //商品名称/商品货号
                this.dataForm.idJp = ""; //id
                this.dataForm.categoryId = ""; //分类
                this.dataForm.storeId = ""; //店铺名称
                this.dataForm.brandId = ""; //品牌名称
                this.dataForm.sellState = ""; //是否可售
                this.dataForm.showWeb = ""; //上下架状态:0：待上架，1：已上架，2：下架 ,
                this.classList = []; //分类名称
                this.getDataList();
            },
            changePage(){
                this.$emit("showList");
            },
        }
    }
</script>


<style scoped>

</style>