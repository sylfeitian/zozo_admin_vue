<template>
    <div>
        <Bread :breaddata="breaddata"></Bread>
        <el-col :span="12" style="border-right: 1px solid #e6e6e6;">
            <el-form
                    ref="dataForm"
                    class="grayLine topGapPadding"
                    :model="dataForm"
                    @keyup.enter.native="getDataList()"
            >
                <p class="title">日文</p>
                <el-form-item label="搭配编号：">
                    <span>{{dataForm.id}}</span>
                </el-form-item>
                <el-form-item label="用户昵称：">
                    <span>{{dataForm.name}}</span>
                </el-form-item>
                <el-form-item label="用户身高：">
                    <span>{{dataForm.id}}</span>
                </el-form-item>
                <el-form-item label="用户地区：">
                    <span>{{dataForm.id}}</span>
                </el-form-item>
                <el-form-item label="性别：">
                    <span>{{dataForm.id}}</span>
                </el-form-item>
                <el-form-item label="收藏数量：">
                    <span>{{dataForm.name}}</span>
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
<!--            <p class="title">日文</p>-->
<!--            <div class="orderState">-->
<!--                <div>-->
<!--                    <span class="inforTit">搭配编号：</span>-->
<!--                    <span class="inforRight">{{111}}</span>-->
<!--                </div>-->
<!--                <div>-->
<!--                    <span class="inforTit">用户昵称：</span>-->
<!--                    <span class="inforRight">{{111}}</span>-->
<!--                </div>-->
<!--                <div>-->
<!--                    <span class="inforTit">用户身高：</span>-->
<!--                    <span class="inforRight">{{111}}</span>-->
<!--                </div>-->
<!--                <div>-->
<!--                    <span class="inforTit">用户地区：</span>-->
<!--                    <span class="inforRight">{{111}}</span>-->
<!--                </div>-->
<!--                <div>-->
<!--                    <span class="inforTit">性别：</span>-->
<!--                    <span class="inforRight">{{111}}</span>-->
<!--                </div>-->
<!--                <div>-->
<!--                    <span class="inforTit">收藏数量：</span>-->
<!--                    <span class="inforRight">{{111}}</span>-->
<!--                </div>-->
<!--                <div>-->
<!--                    <span class="inforTit">传输日趋：</span>-->
<!--                    <span class="inforRight">{{111}}</span>-->
<!--                </div>-->
<!--                <div>-->
<!--                    <span class="inforTit">主图：</span>-->
<!--                    <img class="imglist right" alt="">-->
<!--                </div>-->
<!--                <div>-->
<!--                    <span class="inforTit">辩题：</span>-->
<!--                    <span class="inforRight">{{111}}</span>-->
<!--                </div>-->
<!--                <div>-->
<!--                    <span class="inforTit">详情：</span>-->
<!--                    <span class="inforRight">{{111}}</span>-->
<!--                </div>-->
<!--                <div class="goods">-->
<!--                    <span class="inforTit" style="vertical-align:top;">关联商品：</span>-->
<!--                    <el-table-->
<!--                            width="100%"-->
<!--                            :data="dataList"-->
<!--                            border-->
<!--                            v-loading="dataListLoading"-->
<!--                            class="inforRight"-->
<!--                            style="display:inline-block;width: 80%;"-->
<!--                    >-->
<!--                        <el-table-column prop="" label="商品ID" align="center"></el-table-column>-->
<!--                        <el-table-column prop="" label="商品名称" align="center" width="200"></el-table-column>-->
<!--                        <el-table-column prop="" label="图片" align="center">-->
<!--                            <template slot-scope="scope">-->
<!--                                <img-->
<!--                                        :src="$imgDomain + scope.row.memberAvatar"-->
<!--                                        alt=""-->
<!--                                        style=" object-fit: contain;width: 70px;height:70px;border-radius:100px;"-->
<!--                                >-->
<!--                            </template>-->
<!--                        </el-table-column>-->
<!--                        <el-table-column prop="" label="可售状态" align="center"></el-table-column>-->
<!--                    </el-table>-->
<!--                </div>-->
<!--            </div>-->
        </el-col>

        <el-col :span="12">
            <el-form
                 ref="dataForm"
                 class="grayLine topGapPadding"
                 :model="dataForm"
                 @keyup.enter.native="getDataList()"
            >
                <p class="title">日文</p>
                <el-form-item label="搭配编号：">
                    <span>{{dataForm.id}}</span>
                </el-form-item>
                <el-form-item label="用户昵称：">
                    <span>{{dataForm.name}}</span>
                </el-form-item>
                <el-form-item label="用户身高：">
                    <span>{{dataForm.id}}</span>
                </el-form-item>
                <el-form-item label="用户地区：">
                    <el-input v-model.trim="dataForm.orderSn" placeholder="请输入内容" style="width: 500px;"></el-input>
                </el-form-item>
<!--                    <div style="padding: 0;">-->
<!--                        <span class="inforTit">用户地区：</span>-->
<!--                        <el-input v-model.trim="dataForm.orderSn" class="inforRight" placeholder="请输入内容" style="width: 500px;"></el-input>-->
<!--                    </div>-->
                <el-form-item label="性别：">
                    <span>{{dataForm.id}}</span>
                </el-form-item>
                <el-form-item label="收藏数量：">
                    <span>{{dataForm.name}}</span>
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
                    <el-input v-model.trim="dataForm.orderSn" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item label="详情：" style="height: 120px!important;">
                    <el-input v-model.trim="dataForm.orderSn" type="textarea":rows="5" placeholder="请输入内容"></el-input>
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
        <el-col :span="24">
            <div style="position: fixed;bottom: 0;margin: 0 auto;width: 85%;text-align: center;z-index: 999;">
                <span style="font-size: 20px;margin-right: 20px;">状态：{{111}}</span>
                <el-button class="btn" @click="reset('dataForm')">取消</el-button>
                <el-button class="btn" @click="getData()">保存</el-button>
                <el-button class="btn" type="primary" @click="getData()">保存并发布</el-button>
            </div>
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
                breaddata: [ "内容管理", "编辑搭配"],
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
                            console.log('回显',res.data)
                            if(res.code == 200){
                                this.startObj = cloneDeep(res.data);//深拷贝回显详情初始数据
                                if(res.data.storeDTO.storeLogo){
                                    this.$nextTick(()=>{
                                        this.$refs.cropperImg1.cropper.imgShow  = true
                                        this.$refs.cropperImg1.cropper.cropImg  = res.data.storeDTO.storeLogo;
                                    })
                                }
                                if(res.data.storeAuthDTO&&res.data.storeAuthDTO.electronicBusinessLicense){
                                    this.$nextTick(()=>{
                                        this.$refs.cropperImg2.cropper.imgShow  = true
                                        this.$refs.cropperImg2.cropper.cropImg  = res.data.storeAuthDTO.electronicBusinessLicense;
                                    })
                                }
                                if(res.data.storeClassDTOList&&res.data.storeClassDTOList.length!=0){
                                    this.dataForm.storeClassId = res.data.storeClassDTOList.map(item=>{
                                        return item.classId
                                    })
                                }else{
                                    this.dataForm.storeClassId = this.storeClassList.map(item=>{
                                        return item.id
                                    })
                                }
                                this.storeId = res.data.storeDTO.id;
                                this.dataForm.id = res.data.storeUserDTO.id;
                                Object.assign(this.dataForm, res.data.storeUserDTO)
                                Object.assign(this.dataForm.saveStoreDTO, res.data.storeDTO)
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
                this.$emit("addoraditList");
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
        width: 500px!important;
    }
    /deep/ .el-button {
        width: 150px;
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