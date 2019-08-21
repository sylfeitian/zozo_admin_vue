<template>
    <el-dialog
            class="model-add-edit-data"
            :title="title"
            :close-on-click-modal="false"
            :visible.sync="visible"
            :before-close="closeDialog"
            width="40%"
    >
        <el-form
                :model="dataForm"
                :rules="dataRule"
                ref="addForm"
                @keyup.enter.native="dataFormSubmit('addForm')"
                label-width="120px"
        >
            <el-form-item label="上级分类：">
                <el-select v-model="value" :options="dataArray" @change="handleChange" clearable change-on-select :disabled="row.type=='addNext'"></el-select>
            </el-form-item>
            <el-form-item label="分类名称：" prop="gcName">
                <el-input v-model="dataForm.gcName"  maxlength="30" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="排序：" prop="sort">
                <el-input v-model="dataForm.sort"  maxlength="30" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="关联日本分类：" prop="classId">
                <el-select v-model="value2" :options="dataArray2" @change="handleChange2" clearable change-on-select></el-select>
            </el-form-item>
            <el-form-item label="" prop="classId1">
                <el-select v-model="value3" :options="dataArray3" @change="handleChange3" clearable change-on-select></el-select>
                <span style="display: inline-block;margin-left: 10px;">添加</span>
            </el-form-item>
            <el-form-item label="分类性别：" prop="gcPic" >
                <template slot-scope="scope">
                     <div class="pcCoverUrl imgUrl" style="float: left;width:50%;">
                        <span style="height:100px;vertical-align:100%;display:inline-block;margin-left: 20px;">全部：</span>
                        <img-cropper
                                v-loading="uploading"
                                ref="cropperImg"
                                :index="'1'"
                                :cropImg="dataForm.allPic"
                                :imgWidth='"100px"'
                                :imgHeight='"100px"'
                                @GiftUrlHandle="GiftUrlHandle"
                                style="display: inline-block;"
                        ></img-cropper>
                    </div>
                    <div class="pcCoverUrl imgUrl" style="float: right;width:50%;">
                        <input type="checkbox" style="height:56px;vertical-align:100%;display:inline-block;">
                        <span style="height:100px;vertical-align:100%;display:inline-block;margin-left: 6px;">男士：</span>
                        <img-cropper
                                v-loading="uploading"
                                ref="cropperImg"
                                :index="'1'"
                                :cropImg="dataForm.manPic"
                                :imgWidth='"100px"'
                                :imgHeight='"100px"'
                                @GiftUrlHandle="GiftUrlHandle"
                                style="display: inline-block;"
                        ></img-cropper>
                    </div>
                    <div class="pcCoverUrl imgUrl" style="float: left;width:50%;">
                        <input type="checkbox" style="height:56px;vertical-align:100%;display:inline-block;">
                        <span style="height:100px;vertical-align:100%;display:inline-block;margin-left: 6px;">女士：</span>
                        <img-cropper
                                v-loading="uploading"
                                ref="cropperImg"
                                :index="'1'"
                                :cropImg="dataForm.ladyPic"
                                :imgWidth='"100px"'
                                :imgHeight='"100px"'
                                @GiftUrlHandle="GiftUrlHandle"
                                style="display: inline-block;"
                        ></img-cropper>
                    </div>
                    <div class="pcCoverUrl imgUrl" style="float: right;width:50%;">
                        <input type="checkbox" style="height:56px;vertical-align:100%;display:inline-block;">
                        <span style="height:100px;vertical-align:100%;display:inline-block;margin-left: 6px;">儿童：</span>
                        <img-cropper
                                v-loading="uploading"
                                ref="cropperImg"
                                :index="'1'"
                                :cropImg="dataForm.childPic"
                                :imgWidth='"100px"'
                                :imgHeight='"100px"'
                                @GiftUrlHandle="GiftUrlHandle"
                                style="display: inline-block;"
                        ></img-cropper>
                    </div>
                </template>
            </el-form-item>

            <el-form-item style="text-align: center;margin-left: -120px;">
                <el-button type="primary" @click="dataFormSubmit('addForm')" :loading="saveLoading">{{saveLoading?"提交中...":"保存"}}</el-button>
                <el-button @click="dataFormCancel()">返回</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
import imgCropper from "@/components/model-photo-cropper";
import { uploadPicBase64 } from '@/api/api'
import { backScanCategoryCn,updateCategoryCn } from '@/api/api'
export default {
    name: "model-add-edit-data",
    data() {
        return {
          visible : false,
          loading : false,
          uploading:false,
          saveLoading:false,
          title: "",
          value:[],
          value2:[],
          value3:[],
          dataArray2:[],
          dataArray3:[],
          dataForm:{
            brandName:'',//XX
            allPic: "",
            manPic:"",
            ladyPic:"",
            childPic:"",
            brandId: 0,//品牌ID ,
            // "gcIdpath": "",//层级path ,
            // "brandIds":[],
            storeId: 0,//店铺ID
            // "id":''
            sort:0,
            showFlag:0,
            gcParentId: 0,//父ID ,
            classId:"",
            gcPic:"",


            // "gcUrl"
        },
          row:'',
          dataRule : {
            gcName : [
                { required: true, message: '必填项不能为空', trigger: 'blur' },
            ],
            sort : [
                { required: true, message: '必填项不能为空', trigger: 'blur' },
            ],
            classId: [
                { required: true, message: '必填项不能为空', trigger: 'blur' },
            ],
            gcPic:[
                { required: true, message: '必填项不能为空', trigger: 'blur' },
            ]
      },
    }
  },
  props:['dataArray'],
  components:{
      imgCropper
  },
  created () {
  },
  methods: {
      init (row) {
          this.visible = true;
          this.row = row;
          if(row){
              this.title="编辑分类";
              this.backScan();
          }else{
              this.title="新增分类"

          }
          this.$nextTick(() => {
              this.$refs['addForm'].resetFields();
              // this.getApplyPullList();
          })
      },
      // 编辑回显
      backScan(){
          var obj  = {
              id:this.row.id
          }
          backScanCategoryCn(obj).then((res)=>{
              if(res.code == 200){
                  Object.assign(this.dataForm,res.data);
                  this.$nextTick(()=>{
                      if(this.$refs.cropperImg1){
                          console.log(this.$refs.cropperImg1	);
                          this.$refs.cropperImg1.cropper.imgShow  = true
                          this.$refs.cropperImg1.cropper.cropImg  = this.dataForm.brandPic
                      }
                  })
              }else{

              }
          })
      },
        handleSelect(item){
          console.log(item);
          this.dataForm.brandName= item.brandName
          this.dataForm.brandId= item.id
       },
      dataFormSubmit(formName){ 
          this.handleChange();
          this.handleChange2();
          this.handleChange3();
          if(this.row.type=="edit" &&  this.dataForm.gcParentId == this.row.id){
              this.$message({
                  message: "上级分类不能选自己",
                  type: 'warning',
                  duration: 1000
              })
             return
          }
            this.$refs[formName].validate((valid) => {
                if (valid) {
                     this.saveLoading = true;
                    let fn = updataCategoryCn
                   fn(this.dataForm).then((res)=>{
                        this.saveLoading = false;
                       let status = "warning"
                        if(res.code=="200"){
                            status = "success"
                            this.closeDialog();
                        }else{
                            status = "errror"
                        }
                        this.$message({
                            message: res.msg,
                            type: status,
                            duration: 1500
                            })
                        return
                   })
                } else {
                    //console.log('error 添加失败!!');
                    return false;
                }
            })
        },
        resetForm(){

        },
        handleChange() {
            var value = this.value;
            console.log(value);
            console.log(value[value.length-1]);
            if(value.length >0){
                this.dataForm.gcParentId =value[value.length-1]
            }else{
                this.dataForm.gcParentId = 0;
            }
        },
        handleChange2() {
            var value = this.value2;
            console.log(value);
            console.log(value[value.length-1]);
            if(value.length >0){
                this.dataForm.classId =value[value.length-1]
            }else{
                this.dataForm.classId = 0;
            }
        },
        handleChange3() {
            var value = this.value2;
            console.log(value);
            console.log(value[value.length-1]);
            if(value.length >0){
                this.dataForm.classId =value[value.length-1]
            }else{
                this.dataForm.classId = 0;
            }
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

