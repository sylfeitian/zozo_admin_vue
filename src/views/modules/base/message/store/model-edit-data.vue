<template>
    <el-dialog
            class="model-add-edit-data"
            :title="title"
            :close-on-click-modal="false"
            :visible.sync="visible"
            :before-close="closeDialog"
            width="50%"
    >
        <el-form
                :model="dataForm"
                :rules="dataRule"
                ref="addForm"
                @keyup.enter.native="dataFormSubmit('addForm')"
                label-width="120px"
                v-loading="backScanLoading"
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
                <el-input v-model.trim="dataForm.storeName" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="店铺日文描述：">
                <span>{{dataForm.descriptionJp}}</span>
            </el-form-item>
            <el-form-item label="店铺中文描述：" prop="description">
                <el-input type="textarea" v-model="dataForm.description" placeholder=""></el-input>
            </el-form-item>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="店铺主图：" prop="imageUrl">
                        <template slot-scope="scope">
                            <div class="pcCoverUrl imgUrl">
                                <img-cropper
                                        v-loading="uploading1"
                                        ref="cropperImg"
                                        :index="'1'"
                                        :cropImg="dataForm.imageUrl"
                                        :imgWidth='"100px"'
                                        :imgHeight='"100px"'
                                        @delteteImg="delteteImg"
                                        @GiftUrlHandle="GiftUrlHandle"
                                        style="display: inline-block;"
                                ></img-cropper>
                            </div>
                        </template>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="店铺logo：" prop="storeLogo">
                        <template slot-scope="scope">
                            <div class="pcCoverUrl imgUrl">
                                <img-cropper
                                        v-loading="uploading2"
                                        ref="cropperImg"
                                        :index="'2'"
                                        :cropImg="dataForm.storeLogo"
                                        :imgWidth='"100px"'
                                        :imgHeight='"100px"'
                                        @delteteImg="delteteLogo"
                                        @GiftUrlHandle="GiftUrlHandle"
                                        style="display: inline-block;"
                                ></img-cropper>
                            </div>
                        </template>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="选择风格标签：" prop="mainTag">
                <el-select
                        v-model="dataForm.mainTag"
                        multiple
                        filterable
                        remote
                        reserve-keyword
                        placeholder="请输入关键词"
                        :remote-method="remoteMethod"
                        :loading="loading"
                        style="width: 100%;"
                        :multiple-limit="10"
                >
                    <el-option
                            v-for="item in dataArray"
                            :key="item.id"
                            :label="item.label"
                            :value="item.id">
                    </el-option>
                </el-select>
<!--                <el-input v-model.trim="dataForm.description" placeholder="" style="width: 250px;"></el-input>&nbsp;-->
<!--                <el-button class="btn" type="primary" @click="getDataList()">搜索</el-button>-->
            </el-form-item>
<!--            <el-form-item style="text-align: center;margin-left: -120px!important;">-->
<!--                <el-button  @click="dataFormCancel()">取消</el-button>-->
<!--                <el-button type="primary" @click="dataFormSubmit('addForm')"-->
<!--                           :loading="loading">{{loading ? "提交中···" : "确定"}}</el-button>-->
<!--            </el-form-item>-->
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dataFormCancel()">取消</el-button>
            <el-button type="primary" @click="dataFormSubmit('addForm')"
                           :loading="loading">{{loading ? "提交中···" : "确定"}}</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import { updateShopStore,backScanShopStore,searchShopStyle } from '@/api/api'
    import imgCropper from "@/components/model-photo-cropper";
    import { uploadPicBase64 } from '@/api/api'
    import cloneDeep from 'lodash/cloneDeep'
    export default {
        name: "model-add-edit-data",
        data () {
            return {
                title:'',
                visible : false,
                loading : false,
                backScanLoading:false,
                uploading1:false,
                uploading2:false,
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
                    mainTag:[],//标签分类
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
                list: [],
                formLabelWidth: '100px'
            }
        },
        components:{
            imgCropper
        },
        mounted() {
            // this.list = this.dataArray.map(item => {
            //     return { value: item, label: item };
            // });
            // this.list = cloneDeep(this.dataArray);
        },
        methods: {
            init (row) {
                this.dataArray = [];
                this.list = [];
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
                    imageUrl:this.dataForm.imageUrl,
                    storeLogo:this.dataForm.storeLogo,
                }
                this.backScanLoading = true;
                backScanShopStore(obj).then((res)=>{
                    this.backScanLoading = false;
                    if(res.code == 200){
                        Object.assign(this.dataForm,res.data);
                        this.dataForm.mainTag = res.data.mainTag.split(",");
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
                        this.dataArray.forEach((item,index)=>{
                            item.label = item.styleName;
                        })
                        this.list = cloneDeep(this.dataArray);
                        // Object.assign(this.dataForm,res.data);

                    }else{

                    }
                })
            },
            //上传图片
            uploadPic(base64,index){
                const params = { "imgStr": base64 };
                const that = this;
                if(index==1){
                    this.uploading1 = true;
                }else if(index==2){
                    this.uploading2 = true;
                }
                return new Promise(function(resolve){
                    uploadPicBase64(params).then(res =>{
                        if(index==1){
                            that.uploading1 = false;
                        }else if(index==2){
                            that.uploading2 = false;
                        }
                        if(res && res.code == "200"){
                            var url = res.data.url
                            if(index == 1){
                                that.dataForm.imageUrl = url;
                            }else if(index == 2){
                                that.dataForm.storeLogo = url;
                            }

                            // that.currentIndex = -1;//不能这样写，防止网络延迟
                            resolve("true")
                        }else {
                            // that.currentIndex = -1;//不能这样写，防止网络延迟
                            resolve("false")
                        }
                    })
                });
            },
            // 删除店铺主图
            delteteImg(){
                this.dataForm.imageUrl = "";
            },
            // 删除店铺logo
            delteteLogo () {
                this.dataForm.storeLogo = "";
            },
            GiftUrlHandle(val,index){
                console.log("base64上传图片接口");
                console.log(val);
                this.uploadPic(val,index);
            },
            // 提交
            dataFormSubmit(formName){

                // alert([this.dataForm.name,this.dataForm.domainAddress]);
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        var mainTag = this.dataForm.mainTag?this.dataForm.mainTag.join(","):'';
                        console.log(this.dataForm);
                        var obj = {
                            "id":  this.dataForm.id,
                            "storeName":  this.dataForm.storeName,
                            "description":  this.dataForm.description,
                            "imageUrl":   this.dataForm.imageUrl, //"http://bug.leimingtech.com/zentao/file-read-25289.png",
                            "storeLogo": this.dataForm.storeLogo,// "http://bug.leimingtech.com/zentao/file-read-25289.png",
                            "mainTag":  mainTag,
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
            remoteMethod(query) {
                if (query !== '') {
                    this.loading = true;
                    setTimeout(() => {
                        this.loading = false;
                        this.dataArray = this.list.filter(item => {
                            return item.label.toLowerCase()
                                .indexOf(query.toLowerCase()) > -1;
                        });
                    }, 200);
                } else {
                    this.dataArray = cloneDeep(this.list);
                }
            }
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