<template>
    <div>
        <Bread :breaddata="breaddata" @changePage="changePage" :index="'1'"></Bread>
        <el-form
                ref="dataForm"
                class="grayLine topGapPadding"
                :model="dataForm"
                @keyup.enter.native="getDataList()"
                style="margin-left: 20px;margin-bottom: 100px;"
        >
            <el-form-item label="商品分类：" class="item" style="margin-top: 20px;">
                <span>{{dataForm.firstCategory}}</span>-->
                <span>{{dataForm.secondCategory}}</span>
                <span style="margin-left: 2%;color:green;cursor:pointer;" @click="logMore">修改</span>
            </el-form-item>
            <el-form-item label="商品编码：" class="item">
                <span>{{dataForm.idJp}}</span>
            </el-form-item>
            <el-form-item label="日本商品名称：" class="item">
                <span>{{dataForm.nameJp}}</span>
            </el-form-item>
            <el-form-item label="商品名称：" class="item">
                <el-input v-model="dataForm.goodsName" placeholder="请输入" maxlength="60" style="margin-left: 10px;"></el-input>&nbsp;&nbsp;
                <span style="color: #bebebe;">最多可输入60个文字</span>
            </el-form-item>
            <el-form-item label="品牌：" class="item">
                <span>{{dataForm.brandName}}</span>
            </el-form-item>
            <el-form-item label="所属店铺：" class="item">
                <span>{{dataForm.storeName}}</span>
            </el-form-item>
            <el-form-item label="主品牌：" class="item">
<!--                <span>{{}}</span>-->
                <template>
                    <span v-if="dataForm.brands && dataForm.brands.length!=0 && dataForm.brands[0].isMainBrand==1">{{dataForm.brands[0].brandName}}</span>
                </template>
            </el-form-item>
            <el-form-item label="副品牌：" class="item">
                <template>
                    <span v-if="dataForm.brands && dataForm.brands.length!=0 &&dataForm.brands[0].isMainBrand==0">{{dataForm.brands[0].brandName}}</span>
                </template>
            </el-form-item>
            <el-form-item label="主性别：" class="item">
                <template>
                    <span v-if="dataForm.genders==0">男</span>
                    <span v-if="dataForm.genders==1">女</span>
                    <span v-if="dataForm.genders==2">儿童</span>
                </template>
            </el-form-item>
            <el-form-item label="副性别：" class="item">
                <template>
                    <span v-if="dataForm.viceGenders==0">男</span>
                    <span v-if="dataForm.viceGenders==1">女</span>
                    <span v-if="dataForm.viceGenders==2">儿童</span>
                </template>
            </el-form-item>
            <el-form-item label="日本销售价：" class="item">
                <span>{{dataForm.properPriceYen}}</span>
            </el-form-item>
            <el-form-item label="日本促销价：" class="item">
                <span>{{dataForm.salePriceYen}}</span>
            </el-form-item>
            <el-form-item label="品牌销售价：" class="item">
                <span>{{dataForm.properPrice}}</span>
            </el-form-item>
            <el-form-item label="品牌促销价：" class="item">
                <span>{{dataForm.salePrice}}</span>
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
<!--                <span>{{dataForm.priceType}}</span>-->
            </el-form-item>
            <el-form-item label="原产地：" class="item">
                <span>{{dataForm.madeInJp}}</span>
                <el-input v-model="dataForm.madeIn" placeholder="请输入" maxlength="10" style="margin-left: 10px;"></el-input>&nbsp;&nbsp;
                <span style="color: #bebebe;">最多可输入10个文字</span>
            </el-form-item>
            <el-form-item label="材质：" class="item">
                <span>{{dataForm.materialJp}}</span>
                <el-input v-model="dataForm.material" placeholder="请输入" maxlength="10" style="margin-left: 10px;"></el-input>&nbsp;&nbsp;
                <span style="color: #bebebe;">最多可输入10个文字</span>
            </el-form-item>
            <el-form-item label="上架状态：" class="item">
                <template>
                    <span v-if="dataForm.showWeb==0">下架</span>
                    <span v-if="dataForm.showWeb==1">上架</span>
                    <span v-if="dataForm.showWeb==2">未上架</span>
                </template>
            </el-form-item>
            <el-form-item label="日本上架状态：" class="item">
                <template>
                    <span v-if="dataForm.japanShowWeb==0">可售</span>
                    <span v-if="dataForm.japanShowWeb==1">不可售</span>
                </template>
            </el-form-item>
            <el-form-item label="可售状态：" class="item">
                <template>
                    <span v-if="dataForm.sellState==0">不可售</span>
                    <span v-if="dataForm.sellState==1">可售</span>
                </template>
            </el-form-item>
            <el-form-item label="颜色尺码：">
                <el-table
                        border
                        :data="dataForm.skuVOList"
                        class="inforRight"
                        style="display:inline-block;width: 80%">
                    <el-table-column prop="goodsCsIdjp" label="SKU编码" align="center"></el-table-column>
                    <el-table-column prop="colorName" label="颜色" align="center"></el-table-column>
                    <el-table-column prop="sizeName" label="尺码" align="center"></el-table-column>
                    <el-table-column prop="specId" label="尺码信息" align="center">
                        <template slot-scope="scope">
                            <div @click="detShowChange(scope.row)" style="color: #2260D2;cursor:pointer;">
                                查看
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="stockQuantity" label="库存" align="center"></el-table-column>
                    <el-table-column prop="sellState" label="是否可售" align="center"></el-table-column>
                    <el-table-column prop="sellStartDate" label="售卖开始时间" align="center"></el-table-column>
                    <el-table-column prop="sellEndDate" label="售卖结束时间" align="center"></el-table-column>
                    <el-table-column prop="sellPrice" label="售价(RMB)" align="center">
                        <template
                                slot-scope="scope"
                                v-if="scope.row.specSellPrice!==''&&scope.row.specSellPrice!==null"
                        >￥{{scope.row.sellPrice}}</template>
                    </el-table-column>
                    <el-table-column prop="goodsNum" label="图片" align="center">
                        <template slot-scope="scope">
                            <img
                                    :src="scope.row.itemsImageUrl | filterImgUrl"
                                    style=" object-fit: contain;width: 70px;height:70px;border-radius:100px;"
                            >
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item label="分类条件：">
                <el-row v-for="(item,index) in dataForm.tags" :key="index" class="info" style="width: 500px;">
                    <el-col :span="12"><div class="grid-content">{{item.parentTagName}}</div></el-col>
                    <el-col :span="12"><div class="grid-content">{{item.nameJp}}</div></el-col>
                </el-row>
<!--                <Table class="inforRight" style="display: inline-block;" :tableData="tableData" :tableStyle="{ width:'600px' }"></Table>-->
            </el-form-item>
            <el-form-item label="商品图片：">
                <template slot-scope="scope">
                    <div class="goodsImg">
<!--                        <img  :src="scope.row.imageUrl | filterImgUrl" style="width:60px;height:60px;object-fit: contain;" alt=""/>-->
                        <img :src="dataForm.imageUrl | filterImgUrl" alt=""/>
                    </div>
                </template>
            </el-form-item>
            <el-form-item label="日本商品详情：" class="item" style="height: auto!important;">
                <span v-html="dataForm.descriptionJp"></span>
            </el-form-item>
            <el-form-item label="商品详情：">
                <!-- 富文本编辑器, 容器 -->
                <quill-editor-img class="inforRight" style="display: inline-block;"  @artmessageContent='artmessageContent' ref="refmessageContent"></quill-editor-img>
            </el-form-item>
        </el-form>
        <el-col :span="24">
            <div style="position: fixed;bottom: 0;margin: 0 auto;width: 86%;text-align: center;z-index: 999;background-color: #e6e6e6;padding: 10px 0;">
                <el-button class="btn" @click="reset()">取消</el-button>
                <el-button class="btn" @click="getData(0)">仅保存</el-button>
                <el-button class="btn" type="primary" @click="getData(1)">保存并上架</el-button>
            </div>
        </el-col>
        <!-- 弹窗, 新建 -->
        <addEditData :id="dataForm.id" v-if="addEditDataVisible" ref="addEditData" @searchDataList="getDataList"></addEditData>
        <!-- 尺码信息 -->
        <sizeData v-if="sizeDataVisible" ref="sizeDataCompon" @searchDataList="getDataList"></sizeData>
    </div>
</template>

<script>
    //import addEditData from './recordList'
    import Bread from "@/components/bread";
    import quillEditorImg from "@/components/quillEditor"
    import addEditData from './model-edit-data'
    import mixinViewModule from '@/mixins/view-module'
    import { backScanZozogoods, saveZozogoods } from '@/api/api'
    import sizeData from './model-size'

    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import Quill from 'quill'
    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                breaddata: [ "商品管理","商品列表", "编辑商品"],
                addEditDataVisible: false,
                dataForm: {
                    goodsName:"",
                    madeIn:"",
                    material:"",
                },
                sizeDataVisible: false,
            }
        },
        components: {
            Bread,
            quillEditorImg,
            addEditData,
            sizeData
        },
        // props: [
        //     "detdata",
        //     "data"
        // ],
        methods: {
            init(row){
                this.$nextTick(()=>{
                    if(row){
                        var obj  = {
                            id:row.id
                        }
                        backScanZozogoods(obj).then((res)=>{
                            console.log('详情',res.data)
                            if(res.code == 200){
                                this.dataForm = res.data;
                            }
                        })
                    }
                })
            },
            artmessageContent(messageContent){
                this.dataForm.messageContent = messageContent;
            },
            //备案信息
            // logMore() {
            //     this.$router.push({ name: "mggoods-message-goodslist-recordList" });
            // },
            // 返回上一级
            changePage() {
                this.$emit("showList");
            },
            operational () {
                this.$emit("operational")
            },
            logMore(){
                this.setAddEditDataVisible(true);
                this.$nextTick(() => {
                    this.$refs.addEditData.init()
                })
            },
            setAddEditDataVisible(boolargu){
                this.addEditDataVisible =  boolargu;
                this.id = this.dataForm.id;
            },
            detShowChange (row2) {
                this.sizeDataVisible =  true;
                console.log(this.dataForm);
                this.$nextTick(() => {
                    this.$refs.sizeDataCompon.init(this.row,row2);
                })
            },
            reset(){
                let that = this;
                this.$confirm('取消将不会保存页面数据', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    that.changePage();
                }).catch();
            },
            getData(saveFlag){
                let that = this;
                this.dataForm.saveFlag = saveFlag;
                saveZozogoods({saveLookDTO:this.dataForm}).then((res)=>{
                    if(res.code == 200){
                        this.$message({
                            message: res.msg,
                            type: 'success',
                            onClose:function () {
                                that.changePage();
                            }
                        });
                    }else{
                        this.$message({
                            message: res.msg,
                            type: 'error',
                        });
                    }
                })
            }

        }
    }
</script>

<style scoped>
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
        width: 100px!important;
    }
    .item {
        height: 26px!important;
    }
    .grayLine {
        border-bottom: 0!important;
    }
    .grid-content {
        border: 1px solid #ebeef5;
        height: 50px;
        line-height: 50px;
        text-align: center
    }
    .info {
        margin-left: 100px;
    }
    /deep/ .el-input {
        width: 200px!important;
    }
</style>