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
                <el-form-item label="纪实编号：">
                    <span>{{dataForm.idJp}}</span>
                </el-form-item>
                <el-form-item label="发布者：">
                    <span>{{dataForm.publisher}}</span>
                </el-form-item>
                <el-form-item label="收藏数量：">
                    <span>{{dataForm.totalFavNum}}</span>
                </el-form-item>
                <el-form-item label="浏览数量：">
                    <span>{{dataForm.totalViewsNums}}</span>
                </el-form-item>
                <el-form-item label="发布状态：">
                    <span>{{dataForm.isOpen == 1?"已发布":dataForm.isOpen == 2?"待发布":""}}</span>
                </el-form-item>
                <el-form-item label="背景图：" style="height: 100%!important;">
                    <template slot-scope="scope">
                        <div class="goodsPropsWrap">
                            <div class="goodsImg">
                                <img :src="dataForm.mainImageUrl" alt=""/>
                            </div>
                        </div>
                    </template>
                </el-form-item>
                <el-form-item label="标题：" style="height: 100%!important;">
                    <span>{{dataForm.titleJp}}</span>
                </el-form-item>
                <el-form-item label="详情：" style="height: 100%!important;">
                    <template slot-scope="scope">
                        <br>
                        <div v-for="(v,i) in dataForm.shopFashionContentsVOList" v-if="dataForm.shopFashionContentsVOList[i]" :key="i">
                            <div style="height: 20px;"></div>
                            <div class="contentChild" v-if="v.typeId=='1'||v.typeId=='2'||v.typeId=='5'||v.typeId=='6'">
                                {{v.text}}
                            </div>
                            <div class="contentChild" v-if="v.typeId=='3'||v.typeId=='4'">
                                <div class="goodsPropsWrap">
                                    <div class="goodsImg">
                                        <img :src="v.imageUrl" style="width:200px;" alt=""/>
                                    </div>
                                    <div v-if="v.typeId=='4'">{{v.text}}</div>
                                </div>
                            </div>
                        </div>
                    </template>
                </el-form-item>
            </el-form>
        </el-col>
        <el-col :span="12" style="border-right: 1px solid #e6e6e6;">
            <el-form
                    ref="dataForm"
                    class="grayLine topGapPadding"
                    :model="dataForm"
                    @keyup.enter.native="getDataList()"
            >
                <p class="title">中文</p>
                <el-form-item label="纪实编号：">
                    <span>{{dataForm.idJp}}</span>
                </el-form-item>
                <el-form-item label="发布者：">
                    <span>{{dataForm.publisher}}</span>
                </el-form-item>
                <el-form-item label="收藏数量：">
                    <span>{{dataForm.totalFavNum}}</span>
                </el-form-item>
                <el-form-item label="浏览数量：">
                    <span>{{dataForm.totalViewsNums}}</span>
                </el-form-item>
                <el-form-item label="发布状态：">
                    <span>{{dataForm.state == 0?"未发布":dataForm.state == 1?"已发布":dataForm.state == 2?"取消发布 ":""}}</span>
                </el-form-item>
                <el-form-item label="背景图：" style="height: 100%!important;">
                    <template slot-scope="scope">
                        <div class="goodsPropsWrap">
                            <div class="goodsImg">
                                <img :src="dataForm.mainImageUrl" alt=""/>
                            </div>
                        </div>
                    </template>
                </el-form-item>
                <el-form-item label="标题：" style="height: 100%!important;">
                    <span>{{dataForm.title}}</span>
                </el-form-item>
                <el-form-item label="详情：" style="height: 100%!important;">
                    <template slot-scope="scope">
                        <br>
                        <div v-for="(v,i) in dataForm.shopFashionContentsVOList" v-if="dataForm.shopFashionContentsVOList[i]" :key="i">
                            <div style="height: 20px;"></div>
                            <div class="contentChild" v-if="v.typeId=='1'||v.typeId=='2'||v.typeId=='5'||v.typeId=='6'">
                               {{v.text}}
                            </div>
                            <div class="contentChild" v-if="v.typeId=='3'||v.typeId=='4'">
                                <div class="goodsPropsWrap">
                                    <div class="goodsImg">
                                        <img :src="v.imageUrl" style="width:200px;" alt=""/>
                                    </div>
                                    <div v-if="v.typeId=='4'">{{v.text}}</div>
                                </div>
                            </div>
                        </div>
                    </template>
                </el-form-item>
            </el-form>
        </el-col>
    </div>
</template>

<script>
    import Bread from "@/components/bread";
    import { getfashiondetail } from '@/api/api'
    export default {
        data () {
            return {
                breaddata: [ "内容管理", "时尚记事","时尚记事详情"],
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
                        getfashiondetail(obj).then((res)=>{
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
    .contentChild{
        text-align: center;
    }
    .inforRight {
        margin-left: 20px;
        display: inline-block;
    }
    div {
        padding: 8px 0;
    }
    .orderState {
        margin-left: 2%;
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
    .contentChild{
        text-align: center;
        padding: 0;
    }
</style>