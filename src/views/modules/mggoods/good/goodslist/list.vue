<template>
    <div>
        <Bread  :breaddata="breaddata"></Bread>
        <el-form :inline="true" class="grayLine topGapPadding" :model="dataFormShow" @keyup.enter.native="getDataList()" >
            <!-- <el-scrollbar style="height:90px;margin-right: 30px;"> -->
            <el-form-item label="商品名称：">
                <el-input v-model="dataFormShow.goodsName" placeholder="请输入商品名称" ></el-input>
            </el-form-item>
            <el-form-item label="商品ID：">
                <el-input v-model="dataFormShow.idJp" placeholder="请输入spuID" ></el-input>
            </el-form-item>
            <el-form-item label="分类：">
<!--                <el-select-->
<!--                        v-model="dataFormShow.categoryId"-->
<!--                        filterable-->
<!--                        placeholder="请输入分类名称"-->
<!--                        :loading="loading"-->
<!--                >-->
<!--                    <el-option-->
<!--                            v-for="(item,index) in selectCategoryOption"-->
<!--                            :key="item.index"-->
<!--                            :label="item.name"-->
<!--                            :value="item.id">-->
<!--                    </el-option>-->
<!--                </el-select>-->
                <el-cascader
                        :options="selectCategoryOption"
                        v-model="classList"
                        change-on-select
                        :clearable="true"
                        :props="props"
                        @change="handleChange">
                </el-cascader>
            </el-form-item>
            <el-form-item label="店铺名称：">
                <el-select
                        v-model="dataFormShow.storeId"
                        filterable
                        placeholder="请输入店铺名称"
                        :loading="loading"
                        @change="changeStore"
                >
                    <el-option
                            v-for="(item,index) in selectStoreOption"
                            :key="item.index"
                            :label="item.storeName"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="品牌名称：">
                <el-select
                        v-model="dataFormShow.brandId"
                        filterable
                        placeholder="请输入品牌名称"
                        :loading="loading"
                        @change="changeBrand"
                >
                    <el-option
                            v-for="(item,index) in selectBrandOption"
                            :key="item.id"
                            :label="item.brandName"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="上架状态：">
                <el-select v-model="dataFormShow.showWeb" placeholder="请选择">
                    <el-option
                            v-for="item in showOptions"
                            :key="item.id"
                            :label="item.label"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="可售状态：">
                <el-select v-model="dataFormShow.sellState" placeholder="请选择">
                    <el-option
                            v-for="item in stateOptions"
                            :key="item.id"
                            :label="item.label"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="价格变更：">
                <el-select v-model="dataFormShow.priceState" placeholder="请选择">
                    <el-option
                            v-for="item in priceOptions"
                            :key="item.id"
                            :label="item.label"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button class="btn" type="primary" @click="getData()">查询</el-button>
                <el-button class="btn" type="primary" plain @click="reset()" >重置</el-button>
            </el-form-item>
        </el-form>
        <el-radio-group v-model="activeName" @change="handleClick">
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button label="upper">上架</el-radio-button>
            <el-radio-button label="lower">下架</el-radio-button>
            <el-radio-button label="not">待上架</el-radio-button>
        </el-radio-group>
        <el-button @click="editList()" class="btn" type="primary" style="float: right;">导出信息</el-button>
        <el-table
                width="100%"
                :data="dataList"
                border
                v-loading="dataListLoading"
                @selection-change="handleSelectionChange"
                ref="multipleTable"
                style="width: 100%;margin-top:10px;"
        >
            <el-table-column type="selection" width="70"></el-table-column>
            <el-table-column label="商品ID" align="center" width="100">
                <template slot-scope="scope">
                    <div @click="detShowChange(scope.row)" style="cursor:pointer;color:#2260D2;">
                        {{scope.row.idJp}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="主图" prop="imageUrl" align="center" width="160">
                <template slot-scope="scope">
                    <img
                            :src="scope.row.mainImageUrl | filterImgUrl"
                            alt=""
                            style=" object-fit: contain;width: 70px;height:70px;"
                    >
                </template>
            </el-table-column>
            <el-table-column prop="goodsName" label="商品名称" align="center">
                <template slot-scope="scope">
                    <div>
                        {{scope.row.name}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="brandName" label="品牌" align="center">
                <template slot-scope="scope">
                    <div>
                        {{scope.row.brandName}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="sellPrice" label="售价" width="100" align="center">
                <template slot-scope="scope">
                    <div class="price1">￥{{scope.row.sellPrice}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="salePlan" label="售价类型" align="center" width="100">
                <template slot-scope="scope">
                    <span  v-if="scope.row.salePlan==0">关税计算</span>
                    <span  v-if="scope.row.salePlan==1">品牌方设定</span>
                </template>
            </el-table-column>
            <el-table-column prop="gcName" label="分类"  align="center">
                <template slot-scope="scope">
                    <div>
                        {{scope.row.categoryId}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="storeName" label="所属店铺" align="center">
                <template slot-scope="scope">
                    <div>
                        {{scope.row.storeName}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="状态" align="center">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.sellState==0" type="info">不可售</el-tag>
                    <el-tag v-if="scope.row.sellState==1" type="success">可售</el-tag>
                </template>
            </el-table-column>
<!--            <el-table-column label="日本状态" align="center">-->
<!--                <template slot-scope="scope">-->
<!--                    <div>-->
<!--                        {{scope.row.state}}-->
<!--                    </div>-->
<!--                </template>-->
<!--            </el-table-column>-->
            <el-table-column prop="priceState" label="价格变动" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.priceState==0">价格正常</span>
                    <span v-if="scope.row.priceState==1">价格上涨</span>
                    <span v-if="scope.row.priceState==2">价格下架</span>
                    <span v-if="scope.row.priceState==3" style="color: red;">倒挂</span>
                </template>
            </el-table-column>
            <el-table-column label="更新时间" align="center">
                <template slot-scope="scope">
                    <div>
                        {{scope.row.syncDate}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="可售状态" align="center">
                <template slot-scope="scope">
                    <div>
                        {{scope.row.japanShowWeb}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="上下架时间" align="center">
                <template slot-scope="scope">
                    <div>
                        {{scope.row.showWebDate}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
<!--                    <el-button size="mini" type="text" @click="detShowChange(scope.row)">查看详情</el-button>-->
                    <el-button @click="editList(scope.row)" type="text" size="mini">编辑</el-button>
                    <el-button  @click="cotrolGoodsShow('singe',scope.row)" type="text" size="mini" >
                        <span  v-if="scope.row.showWeb==0 || scope.row.showWeb==2">上架</span>
                        <span  v-if="scope.row.showWeb==1" class="artclose">下架</span>
                        <!-- <span  v-if="scope.row.goodsShow==2"   style="color:#FF0000">未上架</span> -->
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="bottomFun">
            <div class="bottomFunLeft">
                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                <el-button class="btn" type="success" @click="cotrolGoodsShow('batch',1)" style="margin-left: 20px;">批量上架</el-button>
                <el-button class="btn" type="success" @click="cotrolGoodsShow('batch',0)">批量下架</el-button>
            </div>
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
    </div>
</template>

<script>
    import mixinViewModule from '@/mixins/view-module'
    import Bread from "@/components/bread";
    import detail from "./detail";
    import { goodsUrl } from '@/api/url'
    import { showBatchGoods,showGoods, searchStoreName, searchBrandName, backScanCategorys } from '@/api/api'
    import cloneDeep from 'lodash/cloneDeep'
    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                mixinViewModuleOptions: {
                    getDataListURL: goodsUrl,
                    activatedIsNeed:true,
                    getDataListIsPage: true,
                    // exportURL: '/admin-api/log/login/export',
                    deleteIsBatch: true,
                    deleteIsBatchKey: 'id'
                },
                breaddata: [ "商品管理", "商品列表"],
                dataFormShow: {
                    goodsName: "",//商品名称/商品货号
                    idJp: "",//品牌名称
                    categoryId: "",//分类
                    storeName: "",//店铺名称
                    brandName:"",//品牌名称
                    sellState: "",//是否可售
                    showWeb:"",//上下架状态:0：待上架，1：已上架，2：下架 ,
                    priceState: "",//价格变更
                },
                classList:[],
                props: {
                    label:'name',
                    value: 'id',
                    children:'list'
                },
                showOptions: [{id: '0', label: '待上架'}, {id: '1', label: '已上架'}, {id: '2', label: '已下架'}],
                stateOptions: [{id: '0', label: '不可售'}, {id: '1', label: '可售'}],
                priceOptions: [{id: '0', label: '价格正常'}, {id: '1', label: '价格上涨'}, {id: '2', label: '价格下降'}, {id: '3', label: '倒挂'}],
                activeName: "",
                data: {}, //总数据
                dataListLoading: false,
                loading: false,
                detailOrList: 1,
                addressInfo: [], //地址数据
                // orderLog: [], //操作日志
                // orderData: [],
                isChange: true, //true--列表 false--详情
                multipleSelection:[],
                changeVal: "",
                isIndeterminate: false,
                checkednodeslist: [],
                checkAll: false,
                selectVal:"",
                checked:false,
                selectStoreOption:[],
                selectCategoryOption:[],
                selectBrandOption:[]
            }
        },
        components: {
            Bread,
            detail
        },
        created () {
            // 第一次请求数据
            // this.handleClick();
            this.activeName =  this.status == undefined ? "" : this.status;
            this.dataFormShow.showWeb = this.status == undefined ? "" : this.status;
            this.backScan();
            this.backScan1();
            this.backScan2();
        },
        methods: {
            // handleChangeOut(val){
            //     console.log(val)
            //     this.dataForm.categoryId = val[val.length-1];
            // },
            handleChange(){
                if(this.classList.length!=0){
                    this.dataForm.categoryId = this.classList[this.classList.length-1]
                }
                console.log(this.dataForm.categoryId)
            },
            changeStore(val){
                this.$set(this.dataFormShow,"storeId",val);
                this.selectStoreOption = [].concat(this.selectStoreOption)
            },
            changeBrand(val){
                this.$set(this.dataFormShow,"brandId",val);
                this.selectBrandOption = [].concat(this.selectBrandOption)
            },
            handleClick(tab,val) {
                if(tab== ""){
                    this.dataFormShow.showWeb = ""
                }else if(tab== "upper"){
                    this.dataFormShow.showWeb = "1"
                }else if(tab== "lower"){
                    this.dataFormShow.showWeb = "2"
                }else if(tab== "not"){
                    this.dataFormShow.showWeb = "0"
                }
                this.changeVal = val;
                this.dataForm.showWeb =  this.dataFormShow.showWeb
                console.log(this.changeVal)
                this.getDataList();
            },
            getData(){
                this.page =1;
                // this.dataForm = {};
                // for(let key in this.dataFormShow){
                //     this.$set(this.dataForm,`${key}`,this.dataFormShow[key]);
                // }
                this.dataForm = cloneDeep(this.dataFormShow);
                console.log(this.dataForm);
                this.getDataList()
            },
            reset() {
                this.dataFormShow.goodsName = "";
                this.dataFormShow.idJp = "";
                this.dataFormShow.categoryId = "";
                this.dataFormShow.storeId = "";
                this.dataFormShow.brandId = "";
                this.dataFormShow.goodsStatus = "";
                this.dataFormShow.showWeb = "";
                this.dataFormShow.priceState = "";
                this.dataForm.goodsName = "";
                this.dataForm.idJp = "";
                this.dataForm.categoryId = "";
                this.dataForm.storeId = "";
                this.dataForm.brandId = "";
                this.dataForm.goodsStatus = "";
                this.dataForm.showWeb = "";
                this.dataForm.priceState = "";
                this.handleClick();
            },
            //回显
            backScan(){
                var obj  = {
                    id:this.dataForm.id,
                    brandName:this.dataForm.brandName,
                }
                searchStoreName(obj).then((res)=>{
                    if(res.code == 200){
                        this.selectStoreOption = res.data;
                    }else{

                    }
                })
            },
            backScan1(){
                var obj  = {
                    id:this.dataForm.id,
                    storeName:this.dataForm.storeName,
                }
                searchBrandName(obj).then((res)=>{
                    if(res.code == 200){
                        this.selectBrandOption = res.data;
                    }else{

                    }
                })
            },
            backScan2(){
                var obj  = {
                    id:this.dataForm.id,
                    categoryName:this.dataForm.categoryName,
                }
                backScanCategorys(obj).then((res)=>{
                    if(res.code == 200){
                        this.selectCategoryOption = res.data;
                        // console.log( this.selectCategoryOption);
                        this.selectCategoryOption.forEach((item,index)=>{
                            item.list && item.list.forEach((item2,index2)=>{
                                item2.list="";
                            })
                        })

                    }else{

                    }
                })
            },
            // 编辑
            goEidt(row){
                console.log(row);
                this.$router.push({
                    path: 'mggoods-goods-add',
                    query:{
                        gcId:row.id,
                    }
                })
            },
            //页面跳转
            changeState() {
                this.isChange = !this.isChange;
               // this.getDataList(); //刷新页面数据
            },
            //编辑页展示判断
            editList(id) {
                this.$emit("editList", id);
            },
            //详情页展示判断
            detShowChange(row) {
                this.$emit("detShowChange", row);
            },
            // 控制上下架
            cotrolGoodsShow(type,rowOrstatus){
                var ids= [];
                var showWeb = 0;
                if(type=="batch"){ //批量
                    if(this.multipleSelection.length==0){
                        this.$message({
                            message: "请选择商品",
                            type:"warning",
                            duration: 1500,
                        })
                        return;
                    }
                    ids = this.getIds();
                    showWeb = rowOrstatus
                }else{ //单个
                    ids = [rowOrstatus.id]
                    showWeb = rowOrstatus.showWeb==1?2:1;
                }
                var obj = {
                    ids:ids,
                    showWeb:showWeb,
                }
                showBatchGoods(obj).then(res=>{
                    let status="";
                    let msg = "";
                    if(res.code=="200"){
                        status= "success"
                        msg = showWeb==1?"商品上架成功":"商品下架成功"
                        this.getDataList();
                    }else{
                        status= "error"
                        msg = res.msg;
                    }
                    this.$message({
                        message: msg,
                        type:status,
                        duration: 1500,
                    })
                })
            },
            getIds(){
                var ids= [];
                console.log(this.multipleSelection);
                this.multipleSelection.forEach((item,index)=>{
                    if("object" == typeof(item)){
                        ids.push(item.id);
                    }else{
                        ids.push(id);
                    }
                })
                return ids;
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
                if(this.multipleSelection.length == this.dataList.length) this.checkAll = true;
                else this.checkAll = false;
            },
            handleCheckAllChange(val) {
                if(val) this.$refs.multipleTable.toggleAllSelection();
                else this.$refs.multipleTable.clearSelection();
            },
        },
    }
</script>

<style lang="scss" scoped>
    @import "@/element-ui/theme-variables.scss";
    .bottomFun {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .bottomFunLeft {
            width: 450px;
            display: flex;
            align-items: center;
        }
    }
    /*img {*/
    /*    width: 100px;*/
    /*    height: 100px;*/
    /*}*/
</style>