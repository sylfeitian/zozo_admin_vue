<template>
    <div>
        <Bread :breaddata="breaddata" @changePage="changePage"></Bread>
        <el-col :span="12" style="border-right: 1px solid #e6e6e6;">
            <el-form
                    ref="dataForm"
                    class="grayLine topGapPadding"
                    :model="dataForm"
                    @keyup.enter.native="getDataList()"
            >
                <p class="title">日文</p>
                <el-form-item label="搭配ID：">
                    <span>{{dataForm.id}}</span>
                </el-form-item>
                <el-form-item label="标题：">
                    <span>{{dataForm.name}}</span>
                </el-form-item>
                <el-form-item label="发布人：">
                    <span>{{dataForm.id}}</span>
                </el-form-item>
                <el-form-item label="性别：">
                    <span>{{dataForm.id}}</span>
                </el-form-item>
                <el-form-item label="收藏数量：">
                    <span>{{dataForm.name}}</span>
                </el-form-item>
                <el-form-item label="浏览数量：">
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
                <el-form-item label="要点：">
                    <span>{{dataForm.id}}</span>
                </el-form-item>
                <div class="goods">
                    <span class="inforTit" style="vertical-align:top;">关联商品：</span>
                    <el-table
                            width="100%"
                            :data="dataList"
                            border
                            v-loading="dataListLoading"
                            class="inforRight"
                            style="display:inline-block;width: 80%;"
                    >
                        <el-table-column prop="" label="商品ID" align="center"></el-table-column>
                        <el-table-column prop="" label="商品名称" align="center" width="200"></el-table-column>
                        <el-table-column prop="" label="图片" align="center">
                            <template slot-scope="scope">
                                <img
                                        :src="$imgDomain + scope.row.memberAvatar"
                                        alt=""
                                        style=" object-fit: contain;width: 70px;height:70px;border-radius:100px;"
                                >
                            </template>
                        </el-table-column>
                        <el-table-column prop="" label="可售状态" align="center"></el-table-column>
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
                    <span>{{dataForm.id}}</span>
                </el-form-item>
                <el-form-item label="标题：">
                    <span>{{dataForm.name}}</span>
                </el-form-item>
                <el-form-item label="发布人：">
                    <span>{{dataForm.id}}</span>
                </el-form-item>
                <el-form-item label="性别：">
                    <span>{{dataForm.id}}</span>
                </el-form-item>
                <el-form-item label="收藏数量：">
                    <span>{{dataForm.name}}</span>
                </el-form-item>
                <el-form-item label="浏览数量：">
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
                <el-form-item label="要点：">
                    <span>{{dataForm.id}}</span>
                </el-form-item>
                <div class="goods">
                    <span class="inforTit" style="vertical-align:top;">关联商品：</span>
                    <el-table
                            width="100%"
                            :data="dataList"
                            border
                            v-loading="dataListLoading"
                            class="inforRight"
                            style="display:inline-block;width: 80%;"
                    >
                        <el-table-column prop="" label="商品ID" align="center"></el-table-column>
                        <el-table-column prop="" label="商品名称" align="center" width="200"></el-table-column>
                        <el-table-column prop="" label="图片" align="center">
                            <template slot-scope="scope">
                                <img
                                        :src="$imgDomain + scope.row.memberAvatar"
                                        alt=""
                                        style=" object-fit: contain;width: 70px;height:70px;border-radius:100px;"
                                >
                            </template>
                        </el-table-column>
                        <el-table-column prop="" label="可售状态" align="center"></el-table-column>
                    </el-table>
                </div>
            </el-form>
        </el-col>
    </div>
</template>

<script>
    import mixinViewModule from '@/mixins/view-module'
    import Bread from "@/components/bread";
    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                breaddata: [ "内容管理", "搭配详情"],
                dataList: [],
                dataListLoading: false,
                dataForm: {}
            }
        },
        components: {
            Bread
        },
        methods: {
            init(id){
                this.$nextTick(()=>{
                    if(id){
                        var obj  = {
                            id:id
                        }
                        storeNews(obj).then((res)=>{
                            console.log('详情',res.data)
                            if(res.code == 200){
                                this.logo = res.data.storeDTO.storeLogo;
                                this.electronicBusinessLicense = res.data.storeAuthDTO.electronicBusinessLicense;
                                this.dataForm.storeClassId = res.data.storeClassDTOList.map(item=>{
                                    return item.classId
                                })
                                this.storeId = res.data.storeDTO.id;
                                this.dataForm.id = res.data.storeUserDTO.id;
                                Object.assign(this.dataForm, res.data.storeUserDTO);
                                Object.assign(this.dataForm.saveStoreDTO, res.data.storeDTO);
                                if(res.data.storeAuthDTO){
                                    Object.assign(this.dataForm.saveStoreAuthDTO,res.data.storeAuthDTO)
                                }
                                this.dataForm.isEnable = JSON.stringify(res.data.isEnable)

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