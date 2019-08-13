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
                <el-form-item label="时尚编号：">
                    <span>{{dataForm.id}}</span>
                </el-form-item>
                <el-form-item label="发布者：">
                    <span>{{dataForm.name}}</span>
                </el-form-item>
                <el-form-item label="收藏数量：">
                    <span>{{dataForm.id}}</span>
                </el-form-item>
                <el-form-item label="浏览数量：">
                    <span>{{dataForm.name}}</span>
                </el-form-item>
                <el-form-item label="发布日期：">
                    <span>{{dataForm.id}}</span>
                </el-form-item>
                <el-form-item label="日方发布状态：">
                    <span>{{dataForm.id}}</span>
                </el-form-item>
                <el-form-item label="取消发布时间：">
                    <span>{{dataForm.id}}</span>
                </el-form-item>
                <el-form-item label="背景图：">
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
                <el-form-item label="内容：">
                    <span>{{dataForm.id}}</span>
                </el-form-item>
            </el-form>
        </el-col>

        <el-col :span="12">
            <el-form
                    ref="dataForm"
                    class="grayLine topGapPadding"
                    :model="dataForm"
                    :rules="dataRule"
                    @keyup.enter.native="getDataList()"
            >
                <p class="title">中文</p>
                <el-form-item label="时尚编号：">
                    <span>{{dataForm.id}}</span>
                </el-form-item>
                <el-form-item label="发布者：">
                    <span>{{dataForm.name}}</span>
                </el-form-item>
                <el-form-item label="收藏数量：">
                    <span>{{dataForm.id}}</span>
                </el-form-item>
                <el-form-item label="浏览数量：">
                    <span>{{dataForm.name}}</span>
                </el-form-item>
                <el-form-item label="发布日期：">
                    <span>{{dataForm.id}}</span>
                </el-form-item>
                <el-form-item label="日方发布状态：">
                    <span>{{dataForm.id}}</span>
                </el-form-item>
                <el-form-item label="取消发布时间：">
                    <span>{{dataForm.id}}</span>
                </el-form-item>
                <el-form-item label="背景图：">
                    <template slot-scope="scope">
                        <div class="goodsPropsWrap">
                            <div class="goodsImg">
                                <!--                                    <img :src="scope.row.pictureUrl | filterImgUrl" alt=""/>-->
                                <img src="scope.row.pictureUrl | filterImgUrl" alt=""/>
                            </div>
                        </div>
                    </template>
                </el-form-item>
                <el-form-item label="标题：" prop="title">
                    <span>{{dataForm.id}}</span>
                </el-form-item>
                <el-form-item label="内容：" prop="con">
                    <span>{{dataForm.id}}</span>
                </el-form-item>
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
                dataRule : {
                    title : [
                        { required: true, message: '必填项不能为空', trigger: 'blur' },
                    ],
                    con : [
                        { required: true, message: '必填项不能为空', trigger: 'blur' },
                    ]
                },
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
        width: 120px!important;
    }
    /deep/ .el-form-item--default {
        height: 30px!important;
    }
    .grayLine {
        border-bottom: 0!important;
    }
</style>