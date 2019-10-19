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
                <el-form-item label="纪事编号：">
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
                    <el-input v-model.trim="dataForm.orderSn" class="inforRight" placeholder="请输入内容"></el-input>
                </el-form-item>
<!--                <div style="padding: 0;">-->
<!--                    <span class="inforTit">标题：</span>-->
<!--                    <el-input v-model.trim="dataForm.orderSn" class="inforRight" placeholder="请输入内容"></el-input>-->
<!--                </div>-->
                <el-form-item label="内容：" prop="con">
                    <quill-editor-img class="inforRight" style="display: inline-block;width: 670px;"  @artmessageContent='artmessageContent' ref="refmessageContent"></quill-editor-img>
                </el-form-item>
<!--                <div>-->
<!--                    <span class="inforTit" style="vertical-align:top;">内容：</span>-->
<!--                    <quill-editor-img class="inforRight" style="display: inline-block;width: 670px;"  @artmessageContent='artmessageContent' ref="refmessageContent"></quill-editor-img>-->
<!--                </div>-->
            </el-form>
        </el-col>
        <el-col :span="24">
            <div style="position: fixed;bottom: 0;margin: 0 auto;width: 85%;text-align: center;margin-top: 200px;">
                <span style="font-size: 20px;margin-right: 20px;">状态：{{111}}</span>
                <el-button class="btn" @click="reset('dataForm')">取消</el-button>
                <el-button class="btn" @click="reset('dataForm')">保存</el-button>
                <el-button class="btn" type="primary" @click="reset('dataForm')">保存并发布</el-button>
            </div>
        </el-col>
    </div>
</template>

<script>
    import quillEditorImg from "@/components/quillEditor"
    import mixinViewModule from '@/mixins/view-module'
    import Bread from "@/components/bread";
    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                breaddata: [ "内容管理", "编辑时尚纪事"],
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
            quillEditorImg,
            Bread
        },
        methods: {
            artmessageContent(messageContent){
                this.dataForm.messageContent = messageContent;
            },
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
        width: 500px!important;
    }
    /deep/ .el-button {
        width: 150px;
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