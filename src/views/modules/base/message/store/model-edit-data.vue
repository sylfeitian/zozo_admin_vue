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
                <span>{{dataForm.idJp}}</span>
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
            <el-form-item label="选择风格标签：">
                <el-select v-model="mainTag" multiple>
                    <el-option
                            v-for="item in dataArray"
                            :key="item.id"
                            :label="item.styleName"
                            :value="item.id">
                    </el-option>
                </el-select>
<!--                <el-input v-model="dataForm.description" placeholder="" style="width: 250px;"></el-input>&nbsp;-->
<!--                <el-button class="btn" type="primary" @click="getDataList()">搜索</el-button>-->
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
    import { updateShopStore,backScanShopStore,searchShopStyle } from '@/api/api'
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
                    id:"",
                    idJp: "",//店铺ID
                    storeNameGlo: "",//海外店铺名称
                    storeNameJp: "",//店铺日文名称
                    storeName: "",//店铺中文名称
                    descriptionJp: "",//店铺日文描述
                    description: "",//店铺中文描述
                    imageUrl:"",//店铺主图
                    storeLogo:"",//店铺logo
                    mainTag:"",//标签分类
                },
                labelOption:[{ id: '0', name: '营业中' },{ id: '1', name: '已停业' }],
                dataRule : {
                    storeName : [
                        { required: true, message: '必填项不能为空', trigger: 'blur' },
                    ],
                    description : [
                        { required: true, message: '必填项不能为空', trigger: 'blur' },
                    ],
                    imageUrl: [
                        {required: true, message: "必填项不能为空", trigger: "blur"}
                    ],
                    mainTag: [
                        {required: true, message: "必填项不能为空", trigger: "change"}
                    ],
                },
                value:[],
                dataArray:[],
                mainTag:[],
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
                    this.backScan1();
                }else{
                    this.title="新建店铺"

                }
                this.$nextTick(() => {
                    this.$refs['addForm'].resetFields();
                    // this.getApplyPullList();
                })
            },
            // 编辑回显
            backScan(){
                var obj  = {
                    id:this.row.id,
                    idJp:this.row.idJp,
                    storeNameGlo:this.row.storeNameGlo,
                    storeNameJp:this.row.storeNameJp,
                    // storeName:this.row.storeName,
                    descriptionJp:this.row.descriptionJp,
                    // description:this.row.description,
                    imageUrl:this.row.imageUrl,
                    storeLogo:this.row.storeLogo,
                }
                backScanShopStore(obj).then((res)=>{
                    if(res.code == 200){
                        Object.assign(this.dataForm,res.data);

                    }else{

                    }
                })
            },
            backScan1(){

                var obj  = {
                    id:this.row.id,
                    idJp:this.row.idJp,
                    styleName:this.row.styleName
                }
                searchShopStyle(obj).then((res)=>{
                    if(res.code == 200){
                        this.dataArray = res.data;
                        Object.assign(this.dataForm,res.data);

                    }else{

                    }
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
                            "idJp":  this.dataForm.idJp,
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
                        var fn = updateShopStore;
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
                this.$parent.editDataVisible = false;
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