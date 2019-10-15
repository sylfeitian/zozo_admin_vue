<template>
  <div class="homeIndex">
    <Bread :breaddata="breaddata" @changePage="changePage" :index="'2'"></Bread>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm"  @keyup.enter.native="submitStore()" label-width="102px">
        <el-form-item prop="menuName" label="菜单名称：">
            <el-input v-model="dataForm.menuName" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item prop="linkType" label="跳转类型：">
            <el-select v-model="dataForm.linkType " clearable  placeholder="请选择">
                <el-option
                    v-for="item in linkTypeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item prop="url" label="链接：">
            <el-input v-model="dataForm.url" placeholder="Http://xxxxxx.com" clearable></el-input>
        </el-form-item>
        <el-form-item prop="menuIcon" label="菜单图标：">
            <img-cropper
                ref="menuIcon"
                :index="'1'"
                :imgWidth='"100px"'
                :imgHeight='"100px"'
                @GiftUrlHandle="GiftUrlHandle">
            </img-cropper>
        </el-form-item>
        <el-form-item prop="sort" label="排序：">
            <el-input-number v-model="dataForm.sort" controls-position="right" :min="1" :max="10000000" class="floorInput"></el-input-number>
        </el-form-item>
        <el-form-item prop="showFlag" label="是否显示：">
            <el-radio-group v-model="dataForm.showFlag">
                <el-radio label="1">显示</el-radio>
                <el-radio label="0">不显示</el-radio>
            </el-radio-group>
        </el-form-item>
        <div class="btnSub">
            <el-button @click="changePage">{{ $t('cancel') }}</el-button>
            <el-button type="primary" @click="submitStore()" :loading="buttonStatus">{{ $t('confirm') }}</el-button>
        </div>
    </el-form>
    
  </div>
</template>

<script>
import imgCropper from "@/components/model-photo-cropper";
import { menuNews,addMobbileMenu,updateMobbileMenu } from '@/api/api'
import { uploadPicBase64 } from '@/api/api'
import { isURL } from '@/utils/validate'
import Bread from "@/components/bread";


  
export default {
  data () {
    return {
      dataForm: {
        linkType: '',
        menuIcon: '',
        menuName: '',
        url: '',
        sort:1,
        showFlag:'1'
      },
      breaddata: ["运营", "移动端首页配置", "首页菜单",'编辑首页菜单'],
      buttonStatus:false,
      uploading:false,
      menuId:null,
      linkTypeList:[
          {value:'url',label:'外部链接'}
      ],
      dataRule:{
          linkType: [
            { required: true, message: '跳转类型不能为空！', trigger: 'blur' }
          ],
          menuName: [
            { required: true, message: '菜单名称不能为空！', trigger: 'blur' }
          ],
          url: [
            { required: true, message: '链接地址不能为空！', trigger: 'blur' },
            {
                validator: function (rule, value, callback) {
                    if (!isURL(value)) {
                      return callback(new Error('链接地址格式不正确'))
                    }
                    callback()
                }, trigger: 'change'
            }
          ],
          sort: [
            { required: true, message: '排序不能为空！', trigger: 'blur' }
          ],
          menuIcon:[
            { required: true, message: '图标不能为空！', trigger: 'blur' }
          ]
      }
    }
  },
  components:{
        imgCropper,
        Bread
  },
  methods: {
    init(id){
      this.$nextTick(()=>{
              this.menuId = id;
              if(id){
                  var obj  = {
                      id:id
                  }
                  menuNews(obj).then((res)=>{
                      console.log('回显',res.data)
                      if(res.code == 200){
                        if(res.data.menuIcon){
                          this.$nextTick(()=>{
                              this.$refs.menuIcon.cropper.imgShow  = true
                              this.$refs.menuIcon.cropper.cropImg  = this.$imgDomain + res.data.menuIcon;
                          })
                        }
                        
                        Object.assign(this.dataForm,res.data);
                        this.dataForm.showFlag = JSON.stringify(res.data.showFlag)
                      }
                  })
              }
      })
    },
    submitStore(){
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.buttonStatus = true;
          if(this.menuId){//编辑
            var aa = this.dataForm;
            var bb = {
                id: this.menuId,
                linkType: aa.linkType,
                menuIcon: aa.menuIcon,
                menuName: aa.menuName,
                showFlag: aa.showFlag,
                sort: aa.sort,
                url: aa.url
            }
            updateMobbileMenu(bb).then((res)=>{
                if(res.code==200){
                    this.changePage();
                    this.$message({
                      message:res.msg,
                        type: 'success',
                        duration: 1500,
                    })
                }else{
                  this.$message({
                      message:res.msg,
                      type: 'error',
                      duration: 1500,
                  })
                  // this.changePage();
                }
                this.buttonStatus = false;
            })
          }else{
            addMobbileMenu(this.dataForm).then((res)=>{
                if(res.code==200){
                    this.changePage();
                    this.$message({
                      message:res.msg,
                        type: 'success',
                        duration: 1500,
                    })
                }else{
                  this.$message({
                      message:res.msg,
                      type: 'error',
                      duration: 1500,
                  })
                  // this.changePage();
                }
                this.buttonStatus = false;
            })
          }
        }
      })
    },
    GiftUrlHandle(val){
      this.uploadPic(val);
    },
    uploadPic(base64){
      let that = this;
      const params = { "imgStr": base64 };
      return new Promise(function(resolve){
        uploadPicBase64(params).then(res =>{
          that.uploading = true;
          if(res && res.code == "200"){
            var url = res.data.url
							// if(!/http/.test(url)){
							// 	url = "http://192.168.1.108:8888/"+url;
							// }
            that.dataForm.menuIcon = url;
            resolve("true")
          }else {
            resolve("false")
          }
        })
      });
    },
    changePage(){
      this.$emit("addoraditList");
    }
  }
};
</script>
<style lang="scss" >
    
     .homeIndex{
       .el-radio-group{
        margin-top: 0;
      }
        .el-input{
            width: 300px !important;
        }
        .el-form{
            padding-top: 50px;
            width: 1100px;
            margin: 0 auto;
        }
        .btnSub{
            margin-top: 30px;
            padding: 0 180px;
        }
        .floorInput{
            width: 130px !important;
            .el-input{
                width: 130px !important;
            }
        }
    }
</style>
