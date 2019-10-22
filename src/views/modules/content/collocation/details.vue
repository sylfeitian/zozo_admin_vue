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
                <el-form-item label="搭配编号：">
                    <span>{{dataForm.idJp}}</span>
                </el-form-item>
                <el-form-item label="用户昵称：">
                    <template>
                        <span>{{dataForm.nickname}}</span>
                        <div style="display:inline-block;padding:0 0;margin-left: 10px;color: #2260D2">
                            <span  v-if="dataForm.identity==1">WEAR达人</span>
                            <span  v-else-if="dataForm.identity==2">Shop Staff</span>
                        </div>
                    </template>
                </el-form-item>
                <el-form-item label="用户身高：">
                    <span>{{dataForm.height}}</span><span v-if="dataForm.height">cm</span>
                </el-form-item>
                <el-form-item label="用户地区：">
                    <span>日本</span>
                </el-form-item>
                <el-form-item label="性别：">
                    <span>{{dataForm.gender == 0?"男":dataForm.gender == 1?"女":dataForm.gender == 2?"儿童":dataForm.gender == 3?"world":""}}</span>
                </el-form-item>
                <el-form-item label="收藏数量：">
                    <span>{{dataForm.totalFavNum}}</span>
                </el-form-item>
                <el-form-item label="发布状态：">
                    <span>{{dataForm.jpPublishState == 2?"取消发布":dataForm.jpPublishState == 1?"已发布":""}}</span>
                </el-form-item>
                <el-form-item label="主图：" style="height: 100%!important;">
                    <template slot-scope="scope">
                        <div class="goodsPropsWrap">
                            <div class="goodsImg" style="margin-top:10px;">
                                <img :src="dataForm.imageUrl320" alt=""/>
                            </div>
                        </div>
                    </template>
                </el-form-item>
                <el-form-item label="要点：" style="height: 100%!important;margin-top:10px;">
                    <span>{{dataForm.contentJp}}</span>
                </el-form-item>
                <div class="goods" style="margin-top:10px;">
                    <span class="inforTit" style="vertical-align:top;">关联商品：</span>
                    <el-table
                            width="100%"
                            :data="dataForm.itemList"
                            border
                            v-loading="dataListLoading"
                            style="display:inline-block;width: 80%;"
                    >
                        <el-table-column prop="idJp" label="商品ID" align="center"></el-table-column>
                        <el-table-column prop="name" label="商品名称" align="center" width="100">
                            <template slot-scope="scope">
                                <div :title=" scope.row.name ? scope.row.name:scope.row.nameJp ">
                                {{scope.row.name?scope.row.name:scope.row.nameJp}}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="itemsImageUrl" label="图片" align="center">
                            <template slot-scope="scope">
                                <img
                                        :src="scope.row.itemsImageUrl | filterImgUrl"
                                        style=" object-fit: contain;width: 70px;height:70px;border-radius:100px;"
                                >
                            </template>
                        </el-table-column>
                        <el-table-column prop="goodsSyncState" label="同步状态" align="center">
                            <template slot-scope="scope">
                                <div>{{scope.row.goodsSyncState == 1?"已同步":"未同步"}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="goodsShowWeb" label="商品状态" align="center">
                            <template slot-scope="scope">
                                <div>{{scope.row.goodsShowWeb == 0?"待上架":scope.row.goodsShowWeb == 1?"上架":scope.row.goodsShowWeb == 2?"下架":""}}</div>
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
                <el-form-item label="搭配编号：">
                    <span>{{dataForm.idJp}}</span>
                </el-form-item>
                <el-form-item label="用户昵称：">
                    <template>
                        <span>{{dataForm.nickname}}</span>
                        <div style="display:inline-block;padding:0 0;margin-left: 10px;color: #2260D2">
                            <span  v-if="dataForm.identity==1">WEAR达人</span>
                            <span  v-else-if="dataForm.identity==2">Shop Staff</span>
                        </div>
                    </template>
                </el-form-item>
                <el-form-item label="用户身高：">
                    <span>{{dataForm.height }}</span><span v-if="dataForm.height">cm</span>
                </el-form-item>
                <el-form-item label="用户地区：">
                    <span>日本</span>
                </el-form-item>
                <el-form-item label="性别：">
                    <span>{{dataForm.gender == 0?"男":dataForm.gender == 1?"女":dataForm.gender == 2?"儿童":dataForm.gender == 3?"world":""}}</span>
                </el-form-item>
                <el-form-item label="收藏数量：">
                    <span>{{dataForm.totalFavNum}}</span>
                </el-form-item>
                <el-form-item label="发布状态：">
                    <span>{{dataForm.state == 2?"取消发布":dataForm.state == 1?"已发布":dataForm.state == 0?"未发布":""}}</span>
                </el-form-item>
                <el-form-item label="主图：" style="height: 100%!important;">
                    <template slot-scope="scope">
                        <div class="goodsPropsWrap">
                            <div class="goodsImg" style="margin-top:10px;">
                                <img :src="dataForm.imageUrl320" alt=""/>
                            </div>
                        </div>
                    </template>
                </el-form-item>
                <el-form-item label="要点：" style="height: 100%!important;margin-top:10px;">
                    <span>{{dataForm.content}}</span>
                </el-form-item>
                <div class="goods" style="margin-top:10px;">
                    <span class="inforTit" style="vertical-align:top;">关联商品：</span>
                    <el-table
                            width="100%"
                            :data="dataForm.itemList"
                            border
                            v-loading="dataListLoading"
                            style="display:inline-block;width: 80%;"
                    >
                        <el-table-column prop="idJp" label="商品ID" align="center"></el-table-column>
                        <el-table-column prop="name" label="商品名称" align="center" width="100">
                            <template slot-scope="scope">
                                <div :title=" scope.row.name ? scope.row.name:scope.row.nameJp ">
                                    {{scope.row.name?scope.row.name:scope.row.nameJp}}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="itemsImageUrl" label="图片" align="center">
                            <template slot-scope="scope">
                                <img
                                        :src="scope.row.itemsImageUrl | filterImgUrl"
                                        style=" object-fit: contain;width: 70px;height:70px;border-radius:100px;"
                                >
                            </template>
                        </el-table-column>
                        <el-table-column prop="goodsSyncState" label="同步状态" align="center">
                            <template slot-scope="scope">
                                <div>{{scope.row.goodsSyncState == 1?"已同步":"未同步"}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="goodsShowWeb" label="商品状态" align="center">
                            <template slot-scope="scope">
                                <div>{{scope.row.goodsShowWeb == 0?"待上架":scope.row.goodsShowWeb == 1?"上架":scope.row.goodsShowWeb == 2?"下架":""}}</div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-form>
        </el-col>
    </div>
</template>

<script>
    import Bread from "@/components/bread";
    import { getlookdetail } from '@/api/api'
    export default {
        data () {
            return {
                breaddata: [ "内容管理", "搭配管理","搭配详情"],
                dataList: [],
                dataListLoading: false,
                dataForm: {},
                row: ""
            }
        },
        components: {
            Bread
        },
        methods: {
            init(row){
                console.log(row)
                this.$nextTick(()=>{
                    if(row){
                        this.row = row
                        var obj  = {
                            id:row.id
                        }
                        getlookdetail(obj).then((res)=>{
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
        width: 100px;
        text-align: right;
        display: inline-block;
    }
    .inforRight {
        margin-left: 20px;
        display: inline-block;
    }
    .orderState {
        margin-left: 2%;
    }
    /deep/ .el-form-item__label {
        width: 100px!important;
    }
    /deep/ .el-form-item--default {
        /*height: 30px!important;*/
    }
    .grayLine {
        border-bottom: 0!important;
    }
    /deep/ .cell{
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
    }
    /deep/ .el-form-item--default {
        padding: 0 0!important;
        margin-bottom: 0!important;
    }
</style>