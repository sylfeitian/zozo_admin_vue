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
            <el-form-item  label="风格标签分类：">
                <el-select v-model="dataForm.styleType" placeholder="请选择">
                    <el-option
                            v-for="item in options"
                            :key="item.id"
                            :label="item.label"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="风格标签名称：" prop="styleName">
                <el-input v-model="dataForm.styleName" placeholder="0"></el-input>
            </el-form-item>
            <el-form-item label="性别：">
                <el-select v-model="dataForm.gender" placeholder="请选择">
                    <el-option
                            v-for="item in genderOptions"
                            :key="item.id"
                            :label="item.label"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="主图：" prop="imgUrl" >
                <template slot-scope="scope">
                    <div class="pcCoverUrl imgUrl" style="float: left;width:50%;">
                        <img-cropper
                                v-loading="uploading"
                                ref="cropperImg"
                                :index="'1'"
                                :cropImg="dataForm.imgUrl"
                                :imgWidth='"100px"'
                                :imgHeight='"100px"'
                                @GiftUrlHandle="GiftUrlHandle"
                                style="display: inline-block;"
                        ></img-cropper>
                    </div>
                </template>
            </el-form-item>
<!--            <el-form-item label="描述 ：" prop="desc">-->
<!--                <el-input type="textarea" v-model="dataForm.desc" placeholder="请输入500字以内的内容"></el-input>-->
<!--            </el-form-item>-->
            <el-form-item label="排序：" prop="sort" :label-width="formLabelWidth">
                <el-input v-model="dataForm.sort" placeholder="0"></el-input>
                <span style="color: #999;">数字越大越靠前</span>
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
    import imgCropper from "@/components/model-photo-cropper";
    import { uploadPicBase64 } from '@/api/api'
    import { backScanShopStyle,updateShopStyle,deleteShopStyle } from '@/api/api'
    export default {
        name: "model-add-edit-data",
        data () {
            return {
                visible : false,
                loading : false,
                uploading:false,
                title:'',
                dataForm: {
                    styleName: "",//标签名称
                    styleType: "",//标签分类
                    gender: "",//性别
                    imgUrl: "",//主图
                    sort: "",//排序
                },
                dataRule : {
                    styleName : [
                        { required: true, message: '必填项不能为空', trigger: 'blur' },
                    ],
                    styleType: [
                        {required: true, message: "请选择标签分类", trigger: "change"}
                    ]
                },
                options: [{
                    id: '0',
                    label: '主标签'
                }, {
                    id: '1',
                    label: '副标签'
                }],
                genderOptions: [{id: '0',label: '男'}, {id: '1',label: '女'}, {id: '2',label: '儿童'}],
                value:[],
                value2:[],
                dataArray:[],
                dataArray2:[],
                formLabelWidth: '120px'
            }
        },
        components:{
            imgCropper
        },
        created () {
            // this.dataForm.styleType = this.options[0].id;
        },
        methods: {
            init (row) {
                this.visible = true;
                this.row = row;
                if(row){
                    this.title="编辑标签";
                    this.backScan();
                }else{
                    this.title="新建标签"

                }
                this.$nextTick(() => {
                    this.$refs['addForm'].resetFields();
                    // this.getApplyPullList();
                })
            },
            //编辑回显
            backScan(){
                var obj  = {
                    id:this.row.id,
                    styleName:this.row.styleName,
                    styleType:this.row.styleType,
                }
                backScanShopStyle(obj).then((res)=>{
                    if(res.code == 200){
                        Object.assign(this.dataForm,res.data);
                        this.dataForm.styleType =this.dataForm.styleType+"";
                        this.dataForm.gender =this.dataForm.gender+"";
                    }else{

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
            // handleChange2() {
            //     var value = this.value;
            //     console.log(value);
            //     console.log(value[value.length-1]);
            //     if(value.length >0){
            //         this.dataForm.sex =value[value.length-1]
            //     }else{
            //         this.dataForm.sex = 0;
            //     }
            // },
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
                            styleName:  this.dataForm.styleName,
                            styleType:  this.dataForm.styleType,
                            gender:  this.dataForm.gender,
                            imgUrl:  this.dataForm.imgUrl,
                            sort:  this.dataForm.sort,
                            description: this.dataForm.description,
                        }
                        if(this.row) obj.id = this.row.id
                        var fn = updateShopStyle;
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
</style>