<template>
    <div>
        <Bread :breaddata="breaddata" :index="'1'" @changePage="changePage"></Bread>
        <el-col :span="12" style="border-right: 1px solid #e6e6e6;">
            <el-form
                    ref="dataForm"
                    class="grayLine topGapPadding"
                    :model="dataForm"
                    @keyup.enter.native="getDataList()"
            >
                <p class="title">日文</p>
                <el-form-item label="新闻编号：">
                    <span>{{dataForm.idJp}}</span>
                </el-form-item>
                <el-form-item label="店铺ID：">
                    <span>{{dataForm.shopIdJp}}</span>
                </el-form-item>
                <el-form-item label="店铺名称：">
                    <span>{{dataForm.shopName}}</span>
                </el-form-item>
                <el-form-item label="发布状态：">
                    <span>{{dataForm.showWebJp == 1?"已发布":"未发布"}}</span>
                </el-form-item>
                <el-form-item label="背景图：">
                    <template slot-scope="scope">
                        <div class="goodsPropsWrap">
                            <div class="goodsImg">
                                <img :src="dataForm.imageUrl" alt=""/>
                            </div>
                        </div>
                    </template>
                </el-form-item>
                <el-form-item label="标题：">
                    <span>{{dataForm.titleJp}}</span>
                </el-form-item>
                <el-form-item label="详情：">
                    <span>{{dataForm.contentJp}}</span>
                </el-form-item>
                <div class="goods">
                    <span class="inforTit" style="vertical-align:top;">关联商品：</span>
                    <el-table
                            width="100%"
                            :data="dataForm.goodsList"
                            border
                            v-loading="dataListLoading"
                            class="inforRight"
                            style="display:inline-block;width: 80%;"
                    >
                        <el-table-column prop="id" label="商品ID" align="center"></el-table-column>
                        <el-table-column prop="name" label="商品名称" align="center"></el-table-column>
                        <el-table-column prop="imageUrl" label="图片" align="center">
                            <template slot-scope="scope">
                                <img
                                        :src="scope.row.imageUrl"
                                        alt=""
                                        style=" object-fit: contain;width: 70px;height:70px;border-radius:100px;"
                                >
                            </template>
                        </el-table-column>
                        <el-table-column prop="syncState" label="同步状态" align="center">
                            <template slot-scope="scope">
                                <div>{{scope.row.syncState == 1?"已同步":"未同步"}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="showWeb" label="商品状态" align="center">
                            <template slot-scope="scope">
                                <div>{{scope.row.showWeb == 0?"待上架":scope.row.showWeb == 1?"上架":scope.row.showWeb == 2?"下架":""}}</div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-form>
        </el-col>

        <el-col :span="12">
            <el-form
                    ref="dataForm"
                    class="grayLine topGapPadding"
                    :model="dataForm"
                    @keyup.enter.native="getDataList()"
            >
                <p class="title">中文</p>
                <el-form-item label="新闻编号：">
                    <span>{{dataForm.idJp}}</span>
                </el-form-item>
                <el-form-item label="店铺ID：">
                    <span>{{dataForm.shopId}}</span>
                </el-form-item>
                <el-form-item label="店铺名称：">
                    <span>{{dataForm.shopNameCn}}</span>
                </el-form-item>
                <el-form-item label="发布状态：">
                    <span>{{dataForm.showWeb == 1?"已发布":dataForm.showWeb == 0?"待发布":"取消发布"}}</span>
                </el-form-item>
                <el-form-item label="背景图：">
                    <template slot-scope="scope">
                        <div class="goodsPropsWrap">
                            <div class="goodsImg">
                                <img :src="dataForm.imageUrl" alt=""/>
                            </div>
                        </div>
                    </template>
                </el-form-item>
                <el-form-item label="标题：">
                    <span>{{dataForm.title}}</span>
                </el-form-item>
                <el-form-item label="详情：">
                    <span>{{dataForm.content}}</span>
                </el-form-item>
                <div class="goods">
                    <span class="inforTit" style="vertical-align:top;">关联商品：</span>
                    <el-table
                            width="100%"
                            :data="dataForm.goodsList"
                            border
                            v-loading="dataListLoading"
                            class="inforRight"
                            style="display:inline-block;width: 80%;"
                    >
                        <el-table-column prop="id" label="商品ID" align="center"></el-table-column>
                        <el-table-column prop="name" label="商品名称" align="center"></el-table-column>
                        <el-table-column prop="imageUrl" label="图片" align="center">
                            <template slot-scope="scope">
                                <img
                                        :src="scope.row.imageUrl"
                                        alt=""
                                        style=" object-fit: contain;width: 70px;height:70px;border-radius:100px;"
                                >
                            </template>
                        </el-table-column>
                        <el-table-column prop="syncState" label="同步状态" align="center">
                            <template slot-scope="scope">
                                <div>{{scope.row.syncState == 1?"已同步":"未同步"}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="showWeb" label="商品状态" align="center">
                            <template slot-scope="scope">
                                <div>{{scope.row.showWeb == 0?"待上架":scope.row.showWeb == 1?"上架":scope.row.showWeb == 2?"下架":""}}</div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-form>
        </el-col>
    </div>
</template>

<script>
    import mixinViewModule from '@/mixins/view-module'
    import Bread from "@/components/bread";
    import { getStoreNewsdetail } from '@/api/api'
    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                breaddata: [ "内容管理","店铺新闻管理", "搭配详情"],
                dataListLoading: false,
                dataForm: {}
            }
        },
        components: {
            Bread
        },
        methods: {
            init(row){
                this.$nextTick(()=>{
                    if(row){
                        var obj  = {
                            id:row.id
                        }
                        getStoreNewsdetail(obj).then((res)=>{
                            console.log('详情',res.data)
                            if(res.code == 200){
                                this.dataForm = res.data;
                            }
                        })
                    }
                })
            },
            changePage(){
                this.$emit("showList");
            }
        }
    }
</script>

<style lang="scss" scoped>
    .title{
        margin-top: 0;
        padding: 0 0 10px 20px;
        border-bottom: 1px solid #d6d6d6;
        font-size: 20px;
        font-weight: bold;
    }
    .inforTit {
        width: 120px;
        text-align: right;
        display: inline-block;
    }
    .inforRight {
        display: inline-block;
    }
    div {
        padding: 8px 0;
    }
    .orderState {
        margin-left: 2%;
    }
    /deep/ .el-input {
        width: 500px!important;
    }
    /deep/ .el-textarea {
        width: 500px!important;
    }
    /deep/ .el-button {
        width: 150px;
    }
    /deep/ .el-form-item__label {
        width: 120px!important;
    }
    /deep/ .el-form-item--default {
        /*height: 30px!important;*/
    }
    .grayLine {
        border-bottom: 0!important;
    }
</style>