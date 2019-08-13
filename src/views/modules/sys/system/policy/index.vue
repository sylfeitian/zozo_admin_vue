<template>
    <div>
        <Bread :breaddata="breaddata"></Bread>
        <el-form
                :model="dataForm"
                :rules="dataRule"
                ref="addForm"
                @keyup.enter.native="dataFormSubmit('addForm')"
                label-width="120px"

        >
            <el-form-item style="background-color: #f3f3f3;">
                <p style="margin-left: -100px;">客服审单设置</p>
            </el-form-item>
            <el-form-item label="留言审核开关：" prop="adState">
                <el-switch
                        v-model="dataForm.adState"
                        active-color="#1890ff"
                        inactive-color="#ff4949"
                ></el-switch>
            </el-form-item>
            <el-form-item label="黑名单审核开关：" prop="blacktState">
                <el-switch
                        v-model="dataForm.blacktState"
                        active-color="#1890ff"
                        inactive-color="#ff4949"
                ></el-switch>
            </el-form-item>
            <el-form-item label="订单有效金额范围：" prop="" :label-width="formLabelWidth">
                <el-input v-model="dataForm.sizeName" auto-complete="off" placeholder="请输入" style="width: 160px;"></el-input>
                <span> ~ </span>
                <el-input v-model="dataForm.sizeName" auto-complete="off" placeholder="请输入" style="width: 160px;"></el-input>
            </el-form-item>
            <el-form-item style="background-color: #f3f3f3;">
                <p style="margin-left: -100px;">订单设置</p>
            </el-form-item>
            <el-form-item label="未支付订单失效时间：" prop="" :label-width="formLabelWidth">
                <el-input v-model="dataForm.sizeName" auto-complete="off" placeholder="请输入" style="width: 120px;"></el-input>
                <span> 分（min）</span>
                <el-input v-model="dataForm.sizeName" auto-complete="off" placeholder="请输入" style="width: 120px;"></el-input>
                <span> 秒（s）</span>
            </el-form-item>
            <el-form-item label="自动确认收货时间：" prop="" :label-width="formLabelWidth">
                <el-input v-model="dataForm.sizeName" auto-complete="off" placeholder="请输入" style="width: 250px;"></el-input>
                <span> 天（day）</span>
                <span style="color: #999999;">发货后自动确认收货时间</span>
            </el-form-item>
            <el-form-item label="售后时间：" prop="" :label-width="formLabelWidth">
                <el-input v-model="dataForm.sizeName" auto-complete="off" placeholder="请输入" style="width: 250px;"></el-input>
                <span> 天（day）</span>
                <span style="color: #999999;">确认收货后可申请售后的时间</span>
            </el-form-item>
            <el-form-item label="单笔订单最小金额：" prop="" :label-width="formLabelWidth">
                <el-input v-model="dataForm.sizeName" auto-complete="off" placeholder="请输入" style="width: 250px;"></el-input>
                <span> 元（RMB）</span>
                <span style="color: #999999;">低于该金额时将无法提交订单</span>
            </el-form-item>
            <el-form-item style="background-color: #f3f3f3;">
                <p style="margin-left: -100px;">价格设置</p>
            </el-form-item>
            <el-form-item label="今日汇率：" prop="" :label-width="formLabelWidth">
                <p style="margin-top: 10px;padding: 2px 15px;background: #f1deab;display: inline-block;">{{0.063}}</p>
            </el-form-item>
            <el-form-item label="上调幅度：" prop="" :label-width="formLabelWidth">
                <el-input v-model="dataForm.sizeName" auto-complete="off" placeholder="请输入" style="width: 250px;"></el-input>
                <span> % </span>
            </el-form-item>
            <el-form-item label="加价率：" prop="" :label-width="formLabelWidth">
                <el-input v-model="dataForm.sizeName" auto-complete="off" placeholder="0" style="width: 100px;"></el-input>
                <span> —— </span>
                <el-input v-model="dataForm.sizeName" auto-complete="off" placeholder="请输入" style="width: 100px;"></el-input>
                <span> 元（日元） </span>
                <el-input v-model="dataForm.sizeName" auto-complete="off" placeholder="请输入加价率" style="width: 150px;"></el-input>
                <span> % </span>
            </el-form-item>
            <el-form-item style="text-align: center;margin-left: -120px!important;">
                <el-button  @click="dataFormCancel()">保存</el-button>
                <el-button type="primary" @click="dataFormSubmit('addForm')">保存并发布</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import Bread from "@/components/bread";
    import imgCropper from "@/components/model-photo-cropper";
    import { uploadPicBase64 } from '@/api/api'
    import quillEditorImg from "@/components/quillEditor"
    export default {
        data () {
            return {
                breaddata: ["系统管理", "策略设置"],
                dataForm: {},
                dataRule : {
                    sizeName : [
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
                dialogVisible: false,
                uploading:false
            }
        },
        components: {
            quillEditorImg,
            imgCropper,
            Bread
        },
        methods: {
            artmessageContent(messageContent){
                this.dataForm.messageContent = messageContent;
            },
            init (id) {
                console.log(this.id)
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
    /*/deep/ .upload-box {*/
    /*    border: 0!important;*/
    /*}*/
    /*/deep/ .el-button {*/
    /*    width: 150px;*/
    /*}*/
    /deep/ .el-switch__core {
        margin-top: 20px;
    }
    /deep/ .el-form-item__label {
        width: 170px!important;
    }
</style>