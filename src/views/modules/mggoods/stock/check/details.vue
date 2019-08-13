<template>
    <div>
        <Bread :breaddata="breaddata" @changePage="changePage" :index="'2'"></Bread>
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
                <span>{{dataForm.id}}</span>
            </el-form-item>
            <el-form-item label="商品ID：" class="item">
                <span>{{dataForm.id}}</span>
                <span style="margin-left:2%;color:green;cursor:pointer;" @click="logMore">查看备案信息</span>
            </el-form-item>
            <el-form-item label="日本商品名称：" class="item">
                <span>{{dataForm.id}}</span>
            </el-form-item>
            <el-form-item label="商品名称：" class="item">
                <span>{{dataForm.id}}</span>
            </el-form-item>
            <el-form-item label="品牌：" class="item">
                <span>{{dataForm.id}}</span>
            </el-form-item>
            <el-form-item label="所属店铺：" class="item">
                <span>{{dataForm.id}}</span>
            </el-form-item>
            <el-form-item label="性别：" class="item">
                <span>{{dataForm.id}}</span>
            </el-form-item>
            <el-form-item label="原产地：" class="item">
                <span>{{dataForm.id}}</span>
            </el-form-item>
            <el-form-item label="材质：" class="item">
                <span>{{dataForm.id}}</span>
            </el-form-item>
            <el-form-item label="上架状态：" class="item">
                <span>{{dataForm.id}}</span>
            </el-form-item>
            <el-form-item label="日本上架状态：" class="item">
                <span>{{dataForm.id}}</span>
            </el-form-item>
            <el-form-item label="颜色尺码：">
                <el-table border="" class="inforRight" style="display:inline-block;width: 80%">
                    <el-table-column prop="goodsName" label="SKU编码" align="center"></el-table-column>
                    <el-table-column prop="specId" label="备案编码" align="center"></el-table-column>
                    <el-table-column prop="specName" label="颜色" align="center"></el-table-column>
                    <el-table-column prop="goodsName" label="尺码" align="center"></el-table-column>
                    <el-table-column prop="specId" label="尺码信息" align="center"></el-table-column>
                    <el-table-column prop="specName" label="库存" align="center"></el-table-column>
                    <el-table-column prop="specName" label="是否可售" align="center"></el-table-column>
                    <el-table-column prop="specSellPrice" label="单价(RMB)" align="center">
                        <template
                                slot-scope="scope"
                                v-if="scope.row.specSellPrice!==''&&scope.row.specSellPrice!==null"
                        >￥{{scope.row.specSellPrice.toFixed(2)}}</template>
                    </el-table-column>
                    <el-table-column prop="goodsNum" label="图片" align="center"></el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item label="分类条件：">
                <Table class="inforRight" style="display: inline-block;" :tableData="tableData" :tableStyle="{ width:'600px' }"></Table>
            </el-form-item>
            <el-form-item label="商品图片：">
                <img class="imglist right" alt="">
            </el-form-item>
            <el-form-item label="日本商品详情：" class="item">
                <span>{{dataForm.id}}</span>
            </el-form-item>
            <el-form-item label="商品详情：">
                <!-- 富文本编辑器, 容器 -->
                <quill-editor-img class="inforRight" style="display: inline-block;"  @artmessageContent='artmessageContent' ref="refmessageContent"></quill-editor-img>
            </el-form-item>
        </el-form>
        <!-- 弹窗, 新建 -->
        <addEditData  v-if="addEditDataVisible" ref="addEditData" @searchDataList="getDataList"></addEditData>
    </div>
    <!-- 弹窗, 新建 -->
    <!--    <addEditData  v-else-if="addEditDataVisible" ref="addEditData" @searchDataList="getDataList"></addEditData>-->
</template>

<script>
    import addEditData from './record'
    import Bread from "@/components/bread";
    import Table from "@/components/table";
    import quillEditorImg from "@/components/quillEditor"
    //import addEditData from './model-show-data'
    import mixinViewModule from '@/mixins/view-module'

    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import Quill from 'quill'
    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                breaddata: [ "商品管理", "商品详情"],
                tableData: [
                    {key: '袖长', value: '短袖'},
                    {key: '图案', value: '豹纹'},
                    {key: '衣长', value: '短长度'}
                ],
                addEditDataVisible: false,
            }
        },
        components: {
            Bread,
            Table,
            quillEditorImg,
            addEditData,
        },
        props: [
            "detdata",
            "data"
        ],
        methods: {
            artmessageContent(messageContent){
                this.dataForm.messageContent = messageContent;
            },
            //返回上一级
            // changePage() {
            //     this.$emit("changeState");
            // },
            changePage(){
                this.$emit("showList");
            },
            // logMore() {
            //     this.$emit("logMore");
            // },
            operational () {
                this.$emit("operational")
            },
            logMore(index=-1,row=""){
                this.setAddEditDataVisible(true);
                this.$nextTick(() => {
                    this.$refs.addEditData.init(row)
                })
            },
            setAddEditDataVisible(boolargu){
                this.addEditDataVisible =  boolargu;
            },
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
    /*/deep/ .el-form-item--default {*/
    /*    height: 26px!important;*/
    /*}*/
    .item {
        height: 26px!important;
    }
    .grayLine {
        border-bottom: 0!important;
    }
</style>