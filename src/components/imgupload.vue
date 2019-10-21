<template>
  <div class="product_list">
    <!-- 需求主体 -->
    <div class="main clearfix">
      <div class="center"> 
              <el-form
                :model="ruleForm"
                :rules="rules"
                ref="ruleForm"
                label-width="130px"
                class="demo-dynamic"
              >
                <el-form-item label="缩略图：" prop="img">
                  <div class="img" >
                      <el-upload
                        :action="UploadUrl"

                        name="multipartFile"
                        list-type="picture-card"
                        :on-success="imgSuccess"
                        :on-remove="imgRemove"
                        :before-upload="beforeUploadimglimit5"
                        :on-error="errorupload"
                        :file-list="imglist"
                      >
                        <!-- <img v-if="ruleForm.img" :src="ruleForm.img" class="avatar"> -->
                        <i class="el-icon-plus"></i>
                        <div slot="tip" style="color:#999999">图片大小在10M以内，支持JPG/webp/png/gif格式等主流格式</div>
                      </el-upload>
                  </div>
                </el-form-item>
              </el-form>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "product_list",
  data() {
    return {
      agree: [],
      keyword: "",
      ruleForm: {
        title: "",
        value: "",
        content: "",
        author:this.$cookies.get('realName'),
        from:'',
        exe: [],
        img: [],
        secert:''
      },
      activeIndex: "1",
      selectedOptions2: "",
      dialogVisible2:false,
      content:'',
      options: [],
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" },
          { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
        ],
        value: [{ required: true, message: "请选择发布栏目", trigger: "blur" }],
        content: [{ required: true, message: "请输入正文内容", trigger: "blur" }],
        secert: [{ required: true, message: "请上传保密批件", trigger: "blur" }],
        author: [{ required: true, message: "请输入作者名称", trigger: "blur" },
          { min: 1, max: 60, message: '长度在 1 到 60 个字符', trigger: 'blur' }],
        from: [{ required: true, message: "请输入来源名称", trigger: "blur" },
          { min: 1, max: 60, message: '长度在 1 到 60 个字符', trigger: 'blur' }],
      },
      imglist: [], //编辑时的图片列表
      imgsecert:[],
      exelist: [], //编辑时的附件列表
      newExelist:[],
      UploadUrl: `${this.$serverUrl}/common/upload`,
      isClear:false,
      isDisable:false,
      dialogVisible1:false,
      pre:this.$preUrl
    };
  },
  created() {
    this.$http
      .get(`${this.$serverUrl}/homepage/content/TwoLeavel/`, {
        params: {
          catId: "40288281699f3efb01699f43f1830003"
        }
      })
      .then(res => {
        this.options = res.data.list;
      });
    //修改投稿
  },
  mounted() {
    this.loaddata();
  },
  watch: {
  },
  methods: {
    loaddata(){
      this.$nextTick(function () {
        if (this.$route.query.id) {
          this.$http
            .get(`${this.$serverUrl}/news/${this.$route.query.id}`)
            .then(res => {
              this.ruleForm.title = res.data.apiNewsEntity.title; //标题
              this.ruleForm.content = res.data.apiNewsEntity.contents; //内容
              this.$refs['myQuillEditor'].init(this.escape2Html(res.data.apiNewsEntity.contents))
              this.ruleForm.author = res.data.apiNewsEntity.editor; //编辑
              this.ruleForm.from = res.data.apiNewsEntity.source; //来源
              this.ruleForm.secert = res.data.apiNewsEntity.secrecy; //保密批件
              var that = this;
              //accessory附件列表
              // this.newExelist = res.data.result.accessory;
              this.imgsecert.push({url:this.pre+res.data.apiNewsEntity.secrecy});
              $('.secert .el-upload--picture-card').hide()
              $.each(res.data.accessory, function(i, item) {
                that.exelist.push({ url: that.pre+item.url, name: item.name }); //编辑时的附件列表
                that.ruleForm.exe.push({ url: item.url, name: item.name });
              });
              //图片列表
              $.each(res.data.apiNewsEntity.thumbList, function(i, item) {
                that.imglist.push({ url: that.pre+item }); //编辑时的图片列表
                that.ruleForm.img.push(item);
              });
              for(var i=0;i<this.options.length;i++){
                if(this.options[i].name == res.data.apiNewsEntity.catName){
                    this.ruleForm.value = this.options[i].id; //栏目
                }
              }
            });
        }
      })
    },
    beforeUploadimglimit5(file){   //上传前的拦截缩略图最多5张
      if(this.ruleForm.img.length >= 1){
        this.$message('缩略图最多可上传1张');
        return false;
      }
      const isJPG = file.type === "image/jpeg";
      const isWebp = file.type === "image/webp";
      const isPng = file.type === "image/png";
      const isGif = file.type === "image/gif";
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!(isJPG || isWebp || isPng || isGif)) {
      	this.$message.error("上传图片只能是 JPG/webp/png/gif 格式!");
      }
      if (!isLt2M) {
      	this.$message.error("上传图片大小不能超过 10MB!");
      }
      return (
      	(isJPG && isLt2M) ||
      	(isWebp && isLt2M) ||
      	(isPng && isLt2M) ||
      	(isGif && isLt2M)
      );
    },
    imgRemovesecert(file){     //移除图片
      this.ruleForm.secert = '';
      $('.secert .el-upload--picture-card').show()
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    imgSuccess(res, file) {
      this.ruleForm.img.push(file.response.result);
      console.log(this.ruleForm.img);
    },
    imgRemove(file,fileList) {
      console.log(file,fileList);
      if(file.response){           //发布时
        var url = file.response.code == 200?file.response.result:file.url;
      }else if(file.status){    //修改时
        var url = file.url.substr(this.$preUrl.length)
      }

      for (var i = 0; i < this.ruleForm.img.length; i++) {
        if (this.ruleForm.img[i] == url) {
          this.ruleForm.img.splice(i, 1);
        }
      }
      console.log(this.ruleForm.img);
    },
    errorupload(err, file, fileList){
      console.log(err,file)
    },
  
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.product_list {
  .banner {
    height: 155px;
    background-image: url("/static/img/need_banner.png");
    background-size: cover;
    text-align: center;
    color: #fff;
    padding-top: 48px;
    border-bottom: 1px solid #999;
    h3{
        font-size: 30px;
        font-weight: 500;
        line-height: 60px;
        font-family: "微软雅黑";
    }
    h4{
        font-size: 18px;
        font-weight: 500;
        line-height: 40px;
        letter-spacing: 1px;
        text-transform: uppercase;
    }
  }
  .el-dialog__headerbtn .el-dialog__close{
    display: none;
  }
  .success{
    background-color: #fff;
    // margin-bottom: 80px;
    .check{
      width: 115px;
      height: 115px;
      border-radius: 50%;
      background-color: #0AD100;
      text-align: center;
      color: #fff;
      line-height: 115px;
      font-size: 60px;
      margin: 0 auto 29px;
    }
    h3{
      font-size:26px;
      font-weight:400;
      color:rgba(51,51,51,1);
      line-height:38px;
      text-align: center;
    }
    h4{
      font-size:16px;
      font-weight:400;
      color:rgba(0,64,152,1);
      line-height:70px;
      text-align: center;
    }
  }
  .main {
    background-color: #fafafa;
    padding-bottom:80px;
    .top{
      padding: 18px 0;
      /deep/ .el-breadcrumb__inner.is-link{
      font-weight: 400;
      color: #999999;
      &:hover{
        color:#044ec6
      }
      }
      /deep/ .el-breadcrumb__inner{
      color: #999999;
      }
      .el-breadcrumb {
      font-size: 16px;
      }
      img{
        float: left;
        margin-right: 15px;
      }
    }

    .content {
      margin: 0 auto;
      width: 1200px;
      min-height: 1200px;
      padding-top: 10px;
      .top {
        width: 492px;
        margin: 0px auto 40px;
        .el-breadcrumb{font-size: 16px}
        /deep/ .el-step__head.is-process .el-step__icon.is-text{
          background-color: #023B98;
          color:white;
          border: 1px solid #023B98;
        }

      }
      .wrap {
        margin: 0 auto;
        width: 1200px;
        background-color: #fff;
        min-height: 1000px;
        padding: 40px 200px;
        box-sizing: border-box;
        /deep/ .el-upload--picture-card{
          width: 120px;
          height: 120px;
          font-size: 40px;
          line-height: 120px;
          background-color: #fafafa;
          border: 1px dashed #e5e5e5;
        }
        .secretPic{
          color:#FF0026;
          font-size:16px;
          font-family:PingFangSC-Regular;
          font-weight:400;
          line-height: 40px;
        }
        .el-button{
          background: #023B98;
          color: #fff;
          font-size:16px;
          font-family:MicrosoftYaHei;
          font-weight:400;
          width:120px;
          height:38px;
          border:none
        }
        .submit{
          width:160px;
          height:48px;
          border-radius:4px;
          background-color: #174193;
          color: #fff;
          margin-right: 10px;
          &:hover{
            background-color:rgba(2,59,152,0.8);
          }
        }
        .draft{
          width:160px;
          height:48px;
          border-radius:4px;
          background-color: #F7AB00;
          border:none;
          color: #fff;
          margin-right: 10px;
          &:hover{
            background-color:rgba(247,171,0,.8);
          }
        }
        .cancel{
          width:160px;
          height:48px;
          background-color: #fff;
          color: #333333;
          border:1px solid #333333;
          &:hover{
            background-color:rgba(2,59,152,0.8);
            color: #fff;
            border:1px solid  #023B98;
          }
        }
      }
    }
  }
}
</style>
