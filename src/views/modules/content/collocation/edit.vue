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
                    <span>{{dataForm.nickname}}</span>
                </el-form-item>
                <el-form-item label="用户身高：">
                    <span>{{dataForm.height}}</span>
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
                    <span>{{dataForm.state == 2?"取消发布":dataForm.state == 1?"已发布":""}}</span>
                </el-form-item>
                <el-form-item label="主图：" style="height: 100%!important;">
                    <template slot-scope="scope">
                        <div class="goodsPropsWrap">
                            <div class="goodsImg">
                                <!--                                    <img :src="scope.row.pictureUrl | filterImgUrl" alt=""/>-->
                                <img :src="dataForm.imageUrl320" alt=""/>
                            </div>
                        </div>
                    </template>
                </el-form-item>
                <el-form-item label="要点：" style="height: 100%!important;">
                    <span>{{dataForm.contentJp}}</span>
                </el-form-item>
                <div class="goods">
                    <span class="inforTit" style="vertical-align:top;">关联商品：</span>
                    <el-table
                            width="100%"
                            :data="dataForm.itemList"
                            border
                            v-loading="dataListLoading"
                            class="inforRight"
                            style="display:inline-block;width: 80%;"
                    >
                        <el-table-column prop="idJp" label="商品ID" align="center"></el-table-column>
                        <el-table-column prop="name" label="商品名称" align="center" width="200"></el-table-column>
                        <el-table-column prop="itemsImageUrl" label="图片" align="center">
                            <template slot-scope="scope">
                                <img
                                        :src="scope.row.itemsImageUrl"
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
                    <span>{{dataForm.nickname}}</span>
                </el-form-item>
                <el-form-item label="用户身高：">
                    <span>{{dataForm.height}}</span>
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
                    <span>{{dataForm.state == 2?"取消发布":dataForm.state == 1?"已发布":""}}</span>
                </el-form-item>
                <el-form-item label="主图：" style="height: 100%!important;">
                    <template slot-scope="scope">
                        <div class="goodsPropsWrap">
                            <div class="goodsImg">
                                <!--                                    <img :src="scope.row.pictureUrl | filterImgUrl" alt=""/>-->
                                <img :src="dataForm.imageUrl320" alt=""/>
                            </div>
                        </div>
                    </template>
                </el-form-item>
                <el-form-item label="要点：" style="height: 120px!important;">
                    <el-input v-model="dataForm.content" type="textarea":rows="5" placeholder="请输入内容"></el-input>
                </el-form-item>
                <div class="goods">
                    <span class="inforTit" style="vertical-align:top;">关联商品：</span>
                    <el-table
                            width="100%"
                            :data="dataForm.itemList"
                            border
                            v-loading="dataListLoading"
                            class="inforRight"
                            style="display:inline-block;width: 80%;"
                    >
                        <el-table-column prop="idJp" label="商品ID" align="center"></el-table-column>
                        <el-table-column prop="name" label="商品名称" align="center" width="200"></el-table-column>
                        <el-table-column prop="itemsImageUrl" label="图片" align="center">
                            <template slot-scope="scope">
                                <img
                                        :src="scope.row.itemsImageUrl"
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
        <el-col :span="24">
            <div style="position: fixed;bottom: 0;margin: 0 auto;width: 85%;text-align: center;z-index: 999;">
                <span style="font-size: 20px;margin-right: 20px;">状态：{{dataForm.state == 0?"未发布":dataForm.state == 1?"已发布":""}}</span>
                <el-button class="btn" @click="reset()">取消</el-button>
                <el-button class="btn" @click="getData(0)">保存</el-button>
                <el-button class="btn" type="primary" @click="getData(1)">保存并发布</el-button>
            </div>
        </el-col>
    </div>
</template>

<script>
    import Bread from "@/components/bread";
    import { getlookdetail,savelookdetail } from '@/api/api'
    export default {
        data () {
            return {
                breaddata: [ "内容管理", "搭配管理","编辑搭配"],
                dataForm: {},
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
                        };
                        getlookdetail(obj).then((res)=>{
                            console.log('详情',res.data)
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
                this.dataForm.saveFlag = saveType;
                savelookdetail(this.dataForm).then((res)=>{
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
        width: 100px;
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
        width: 100px!important;
    }
    /deep/ .el-form-item--default {
        /*height: 30px!important;*/
    }
    .grayLine {
        border-bottom: 0!important;
    }
</style>