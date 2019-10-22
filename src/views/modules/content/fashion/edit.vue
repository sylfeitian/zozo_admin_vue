<template>
    <div>
        <Bread :breaddata="breaddata" :index="'1'" @changePage="changePage"></Bread>
        <!-- <el-col :span="12" style="border-right: 1px solid #e6e6e6;">
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
                    <span>{{dataForm.viewsNum}}</span>
                </el-form-item>
                <el-form-item label="发布状态：">
                    <span>{{dataForm.isOpen == 1?"发布":dataForm.isOpen == 2?"未发布":""}}</span>
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
                                <div class="goodsPropsWrap" style="text-align: center;">
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
        </el-col> -->

        <el-col :span="24" >
            <el-form
                    ref="dataForm"
                    class="grayLine topGapPadding"
                    :model="dataForm"
                    @keyup.enter.native="getDataList()"
            >
                <div style="display:flex;padding:0">
                    <div style="width:50%;">
                        <p class="title" >日文</p>
                    </div>
                    <div style="width:50%">
                       <p class="title">中文</p>
                    </div>
                </div>

                <div style="display:flex;padding:0">
                    <div style="width:50%;">
                         <el-form-item label="纪实编号：" style="width:50%;">
                            <span>{{dataForm.idJp}}</span>
                        </el-form-item>
                    </div>
                    <div style="width:50%">
                        <el-form-item label="纪实编号：">
                            <span>{{dataForm.idJp}}</span>
                        </el-form-item>
                    </div>
                </div>

                <div style="display:flex;padding:0">
                    <div style="width:50%;">
                        <el-form-item label="发布者：" style="width:50%;">
                            <span>{{dataForm.publisher}}</span>
                        </el-form-item>
                    </div>
                    <div style="width:50%">
                        <el-form-item label="发布者：" >
                            <span>{{dataForm.publisher}}</span>
                        </el-form-item>
                    </div>
                </div>

                <div style="display:flex;padding:0">
                    <div style="width:50%;">
                        <el-form-item label="收藏数量：">
                            <span>{{dataForm.totalFavNum}}</span>
                        </el-form-item>
                    </div>
                    <div style="width:50%">
                        <el-form-item label="收藏数量：">
                            <span>{{dataForm.totalFavNum}}</span>
                        </el-form-item>
                    </div>
                </div>

                <div style="display:flex;padding:0">
                    <div style="width:50%;">
                        <el-form-item label="浏览数量：">
                            <span>{{dataForm.viewsNum}}</span>
                        </el-form-item>
                    </div>
                    <div style="width:50%">
                        <el-form-item label="浏览数量：">
                            <span>{{dataForm.viewsNum}}</span>
                        </el-form-item>
                    </div>
                </div>

                <div style="display:flex;padding:0">
                    <div style="width:50%;">
                        <el-form-item label="发布状态：">
                            <span>{{dataForm.isOpen == 1?"发布":dataForm.isOpen == 2?"未发布":""}}</span>
                        </el-form-item>
                    </div>
                    <div style="width:50%">
                         <el-form-item label="发布状态：">
                            <span>{{dataForm.state == 0?"未发布":dataForm.state == 1?"已发布":dataForm.state == 2?"取消发布 ":""}}</span>
                        </el-form-item>
                    </div>
                </div>

                <div style="display:flex;padding:0">
                    <div style="width:50%;">
                        <el-form-item label="背景图：" style="height: 100%!important;">
                            <template slot-scope="scope">
                                <div class="goodsPropsWrap">
                                    <div class="goodsImg">
                                        <img :src="dataForm.mainImageUrl" alt=""/>
                                    </div>
                                </div>
                            </template>
                        </el-form-item>
                    </div>
                    <div style="width:50%">
                         <el-form-item label="背景图：" style="height: 100%!important;">
                            <template slot-scope="scope">
                                <div class="goodsPropsWrap">
                                    <div class="goodsImg">
                                        <img :src="dataForm.mainImageUrl" alt=""/>
                                    </div>
                                </div>
                            </template>
                        </el-form-item>
                    </div>
                </div>
               
                <div style="display:flex;padding:0">
                    <div style="width:50%;">
                         <el-form-item label="标题：" style="height: 100%!important;">
                            <span>{{dataForm.titleJp}}</span>
                        </el-form-item>
                    </div>
                    <div style="width:50%">
                        <el-form-item label="标题：" style="height: 100%!important;">
                            <el-input v-model.trim="dataForm.title" type="text" placeholder="请输入标题名称"></el-input>
                        </el-form-item>
                    </div>
                </div>
                <div style="display:flex;padding:0">
                    <div style="width:50%;">
                        <el-form-item label="详情：" style="height: 100%!important;">
                            <template slot-scope="scope">
                                <div style="display:flex;padding:0" v-for="(v,i) in dataForm.shopFashionContentsVOList" v-if="dataForm.shopFashionContentsVOList[i]" :key="i">
                                    <div v-if="v.text || v.imageUrl"  v-show="row.fashionFlag == 0" style="padding: 0;">
                                        <!-- <div style="height: 20px;"></div> -->
                                        <div class="contentChild" style="min-height:33px;padding-right: 6px;padding: 0;" v-if="v.typeId=='1'||v.typeId=='2'||v.typeId=='5'||v.typeId=='6'">
                                            {{v.text}}
                                        </div>
                                        <div class="contentChild" v-if="v.typeId=='3'||v.typeId=='4'">
                                            <div class="goodsPropsWrap" style="text-align: center;">
                                                <div class="goodsImg" style="margin-left:60%;">
                                                    <img :src="v.imageUrl" style="width:200px;" alt=""/>
                                                </div>
                                                <div v-if="v.typeId=='4'">{{v.text}}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </el-form-item>
                    </div>
                    <div style="width:50%;">
                        <el-form-item label="详情：" style="height: 100%!important;">
                            <template slot-scope="scope">
                                <div style="padding:0" v-for="(v,i) in dataForm.shopFashionContentsVOList" v-if="dataForm.shopFashionContentsVOList[i]" :key="i">
                                    <div  v-if="v.text || v.imageUrl" style="padding: 0;width:80%;margin-left:20%;">
                                        <!-- <div style="height: 20px;"></div> -->
                                        <div class="contentChild"  style="min-height:33px;padding-left: 6px;"  v-if="v.typeId=='1'||v.typeId=='2'||v.typeId=='5'||v.typeId=='6'">
                                            <el-input style="margin: auto;" v-model="v.text" type="textarea" :rows="5" ></el-input>
                                        </div>
                                        <div class="contentChild" v-if="v.typeId=='3'||v.typeId=='4'">
                                            <div class="goodsPropsWrap" style="text-align: center;">
                                                <div class="goodsImg" style="margin-left:-60%;">
                                                    <img :src="v.imageUrl" style="width:200px;" alt=""/>
                                                </div>
                                                <div v-if="v.typeId=='4'">{{v.text}}</div>
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
        <el-col :span="24">
            <div style="position: fixed;bottom: 0;margin: 0 auto;width: 85%;text-align: center;margin-top: 200px;">
                <span style="font-size: 20px;margin-right: 20px;">状态：{{dataForm.state == 0?"未发布":dataForm.state == 1?"已发布":dataForm.state == 2?"取消发布 ":""}}</span>
                <el-button class="btn" @click="reset()">取消</el-button>
                <el-button class="btn" @click="getData(0)">保存</el-button>
                <el-button class="btn" :disabled="dataForm.isOpen == 0" type="primary" @click="getData(1)">保存并发布</el-button>
            </div>
        </el-col>
    </div>
</template>

<script>
    import quillEditorImg from "@/components/quillEditor"
    import Bread from "@/components/bread";
    import { getfashiondetail,savefashiondetail } from '@/api/api'
    export default {
        data () {
            return {
                breaddata: [ "内容管理", "时尚记事","编辑时尚记事"],
                dataRule : {
                    title : [
                        { required: true, message: '必填项不能为空', trigger: 'blur' },
                    ],
                    con : [
                        { required: true, message: '必填项不能为空', trigger: 'blur' },
                    ]
                },
                dataForm: {},
                row:"",
            }
        },
        components: {
            quillEditorImg,
            Bread
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
                this.$emit("addoraditList");
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
            getData(saveType){
                let that = this;
                this.dataForm.saveType = saveType;
                savefashiondetail(this.dataForm).then((res)=>{
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
        /*width: 50%!important;*/
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
    .contentChild{
        text-align: center;
    }
    /deep/ .el-form-item--default {
        padding: 0 0!important;
        margin-bottom: 0!important;
    }
     .borderLeftLine{
        border-left:1px solid #e6e6e6;
    }
    /deep/ .contentChild p {
        margin-top: 0;
        text-align: left;
    }
</style>