<template>
    <el-dialog
            class="model-add-edit-data"
            :title="title"
            :close-on-click-modal="false"
            :visible.sync="visible"
            :before-close="closeDialog"
            width="30%"
    >
        <el-form
                :model="dataForm"
                :rules="dataRule"
                ref="addForm"
                @keyup.enter.native="dataFormSubmit('addForm')"
                label-width="120px"
        >
            <el-form-item label="店铺ID：">
                <span>{{dataForm.id}}</span>
            </el-form-item>
            <el-form-item label="海外店铺名称：">
                <span>{{dataForm.storeNameGlo}}</span>
            </el-form-item>
            <el-form-item label="店铺日文名称：">
                <span>{{dataForm.storeNameJp}}</span>
            </el-form-item>
            <el-form-item label="店铺中文名称：" prop="storeName">
                <el-input v-model="dataForm.storeName" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="店铺日文描述：">
                <span>{{dataForm.descriptionJp}}</span>
            </el-form-item>
            <el-form-item label="店铺中文描述：" prop="description">
                <el-input type="textarea" v-model="dataForm.description" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="店铺主图：" prop="imageUrl" style="float: left;width:50%;">
                <template slot-scope="scope">
                    <div class="pcCoverUrl imgUrl" style="float: left;width:50%;">
                        <img-cropper
                                v-loading="uploading"
                                ref="cropperImg"
                                :index="'1'"
                                :cropImg="dataForm.imageUrl"
                                :imgWidth='"100px"'
                                :imgHeight='"100px"'
                                @GiftUrlHandle="GiftUrlHandle"
                                style="display: inline-block;"
                        ></img-cropper>
                    </div>
                </template>
            </el-form-item>
            <el-form-item label="店铺logo：" prop="storeLogo" style="float: right;width:50%;">
                <template slot-scope="scope">
                    <div class="pcCoverUrl imgUrl" style="float: left;width:50%;">
                        <img-cropper
                                v-loading="uploading"
                                ref="cropperImg"
                                :index="'1'"
                                :cropImg="dataForm.storeLogo"
                                :imgWidth='"100px"'
                                :imgHeight='"100px"'
                                @GiftUrlHandle="GiftUrlHandle"
                                style="display: inline-block;"
                        ></img-cropper>
                    </div>
                </template>
            </el-form-item>
            <el-form-item label="标签分类：" prop="mainTag">
                <el-select v-model="value" multiple :options="dataArray" @change="handleChange" clearable change-on-select></el-select>
            </el-form-item>
            <el-form-item style="text-align: center;margin-left: -120px!important;">
                <el-button  @click="dataFormCancel()">取消</el-button>
                <el-button type="primary" @click="dataFormSubmit('addForm')"
                           :loading="loading">{{loading ? "提交中···" : "确定"}}</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
    import { updateShopStore,operateShopStore,updateGoodsSpecSku } from '@/api/api'
    import imgCropper from "@/components/model-photo-cropper";
    import { uploadPicBase64 } from '@/api/api'
    export default {
        name: "model-add-edit-data",
        data () {
            return {
                title:'',
                visible : false,
                loading : false,
                uploading:false,
                dataForm: {
                    id: "",//店铺ID
                    storeNameGlo: "",//海外店铺名称
                    storeNameJp: "",//店铺日文名称
                    storeName: "",//店铺中文名称
                    descriptionJp: "",//店铺日文描述
                    description: "",//店铺中文描述
                    imageUrl:"",//店铺主图
                    storeLogo:"",//店铺logo
                    mainTag:"",//标签分类
                },
                dataRule : {
                    storeName : [
                        { required: true, message: '必填项不能为空', trigger: 'blur' },
                    ],
                    description : [
                        { required: true, message: '必填项不能为空', trigger: 'blur' },
                    ],
                    imageUrl: [
                        {required: true, message: "请选择标签分类", trigger: "blur"}
                    ],
                    mainTag: [
                        {required: true, message: "请选择标签分类", trigger: "change"}
                    ],
                },
                value:[],
                dataArray:[],
                formLabelWidth: '100px'
            }
        },
        components:{
            imgCropper
        },
        methods: {
            init (row) {
                this.visible = true;
                this.row = row;
                if(row){
                    this.title="编辑店铺";
                    this.backScan();
                }else{
                    this.title="新建店铺"

                }
                this.$nextTick(() => {
                    this.$refs['addForm'].resetFields();
                    // this.getApplyPullList();
                })
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
                            that.dataForm.gcPic = url;
                            // that.currentIndex = -1;//不能这样写，防止网络延迟
                            resolve("true")
                        }else {
                            // that.currentIndex = -1;//不能这样写，防止网络延迟
                            resolve("false")
                        }
                    })
                });
            },
            GiftUrlHandle(val){
                console.log("base64上传图片接口");
                console.log(val);
                this.uploadPic(val);
            },
            // 提交
            dataFormSubmit(formName){
                // alert([this.dataForm.name,this.dataForm.domainAddress]);
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        var obj = {
                            "id":  this.dataForm.id,
                            "storeNameGlo":  this.dataForm.storeNameGlo,
                            "storeNameJp":  this.dataForm.storeNameJp,
                            "storeName":  this.dataForm.storeName,
                            "descriptionJp":  this.dataForm.descriptionJp,
                            "description":  this.dataForm.description,
                            "imageUrl":  this.dataForm.imageUrl,
                            "storeLogo":  this.dataForm.storeLogo,
                            "mainTag":  this.dataForm.mainTag,
                        }
                        if(this.row) obj.id = this.row.id
                        var fn = this.row.updateShopStore;
                        fn(obj).then((res) => {
                            this.loading = false;
                            // alert(JSON.stringify(res));
                            let status = null;
                            if(res.code == "200"){
                                status = "success";
                                this.visible = false;
                                this.$emit('searchDataList');
                                this.closeDialog();

                            }else{
                                status = "error";
                            }

                            this.$message({
                                message: res.msg,
                                type: status,
                                duration: 1500
                            })
                        })
                    } else {
                        //console.log('error 添加失败!!');
                        return false;
                    }
                })
            },
            handleChange() {
                var value = this.value;
                console.log(value);
                console.log(value[value.length-1]);
                if(value.length >0){
                    this.dataForm.labelSort =value[value.length-1]
                }else{
                    this.dataForm.labelSort = 0;
                }
            },
            //关闭弹窗
            dataFormCancel(){
                this.visible = false;
                this.closeDialog();
            },
            closeDialog() {
                this.$parent.addEditDataVisible = false;
            },
        }
    }
</script>

<style scoped>
    /deep/.upload-box {
        border: 0!important;
    }
    .title {
        margin-left: -98px;
    }
</style>