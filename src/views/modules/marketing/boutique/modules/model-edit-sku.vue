<template>
   <!-- 修改弹框 -->
    <el-dialog
        :visible.sync="visible"
        :close-on-click-modal = "false"
        class="editDialog"
         :before-close="closeDialog"
        width="80%">
        <el-form :inline="true" :model="dataForm"  ref="addForm">
            <el-form-item label="商品货号：">
                <el-input v-model.trim="dataForm.goodsId" placeholder="请输入商品货号" clearable maxlength="300"></el-input>
            </el-form-item>
            <el-form-item label="商品名称：">
                <el-input v-model.trim="dataForm.goodsName"  placeholder="请输入商品名称" clearable></el-input>
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
            <!-- <el-form-item >
                <el-button  class="btn" type="primary" @click="getData()">搜索</el-button>
                <el-button class="btn"  type="primary" plain @click="reset()" plain>重置</el-button>
            </el-form-item> -->
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
            <el-form-item label="选择分类：">
                <el-cascader
                        :options="selectCategoryOption"
                        v-model="classList"
                        change-on-select
                        :clearable="true"
                        :props="props"
                        @change="handleChange">
                </el-cascader>
            </el-form-item>
            <el-form-item label="是否折扣：">
                <el-select v-model="dataForm.isDiscount" placeholder="请选择">
                <el-option
                    v-for="item in isDiscountOptions"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id"
                ></el-option>
                </el-select>
            </el-form-item>
            
            <el-form-item label="促销价：">
                <div style="display:flex">
                <el-input 
                v-model.trim="discountPriceStart" 
                type="number" placeholder="0" class="custom-range-input"
                @blur="bottomCheck('discountPriceStart','discountPriceEnd',true)"
                ></el-input>
                <span>&nbsp 至 &nbsp</span>
                <el-input 
                v-model.trim="discountPriceEnd" 
                type="number" placeholder="0" class="custom-range-input"
                @blur="topCheck('discountPriceStart','discountPriceEnd',true)"
                ></el-input>

                </div>
            </el-form-item>
            <el-form-item label="折扣率(%)：">
                <div style="display:flex">
                <el-input 
                v-model.trim="discountRateStart" 
                type="number" placeholder="0.00" class="custom-range-input" 
                @blur="bottomCheck('discountRateStart','discountRateEnd',false)"
                ></el-input>
                <span>&nbsp 至 &nbsp</span>
                <el-input 
                v-model.trim="discountRateEnd" 
                type="number" placeholder="100.00" class="custom-range-input"
                @blur="topCheck('discountRateStart','discountRateEnd',false)"
                ></el-input>

                </div>
            </el-form-item>
            <el-form-item label="本地库存：">
                <div style="display:flex">
                <el-input v-model.trim="stockQuantityStart" 
                type="number" placeholder="0" class="custom-range-input" 
                @blur="bottomCheck('stockQuantityStart','stockQuantityeEnd',true)"
                ></el-input>
                <span>&nbsp 至 &nbsp</span>
                <el-input v-model.trim="stockQuantityeEnd" 
                type="number" placeholder="0" class="custom-range-input"
                @blur="topCheck('stockQuantityStart','stockQuantityeEnd',true)"
                ></el-input>

                </div>
            </el-form-item>
            <el-form-item label="产地：">
                <el-input v-model.trim="dataForm.madeIn" placeholder="请输入产地"></el-input>
            </el-form-item>
            <el-form-item label="模糊查询：">
                <el-input v-model.trim="dataForm.fuzzySearch" placeholder="请输入关键字"></el-input>
            </el-form-item>

            <el-form-item label="性别：">
                <el-select v-model="dataForm.genders" placeholder="请选择">
                <el-option
                    v-for="item in gendersOptions"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id"
                ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="多分类：">
                <el-select v-model="dataForm.categoryMore" placeholder="请选择">
                <el-option
                    v-for="item in categoryMoreOptions"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id"
                ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item >
                <el-button  class="btn" type="primary" @click="getData()">搜索</el-button>
                <el-button class="btn"  type="primary" plain @click="reset()" plain>重置</el-button>
                <!-- <el-button  class="btn" type="primary" @click="handleCheckAllChange(multipleSelection)" style="margin-right: 10px;">选择全部</el-button> -->
                <el-button  class="btn" type="primary" @click="showModel(row)" style="margin-right: 10px;">选择全部</el-button>
                <importAndExport :btType="'primary'" :importAndExportOptions="importAndExportOptions" :dataForm="{}" @getDataList="getDataList"></importAndExport>
            </el-form-item>
        </el-form>
        
        <el-table
            :data="dataList"
            v-loading="dataListLoading"
            border
            @selection-change="handleSelectionChange"
            ref="multipleTable"
            style="width: 100%">
             <el-table-column
                type="selection"
                width="70">
            </el-table-column>
            <el-table-column
                prop="goodsIdJp"
                label="商品ID"
                align="center">
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
            <el-table-column
                prop="name"
                label="商品名称"
                align="center"
                width="180">
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
                prop="goodsTypeName"
                align="center"
                label="所属分类">
            </el-table-column>
            <!-- 性别 -->
            <el-table-column
                prop="genders"
                align="center"
                label="性别">
                <template slot-scope="scope">
                   <span>{{getGenders(scope.row.genders)}}</span>
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
                   <span>{{scope.row.discountRate?`${Number.parseFloat(scope.row.discountRate).toFixed(2)*100}%`:'--'}}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="stockQuantity"
                align="center"
                label="本地库存">
            </el-table-column>
            <el-table-column
                prop="favoriteNum"
                align="center"
                label="收藏量">
            </el-table-column>
            <el-table-column
                prop="categoryMore"
                align="center"
                label="多分类">
                <template slot-scope="scope">
                   <span>{{scope.row.categoryMore == 1?'是':'否'}}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="madeIn"
                align="center"
                label="产地">
            </el-table-column>
            <el-table-column
                prop="material"
                align="center"
                width="200"
                :show-overflow-tooltip="true"
                label="材质">
                <template slot-scope="scope">
                   <span>{{scope.row.material?scope.row.material:'--'}}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="description"
                align="center"
                width="200"
                :show-overflow-tooltip="true"
                label="描述">
                <template slot-scope="scope">
                   <span>{{getDescription(scope.row.description)}}</span>
                </template>
            </el-table-column>
            
            <!-- <el-table-column
                align="center"
                label="价格">
                <template slot-scope="scope">
                    <span v-if="scope.row.priceType == 'proper'">￥{{scope.row.sellPrice}}</span>
                    <span v-else-if="scope.row.priceType == 'sale'">￥{{scope.row.discountPrice}}</span>
                    <span v-else>/</span>
                </template>
            </el-table-column> -->
            <!-- <el-table-column
                align="center"
                label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small">适用于全部规格</el-button>
                </template>
            </el-table-column> -->
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

        <span slot="footer" class="dialog-footer" v-if="!dataListLoading">
            <el-button @click="dataFormCancel()">取 消</el-button>
            <el-button type="primary" @click="dataFormSubmit('addForm')" :loading="saveLoading">{{saveLoading?'提交中..':'确 定'}}</el-button>
        </span>
    <!-- 选择全部 -->
    <showOrder v-if="showOrderVisible" :dataForm="{}" ref="showOrderCompon" @searchDataList="searchDataList"></showOrder>
    <el-dialog
	 	    class="model-add-edit-data"
		    title="提示"
		    :close-on-click-modal="false"
		    :visible.sync="visible2"
			width="35%"
			append-to-body
			:before-close="closeDialog">
		    	<h3 style="text-align:center;">请确定是否添加全部商品到该分类下?</h3>
                <!-- <p style="color:red">请确认已与用户沟通达成一致</p> -->
			    <span slot="footer" class="dialog-footer"  >
		     		    <el-button @click="dataFormCancel()">取消</el-button>
		     		    <el-button type="primary" @click="modeldataFormSubmit('addForm')"
		     		    :loading="loading">{{loading ? "提交中···" : "确定"}}</el-button>
			    </span>
	</el-dialog>
    </el-dialog>
</template>

<script>
    import mixinViewModule from '@/mixins/view-module'
    import {editLimitActivityGoods,getdatacategory,searchStoreName,searchBrandName} from "@/api/api.js"
    import { categoryactivitygoodsImport } from "@/api/io.js"
     import {categoryactivitygoodsBatch, categoryactivitygoodsAll} from "@/api/api.js" 
     import {categoryactivityGoodsPagePopUrl} from "@/api/url.js"
     import importAndExport from "@/components/import-and-export"
    import showOrder from './model-show.vue'
    export default {
        name: "model-add-edit-data",
          mixins: [mixinViewModule],
        data () {
            return {
                mixinViewModuleOptions: {
                    getDataListURL: categoryactivityGoodsPagePopUrl,
                     activatedIsNeed: false,
                    getDataListIsPage: true,
                    exportURL: '/admin-api/store/export',
                    deleteURL: "?????",
                    deleteIsBatch: true,
                // deleteIsBatchKey: 'id'
                },
                showOrderVisible:false,
                visible : false,
                visible2:false,
                loading : false,
                saveLoading:false,
                dataList:[],
                title:'',
                multipleSelection:[],
                dataForm:{
                    goodsId: null,//商品id ,
                    goodsName: null,//商品名称
                    categoryId:'',//分类ID
                    categoryActivityId:'',//精选分类分类ID
                    storeId: '',
                    brandId: '',
                    genders: '',
                    isDiscount: '',
                    categoryMore: '',
                    madeIn: '',
                    fuzzySearch: '',
                    discountPriceStart: '',
                    discountPriceEnd: '',
                    discountRateStart: '',
                    discountRateEnd: '',
                    stockQuantityStart: '',
                    stockQuantityeEnd: '',

                },
                discountPriceStart: '',
                discountPriceEnd: '',
                discountRateStart: '',
                discountRateEnd: '',
                stockQuantityStart: '',
                stockQuantityeEnd: '',
                moneyNum:99.9,
                kucun:'',
                row:'',
                selectCategoryOption: [],//中国分类id
                classList:[],
                props: {
                    label:'name',
                    value: 'id',
                    children:'list'
                },
                selectStoreOption: [],
                selectBrandOption: [],
                gendersOptions: [
                    {id:"",label:"全部"},
                    { id: "0", label: "男" },
                    { id: "1", label: "女" },
                    { id: "2", label: "儿童" }
                ],
                isDiscountOptions: [
                    {id:"",label:"全部"},
                    { id: "0", label: "否" },
                    { id: "1", label: "是" },
                ],
                categoryMoreOptions: [
                    {id:"",label:"全部"},
                    { id: "0", label: "否" },
                    { id: "1", label: "是" },
                ],
                importAndExportOptions:{
                    importUrl:categoryactivitygoodsImport,//导入接口
                    importWord:"导入",
                },
            }
            
        },
        created(){
        	
        },
        components: {
            importAndExport,
            showOrder
        },
        watch: {
            'discountPriceStart': function(val) {
                if(val == '') {
                    this.dataForm.discountPriceStart = '';
                    this.discountPriceStart = '';
                } else if(val >= 0) {
                    this.dataForm.discountPriceStart = val;
                } else if(val == 'e') {
                    this.discountPriceStart = '';
                } else {
                    this.dataForm.discountPriceStart = 0;
                    this.discountPriceStart = 0;
                }
            },
            'discountPriceEnd': function(val) {
                if(val == '') {
                    this.dataForm.discountPriceEnd = '';
                    this.discountPriceEnd = '';
                } else if(val >= 0) {
                    this.dataForm.discountPriceEnd = val;
                } else if(val == 'e') {
                    this.discountPriceEnd = '';
                } else {
                    this.dataForm.discountPriceEnd = 0;
                    this.discountPriceEnd = 0;
                }
            },
            'stockQuantityStart': function(val) {
                if(val == '') {
                    this.dataForm.stockQuantityStart = '';
                    this.stockQuantityStart = '';
                } else if(val >= 0) {
                    this.dataForm.stockQuantityStart = val;
                } else if(val == 'e') {
                    this.stockQuantityStart = '';
                } else {
                    this.dataForm.stockQuantityStart = 0;
                    this.stockQuantityStart = 0;
                }
            },
            'stockQuantityeEnd': function(val) {
                if(val == '') {
                    this.dataForm.stockQuantityeEnd = '';
                    this.stockQuantityeEnd = '';
                } else if(val >= 0) {
                    this.dataForm.stockQuantityeEnd = val;
                } else if(val == 'e') {
                    this.stockQuantityeEnd = '';
                } else {
                    this.dataForm.stockQuantityeEnd = 0;
                    this.stockQuantityeEnd = 0;
                }
            },
            'discountRateStart': function(val,oldVal) {
                if(val == "" || val == "e") {
                    this.dataForm.discountRateStart = '';
                    this.discountRateStart = '';
                } else {
                    let regRate = /^(?:(?!0\d)\d{1,2}(?:\.\d{1,2})?|100(?:\.0{1,2})?)$/;
                    if(regRate.test(val)) {
                        let intVal = val;
                        this.dataForm.discountRateStart = Number.parseInt(intVal*100)/10000;
                    } else {
                        this.discountRateStart = oldVal;
                        oldVal = Number.parseInt(oldVal*100);
                        this.dataForm.discountRateStart = oldVal/10000;
                    }
                }
            },
            'discountRateEnd': function(val,oldVal) {
                if(val == "" || val == "e") {
                    this.dataForm.discountRateEnd = '';
                    this.discountRateEnd = '';
                } else {
                    let regRate = /^(?:(?!0\d)\d{1,2}(?:\.\d{1,2})?|100(?:\.0{1,2})?)$/;
                    if(regRate.test(val)) {
                        let intVal = val;
                        this.dataForm.discountRateEnd = Number.parseInt(intVal*100)/10000;
                    } else {
                        this.discountRateEnd = oldVal;
                        oldVal = Number.parseInt(oldVal*100);
                        this.dataForm.discountRateEnd = oldVal/10000;
                    }
                }
            },
            // 'dataForm.categoryId': function(val) {
            //     this.importAndExportOptions.importUrl = categoryactivitygoodsImport + `?id=${val}`
            //  }

        },
        methods: {
            init (row) {
                this.getDatacategoryFn();
                this.backScan();
                this.backScan1();
                this.visible = true;
                this.saveLoading = false;
                this.$nextTick(() => {
                    this.row = row;
                    console.log(this.row)
                    this.dataForm.categoryActivityId = row.id
                    console.log(this.dataForm.categoryActivityId)
                    this.importAndExportOptions.importUrl = categoryactivitygoodsImport + `?id=${row.id}`
                    this.title = "修改";
                    this.getData();
                   
                })
            },
            //编辑回显
            // backScan(){
            //     var obj  = {
            //        params:{
            //         activityId:this.row.id,//活动ID
            //         goodsId:this.row2.id,//商品ID
            //         activityType:1,//活动类型 0秒杀 1限量 2预售
            //        }

            //     }
            //     this.loading = true;
            //     limitActivitySkuChoice(obj).then((res)=>{
            //         this.loading = false;
            //         if(res.code == 200){
            //             Object.assign(this.dataForm,res.data);
            //             if(res.data && res.data.activityGoodsChoiceSkuVOList){
            //                 this.dataList =  res.data.activityGoodsChoiceSkuVOList
            //             }else{
            //                 this.dataList = []
            //             }
                      
            //         }
            //     })
            // },
            getData(){
                this.page=1;
                this.getDataList();
            },
            showModel (row) {
                this.visible2 = true;
                // console.log(row)
                // this.showOrderVisible = true;
                // this.$nextTick(() => {
                //    this.$refs.showOrderCompon.init(row)
                // })
                // this.searchDataList();
            },
            dataFormCancel(){
                this.visible2 = false;
                this.closeDialog();
			},
			closeDialog() {
                this.visible2 = false;
			},
             //获取中国分类
            getDatacategoryFn(){
                    getdatacategory().then((res)=>{
                        if(res.code == 200){
                            console.log(res);
                            this.selectCategoryOption = res.data;
                            this.selectCategoryOption.forEach((item,index)=>{
                                // item.label = item.name
                                // item.value = item.id
                                item.list && item.list.forEach((item2,index2)=>{
                                    // item2.label = item2.name
                                    // item2.value = item2.id
                                    item2.list="";
                                })
                            })
                        }else{
                            this.$message(res.msg);
                        }
                    }).catch(()=>{
                        this.$message("服务器错误");
                    })
            },
            // 切换中国分类
            handleChange(){
                if(this.classList.length!=0){
                    this.dataForm.categoryId = this.classList[this.classList.length-1]
                }else{
                this.dataForm.categoryId = "";//分类id

                }
                console.log(this.dataForm.categoryId)
            },
            // 表格前端的checkbox
            handleSelectionChange(val) {
                this.multipleSelection = val;
                console.log(this.multipleSelection);
            },
            reset(){
                this.dataForm.goodsName=""
                this.dataForm.goodsId=""
                this.dataForm.categoryId=""
                this.dataForm.storeId = ""
                this.dataForm.brandId = ""
                this.dataForm.genders = ""
                this.dataForm.isDiscount = ""
                this.dataForm.categoryMore = ""
                this.dataForm.madeIn = ""
                this.dataForm.fuzzySearch = ""
                this.dataForm.discountPriceStart = ""
                this.dataForm.discountPriceEnd = ""
                this.dataForm.discountRateStart = ""
                this.dataForm.discountRateEnd = ""
                this.dataForm.stockQuantityStart = ""
                this.dataForm.stockQuantityeEnd = ""
                this.discountPriceStart = ""
                this.discountPriceEnd = ""
                this.discountRateStart = ""
                this.discountRateEnd = ""
                this.stockQuantityStart = ""
                this.stockQuantityeEnd = ""
                this.classList = []
                this.getData();
            },
            // 提交
            dataFormSubmit(formName){
                // alert([this.dataForm.name,this.dataForm.domainAddress]);
                // console.log(this.dataForm);
                // this.$refs[formName].validate((valid) => {
                    // if (valid) {
                        if(this.multipleSelection.length==0){
                            this.$message.warning("至少勾选一个");
                            return
                        }
                         var ids = [];
                        this.multipleSelection.forEach((item,index)=>{
                            ids.push(item.id);
                        })
                        var obj = {
                            "activityId": this.row.id,// 活动ID ,
                            "categoryName": this.row.title,//精选分类名称 ,
                            "ids":ids
                        }
                        categoryactivitygoodsBatch(obj).then((res)=>{
                            // console.log(res);
                            if(res.code==200){
                                this.dataFormCancel();
                                this.$message.success(res.msg);
                            }else{
                                this.$message.error(res.msg);
                            }
                        })
                //     } else {
                //         //console.log('error 添加失败!!');
                //         return false;
                //     }
                // })
            },
            modeldataFormSubmit () {
                this.loading = true;
                    var obj=  {
                        params:{
                            ...this.dataForm,
                        },
                        "categoryActivityId": this.row.id,// 活动ID ,
                        "categoryActivityName": this.row.title,//精选分类名称 ,
                        
                    }
                    categoryactivitygoodsAll(obj).then((res) => {
                        this.loading = false;
                        // alert(JSON.stringify(res));
                        let status = null;
                        if(res.code == "200"){
                            console.log(res.msg)
                            status = "success";
                            this.visible2 = false;
                            this.getData;
                            this.closeDialog();
                        }else{
                            status = "error";
                        }
                        this.$message({
                            message: res.msg,
                            type: status,
                            duration: 1500
                        })
                    })
            },
            dataFormCancel(){
                this.visible = false;
                this.closeDialog();
            },
            closeDialog() {
                 this.$emit('searchDataList');
                this.$parent.modelEditSkuVisible = false;
            },
            searchDataList() {
                // this.getOrderListTop();
                this.getData();
            },
            // 表格
            getImgUrl(url) {
                if(!url) {
                    return url;
                }
                if(url.includes('http')) {
                    return url;
                }
                return this.$imgDomain + url;
            },
            getDescription(des) {
                if(des) {
                    let elm = document.createElement('div');
                    let desText = $(elm).html(des).text();
                    elm = null;
                    return desText;
                }
                return '--';
            },
            getGenders(gen) {
                let str = '';
                switch (gen) {
                    case '0':
                        str = '男';
                        break;
                
                    case '1':
                        str = '女';
                        break;
                
                    case '2':
                        str = '儿童';
                        break;
                
                    default:
                        str = '--'
                        break;
                }
                return str;
            },
            // 全选
            handleCheckAllChange(val) {
                if(val) this.$refs.multipleTable.toggleAllSelection();
                else this.$refs.multipleTable.clearSelection();
            },
            // 表单
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
            changeStore(val) {
                this.$set(this.dataForm, "storeId", val);
                this.selectStoreOption = [].concat(this.selectStoreOption);
            },
            changeBrand(val) {
                this.$set(this.dataForm, "brandId", val);
                this.selectBrandOption = [].concat(this.selectBrandOption);
            },
            bottomCheck(startKey,endKey,isint) {
                if (this.dataForm[endKey] == "") {
                    return ;
                } else if (this.dataForm[startKey] > this.dataForm[endKey]) {
                    this.$message("最低不得大于最高");
                    this.dataForm[startKey] = 0;
                    this[startKey] = 0;
                }
            },
            topCheck(startKey,endKey,isInt) {
                if (this.dataForm[startKey] == "") {
                    return ;
                } else if (this.dataForm[startKey] > this.dataForm[endKey]) {
                    this.$message("最高不低于最低");
                    this.dataForm[endKey] = isInt? Number.parseInt(this.dataForm[startKey]) + 1 : Number.parseFloat(this.dataForm[startKey]) + 0.001;
                    this[endKey] = isInt? Number.parseInt(this[startKey]) + 1 : Number.parseFloat(this[startKey]) + 0.1;
                }
            }
        }
    }
</script>

<style scoped>
    /*/deep/.el-form-item__content:nth-child(1) {*/
    /*    margin-left: 50px!important;*/
    /*}*/
    .title {
        margin-left: -70px;
    }
    .custom-range-input {
        width: 70px!important;
    }
</style>
<style>
    .el-tooltip__popper {
        width: 80%!important;
    }
</style>