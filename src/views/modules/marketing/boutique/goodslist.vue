<template>
    <div>
        <Bread :breaddata="breaddata" :index = "'1'" @changePage = "changePage"></Bread>
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" >
            <el-form-item label="商品货号：">
                <el-input v-model.trim="dataForm.goodsId"  placeholder="请输入商品货号" clearable></el-input>
            </el-form-item>
            <el-form-item label="商品名称：">
                <el-input v-model.trim="dataForm.goodsName" placeholder="请输入商品名称" clearable maxlength="300"></el-input>
            </el-form-item>
            <el-form-item label="店铺名称：">
                <el-select
                v-model="dataForm.storeId"
                filterable
                clearable
                placeholder="请输入店铺名称"
                :loading="loading"
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

            <el-form-item >
                <el-button  class="btn" type="primary" @click="getDataList()">搜索</el-button>
                <el-button class="btn"  type="primary" plain @click="reset()" plain>重置</el-button>
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
            <el-form-item label="品牌名称：">
                <el-select
                v-model="dataForm.brandId"
                filterable
                clearable
                placeholder="请输入品牌名称"
                :loading="loading"
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

            <el-form-item style="float:right">
                <el-button type="primary" @click="deleteRow()">批量删除</el-button>
                <!-- <el-button type="primary" @click="saveSort">保存排序</el-button> -->
                <el-button type="primary" @click="addGoods()">添加商品</el-button>
                <el-button type="primary" @click="exportGoods()">导出</el-button>
            </el-form-item>
        </el-form>

        <el-table
           :data="dataList"
            v-loading="dataListLoading"
            @selection-change="handleSelectionChange"
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
                prop="goodsIdJp"
                label="商品ID"
                align="center"
                width="180">
            </el-table-column>
            <el-table-column
                prop="imageUrl"
                label="主图"
                align="center">
                <template slot-scope="scope">
                    <img v-if="getImgUrl(scope.row.imageUrl)" :src="getImgUrl(scope.row.imageUrl)" alt="主图" width="51" height="60">
                    <span v-else> -- </span>
                </template>
            </el-table-column>
             <!-- <el-table-column
                prop="sort"
                label="排序"
                align="center"
                width="210">
                <template slot-scope="scope">
                    <el-input-number v-model="scope.row.sort" :step="1" :min="0" :max="999999" ></el-input-number>
                </template>
            </el-table-column> -->
            <el-table-column
                prop="goodsName"
                label="商品名称"
                align="center"
                min-width="300">
            </el-table-column>
            <el-table-column
                prop="storeName"
                align="center"
                label="所属店铺">
                <template slot-scope="scope">
                    {{scope.row.storeName?scope.row.storeName:'--'}}
                </template>
            </el-table-column>
            <el-table-column
                prop="brandName"
                align="center"
                label="品牌">
                <template slot-scope="scope">
                    {{scope.row.brandName?scope.row.brandName:'--'}}
                </template>
            </el-table-column>
            <el-table-column
                prop="categoryActivityName"
                align="center"
                label="所属分类">
            </el-table-column>

            <el-table-column
                prop="showWeb"
                align="center"
                label="上架状态">
                <template slot-scope="scope">
                   <span>{{showWebStr(scope.row.showWeb)}}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="sellState"
                align="center"
                label="可售状态">
                <template slot-scope="scope">
                   <span>{{scope.row.sellState == 1?'可售':'不可售'}}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="priceType"
                align="center"
                label="是否折扣">
                <template slot-scope="scope">
                   <span>{{scope.row.priceType == 'sale'?'是':'否'}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="标准价">
                <template slot-scope="scope">
                   <span>￥{{scope.row.sellPrice?scope.row.sellPrice:'0.00'}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="促销价">
                 <template slot-scope="scope">
                   <span>￥{{scope.row.discountPrice?scope.row.discountPrice:'--'}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="折扣率">
                <template slot-scope="scope">
                   <span>{{scope.row.discountRate?`${scope.row.discountRate*100}%`:'--'}}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="stockQuantity"
                align="center"
                label="本地库存">
            </el-table-column>

            <el-table-column
                align="center"
                label="操作">
                <template slot-scope="scope">
                    <el-button class="artdanger" type="text" size="small" @click="deleteRow(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
            @size-change="pageSizeChangeHandle"
            @current-change="pageCurrentChangeHandle"
            :current-page="dataForm.page"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="limit"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>

        <modelEditSku v-if="modelEditSkuVisible" ref="modelEditSkuCompon" @searchDataList="getDataList"></modelEditSku>
    </div>
</template>

<script>
    import mixinViewModule from '@/mixins/view-module'
    import { categoryactivitygoodsPageUrl } from '@/api/url'
    import { categoryactivitygoodsBatch,deleteCateActgoods,categoryactivitygoodsUpdateBach,searchStoreName,searchBrandName,backScanCategorys,categoryactivitygoodsExport } from '@/api/api'
    import Bread from "@/components/bread";
    import modelEditSku from "./modules/model-edit-sku";

    export default {
        mixins: [mixinViewModule],
        components:{Bread,modelEditSku},
        data () {
            return {
                dds:'12121212',
                mixinViewModuleOptions: {
                    getDataListURL: categoryactivitygoodsPageUrl,
                    activatedIsNeed: false,
                    getDataListIsPage: true,
                    exportURL: '/admin-api/store/export',
                    deleteURL: "?????",
                    deleteIsBatch: true,
                    // deleteIsBatchKey: 'id'
                },
                multipleSelection:[],
                modelEditSkuVisible:false,
                dataListLoading:false,
                dataList:[],
                breaddata: ["营销管理", "精选分类","添加商品"],
                dataForm: {
                    goodsName:'',//商品名称
                    goodsId:'',//商品货号
                    categoryActivityId:'',//精选分类ID
                    storeId: '', // 店铺ID
                    brandId: '', // 品牌ID
                    showWeb: '', // 上架状态
                    sellState: '', // 可售状态
                },
                listdataForm:{
                    storeId:'',
                },
                row:'',
                // 表单部分
                loading: false,
                selectStoreOption: [],
                selectBrandOption: [],
                classList: [],
                props: {
                    label: "name",
                    value: "id",
                    children: "list"
                },
                selectCategoryOption: [],
                categoryName: '',
                categoryActivityId: '',

                showOptions: [
                    {id:"",label:"全部"},
                    { id: "0", label: "待上架" },
                    { id: "1", label: "已上架" },
                    { id: "2", label: "已下架" }
                ],
                stateOptions: [{id:"",label:"全部"},{ id: "0", label: "不可售" }, { id: "1", label: "可售" }],
            }
        },
        created(){
            this.backScan();
            this.backScan1();
        },
        methods: {
            init(row){
                console.log(row)
                this.row = row;
                this.dataForm.categoryActivityId = row.id;
                this.categoryActivityId = row.id;
                this.categoryName = row.title
                this.getData();
                this.backScan2();
            },
            getData(){
                // this.dataForm.page =1;
                this.getDataList();
            },
            //返回
            changePage(){
                this.$emit('showListFun')
            },
            reset(){
                this.dataForm.goodsName= "";//商品名称
                this.dataForm.goodsId= "";//商品货号
                this.dataForm.storeId = '', // 店铺ID
                this.dataForm.brandId = '', // 品牌ID
                this.dataForm.showWeb = '', // 上架状态
                this.dataForm.sellState = '', // 可售状态
                this.dataForm.categoryActivityId = this.categoryActivityId;
                this.dataForm.categoryId = '',
                this.getData();
            },
            changeCheck($event,id){
                // $event当前状态值选中为true,未选中为false，id：为你要操作的分类id
                console.log('??????',$event,id)
            },
             // 表格前端的checkbox
            handleSelectionChange(val) {
                this.multipleSelection = val;
                console.log(this.multipleSelection);
            },
            // 添加商品
            addGoods(){
                this.modelEditSkuVisible = true;
                this.$nextTick(()=>{
                    this.$refs.modelEditSkuCompon.init(this.row);
                })
            },
            // 导出
            exportGoods() {
                categoryactivitygoodsExport({
                    params: {
                        categoryActivityId: this.dataForm.categoryActivityId || this.categoryActivityId,
                        goodsName: this.dataForm.goodsName,
                        goodsId: this.dataForm.goodsId,
                        storeId: this.dataForm.storeId,
                        brandId: this.dataForm.brandId,
                        showWeb: this.dataForm.showWeb,
                        sellState: this.dataForm.sellState
                    }
                }).then((res) => {
                    this.$message.success(res.msg);
                });
            },
             // 保存排序
            saveSort(){
                let dataArr = [];
                this.dataList.forEach((item,index)=>{
                    dataArr.push({
                        id:item.id,//主键id
                        goodsId:item.goodsId,//活动商品id ,
                        sort:item.sort,// 排序
                    })
                })
                var obj = dataArr
                categoryactivitygoodsUpdateBach(obj).then((res)=>{
                            if(res.code==200){
                            this.$message.success(res.msg);
                            this.getDataList();
                        }else{
                            this.$message.error(res.msg);
                        }
                })
            },
            // 单个删除和批量删除
            deleteRow(row){
                if(!row && this.multipleSelection.length==0){
                    this.$message.warning("至少选择一个商品")
                    return;
                }
                let that = this;
                console.log(row);
                 console.log(that.row);
                this.$confirm("是否确认删除?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText:"取消",
                    type: 'warning'
                }).then(() => {
                    let ids = [];
                    if(row){//单个删除
                        ids = [row.id]
                    }else{//批量删除
                        that.multipleSelection.forEach((item,index)=>{
                            ids.push(item.id);
                        })
                    }
                    var obj = {
                        data:ids,//商品spuid
                    };
                    console.log(deleteCateActgoods);
                    deleteCateActgoods(obj).then((res)=>{
                        if(res.code==200){
                            that.$message.success(res.msg);
                            that.getDataList();
                        }else{
                            that.$message.error(res.msg);
                        }
                    })
                }).catch(() => {
                })
            },
            getImgUrl(url) {
                if(!url) {
                    return url;
                }
                if(url.includes('http')) {
                    return url;
                }
                return this.$imgDomain + url;
            },
            showWebStr(type) {
                let str = '';
                switch (type) {
                    case 0:
                        str = '待上架';
                        break;
                
                    case 1:
                        str = '已上架';
                        break;
                
                    case 2:
                        str = '已下架';
                        break;
                
                    default:
                        str = '暂无信息'
                        break;
                }
                return str;
            },
            changeStore(val) {
                this.$set(this.dataForm, "storeId", val);
                this.selectStoreOption = [].concat(this.selectStoreOption);
            },
            // 下拉字典
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
                var params = {
                    id: this.dataForm.categoryActivityId,
                    categoryName: this.categoryName
                };
                backScanCategorys(params).then(res => {
                    if (res.code == 200) {
                    this.selectCategoryOption = res.data ? res.data : [];
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
            // 品牌选择回调
            handleChange() {
                if (this.classList.length != 0) {
                    this.dataForm.categoryId = this.classList[
                    this.classList.length - 1
                    ];
                    this.dataForm.categoryActivityId = '';
                } else {
                    this.dataForm.categoryActivityId = this.categoryActivityId;
                    this.dataForm.categoryId = '';
                }
            },
            changeBrand(val) {
                this.$set(this.dataForm, "brandId", val);
                this.selectBrandOption = [].concat(this.selectBrandOption);
            },
        }
    };
</script>
<style lang="scss" scoped>

</style>
