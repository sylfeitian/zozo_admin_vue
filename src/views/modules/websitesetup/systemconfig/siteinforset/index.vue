<template>
  <div>
    <Bread :breaddata="breaddata"></Bread>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="130px"
      class="demo-ruleForm artinputcontent"
    >
      <el-form-item label="平台名称：" prop="name">
        <el-input v-model.trim="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="平台LOGO：">
        <!-- <div class="pcCoverUrl imgUrl"> -->
          <!-- :aspectRatio="1/1" -->
        <img-cropper
          :index="'1'"
          ref="cropperImg1"
          :imgWidth="'100px'"
          :imgHeight="'100px'"
          @GiftUrlHandle="GiftUrlHandle"
        ></img-cropper>
        <p>只支持jpg/png格式上传,文件不得超过50kb</p>
      </el-form-item>
      <el-form-item label="关键字：" prop="key">
        <el-input v-model.trim="ruleForm.key"></el-input>
      </el-form-item>
      <el-form-item label="描述：" prop="discription">
        <el-input v-model.trim="ruleForm.discription "></el-input>
      </el-form-item>
      <el-form-item label="备案号：" prop="icp">
        <el-input v-model.trim="ruleForm.icp "></el-input>
      </el-form-item>
      <el-form-item label="版权信息：" prop="copy">
        <el-input v-model.trim="ruleForm.copy"></el-input>
      </el-form-item>
      <el-form-item label="公司地址：" prop="addresss">
        <el-input v-model.trim="ruleForm.addresss"></el-input>
      </el-form-item>
      <el-form-item label="联系方式：" prop="link">
        <el-input v-model.trim="ruleForm.link"></el-input>
      </el-form-item>
      <el-form-item label="第三方统计代码：" prop="other">
        <el-input v-model.trim="ruleForm.other" type="textarea"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getWebMes" style="margin-left: 130px; margin-top: 20px">取消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import Bread from "@/components/bread";
import { sysWebMesCon, uploadPicBase64, sysWebMesSave } from "@/api/api";
import imgCropper from "@/components/model-photo-cropper";
export default {
  data() {
    return {
      breaddata: ["设置系统", "系统设置", "站点信息设置"],
      ruleForm: {
        name: "", //凭条名称
        icp: "", //备案号
        copy: "", //版权信息
        key: "", //关键字
        discription: "", //描述
        logoNow: "", //logo
        other: "", //第三方
        addresss: "", //公司地址
        link: "" //联系方式
      },
      rules: {
        name: [
          { required: true, message: "请输入平台名称", trigger: "blur" }
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        copy: [{ required: true, message: "请填写版权信息", trigger: "blur" }],
        key: [{ required: true, message: "请填写关键字", trigger: "blur" }],
        discription: [
          { required: true, message: "请填写网站描述", trigger: "blur" }
        ],
        icp: [{ required: true, message: "请填写备案号", trigger: "blur" }],
        addresss: [
          { required: true, message: "请填写公司地址", trigger: "blur" }
        ],
        link: [{ required: true, message: "请填写联系方式", trigger: "blur" }],
        other: [
          { required: true, message: "请填写第三方代码统计", trigger: "blur" }
        ]
      }
    };
  },
  components: {
    Bread,
    imgCropper
  },
  created() {
    this.getWebMes();
  },
  methods: {
    submitUpload() {
      this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    GiftUrlHandle(val) {
      console.log("base64上传图片接口");
      // console.log(val);
      // const isJPG = val.type === "image/jpeg/png";
      // const isLt2M = val.size / 1024 < 50;
      // if (!isJPG) {
      //   this.$message.error("上传图片只能是JPG/PNG格式!");
      // } else if (!isLt2M) {
      //   this.$message.error("上传头像图片大小不能超过50KB");
      // } else {
      this.uploadPic(val);
      // }
    },
    //提交保存
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const obj = {
            name: this.ruleForm.name,
            copy: this.ruleForm.copy,
            logoNow: this.ruleForm.logoNow,
            icp: this.ruleForm.icp,
            key: this.ruleForm.key,
            discription: this.ruleForm.discription,
            other: this.ruleForm.other,
            addresss: this.ruleForm.addresss,
            link: this.ruleForm.link
          };
          sysWebMesSave(obj).then(res => {
            if (res.code == 200) {
              // consle.log(res);
              this.$message({
                message: res.msg,
                type: "success",
                duration: 1500
              });
              this.getWebMes();
            }
          });
        } else {
          this.$message({
            message: res.msg,
            type: "warning",
            duration: 1500
          });
        }
      });
    },
    //取消保存
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //上传图片
    uploadPic(base64) {
      const params = { imgStr: base64 };
      this.uploading = true;
      uploadPicBase64(params).then(res => {
        if (res.data && res.code == "200") {
          var url = res.data.url;
          this.ruleForm.logoNow = url;
          this.$refs.cropperImg1.cropper.cropImg  = this.$imgDomain +url;
          this.$message({
            message: res.msg,
            type: "success",
            duration: 1500
          });
          // this.getWebMes();
        } else {
          this.$message({
            message: res.msg,
            type: "error",
            duration: 1500
          });
        }
      });
    },
    //获取站点消息数据
    getWebMes() {
      sysWebMesCon().then(res => {
        if (res.code == 200) {
          // console.log(res, "站点消息");
          this.ruleForm = res.data;
          this.$refs.cropperImg1.cropper.imgShow = true;
          this.$refs.cropperImg1.cropper.cropImg = this.$imgDomain + res.data.logoNow;
        }
      });
    }
  }
};
</script>
<style scoped>
.el-input {
  width: 60%;
}
.el-textarea {
  width: 60%;
}
</style>
