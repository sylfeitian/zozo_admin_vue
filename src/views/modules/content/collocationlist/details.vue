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
                <el-form-item label="搭配集合：">
                    <span>{{dataForm.idJp}}</span>
                </el-form-item>
                <el-form-item label="用户昵称：">
                    <span>{{dataForm.userNickname}}</span>
                </el-form-item>
                <el-form-item label="用户身高：">
                    <span>{{dataForm.userHeight}}</span>
                </el-form-item>
                <el-form-item label="用户地区：">
                    <span>{{dataForm.contryNameJp}}</span>
                </el-form-item>
                <el-form-item label="性别：">
                    <span>{{dataForm.gender == 0?"男":dataForm.gender == 1?"女":dataForm.gender == 2?"儿童":dataForm.gender == 3?"world":""}}</span>
                </el-form-item>
                <el-form-item label="浏览量：">
                    <span>{{dataForm.totalViewsNum}}</span>
                </el-form-item>
                <el-form-item label="发布状态：">
                    <span>{{dataForm.jpPublishState == 0?"取消发布":dataForm.jpPublishState == 1?"已发布":""}}</span>
                </el-form-item>
                <el-form-item label="主图：" style="height: 100%!important;">
                    <template slot-scope="scope">
                        <div class="goodsPropsWrap">
                            <div class="goodsImg">
                                <!--                                    <img :src="scope.row.pictureUrl | filterImgUrl" alt=""/>-->
                                <img :src="dataForm.imageUrl" alt=""/>
                            </div>
                        </div>
                    </template>
                </el-form-item>
                <el-form-item label="标题：" style="height: 100%!important;">
                    <span>{{dataForm.titleJp}}</span>
                </el-form-item>
                <el-form-item label="详情：" style="height: 100%!important;">
                    <span>{{dataForm.contentJp}}</span>
                </el-form-item>
                <div class="goods">
                    <span class="inforTit" style="vertical-align:top;">关联搭配：</span>
                    <el-table
                            width="100%"
                            :data="dataForm.lookItems"
                            border
                            v-loading="dataListLoading"
                            class="inforRight"
                            style="display:inline-block;width: 80%;"
                    >
                        <el-table-column prop="idJp" label="搭配ID" align="center"></el-table-column>
                        <el-table-column prop="imageUrl320" label="主图" align="center">
                            <template slot-scope="scope">
                                <img
                                        :src="scope.row.imageUrl320"
                                        style=" object-fit: contain;width: 70px;height:70px;border-radius:100px;"
                                >
                            </template>
                        </el-table-column>
                        <el-table-column prop="syncState" label="同步状态" align="center">
                            <template slot-scope="scope">
                                <div>{{scope.row.syncState == 1?"已同步":"未同步"}}</div>
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
                <el-form-item label="搭配集合：">
                    <span>{{dataForm.idJp}}</span>
                </el-form-item>
                <el-form-item label="用户昵称：">
                    <span>{{dataForm.userNickname}}</span>
                </el-form-item>
                <el-form-item label="用户身高：">
                    <span>{{dataForm.userHeight}}</span>
                </el-form-item>
                <el-form-item label="用户地区：">
                    <span>{{dataForm.contryName}}</span>
                </el-form-item>
                <el-form-item label="性别：">
                    <span>{{dataForm.gender == 0?"男":dataForm.gender == 1?"女":dataForm.gender == 2?"儿童":dataForm.gender == 3?"world":""}}</span>
                </el-form-item>
                <el-form-item label="浏览量：">
                    <span>{{dataForm.totalViewsNum}}</span>
                </el-form-item>
                <el-form-item label="发布状态：">
                    <span>{{dataForm.sate == 0?"未发布":dataForm.sate == 1?"已发布":dataForm.sate == 2?"取消发布 ":""}}</span>
                </el-form-item>
                <el-form-item label="主图：" style="height: 100%!important;">
                    <template slot-scope="scope">
                        <div class="goodsPropsWrap">
                            <div class="goodsImg">
                                <!--                                    <img :src="scope.row.pictureUrl | filterImgUrl" alt=""/>-->
                                <img :src="dataForm.imageUrl" alt=""/>
                            </div>
                        </div>
                    </template>
                </el-form-item>
                <el-form-item label="标题：" style="height: 100%!important;">
                    <span>{{dataForm.title}}</span>
                </el-form-item>
                <el-form-item label="详情：" style="height: 100%!important;">
                    <span>{{dataForm.content}}</span>
                </el-form-item>
                <div class="goods">
                    <span class="inforTit" style="vertical-align:top;">关联搭配：</span>
                    <el-table
                            width="100%"
                            :data="dataForm.lookItems"
                            border
                            v-loading="dataListLoading"
                            class="inforRight"
                            style="display:inline-block;width: 80%;"
                    >
                        <el-table-column prop="id" label="搭配ID" align="center"></el-table-column>
                        <el-table-column prop="imageUrl320" label="主图" align="center">
                            <template slot-scope="scope">
                                <img
                                        :src="scope.row.imageUrl320"
                                        style=" object-fit: contain;width: 70px;height:70px;border-radius:100px;"
                                >
                            </template>
                        </el-table-column>
                        <el-table-column prop="syncState" label="同步状态" align="center">
                            <template slot-scope="scope">
                                <div>{{scope.row.syncState == 1?"已同步":"未同步"}}</div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-form>
        </el-col>
        <div style="margin-left: 20px;">
            <span>关联标签：</span>
            <span style="margin-left: 30px;">
                <el-tag
                        :key="index"
                        v-for="(tag,index) in dataForm.styles"
                        :disable-transitions="false"
                        @close="handleClose(index)">
                    {{tag.name}}
                </el-tag>
            </span>
        </div>
    </div>
</template>

<script>
    import mixinViewModule from '@/mixins/view-module'
    import Bread from "@/components/bread";
    import { getlookfolderdetail } from '@/api/api'
    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                breaddata: [ "内容管理", "搭配集合管理","搭配集合详情"],
                dataListLoading: false,
                dataForm: {}
            }
        },
        components: {
            Bread
        },
        methods: {
            handleClose(index) {
                this.dataForm.styles.splice(index, 1);
            },
            init(row){
                this.$nextTick(()=>{
                    if(row){
                        var obj  = {
                            id:row.id
                        }
                        getlookfolderdetail(obj).then((res)=>{
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
    .el-tag + .el-tag {
        margin-left: 30px;
    }
    .el-tag {
        padding: 0 35px;
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
    div {
        padding: 8px 0;
    }
    .orderState {
        margin-left: 2%;
    }
    /deep/ .el-form-item__label {
        width: 100px!important;
    }
    /deep/ .el-form-item--default {
        height: 30px!important;
    }
    .grayLine {
        border-bottom: 0!important;
    }
</style>