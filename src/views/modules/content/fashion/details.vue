<template>
    <div>
        <Bread :breaddata="breaddata" :index="'1'" @changePage="changePage"></Bread>
        <!-- <el-col :span="12" style="border-right: 1px solid #e6e6e6;" v-if="row.fashionFlag == 0">
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
                            <div class="contentChild" v-if="v.typeId=='1'||v.typeId=='2'||v.typeId=='5'||v.typeId=='6'" v-html="v.text">
                                {{v.text}}
                            </div>
                            <div class="contentChild" v-if="v.typeId=='3'||v.typeId=='4'">
                                <div class="goodsPropsWrap">
                                    <div class="goodsImg">
                                        <img :src="v.imageUrl" style="width:200px;" alt=""/>
                                    </div>
                                    <div v-if="v.typeId=='4'" v-html="v.text"></div>
                                </div>
                            </div>
                        </div>
                    </template>
                </el-form-item>
            </el-form>
        </el-col> -->
        <el-col :span="24"   :style="{'padding-left':row.fashionFlag == 0?'0':'20%'}">
            <el-form
                    ref="dataForm"
                    class="grayLine topGapPadding"
                    :model="dataForm"
                    v-loading="fullscreenLoading"
                    @keyup.enter.native="getDataList()"
            >
                <div style="display:flex;padding:0">
                    <div style="width:50%;"  v-if="row.fashionFlag == 0">
                        <p class="title" >日文</p>
                    </div>
                    <div style="width:50%;"  :class="row.fashionFlag==0?'borderLeftLine':'positionLeft'"  :style="{'width':row.fashionFlag == 0?'50%':'100%'}">
                       <p class="title">中文</p>
                    </div>
                </div>

                <div style="display:flex;padding:0">
                    <div style="width:50%;padding:0"  v-if="row.fashionFlag == 0">
                         <el-form-item label="纪实编号：" style="width:50%;">
                            <span>{{dataForm.idJp}}</span>
                        </el-form-item>
                    </div>
                    <div style="width:50%;padding:0"  :class="row.fashionFlag==0?'borderLeftLine':''">
                        <el-form-item label="纪实编号：">
                            <span>{{dataForm.idJp}}</span>
                        </el-form-item>
                    </div>
                </div>

                <div style="display:flex;padding:0">
                    <div style="width:50%;padding:0"  v-if="row.fashionFlag == 0">
                        <el-form-item label="发布者：" style="width:50%;">
                            <span>{{dataForm.publisher}}</span>
                        </el-form-item>
                    </div>
                    <div style="width:50%;padding:0"  :class="row.fashionFlag==0?'borderLeftLine':''">
                        <el-form-item label="发布者：" >
                            <span>{{dataForm.publisher}}</span>
                        </el-form-item>
                    </div>
                </div>

                <div style="display:flex;padding:0">
                    <div style="width:50%;padding:0"  v-if="row.fashionFlag == 0">
                        <el-form-item label="收藏数量：">
                            <span>{{dataForm.totalFavNum}}</span>
                        </el-form-item>
                    </div>
                    <div style="width:50%;padding:0"  :class="row.fashionFlag==0?'borderLeftLine':''">
                        <el-form-item label="收藏数量：">
                            <span>{{dataForm.totalFavNum}}</span>
                        </el-form-item>
                    </div>
                </div>


                <div style="display:flex;padding:0">
                    <div style="width:50%;padding:0"  v-if="row.fashionFlag == 0">
                        <el-form-item label="浏览数量：">
                            <span>{{dataForm.totalViewsNums}}</span>
                        </el-form-item>
                    </div>
                    <div style="width:50%;padding:0"  :class="row.fashionFlag==0?'borderLeftLine':''">
                        <el-form-item label="浏览数量：">
                            <span>{{dataForm.totalViewsNums}}</span>
                        </el-form-item>
                    </div>
                </div>


                 <div style="display:flex;padding:0">
                    <div style="width:50%;padding:0"  v-if="row.fashionFlag == 0">
                        <el-form-item label="发布状态：">
                              <span>{{dataForm.isOpen == 1?"已发布":dataForm.isOpen == 2?"待发布":""}}</span>
                        </el-form-item>
                    </div>
                    <div style="width:50%;padding:0"  :class="row.fashionFlag==0?'borderLeftLine':''">
                        <el-form-item label="发布状态：">
                            <span>{{dataForm.state == 0?"未发布":dataForm.state == 1?"已发布":dataForm.state == 2?"取消发布 ":""}}</span>
                        </el-form-item>
                    </div>
                </div>

                <div style="display:flex;padding:0">
                    <div style="width:50%;padding:0"  v-if="row.fashionFlag == 0">
                        <el-form-item label="背景图：" style="height: 100%!important;">
                            <template slot-scope="scope">
                                <div class="goodsPropsWrap">
                                    <div class="goodsImg">
                                        <img :src="dataForm.mainImageUrl | filterImgUrl" alt="" style="width:200px;"/>
                                    </div>
                                </div>
                            </template>
                        </el-form-item>
                    </div>
                    <div style="width:50%;padding:0"  :class="row.fashionFlag==0?'borderLeftLine':''">
                         <el-form-item label="背景图：" style="height: 100%!important;">
                            <template slot-scope="scope">
                                <div class="goodsPropsWrap">
                                    <div class="goodsImg">
                                        <img :src="dataForm.mainImageUrl | filterImgUrl" alt="" style="width:200px;"/>
                                    </div>
                                </div>
                            </template>
                        </el-form-item>
                    </div>
                </div>

                <div style="display:flex;padding:0">
                    <div style="width:50%;padding:0"  v-if="row.fashionFlag == 0">
                         <el-form-item label="标题：" style="height: 100%!important;">
                            <span>{{dataForm.titleJp}}</span>
                        </el-form-item>
                    </div>
                    <div style="width:50%;padding:0"  :class="row.fashionFlag==0?'borderLeftLine':''">
                        <el-form-item label="标题：" style="height: 100%!important;">
                            <span>{{dataForm.title}}</span>
                        </el-form-item>
                    </div>
                </div>
                <div style="display:flex;padding:0">
                    <div style="width:50%;padding:0"  v-if="row.fashionFlag == 0">
                        <el-form-item label="详情：" style="height: 100%!important;"  v-if="row.fashionFlag == 0">
                            <template slot-scope="scope">
                                <div style="display:flex;padding:0;" v-for="(v,i) in dataForm.shopFashionContentsVOList" v-if="dataForm.shopFashionContentsVOList[i]" :key="i">
                                    <div v-if="v.text || v.imageUrl"  v-show="row.fashionFlag == 0" style="padding: 0;">
                                        <!-- <div style="height: 20px;"></div> -->
                                        <div :class="['contentChild','detail'+i]" style="min-height:33px;padding-right: 6px;" v-if="v.typeId=='1'||v.typeId=='2'||v.typeId=='5'||v.typeId=='6'" v-html="v.text">
                                        <!-- {{v.text}} -->
                                        </div>
                                        <div class="contentChild" v-if="v.typeId=='3'||v.typeId=='4'">
                                            <div class="goodsPropsWrap">
                                                <div class="goodsImg" style="margin-left:60%;">
                                                    <img :src="v.imageUrl | filterImgUrl" style="width:200px;" alt=""/>
                                                </div>
                                                <div v-if="v.typeId=='4'"  v-html="v.text"></div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </template>
                        </el-form-item>
                    </div>
                    <div style="width:50%;padding:0"  :class="row.fashionFlag==0?'borderLeftLine':''">
                        <el-form-item label="详情：" style="height: 100%!important;">
                            <template slot-scope="scope" style="display: flex;">
                                <div style="display:flex;padding:0;flex-direction: column;" v-for="(v,i) in dataForm.shopFashionContentsVOList" v-if="dataForm.shopFashionContentsVOList[i]" :key="i" >
                                    <div v-if="v.text || v.imageUrl" style="padding: 0;">
                                        <!-- <div style="height: 20px;"></div> -->
                                        <div :class="['contentChild','inputHeight'+i]"   style="min-height:33px;margin-top:0;"v-if="v.typeId=='1'||v.typeId=='2'||v.typeId=='5'||v.typeId=='6'" v-html="v.textCn">
                                            <!-- {{v.text}} -->
                                        </div>
                                        <div class="contentChild" v-if="v.typeId=='3'||v.typeId=='4'">
                                            <div class="goodsPropsWrap">
                                                <div class="goodsImg" style="text-align:center;">
                                                    <img :src="v.imageUrl | filterImgUrl" style="width:200px;" alt=""/>
                                                </div>
                                                <div v-if="v.typeId=='4'"  v-html="v.textCn"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </el-form-item>
                    </div>
                </div>
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
                dataForm: {},
                row:'',
                timer: null, // 定时器
                fullscreenLoading: true

            }
        },
        components: {
            Bread
        },
        created(){
            // 判断页面加载完毕
            const that = this
            that.timer = setInterval(function () {
                if (document.readyState === 'complete') {
                    that.getHeight()
                    window.clearInterval(that.timer)
                }
            }, 1500)
        },
        methods: {
            init(row){
                this.$nextTick(()=>{
                    if(row){
                        this.row = row;
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
            },
            getHeight(){
                // 详情文字的高度
                for(let i=0;i<this.dataForm.shopFashionContentsVOList.length;i++){
                    // 文字高度
                    var fontH = $("."+'detail'+i).height()
                    // 输入框高度
                    var inputH = $("."+'inputHeight'+i).height()
                    if(fontH<inputH){
                        $("."+'detail'+i).height(inputH)
                    }else{
                        $("."+'inputHeight'+i).height(fontH)
                    }
                }
                this.fullscreenLoading = false
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
        // text-align: center;
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
        // text-align: center;
        padding: 0;
    }
    /deep/ .el-form-item--default {
        padding: 0 0!important;
        margin-bottom: 0!important;
    }
    .borderLeftLine{
        border-left:1px solid #e6e6e6;
    }
    .positionLeft {
        margin-left: -252px!important;
        width: 127%!important;
    }
    /deep/ .contentChild p {
        margin-top: 0;
        text-align: left;
    }
    /deep/ .el-form-item__content {
        display: flex!important;
        flex-direction: column!important;
        padding: 0 20px 0 0!important;
    }
</style>
