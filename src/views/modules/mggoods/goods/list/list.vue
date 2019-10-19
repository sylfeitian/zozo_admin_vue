<template>
    <div>
        <!-- <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/' }">商品</el-breadcrumb-item>
              <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
              <el-breadcrumb-item>商品列表</el-breadcrumb-item>
            </el-breadcrumb> -->
        <Bread  :breaddata="breaddata"></Bread>
        <el-form :inline="true" class="grayLine topGapPadding" :model="dataForm" @keyup.enter.native="getDataList()" >
            <!-- <el-scrollbar style="height:90px;margin-right: 30px;"> -->
            <el-form-item label="输入搜索：">
                <el-input v-model.trim.trim="dataForm.goodsName" placeholder="商品名称/商品货号" ></el-input>
            </el-form-item>
            <el-form-item  label="所属店铺：">
                <el-input v-model.trim.trim="dataForm.storeName" placeholder="店铺名称" ></el-input>
            </el-form-item>
            <el-form-item label="商品分类：">
                <!-- <el-select
                  v-model="dataForm.gcId0"
                  placeholder="请选择"
                  loading-text="加载中···"
                  @visible-change="getGoodsClassFn(1)">
                  <el-option
                    v-for="item in goodscalssOption0"
                    :key="item.id"
                    :label="item.gcName"
                    :value="item.id">
                  </el-option>
                </el-select>
                <span style="color:#999999"> - </span>
                <el-select
                v-model="dataForm.gcId1"
                  placeholder="请选择"
                  :loading="goodKind1loading"
                  loading-text="加载中···"
                  @visible-change="getGoodsClassFn(2)">
                  <el-option
                    v-for="item in goodscalssOption1"
                    :key="item.id"
                    :label="item.gcName"
                    :value="item.id">
                  </el-option>
                </el-select>
                <span style="color:#999999"> - </span>
                <el-select
                v-model="dataForm.gcId2"
                  placeholder="请选择"
                  :loading="goodKind2loading"
                  loading-text="加载中···">
                  <el-option
                    v-for="item in goodscalssOption2"
                    :key="item.id"
                    :label="item.gcName"
                    :value="item.id">
                  </el-option>
                </el-select> -->
                <!-- {{goodscalssOption}} -->
                <el-cascader
                        clearable=""
                        v-model="gcIds"
                        :options="goodscalssOption"
                        @active-item-change="handleItemChange"
                        @change ="finishCange()"
                ></el-cascader>
            </el-form-item>
            <el-form-item  label="商品品牌：">
                <!-- <el-select
                v-model="dataForm.brandId"
                placeholder="请选择">
                    <el-option
                        v-for="item in brandListOption"
                        :key="item.id"
                        :label="item.brandName"
                        :value="item.id">
                    </el-option>
                </el-select> -->
                <el-autocomplete
                        v-model="state4"
                        :fetch-suggestions="getBrandListPull"
                        placeholder="请输入品牌"
                        @select="handleSelect"
                ></el-autocomplete>
            </el-form-item>
            <!-- </el-scrollbar> -->
            <el-form-item>
                <el-button  class="btn" type="primary" @click="handleClick()">搜索</el-button>
                <!-- </el-form-item>
                <el-form-item> -->
                <el-button   class="btn"  @click="reset()" type="primary" plain>重置</el-button>
            </el-form-item>
        </el-form>

        <!--        <el-tabs v-model="activeName" @tab-click="handleClick" class="botttomGapPadding">-->
        <!--            <el-tab-pane label="全部" name="first">-->
        <!--                <listItem :dataForm="dataForm" ref="firstList" @showSkuListFn="showSkuListFn"></listItem>-->
        <!--            </el-tab-pane>-->
        <!--            <el-tab-pane label="上架" name="second">-->
        <!--                <listItem :dataForm="dataForm"  ref="secondList" @showSkuListFn="showSkuListFn"></listItem>-->
        <!--            </el-tab-pane>-->
        <!--            <el-tab-pane  label="下架" name="third">-->
        <!--                <listItem :dataForm="dataForm" ref="thirdList" @showSkuListFn="showSkuListFn"></listItem>-->
        <!--            </el-tab-pane>-->
        <!--            <el-tab-pane  label="未上架" name="four">-->
        <!--                <listItem :dataForm="dataForm" ref="fourList" @showSkuListFn="showSkuListFn"></listItem>-->
        <!--            </el-tab-pane>-->
        <!--        </el-tabs>-->
        <el-radio-group v-model="activeName" @change="handleClick">
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button label="upper">上架</el-radio-button>
            <el-radio-button label="lower">下架</el-radio-button>
            <el-radio-button label="not">未上架</el-radio-button>
        </el-radio-group>
        <el-table
                width="100%"
                :data="dataList"
                border
                v-loading="dataListLoading"
                style="width: 100%"
        >
            <el-table-column type="selection" width="70"></el-table-column>
            <el-table-column label="序号" width="70" align="center">
                <template slot-scope="scope">
                    {{scope.$index+1+(parseInt(page)-1)* parseInt(limit) }}
                </template>
            </el-table-column>
            <el-table-column label="商品" align="center" width="330">
                <template slot-scope="scope">
                    <div class="goodsPropsWrap">
                        <div class="goodsImg">
                            <img :src="scope.row.pictureUrl | filterImgUrl" alt=""/>
                        </div>
                        <div class="goodsProps">
                            <span class="goodsName">
                                <label class="goodsNameTitle">名称:</label>
                                <el-tooltip class="item" effect="dark" :content="scope.row.goodsName" placement="top-start">
                                      <a class="goodsNameContent" :href="scope.row.id | filterhrefUrl"  target="view_window">{{scope.row.goodsName}}</a>
                                </el-tooltip>
                            </span>
                            <span  class="goodsBrand">
                                <label class="goodsNameTitle">品牌:</label>
                                <span class="goodsBrandName">{{scope.row.brandName}}</span>
                            </span>
                            <span class="goodsNum">
                                <label class="goodsNameTitle">编号:</label>
                                <span class="goodsBrandName">{{scope.row.brandName}}</span>
                            </span>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="price" label="价格(销售价/成本价)" width="170" align="right">
                <template slot-scope="scope">
                    <div class="priceWrap">
                        <div class="price1">￥{{scope.row.specSellPrice}}</div>
                        <div class="price2">￥{{scope.row.specCostPrice}}</div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="gcName" label="分类"  align="center">
                <template slot-scope="scope">
                    <div>
                        {{scope.row.gcName}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="storeName" label="店铺名称" align="center">
                <template slot-scope="scope">
                    <div>
                        {{scope.row.storeName}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button @click="goEidt(scope.row)" type="text" size="mini">编辑</el-button>
                    <el-button  @click="cotrolGoodsShow('singe',scope.row)" type="text" size="mini" >
                        <span  v-if="scope.row.goodsShow==0 || scope.row.goodsShow==2">上架</span>
                        <span  v-if="scope.row.goodsShow==1" class="artclose">下架</span>
                        <!-- <span  v-if="scope.row.goodsShow==2"   style="color:#FF0000">未上架</span> -->
                    </el-button>
                    <el-button  @click="editSku(scope.row)" type="text" size="mini">SKU</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div  class="bottomFun">
            <div class="bottomFunLeft">
                <!-- <el-checkbox v-model="checked" @change="change">全选</el-checkbox> -->
                <div class="grayBtnWarp">
                    <el-button type="primary" plain @click="cotrolGoodsShow('batch',1)">上架</el-button>
                    <el-button type="info" plain @click="cotrolGoodsShow('batch',0)">下架</el-button>
                    <!--                    <el-button type="danger" plain @click="deleteHandle()">删除</el-button>-->
                </div>
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
    import { showBatchGoods } from '@/api/api'
    import { goodsPageUrl,deleteGoodsUrl } from '@/api/url'
    import Bread from "@/components/bread";
    import listItem from "./listItem.vue"
    import {brandListPull} from "@/api/api.js";
    import {getGoodscalss} from "@/api/api.js";
    import { setTimeout } from 'timers';
    import { constants } from 'crypto';
    let id = 0;
    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                mixinViewModuleOptions: {
                    getDataListURL: goodsPageUrl,
                    activatedIsNeed:false,
                    getDataListIsPage: true,
                    // exportURL: '/admin-api/log/login/export',
                    deleteURL: deleteGoodsUrl,
                    deleteIsBatch: true,
                    deleteIsBatchKey: 'id'
                },
                checked:false,
                multipleSelection:[],
                gcIds:[],
                state4:"",
                breaddata: ["商品", "商品管理", "商品列表"],
                goodKind1loading:false,
                goodKind2loading:false,
                dataForm: {
                    goodsName: "",//商品名称/商品货号
                    storeName: "",//所属店铺
                    brandId: "",//品牌id
                    gcId: "",//分类ID
                    goodsShow:"",//上下架状态:0下架;1上架
                    // gcId0:'',
                    // gcId1:'',
                    // gcId2:'',
                },
                activeName: "",
                brandListOption:[],//品牌列表
                // goodscalssOption0: [],
                // goodscalssOption1: [],
                // goodscalssOption2: [],
                goodscalssOption:[
                    // {
                    //     value: '123',
                    //     label: '江苏2',
                    //     children: []
                    // },
                ],
                dataListLoading: false,
            };
        },
        components: {
            Bread,
            listItem
        },
        watch:{
            state4(val){
                if(!val){
                    this.dataForm.brandId = ""
                }
            }
        },
        created() {
            // 获取商品品牌下拉
            // this.getBrandList();
            // 获取商品分类下拉
            // this.getGoodsClassFn(0);
            this.handleItemChange();
            // 第一次请求数据
            this.handleClick();
            this.activeName =  this.status == undefined ? "" : this.status;
            this.dataForm.goodsShow = this.status == undefined ? "" : this.status;
        },
        methods: {
            // 获取品牌下拉列表
            getBrandListPull(brandName,cb){
                var obj = {
                    params:{
                        // page:1,
                        // limit:50,
                        brandName:brandName,
                    }
                }
                brandListPull(obj).then((res)=>{
                    if(res.code == 200){
                        // this.brandListOption =  [{"id":"",brandName:"全部"}].concat(res.data);
                        var showData = []
                        res.data.forEach((item,index) => {
                            item.value = item.brandName;
                            showData.push(item);
                        });
                        cb(showData)
                    }
                })
            },
            // // 获取品牌下拉列表
            handleSelect(item){
                console.log(item);
                this.dataForm.brandId = item.id
                // this.dataForm.brandName= item.brandName
                // this.dataForm.brandId= item.id
            },
            // 后去商品分类（三级联动）
            // getGoodsClassFn(arguId){
            //     var id= 0;
            //       if(arguId==1){//二级关联
            //           if(!this.dataForm.gcId0){this["goodscalssOption"+arguId] = []; return;}
            //           id = this.dataForm.gcId0;

            //           this.dataForm.gcId1 = "";
            //           this.dataForm.gcId2 = "";
            //           this["goodscalssOption1"] = [];
            //           this["goodscalssOption2"] = [];

            //       }else if(arguId==2){//三级关联
            //           if(!this.dataForm.gcId1) {this["goodscalssOption"+arguId] = []; return;}
            //           id = this.dataForm.gcId1;

            //            this.dataForm.gcId2 = "";
            //           this["goodscalssOption2"] = [];
            //       }else{//一级关联
            //           id=0;
            //           this.dataForm.gcId1 = "";
            //           this.dataForm.gcId2 = "";
            //           this["goodscalssOption1"] = [];
            //           this["goodscalssOption2"] = [];
            //       }
            //       var obj = {
            //           id:id
            //       }
            //       getGoodscalss(obj).then((res)=>{
            //           console.log(res)
            //           if(res.code == 200){
            //             if(arguId==0){
            //               this["goodscalssOption"+arguId] = [{id:"",gcName:"全部"}].concat(res.data);
            //             }else{
            //               this["goodscalssOption"+arguId] = res.data;
            //             }
            //           }
            //       })
            // },
            handleItemChange(val){
                console.log('active item:', val, typeof val);
                // console.log(val);
                var val1 = [];
                if(val && typeof(val) == "string"){
                    val1 =  JSON.parse(val);
                }
                else{
                    val &&  val.forEach((item,index)=>{
                        if(typeof(item) == "string"){
                            val1.push(JSON.parse(item))
                        }else{
                            val1.push(item)
                        }
                    })
                }
                if(val1)
                // console.log(val1)
                    var id =0
                let takeBlack = true
                if(Object.prototype.toString.call(val1) === '[object Object]'){
                    id = val1.id ?val1.id:0;
                }else if(Object.prototype.toString.call(val1) === '[object Array]' && val1.length>0){
                    id =  val1[val1.length-1].id;
                    if(val1.length==2) takeBlack = false
                }
                var obj = {
                    id:id
                }
                // console.log(val1.length,Object.prototype.toString.call(val1),takeBlack);
                getGoodscalss(obj).then((res)=>{
                    if(res.code == 200){
                        res.data.forEach((item,index)=>{
                            item.label = item.gcName
                            takeBlack?item.children = []:""
                            item.value = JSON.stringify(item);
                            // item.value = item.id
                        })
                        if(!val){
                            this.goodscalssOption = res.data;
                        }else{
                            this.goodscalssOption.forEach((item,index)=>{
                                if(item.id == id){
                                    item.children= res.data.length>0?res.data:"";
                                }
                                item.children.forEach((item2,index2)=>{
                                    if(item2.id == id){
                                        item2.children =  res.data.length>0?res.data:"";
                                    }
                                })
                            })
                        }
                    }
                    // console.log(this.goodscalssOption);
                })
            },
            finishCange(){
                console.log(this.gcIds);
                if(this.gcIds.length>0){
                    this.dataForm.gcId = JSON.parse(this.gcIds[this.gcIds.length-1]).id
                    console.log(JSON.parse(this.gcIds[this.gcIds.length-1]).id);
                }else{
                    this.dataForm.gcId="";
                }

            },
            handleClick(tab) {
                if(tab== ""){
                    this.dataForm.goodsShow = ""
                }else if(tab== "upper"){
                    this.dataForm.goodsShow = "1"
                }else if(tab== "lower"){
                    this.dataForm.goodsShow = "0"
                }else if(tab== "not"){
                    this.dataForm.goodsShow = "2"
                }
                this.getDataList();
            },
            agreeChange(val) {
                this.dataForm.goodsShow = val;
                this.getDataList();
            },
            reset() {
                this.dataForm.goodsName = "";//商品名称/商品货号
                this.dataForm.storeName = "";//所属店铺
                this.dataForm.brandId = "";//品牌id
                this.dataForm.gcId = "";//分类ID
                this.state4  = ""
                // this.dataForm.goodsShow = "";//上下架状态:0下架;1上架
                // this.dataForm.gcId0 = "";//分类ID
                // this.dataForm.gcId1 = "";//分类ID
                // this.dataForm.gcId2 = "";//分类ID
                this.handleClick();
            },
            showSkuListFn(row){
                this.$emit("showSkuListFn",row);
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
            // 控制上下架
            cotrolGoodsShow(type,rowOrstatus){
                var ids= [];
                var goodsShow = 0;
                if(type=="batch"){ //批量
                    if(this.multipleSelection.length==0){
                        this.$message({
                            message: "请选择商品",
                            type:"warning",
                            duration: 1500,
                        })
                    }
                    ids = this.getIds();
                    goodsShow = rowOrstatus
                }else{ //单个
                    ids = [rowOrstatus.id]
                    goodsShow = rowOrstatus.goodsShow==1?0:1;
                }
                var obj = {
                    ids:ids,
                    goodsShow:goodsShow,
                }
                showBatchGoods(obj).then(res=>{
                    let status="";
                    let msg = "";
                    if(res.code=="200"){
                        status= "success"
                        msg = goodsShow==1?"商品上架成功":"商品下架成功"
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
            editSku(row){
                this.$emit("showSkuListFn",row)
            }
        }
    };
</script>
<style lang="scss" scoped>
    @import "@/element-ui/theme-variables.scss";
    .el-popper {
        left: 292px !important;
    }
    .el-table--border {
        margin-top: 20px;
    }
    .el-radio-group {
        margin-top: 20px;
    }
    .orderUerInfo {
        width: 100%;
        height: auto;
        margin-top: 20px;
        border: 1px solid #d1d1d1;
    }
    /* .el-scrollbar__wrap {
      overflow-x: hidden;
    } */
    .el-scrollbar .el-scrollbar__wrap .el-scrollbar__view {
        white-space: nowrap;
    }
    .el-form--inline .el-form-item {
        margin-right: 76px;
    }
    *::-webkit-scrollbar {
        width: 7px;
        height: 1px;
        background-color: transparent;
    } /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
    *::-webkit-scrollbar-track {
        background-color: #f0f6ff;
    } /*定义滚动条轨道 内阴影+圆角*/
    *::-webkit-scrollbar-thumb {
        background-color: #e3e4e4;
        border-radius: 6px;
    } /*定义滑块 内阴影+圆角*/
    .scrollbarHide::-webkit-scrollbar {
        display: none;
    }
    .scrollbarShow::-webkit-scrollbar {
        display: block;
    }

    .el-input {
        width: 170px;
        height: 40px;
    }
    /deep/ .el-tabs__nav-wrap {
        border-bottom: 2px #efefef dotted;
        &::after {
            content: unset;
        }
    }
    /deep/ .el-tabs__nav-scroll {
        height: 60px;
        line-height: 60px;
        /deep/ .el-tabs__item {
            width: 120px;
            // box-sizing: border-box;
            text-align: center;
        }
    }
    /deep/ .el-tabs__active-bar {
        // width: 120px !important;
    }

    .grayBtn {
    }
    // 表头背景和字体颜色
    /deep/ .el-table__header  th{
        background:#f5f7fa;
    }
    // 勾选表格复选框居中
    /deep/ tr .cell{
        display: flex;
        justify-content: center
    }
    // 表内字体默认颜色
    /deep/ .el-table__row{
        color: #999999FF;
        font-size: 14px;
    }

    // 复选框颜色改正
    /deep/ .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner{
        // background-color: #666666 !important;
        // border-color: #666666 !important;
    }
    // 表格内部纵向分割线颜色
    .el-table--border td, .el-table--border th, .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed{
        border-right: 1px solid white;
    }
    // 商品
    .goodsPropsWrap{
        margin: auto;
        height: 110px;
        width: 330px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        .goodsImg{
            width: 70px;
            height: 70px;
            img{
                width:100%;
                height: 100%;
            }
        }
        .goodsProps{
            width: 210px;
            height: 70px;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            color: #999999;
            .goodsNameTitle{
                display: inline-block;
                width: 50px;
                color: #666666FF;
            }
            .goodsBrandName{
                text-align: left;
            }
            .goodsName{
                display: flex;
                .goodsNameContent{
                    width: 150px;
                    text-align: left;
                    text-overflow: -o-ellipsis-lastline;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    line-clamp: 2;
                    -webkit-box-orient: vertical;
                }

            }
        }
    }

    // 价格
    .priceWrap{
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 100%;
        .price1{
            color: $--color-primary;
        }
        div{
            width: 100%;
            text-align: right;
        }

    }

    // 分类


    // 店铺名称

    // 操作
    .btnWrap{
        display: flex;
        justify-content: space-around;
        align-items: center;
        .editWrap{
            cursor: pointer;
        }
        .skuWrap{
            cursor: pointer;
        }
        .btsvg{
            margin-right: 3px;
        }
    }
    .el-table__row:hover {
        .editWrap,.skuWrap{
            color: #2260D2;
        }
    }
    .bottomFun{
        display: flex;
        justify-content: space-between;
        align-items: center;
        .bottomFunLeft{
            width: 450px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }


    }
</style>
