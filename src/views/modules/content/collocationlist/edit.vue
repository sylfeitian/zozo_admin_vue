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
                    <span>{{dataForm.userHeight}}</span><span v-if="dataForm.userHeight">cm</span>
                </el-form-item>
                <el-form-item label="用户地区：">
                    <span>日本</span>
                </el-form-item>
                <el-form-item label="性别：">
                    <span>{{dataForm.gender == 0?"男":dataForm.gender == 1?"女":dataForm.gender == 2?"儿童":dataForm.gender == 3?"world":""}}</span>
                </el-form-item>
                <el-form-item label="浏览量：">
                    <span>{{dataForm.totalViewsNum}}</span>
                </el-form-item>
                <el-form-item label="发布状态：">
                    <span>{{dataForm.jpPublishState == 0?"待发布":dataForm.jpPublishState == 1?"已发布":""}}</span>
                </el-form-item>
                <el-form-item label="主图：" style="height: 100%!important;">
                    <template slot-scope="scope">
                        <div class="goodsPropsWrap">
                            <div class="goodsImg">
                                <img :src="dataForm.imageUrl" alt=""/>
                            </div>
                        </div>
                    </template>
                </el-form-item>
                <el-form-item label="标题：" style="height: 100%!important;">
                    <span>{{dataForm.titleJp}}</span>
                </el-form-item>
                <el-form-item label="详情：" style="height: 100%!important;">
                    <span>{{dataForm.descriptionJp}}</span>
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
                    <span>{{dataForm.userHeight}}</span><span v-if="dataForm.userHeight">cm</span>
                </el-form-item>
                <el-form-item label="用户地区：">
                    <span>日本</span>
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
                                <img :src="dataForm.imageUrl" alt=""/>
                            </div>
                        </div>
                    </template>
                </el-form-item>
                <el-form-item label="标题：" style="height: 100%!important;">
                    <el-input v-model="dataForm.title" type="text" placeholder="请输入标题名称"></el-input>
                </el-form-item>
                <el-form-item label="详情：" style="height: 100%!important;">
                    <el-input v-model="dataForm.description" type="textarea":rows="5" placeholder="请输入内容"></el-input>
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
        <div style="margin-left:20px;">
            <div>
                <span style="margin-right: 10px;"><span style="color: #F56C6C;margin-right: 5px;">*</span>关联标签：</span>
                <el-select v-model="stylesName" :filter-method="getStyle" @change="saveList" filterable placeholder="请选择">
                    <el-option
                            v-for="(item,index) in options"
                            :key="index"
                            :label="item.styleName"
                            :value="index">
                    </el-option>
                </el-select>
            </div>
            <span style="margin-left: 30px;">
                <el-tag
                        :key="index"
                        style="margin-bottom: 10px;"
                        v-for="(tag,index) in styleList"
                        closable
                        :disable-transitions="false"
                        @close="handleClose(index)">
                    {{tag.styleName}}
                </el-tag>
            </span>
        </div>
        <el-col :span="24">
            <div style="position: fixed;bottom: 0;margin: 0 auto;width: 85%;text-align: center;z-index: 999;">
                <span style="font-size: 20px;margin-right: 20px;">状态：{{dataForm.sate == 0?"未发布":dataForm.sate == 1?"已发布":dataForm.sate == 2?"取消发布 ":""}}</span>
                <el-button class="btn" @click="reset()">取消</el-button>
                <el-button class="btn" @click="getData(0)">保存</el-button>
                <el-button class="btn" :disabled="dataForm.jpPublishState == 0" type="primary" @click="getData(1)">保存并发布</el-button>
            </div>
        </el-col>
    </div>
</template>

<script>
    import Bread from "@/components/bread";
    import {  getlookfolderdetail,saveFolderdetail,getStyleName } from '@/api/api'
    export default {
        data () {
            return {
                breaddata: [ "内容管理",  "搭配集合管理","编辑搭配集合"],
                dataForm: {},
                stylesName:"",
                dataListLoading: false,
                styleList:[],
                options:""
            }
        },
        components: {
            Bread
        },
        created(){
            this.getStyle();
        },
        methods: {
            init(row){
                this.$nextTick(()=>{
                    if(row){
                        var obj  = {
                            id:row.id
                        }
                        getlookfolderdetail(obj).then((res)=>{
                            if(res.code == 200){
                                this.dataForm = res.data;
                                if(this.dataForm.styles) this.styleList = this.dataForm.styles;
                                else this.styleList = [];
                            }
                        })
                    }
                })
            },
            saveList(val){
                let is = true;
                this.styleList.map((v)=>{
                    if(v.id == this.options[val].id){
                        this.$message({
                            message: "风格标签不能重复选择",
                            type: 'error',
                        });
                        is = false
                    }
                })
                if(is) this.styleList.push(this.options[val])
            },
            getStyle(){
                getStyleName({
                    params:{styleName:this.styleName}
                }).then((res)=>{
                    this.options = res;
                })
            },
            handleClose(index) {
                this.styleList.splice(index, 1);
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
                this.dataForm.styles = this.styleList;
                saveFolderdetail(this.dataForm).then((res)=>{
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