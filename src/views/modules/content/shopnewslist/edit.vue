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
                    <span>{{dataForm.showWebJp == 1?"已发布":dataForm.showWebJp == 0?"待发布":""}}</span>
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

        <el-col :span="12" style="border-right: 1px solid #e6e6e6;">
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
                    <span>{{dataForm.shopIdJp}}</span>
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
                <el-form-item label="标题：" style="height: 100%!important;">
                    <el-input v-model.trim="dataForm.title" type="text" placeholder="请输入标题名称"></el-input>
                </el-form-item>
                <el-form-item label="详情：" style="height: 100%!important;">
                    <el-input v-model.trim="dataForm.content" type="textarea":rows="5" placeholder="请输入内容"></el-input>
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
        <el-col :span="24">
        	<!--position: fixed;bottom: 0;-->
            <div style="margin: 0 auto;width: 85%;text-align: center;z-index: 999;">
                <span style="font-size: 20px;margin-right: 20px;">状态：{{dataForm.showWeb == 0?"未发布":dataForm.showWeb == 1?"已发布":dataForm.showWeb == 2?"取消发布":''}}</span>
                <el-button class="btn" @click="reset()">取消</el-button>
                <el-button class="btn" @click="getData(0)">保存</el-button>
                <el-button class="btn" :disabled="dataForm.showWebJp != 1" type="primary" @click="getData(1)">保存并发布</el-button>
            </div>
        </el-col>
    </div>
</template>

<script>
    import Bread from "@/components/bread";
    import { getStoreNewsdetail,saveStoreNewsdetail ,saveStoreNewsdetailOne} from '@/api/api'
    export default {
        data () {
            return {
                breaddata: [ "内容管理","店铺新闻管理", "编辑店铺新闻"],
                dataForm: {},
                dataListLoading: false,
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
               if(saveType == 0){
                   saveStoreNewsdetailOne(this.dataForm).then((res)=>{
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
               }else{
                   saveStoreNewsdetail(this.dataForm).then((res)=>{
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
        width: 50%!important;
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
    /deep/ .el-form-item--default {
        padding: 0 0!important;
        margin-bottom: 0!important;
    }
</style>