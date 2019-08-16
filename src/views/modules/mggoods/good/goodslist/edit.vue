<template>
    <div>
        <Bread :breaddata="breaddata" @changePage="changePage" :index="'2'"></Bread>
        <el-form
                ref="dataForm"
                class="grayLine topGapPadding"
                :model="dataForm"
                @keyup.enter.native="getDataList()"
                style="margin-left: 20px;"
        >
            <el-form-item label="商品分类：" class="item" style="margin-top: 20px;">
                <span>{{dataForm.id}}</span>
                <span style="margin-left: 2%;color:green;cursor:pointer;" @click="logMore">修改</span>
            </el-form-item>
            <el-form-item label="商品编码：" class="item">
                <span>{{dataForm.id}}</span>
            </el-form-item>
            <el-form-item label="日本商品名称：" class="item">
                <span>{{dataForm.id}}</span>
            </el-form-item>
            <el-form-item label="商品名称：" class="item">
                <el-input v-model="dataForm.goodsId" placeholder="请输入" maxlength="60"></el-input>&nbsp;&nbsp;
                <span style="color: #bebebe;">最多可输入60个文字</span>
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
                <el-input v-model="dataForm.goodsId" placeholder="请输入" maxlength="10"></el-input>&nbsp;&nbsp;
                <span style="color: #bebebe;">最多可输入10个文字</span>
            </el-form-item>
            <el-form-item label="材质：" class="item">
                <span>{{dataForm.id}}</span>
                <el-input v-model="dataForm.goodsId" placeholder="请输入" maxlength="10"></el-input>&nbsp;&nbsp;
                <span style="color: #bebebe;">最多可输入10个文字</span>
            </el-form-item>
            <el-form-item label="上架状态：" class="item">
                <span>{{dataForm.id}}</span>
            </el-form-item>
            <el-form-item label="可售状态：" class="item">
                <span>{{dataForm.id}}</span>
            </el-form-item>
            <el-form-item label="颜色尺码：">
                <el-table border="" class="inforRight" style="display:inline-block;width: 80%">
                    <el-table-column prop="goodsName" label="SKU编码" align="center"></el-table-column>
                    <!--                    <el-table-column prop="specId" label="备案编码" align="center"></el-table-column>-->
                    <el-table-column prop="specName" label="颜色" align="center"></el-table-column>
                    <el-table-column prop="goodsName" label="尺码" align="center"></el-table-column>
                    <el-table-column prop="specId" label="尺码信息" align="center"></el-table-column>
                    <el-table-column prop="specName" label="库存" align="center"></el-table-column>
                    <el-table-column prop="specName" label="是否可售" align="center"></el-table-column>
                    <el-table-column prop="specName" label="售卖开始时间" align="center"></el-table-column>
                    <el-table-column prop="specName" label="售卖结束时间" align="center"></el-table-column>
                    <el-table-column prop="specSellPrice" label="售价(RMB)" align="center">
                        <template
                                slot-scope="scope"
                                v-if="scope.row.specSellPrice!==''&&scope.row.specSellPrice!==null"
                        >￥{{scope.row.specSellPrice.toFixed(2)}}</template>
                    </el-table-column>
                    <el-table-column prop="goodsNum" label="图片" align="center">
                        <template slot-scope="scope">
                            <div class="goodsImg">
                                <img  :src="scope.row.pictureUrl | filterImgUrl" style="width:60px;height:60px;object-fit: contain;" alt=""/>
                            </div>
                        </template>
                    </el-table-column>
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
</template>

<script>
    //import addEditData from './recordList'
    import Bread from "@/components/bread";
    import Table from "@/components/table";
    import quillEditorImg from "@/components/quillEditor"
    import addEditData from './model-edit-data'
    import mixinViewModule from '@/mixins/view-module'

    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import Quill from 'quill'
    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                breaddata: [ "商品管理","商品管理", "商品详情"],
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
            //备案信息
            // logMore() {
            //     this.$router.push({ name: "mggoods-message-goodslist-recordList" });
            // },
            // 返回上一级
            changePage() {
                this.$emit("changeState");
            },
            changePage(){
                this.$emit("showList");
            },
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
    .item {
        height: 28px!important;
    }
    .grayLine {
        border-bottom: 0!important;
    }
    /deep/ .el-input {
        width: 200px!important;
    }
</style>