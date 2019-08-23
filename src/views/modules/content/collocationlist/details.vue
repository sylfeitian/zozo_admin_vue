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
                <el-form-item label="时尚编号：">
                    <span>{{dataForm.id}}</span>
                </el-form-item>
                <el-form-item label="用户昵称：">
                    <span>{{dataForm.name}}</span>
                </el-form-item>
                <el-form-item label="用户身高：">
                    <span>{{dataForm.id}}</span>
                </el-form-item>
                <el-form-item label="用户地区：">
                    <span>{{dataForm.name}}</span>
                </el-form-item>
                <el-form-item label="性别：">
                    <span>{{dataForm.id}}</span>
                </el-form-item>
                <el-form-item label="浏览量：">
                    <span>{{dataForm.id}}</span>
                </el-form-item>
                <el-form-item label="传输日期：">
                    <span>{{dataForm.id}}</span>
                </el-form-item>
                <el-form-item label="主图：">
                    <template slot-scope="scope">
                        <div class="goodsPropsWrap">
                            <div class="goodsImg">
                                <!--                                    <img :src="scope.row.pictureUrl | filterImgUrl" alt=""/>-->
                                <img src="scope.row.pictureUrl | filterImgUrl" alt=""/>
                            </div>
                        </div>
                    </template>
                </el-form-item>
                <el-form-item label="标题：">
                    <span>{{dataForm.id}}</span>
                </el-form-item>
                <el-form-item label="详情：">
                    <span>{{dataForm.id}}</span>
                </el-form-item>
                <div class="goods">
                    <span class="inforTit" style="vertical-align:top;">关联搭配：</span>
                    <el-table
                            width="100%"
                            :data="dataList"
                            border
                            v-loading="dataListLoading"
                            class="inforRight"
                            style="display:inline-block;width: 80%;"
                    >
                        <el-table-column prop="" label="搭配ID" align="center"></el-table-column>
                        <el-table-column prop="" label="主图" align="center">
                            <template slot-scope="scope">
                                <img
                                        :src="$imgDomain + scope.row.memberAvatar"
                                        alt=""
                                        style=" object-fit: contain;width: 70px;height:70px;border-radius:100px;"
                                >
                            </template>
                        </el-table-column>
                        <el-table-column prop="" label="同步状态" align="center"></el-table-column>
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
                <el-form-item label="时尚编号：">
                    <span>{{dataForm.id}}</span>
                </el-form-item>
                <el-form-item label="用户昵称：">
                    <span>{{dataForm.name}}</span>
                </el-form-item>
                <el-form-item label="用户身高：">
                    <span>{{dataForm.id}}</span>
                </el-form-item>
                <el-form-item label="用户地区：">
                    <span>{{dataForm.name}}</span>
                </el-form-item>
                <el-form-item label="性别：">
                    <span>{{dataForm.id}}</span>
                </el-form-item>
                <el-form-item label="浏览量：">
                    <span>{{dataForm.id}}</span>
                </el-form-item>
                <el-form-item label="传输日期：">
                    <span>{{dataForm.id}}</span>
                </el-form-item>
                <el-form-item label="主图：">
                    <template slot-scope="scope">
                        <div class="goodsPropsWrap">
                            <div class="goodsImg">
                                <!--                                    <img :src="scope.row.pictureUrl | filterImgUrl" alt=""/>-->
                                <img src="scope.row.pictureUrl | filterImgUrl" alt=""/>
                            </div>
                        </div>
                    </template>
                </el-form-item>
                <el-form-item label="标题：">
                    <span>{{dataForm.id}}</span>
                </el-form-item>
                <el-form-item label="详情：">
                    <span>{{dataForm.id}}</span>
                </el-form-item>
                <div class="goods">
                    <span class="inforTit" style="vertical-align:top;">关联搭配：</span>
                    <el-table
                            width="100%"
                            :data="dataList"
                            border
                            v-loading="dataListLoading"
                            class="inforRight"
                            style="display:inline-block;width: 80%;"
                    >
                        <el-table-column prop="" label="搭配ID" align="center"></el-table-column>
                        <el-table-column prop="" label="主图" align="center">
                            <template slot-scope="scope">
                                <img
                                        :src="$imgDomain + scope.row.memberAvatar"
                                        alt=""
                                        style=" object-fit: contain;width: 70px;height:70px;border-radius:100px;"
                                >
                            </template>
                        </el-table-column>
                        <el-table-column prop="" label="同步状态" align="center"></el-table-column>
                    </el-table>
                </div>
            </el-form>
        </el-col>
        <div style="margin-left: 20px;">
            <span>关联标签：</span>
            <span style="margin-left: 30px;">
                <el-tag
                        :key="index"
                        v-for="(tag,index) in dynamicTags"
                        closable
                        :disable-transitions="false"
                        @close="handleClose(tag)">
                    {{tag}}
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
                dataList: [],
                dataListLoading: false,
                dynamicTags: ['清爽一夏', '泫雅风'],
                dataForm: {}
            }
        },
        components: {
            Bread
        },
        methods: {
            handleClose(tag) {
                this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
            },
            init(id){
                this.$nextTick(()=>{
                    if(id){
                        var obj  = {
                            id:id
                        }
                        getlookfolderdetail(obj).then((res)=>{
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