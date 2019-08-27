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
                    @keyup.enter.native="getDataList()"
                    style="margin-left: 20px;"
            >
                <el-form-item label="商品分类：" class="item" style="margin-top: 20px;">
                    <span>{{dataForm.firstCategory}}</span>
                </el-form-item>
                <el-form-item label="商品ID：" class="item">
                    <span>{{dataForm.idJp}}</span>
                    <span style="margin-left:2%;color:green;cursor:pointer;" @click="log">查看备案信息</span>
                </el-form-item>
                <el-form-item label="日本商品名称：" class="item">
                    <span>{{dataForm.nameJp}}</span>
                </el-form-item>
                <el-form-item label="商品名称：" class="item">
                    <span>{{dataForm.name}}</span>
                </el-form-item>
                <el-form-item label="品牌：" class="item">
                    <span>{{dataForm.brandName}}</span>
                </el-form-item>
                <el-form-item label="所属店铺：" class="item">
                    <span>{{dataForm.storeName}}</span>
                </el-form-item>
                <el-form-item label="性别：" class="item">
                    <template>
                        <span v-if="dataForm.genders==0">男</span>
                        <span v-if="dataForm.genders==1">女</span>
                        <span v-if="dataForm.genders==2">儿童</span>
                    </template>
                </el-form-item>
                <el-form-item label="原产地：" class="item">
                    <span>{{dataForm.madeIn}}</span>
                </el-form-item>
                <el-form-item label="材质：" class="item">
                    <span>{{dataForm.material}}</span>
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
                            >￥{{scope.row.sellPrice.toFixed(2)}}</template>
                        </el-table-column>
                        <el-table-column prop="goodsNum" label="图片" align="center">
                            <template slot-scope="scope">
                                <img
                                        :src="scope.row.itemsImageUrl"
                                        style=" object-fit: contain;width: 70px;height:70px;border-radius:100px;"
                                >
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
                <el-form-item label="分类条件：">
                    <Table class="inforRight" style="display: inline-block;" :tableData="tableData" :tableStyle="{ width:'600px' }"></Table>
                </el-form-item>
                <el-form-item label="商品图片：">
                    <template slot-scope="scope">
                        <div class="goodsImg">
                            <!--                        <img :src="scope.row.imageUrl | filterImgUrl" style="width:60px;height:60px;object-fit: contain;" alt=""/>-->
                            <img :src="dataForm.imageUrl320" alt=""/>
                        </div>
                    </template>
                </el-form-item>
                <el-form-item label="日本商品详情：" class="item">
                    <span>{{dataForm.descriptionJp}}</span>
                </el-form-item>
                <el-form-item label="商品详情：">
                    <el-input type="textarea" class="inforRight" v-model="dataForm.description" placeholder="" :rows="4"  style="display: inline-block;width: 600px;"></el-input>
                    <!-- 富文本编辑器, 容器 -->
                    <!--                <quill-editor-img class="inforRight" style="display: inline-block;"  @artmessageContent='artmessageContent' ref="refmessageContent"></quill-editor-img>-->
                </el-form-item>
            </el-form>
        </div>

        <!-- 备案 -->
        <addEditData :idJp="dataForm.idJp" v-if="addEditDataVisible" ref="addEditData" @searchDataList="getDataList"></addEditData>
        <!-- 操作日志 -->
        <operationallog :idJp="dataForm.idJp" v-if="operationallogVisible" ref="operationallogCompon" @searchDataList="getDataList" ></operationallog>
    </div>
</template>

<script>
    import addEditData from './recordList'
    import Bread from "@/components/bread";
    import Table from "@/components/table";
    import quillEditorImg from "@/components/quillEditor"
    //import addEditData from './model-show-data'
    import mixinViewModule from '@/mixins/view-module'
    import { backScanZozogoods } from '@/api/api'

    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import Quill from 'quill'
    import operationallog from "./operationalLog"
    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                breaddata: [ "商品管理","商品列表", "商品详情"],
                tableData: [
                    {key: '袖长', value: '短袖'},
                    {key: '图案', value: '豹纹'},
                    {key: '衣长', value: '短长度'}
                ],
                dataForm:{},
                addEditDataVisible: false,
                data: {}, //总数据
                // skuVOList: [],
                operationallogVisible:false,
                mainVisible: true
            }
        },
        components: {
            Bread,
            Table,
            quillEditorImg,
            addEditData,
            operationallog,
        },
        created(){

        },
        methods: {
            operational (index=-1,row="") {
                this.setOperationalVisible(true);
                this.$nextTick(() => {
                    this.$refs.operationallogCompon.init(row)
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
            // operational () {
            //     this.$emit("operational",this.dataForm.idJp)
            // },
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
</style>