<template>
    <div>
        <div v-if="mainVisible" ref="listCompon">
            <Bread :breaddata="breaddata" @changePage="changePage" :index="'1'"></Bread>
            <el-button size="mini">查看详情</el-button>
            <el-button size="mini" @click="operational">操作日志</el-button>
            <el-form
                    ref="dataForm"
                    class="grayLine topGapPadding"
                    :model="dataForm"
                    @keyup.enter.native="getData()"
                    style="margin-left: 20px;"
            >
                <el-form-item label="商品分类：" class="item" style="margin-top: 20px;">
                    <span>{{dataForm.firstCategory}}</span>-->
                    <span>{{dataForm.secondCategory}}</span>
                </el-form-item>
                <el-form-item label="商品ID：" class="item">
                    <span>{{dataForm.idJp}}</span>
                    <span style="margin-left:2%;color:green;cursor:pointer;" @click="log">查看备案信息</span>
                </el-form-item>
                <el-form-item label="日本商品名称：" class="item">
                    <template slot-scope="scope">
                        <span v-if="dataForm.nameJp">{{dataForm.nameJp}}</span>
                        <span v-else>/</span>
                    </template>
                </el-form-item>
                <el-form-item label="商品名称：" class="item">
                    <template slot-scope="scope">
                        <span v-if="dataForm.name">{{dataForm.name}}</span>
                        <span v-else>/</span>
                    </template>
                </el-form-item>
<!--                <el-form-item label="品牌：" class="item">-->
<!--                    <span>{{dataForm.brandName}}</span>-->
<!--                </el-form-item>-->
                <el-form-item label="主品牌：" class="item">
                    <!--                <span>{{}}</span>-->
                    <template>
                        <span v-if="dataForm.brands && dataForm.brands.length!=0 && dataForm.brands[0].isMainBrand==0">{{dataForm.brands[0].brandName}}</span>
                        <span v-else>/</span>
                    </template>
                </el-form-item>
                <el-form-item label="副品牌：" class="item">
                    <template>
                        <span v-if="dataForm.brands && dataForm.brands.length!=0 &&dataForm.brands[0].isMainBrand==1">{{dataForm.brands[0].brandName}}</span>
                        <span v-else>/</span>
                    </template>
                </el-form-item>
                <el-form-item label="所属店铺：" class="item">
                    <template slot-scope="scope">
                        <span v-if="dataForm.storeName">{{dataForm.storeName}}</span>
                        <span v-else>/</span>
                    </template>
                </el-form-item>
<!--                <el-form-item label="性别：" class="item">-->
<!--                    <template>-->
<!--                        <span v-if="dataForm.genders==0">男</span>-->
<!--                        <span v-if="dataForm.genders==1">女</span>-->
<!--                        <span v-if="dataForm.genders==2">儿童</span>-->
<!--                    </template>-->
<!--                </el-form-item>-->
                <el-form-item label="主性别：" class="item">
                    <template>
                        <span v-if="dataForm.genders==0">男</span>
                        <span v-if="dataForm.genders==1">女</span>
                        <span v-if="dataForm.genders==2">儿童</span>
                        <span v-if="dataForm.genders==null">/</span>
                    </template>
                </el-form-item>
                <el-form-item label="副性别：" class="item">
                    <template>
                        <span v-if="dataForm.viceGenders==0">男</span>
                        <span v-if="dataForm.viceGenders==1">女</span>
                        <span v-if="dataForm.viceGenders==2">儿童</span>
                        <span v-if="dataForm.viceGenders==null">/</span>

                    </template>
                </el-form-item>
                <el-form-item label="日本销售价：" class="item">
                    <template slot-scope="scope">
                        <span v-if="dataForm.properPriceYen">{{dataForm.properPriceYen}}</span>
                        <span v-else>/</span>
                    </template>
                </el-form-item>
                <el-form-item label="日本促销价：" class="item">
                    <template slot-scope="scope">
                        <span v-if="dataForm.salePriceYen">{{dataForm.salePriceYen}}</span>
                        <span v-else>/</span>
                    </template>
                </el-form-item>
                <el-form-item label="品牌销售价：" class="item">
                    <template slot-scope="scope">
                        <span v-if="dataForm.properPrice">{{dataForm.properPrice}}</span>
                        <span v-else>/</span>
                    </template>
                </el-form-item>
                <el-form-item label="品牌促销价：" class="item">
                    <template slot-scope="scope">
                        <span v-if="dataForm.salePrice">{{dataForm.salePrice}}</span>
                        <span v-else>/</span>
                    </template>
                </el-form-item>
                <el-form-item label="价格标识：" class="item">
                    <!--                <span>{{dataForm.salePlan}}</span>-->
                    <template>
                        <span v-if="dataForm.salePlan==0">关税计算</span>
                        <span v-if="dataForm.salePlan==1">品牌方设定</span>
                    </template>
                    <template>
                        <span v-if="dataForm.priceType=='sale'">促销价</span>
                        <span v-if="dataForm.priceType=='proper'">标准价</span>
                    </template>
                    <span v-if="dataForm.salePlan==null && dataForm.priceType==null">/</span>
                </el-form-item>
                <el-form-item label="原产地：" class="item">
                    <template slot-scope="scope">
                        <span v-if="dataForm.madeIn">{{dataForm.madeIn}}</span>
                        <span v-else>/</span>
                    </template>
                </el-form-item>
                <el-form-item label="材质：" class="item">
                    <template slot-scope="scope">
                        <span v-if="dataForm.material">{{dataForm.material}}</span>
                        <span v-else>/</span>
                    </template>
                </el-form-item>
                <el-form-item label="上架状态：" class="item">
                    <template>
                        <span v-if="dataForm.showWeb==0">下架</span>
                        <span v-if="dataForm.showWeb==1">上架</span>
                        <span v-if="dataForm.showWeb==2">未上架</span>
                        <span v-if="dataForm.showWeb==null">/</span>
                    </template>
                </el-form-item>
                <el-form-item label="日本上架状态：" class="item">
                    <template>
                        <span v-if="dataForm.japanShowWeb=='true' || dataForm.japanShowWeb==1|| dataForm.japanShowWeb==true">可售</span>
                        <span v-else-if="dataForm.japanShowWeb=='false' || dataForm.japanShowWeb==0 || dataForm.japanShowWeb==false">不可售</span>
                        <span v-if="dataForm.japanShowWeb==null">/</span>
                    </template>
                </el-form-item>
                <el-form-item label="可售状态：" class="item">
                    <template>
                        <span v-if="dataForm.sellState==0">不可售</span>
                        <span v-if="dataForm.sellState==1">可售</span>
                        <span v-if="dataForm.sellState==null">/</span>
                    </template>
                </el-form-item>
                <el-form-item label="颜色尺码：">
                    <el-table
                            border
                            :data="skuVOList"
                            class="inforRight"
                            style="display:inline-block;width: 90%">
                        <el-table-column prop="goodsCsIdJp" label="SKU编码" align="center">
                            <template slot-scope="scope">
                                <span v-if="scope.row.goodsCsIdJp">{{scope.row.goodsCsIdJp}}</span>
                                <span v-if="scope.row.goodsCsIdJp==null">/</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="colorName" label="颜色" align="center">
                            <template slot-scope="scope">
                                <span v-if="scope.row.colorName">{{scope.row.colorName}}</span>
                                <span v-if="scope.row.colorName==null">/</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="sizeName" label="尺码" align="center">
                            <template slot-scope="scope">
                                <span v-if="scope.row.sizeName">{{scope.row.sizeName}}</span>
                                <span v-if="scope.row.sizeName==null">/</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="specId" label="尺码信息" align="center">
                            <template slot-scope="scope">
                                <div @click="detShowChange(scope.row)" style="color: #2260D2;cursor:pointer;">
                                    查看
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="stockQuantity" label="库存" align="center">
                            <template slot-scope="scope">
                                <span v-if="scope.row.stockQuantity || scope.row.stockQuantity=='0'">{{scope.row.stockQuantity}}</span>
                                <span v-else>/</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="sellStartDate" label="售卖开始时间" align="center">
                            <template slot-scope="scope">
                                <span v-if="scope.row.sellStartDate">{{scope.row.sellStartDate}}</span>
                                <span v-if="scope.row.sellStartDate==null">/</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="sellEndDate" label="售卖结束时间" align="center">
                            <template slot-scope="scope">
                                <span v-if="scope.row.sellEndDate">{{scope.row.sellEndDate}}</span>
                                <span v-if="scope.row.sellEndDate==null">/</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="cartLimit" label="日本限购数量" align="center">
                            <template slot-scope="scope">
                                <span v-if="scope.row.cartLimit || scope.row.cartLimit=='0'">{{scope.row.cartLimit}}</span>
                                <span v-else>/</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="limitPerCustomer" label="日本每人限购数量" align="center">
                            <template slot-scope="scope">
                                <span v-if="scope.row.limitPerCustomer || scope.row.limitPerCustomer=='0'">{{scope.row.limitPerCustomer}}</span>
                                <span v-else>/</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="sellPrice" label="售价(RMB)" align="center">
                            <template slot-scope="scope">
                                <span v-if="scope.row.specSellPrice!==''&&scope.row.specSellPrice!==null"
                            >￥{{scope.row.sellPrice?scope.row.sellPrice:'0.00'}}</span>
                                <span v-else>/</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="goodsNum" label="图片" align="center">
                            <template slot-scope="scope">
                                <img
                                        :src="scope.row.imageUrl | filterImgUrl"
                                        style=" object-fit: contain;width: 70px;height:70px;border-radius:100px;"
                                >
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
                <el-form-item label="分类条件：" style="overflow: hidden;">
                    <el-row v-for="(item,index) in dataForm.tags" :key="index" class="info" style="width: 80%;">
                        <el-col :span="12"><div class="grid-content">{{item.parentTagName}}</div></el-col>
                        <el-col :span="12"><div class="grid-content">{{item.nameJp}}</div></el-col>
                    </el-row>
<!--                    <Table class="inforRight" style="display: inline-block;" :tableData="tableData" :tableStyle="{ width:'600px' }"></Table>-->
                </el-form-item>
                <el-form-item label="商品图片：">
                        <template slot-scope="scope">
                            <div class="goodsImg" style="display:flex">
        <!--                        <img  :src="scope.row.imageUrl | filterImgUrl" style="width:60px;height:60px;object-fit: contain;" alt=""/>-->
                                <!-- <img :src="dataForm.imageUrl | filterImgUrl" alt=""/> -->
                            <div v-for="(item,index) in  dataForm.imgs" style="width:100px;height:100px;margin-right:5px;">
                                    <img :src="item.sizeOriginal | filterImgUrl" alt="" style="width:100%;height:100%"/>
                            </div>
                            </div>
                        </template>
                </el-form-item>
                <el-form-item label="日本商品详情：" class="item" style="height: auto!important;">
                    <div  v-html="dataForm.descriptionJp"></div>
                </el-form-item>
                <el-form-item label="商品详情：">
                    <el-input type="textarea" class="inforRight" v-model="dataForm.description" placeholder="" :rows="4"  style="display: inline-block;width: 600px;"></el-input>
                    <!-- 富文本编辑器, 容器 -->
                    <!--                <quill-editor-img class="inforRight" style="display: inline-block;"  @artmessageContent='artmessageContent' ref="refmessageContent"></quill-editor-img>-->
                </el-form-item>
            </el-form>
        </div>

        <!-- 备案 -->
        <addEditData :idJp="dataForm.idJp" v-if="addEditDataVisible" ref="addEditData" @searchDataList="getData"></addEditData>
        <!-- 操作日志 -->
        <operationallog :idJp="dataForm.idJp" v-if="operationallogVisible" ref="operationallogCompon" @searchDataList="getData" ></operationallog>
        <!-- 尺码信息 -->
        <sizeData v-if="sizeDataVisible" ref="sizeDataCompon" @searchDataList="getData"></sizeData>
    </div>
</template>

<script>
    import addEditData from './recordList'
    import sizeData from './model-size'
    import Bread from "@/components/bread";
    import quillEditorImg from "@/components/quillEditor"
    //import addEditData from './model-show-data'
    // import mixinViewModule from '@/mixins/view-module'
    import { backScanZozogoods,backScanZozogoods2 } from '@/api/api'

    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import Quill from 'quill'
    import operationallog from "./operationalLog"
    export default {
        // mixins: [mixinViewModule],
        data () {
            return {
                breaddata: [ "商品管理","商品列表", "商品详情"],
                dataForm:{},
                addEditDataVisible: false,
                data: {}, //总数据
                skuVOList: [],
                operationallogVisible:false,
                sizeDataVisible: false,
                mainVisible: true,
                tags: [],
                row:'',
            }
        },
        components: {
            Bread,
            quillEditorImg,
            addEditData,
            operationallog,
            sizeData
        },
        created(){

        },
        methods: {
            init(row){
                this.row = row;
                this.$nextTick(()=>{
                    if(row){
                        var obj  = {
                            id:row.id
                        }

                        var fn = backScanZozogoods
                         //  如果是备案商品
                        if(row.origin && row.origin=="recordinformation"){
                            fn = backScanZozogoods2;
                        }
                        fn(obj).then((res)=>{
                            console.log('详情',res.data)
                            if(res.code == 200){
                                this.dataForm = res.data;
                                this.skuVOList = res.data.skuVOList;
                            }
                        })
                    }
                })
            },
            getData(){
            },
            operational () {
                this.setOperationalVisible(true);
                this.$nextTick(() => {
                    this.$refs.operationallogCompon.init(this.row)
                })
                console.log(this.row)
            },
            setOperationalVisible () {
                this.operationallogVisible =  true;
                this.mainVisible = false;
                this.idJp = this.dataForm.idJp;
                console.log(this.dataForm.idJp)
            },
            more () {
                this.operationallogVisible =  false;
                this.mainVisible = true;
                // this.$nextTick(() => {
                //     this.$refs.listCompon.getDataList();
                // })
            },
            artmessageContent(messageContent){
                this.dataForm.messageContent = messageContent;
            },
            changePage(){
                this.$emit("logMore");
            },
            log(){
                this.setAddEditDataVisible(true);
                console.log("dataForm：");
                console.log(this.dataForm);
                this.$nextTick(() => {
                    this.$refs.addEditData.init();
                })
            },
            setAddEditDataVisible(){
                this.addEditDataVisible =  true;
                this.idJp = this.dataForm.idJp;
                console.log(this.dataForm.idJp)
            },
            detShowChange (row2) {
                this.sizeDataVisible =  true;
                console.log(this.dataForm);
                this.$nextTick(() => {
                    this.$refs.sizeDataCompon.init(this.row,row2);
                })
            }
            // operational () {
            //     this.$emit("operational",this.dataForm.idJp)
            // },

        }
    }
</script>

<style lang="scss" scoped>
    /*.inforTit {*/
    /*    width: 100px;*/
    /*    font-weight: 600;*/
    /*    text-align: right;*/
    /*    display: inline-block;*/
    /*}*/
    /*.inforRight {*/
    /*    margin-left: 40px;*/
    /*    display: inline-block;*/
    /*}*/
    /*div {*/
    /*    padding: 8px 0;*/
    /*}*/
    /*.orderState {*/
    /*    margin-left: 5%;*/
    /*}*/
    /deep/ .el-form-item__label {
        /*width: 135px!important;*/
    }
    // .item {
    //     height: 26px!important;
    // }
    .grayLine {
        border-bottom: 0!important;
    }
    .grid-content {
        border: 1px solid #ebeef5;
        height: 54px;
        line-height: 54px;
        text-align: center;
        white-space: nowrap;
	    overflow: hidden;
	    text-overflow: ellipsis;
    }
    .info {
        margin-left: 135px;
    }
    .cell div{
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
    }
    /deep/ .grid-content {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .el-form-item {
        margin-bottom: 0!important;
    }
</style>