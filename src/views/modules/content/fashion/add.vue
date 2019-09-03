<template>
    <div>
        <Bread :breaddata="breaddata" :index="'1'" @changePage="changePage"></Bread>
        <el-form
                :model="addDataForm"
                :rules="dataRule"
                ref="addForm"
                @keyup.enter.native="dataFormSubmit('addForm')"
                label-width="120px"

        >
            <el-form-item style="background-color: #f3f3f3;">
                <p style="margin-left: -100px;">基础信息</p>
            </el-form-item>
            <el-form-item label="标题：" prop="title" :label-width="formLabelWidth">
                <el-input v-model="addDataForm.title" maxlength="120" auto-complete="off" placeholder="请填写时尚记事标题" style="width: 1200px;"></el-input>
                <p style="color: #bebebe;line-height: 14px;">请输入120个汉字，包含汉字、数字、英文、常用字符</p>
            </el-form-item>
            <el-form-item label="编号：" prop="" :label-width="formLabelWidth" style="display: inline-block;vertical-align:top;">
                <el-input v-model="addDataForm.idJp" maxlength="20" auto-complete="off" placeholder="" style="width: 540px;"></el-input>
                <p style="color: #bebebe;line-height: 14px;">请输入20个字符以内，包含英文、数字的编号</p>
            </el-form-item>
            <el-form-item label="发布人：" prop="" :label-width="formLabelWidth" style="display: inline-block;vertical-align:top;">
                <el-input v-model="addDataForm.publisher" auto-complete="off" placeholder="" style="width: 540px;"></el-input>
            </el-form-item>
            <el-form-item label="关注量：" prop="" :label-width="formLabelWidth" style="display: inline-block;">
                <el-input v-model="addDataForm.favNumCn" type="number" auto-complete="off" placeholder="（仅可填写数字，可选）" style="width: 540px;"></el-input>
            </el-form-item>
            <el-form-item label="浏览量：" prop="" :label-width="formLabelWidth" style="display: inline-block;">
                <el-input v-model="addDataForm.viewsNumCn" type="number" auto-complete="off" placeholder="（仅可填写数字，可选）" style="width: 540px;"></el-input>
            </el-form-item>
            <el-form-item style="background-color: #f3f3f3;">
                <div style="background-color: #f3f3f3;display: flex;align-items: center;">
                    <p style="margin-left: -100px;margin-right: 50px;">详细信息</p>
                    <el-button type="primary" @click="addContent('5')" >添加文字</el-button>
                    <el-button type="primary" style="position: relative;"><input accept="image/*" multiple type="file" @change="imgUpload" style="width:100%;height:100%;position:absolute;top: 0; opacity: 0;left: 0;">添加图片</el-button>
                    <el-button type="primary" @click="openDiog" >添加商品</el-button>
                </div>
            </el-form-item>
            <el-form-item label="内容：" prop="con" :label-width="formLabelWidth" style="vertical-align:top;">
                <template slot-scope="scope">
                    <div id="content" v-for="(v,i) in content" :key="i">
                        <div class="contentChild" v-if="content[i]&&v.typeId=='5'">
                            <quill-editor-img class="inforRight" :index="i" ref="quillEditorCompon" style="display: inline-block;"  @artmessageContent='artmessageContent' ></quill-editor-img>
                            <span style="margin-left: 10px;color:#2260d2;" @click="delContent(i)">删除</span>
                        </div>
                        <div class="contentChild" v-if="content[i]&&v.typeId=='3'">
                            <img style="width:600px;" :src="$imgDomain+v.imageUrl" alt="">
                            <span style="margin-left: 10px;color:#2260d2;" @click="delContent(i)">删除</span>
                        </div>
                    </div>
                </template>
            </el-form-item>
            <el-form-item label="上传封面图：" prop="img" :label-width="formLabelWidth">
                <template slot-scope="scope">
                    <div class="pcCoverUrl imgUrl" style="float: left;width:50%;">
                        <img-cropper
                                v-loading="uploading"
                                ref="cropperImg"
                                list-type="picture-card"
                                :index="'1'"
                                :cropImg="addDataForm.mainImageUrl"
                                :imgWidth='"100px"'
                                :imgHeight='"100px"'
                                @GiftUrlHandle="GiftUrlHandle"
                                style="display: inline-block;"
                        ></img-cropper>
                        <el-dialog :visible.sync="dialogVisible" size="tiny">
                            <img width="100%" :src="$imgDomain+dialogImageUrl" alt="">
                        </el-dialog>
                    </div>
                </template>
            </el-form-item>
            <el-form-item style="text-align: center;margin-left: -120px!important;">
                <el-button  @click="dataFormSubmit(0)">保存</el-button>
                <el-button type="primary" @click="dataFormSubmit(1)">保存并发布</el-button>
            </el-form-item>
            <el-dialog title="添加商品" :visible.sync="dialogTableVisible">
                <el-form :inline="true" class="grayLine topGapPadding" :model="dataForm" @keyup.enter.native="getDataList()" >
                    <el-form-item label="ID：">
                        <el-input v-model="dataForm.params" ></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button  class="btn" type="primary" @click="getDataList()">搜索</el-button>
                        <el-button  class="btn"type="primary" plain @click="reset()" >重置条件</el-button>
                    </el-form-item>
                </el-form>
                <el-table
                        width="100%"
                        ref="multipleTable"
                        :data="dataList"
                        border=""
                        v-loading="dataListLoading"
                        style="width: 100%;maigin-top:10px;"
                        @selection-change="handleSelectionChange"
                >
                    <el-table-column type="selection" width="70"></el-table-column>
                    <el-table-column prop="goodsName" label="商品名称" align="center"></el-table-column>
                    <el-table-column prop="goodsId" label="商品ID" align="center"></el-table-column>
                    <el-table-column prop="sellPrice" label="价格" align="center"></el-table-column>
                    <el-table-column prop="stockQuantity" label="库存" align="center"></el-table-column>

                </el-table>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogTableVisible = false">取 消</el-button>
                    <el-button type="primary" @click="dialogTableVisible = false">确 定</el-button>
                </div>
            </el-dialog>
        </el-form>
    </div>
</template>

<script>
    import imgCropper from "@/components/model-photo-cropper";
    import Bread from "@/components/bread";
    import { getfashiondetail,uploadPicBase64,savefashiondetail } from '@/api/api';
    import quillEditorImg from "@/components/quillEditor";
    import { getGoodscspage } from '@/api/url';
    import mixinViewModule from '@/mixins/view-module'
    export default {
        mixins: [mixinViewModule],
        data () {
            return {
                mixinViewModuleOptions: {
                    getDataListURL: getGoodscspage,
                    getDataListIsPage: true,
                    // exportURL: '/admin-api/log/login/export',
                    deleteURL: '',
                    dataListLoading: false,
                    deleteIsBatch: true,
                    deleteIsBatchKey: 'id'
                },
                dataListLoading: false,
                dialogTableVisible: false,
                dataForm:{},
                addDataForm: {
                    fashionContents: [],
                    favNumCn: 0,
                    mainImageUrl: "",
                    publisher: "",
                    saveType: 0,
                    title: "",
                    idJp:"",
                    viewsNumCn: 0
                },
                multipleSelection:[],
                dataList: [],
                content:[],
                list:[],
                dataRule : {
                    sizeName : [
                        { required: true, message: '必填项不能为空', trigger: 'blur' },
                    ],
                    title : [
                        { required: true, message: '必填项不能为空', trigger: 'blur' },
                    ],
                    con : [
                        { required: true, message: '必填项不能为空', trigger: 'blur' },
                    ],
                    img : [
                        { required: true, message: '必填项不能为空', trigger: 'blur' },
                    ]
                },
                formLabelWidth: '120px',
                dialogImageUrl: "",
                uploading:false,
                dialogVisible: false,
                breaddata: [ "内容管理",  "时尚记事","新增时尚记事"],
            }
        },
        components: {
            quillEditorImg,
            imgCropper,
            Bread
        },
        methods: {
            init(row){
                this.$nextTick(()=>{
                    if(row){
                        var obj  = {
                            id:row.id
                        }
                        getfashiondetail(obj).then((res)=>{
                            if(res.code == 200){
                                this.addDataForm = res.data;
                            }
                        })
                    }
                })
            },
            artmessageContent(messageContent,i){
                if(this.content[i]) this.content[i].text = messageContent;
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            openDiog(){
                this.dialogTableVisible = true;
                this.getDataList();
            },
            reset() {
                this.dataForm.params = "";
                this.getDataList();
            },
            delContent(i){
                this.content.splice(i,1);
                window.this = this;
                this.$nextTick(()=>{
                    this.content.forEach((item,index)=>{
                        this.$refs.quillEditorCompon[index].addDataForm.messageContent = item.text;
                    })
                    this.content = [].concat(this.content)
                },0)
            },
            imgUpload(e){
                console.log(e.target.files)
                let that = this;
                for (let i = 0; i < e.target.files.length; i++) {
                    var reader = new FileReader();
                    reader.readAsDataURL(e.target.files[i])
                    reader.onload = function(){
                        const params = { "imgStr": reader.result };
                        uploadPicBase64(params).then(res =>{
                            if(res && res.code == "200"){
                                let obj = {
                                    colorId :"" ,//颜色id
                                    colorIdJp :"" ,// 颜色idJp
                                    contentsId :"" ,//时尚纪事内容
                                    createTime :"" ,//创建时间
                                    fashionMatomeId :"" ,// 时尚纪事的id
                                    fashionMatomeIdJp :"" ,// 日本时尚纪事的id
                                    goodCsId :"" ,// 商品的中国skuid
                                    goodCsIdJp :"" ,// 商品的日本skuid
                                    goodTypesId :"" ,// 商品类型id
                                    goodTypesIdJp :"" ,// 商品类型idJp
                                    goodsId :"" ,// 商品id
                                    goodsIdJp :"" ,// 商品idJp
                                    id :"" ,// 主键id
                                    imageUrl :res.data.url ,// 图片url
                                    sortId :"" ,// 排序id
                                    text :"" ,// 内容
                                    typeId :"3" ,// 内容类型id
                                };
                                that.content.push(obj);
                            }
                        })
                    }; //属性
                }
            },
            addContent(type){
                    let obj = {
                        colorId :"" ,//颜色id
                        colorIdJp :"" ,// 颜色idJp
                        contentsId :"" ,//时尚纪事内容
                        createTime :"" ,//创建时间
                        fashionMatomeId :"" ,// 时尚纪事的id
                        fashionMatomeIdJp :"" ,// 日本时尚纪事的id
                        goodCsId :"" ,// 商品的中国skuid
                        goodCsIdJp :"" ,// 商品的日本skuid
                        goodTypesId :"" ,// 商品类型id
                        goodTypesIdJp :"" ,// 商品类型idJp
                        goodsId :"" ,// 商品id
                        goodsIdJp :"" ,// 商品idJp
                        id :"" ,// 主键id
                        imageUrl :"" ,// 图片url
                        sortId :"" ,// 排序id
                        text :"" ,// 内容
                        typeId :type ,// 内容类型id
                    };
                    this.content.push(obj);
            },
            dataFormSubmit(type){
                let that = this;
                this.$refs["addForm"].validate(valid => {
                    if (valid) {
                        this.$confirm(`确定提交表单信息?`, "提示", {
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            type: "warning"
                        })
                            .then(() => {
                                this.addDataForm.saveType = type;
                                savefashiondetail({saveFashionDTO:this.addDataForm}).then((res)=>{
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
                            })
                            .catch(() => {});
                    }
                });

            },
            GiftUrlHandle(val){
                console.log("base64上传图片接口");
                console.log(val);
                this.uploadPic(val);
            },
            //上传图片
            uploadPic(base64){
                const params = { "imgStr": base64 };
                const that = this;
                this.uploading = true;
                return new Promise(function(resolve){
                    uploadPicBase64(params).then(res =>{
                        that.uploading = false
                        if(res && res.code == "200"){
                            var url = res.data.url
                            that.addDataForm.mainImageUrl = url;
                            // that.currentIndex = -1;//不能这样写，防止网络延迟
                            resolve("true")
                        }else {
                            // that.currentIndex = -1;//不能这样写，防止网络延迟
                            resolve("false")
                        }
                    })
                });
            },
            changePage(){
                this.$emit("addList");
            }
        }
    }
</script>

<style scoped>
    /deep/ .el-form-item__content {
        line-height: 20px!important;
    }
    /deep/ .upload-box {
        border: 0!important;
    }
    /deep/ .el-button {
        width: 150px;
    }
</style>