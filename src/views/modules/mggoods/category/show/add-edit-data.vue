<template>
  <div>
       <Bread :breaddata="breaddata" @changePage="changePage" :index="'2'"></Bread>
        <el-form :model="dataForm" label-width="140px" 	:rules="dataRule" class="demo-ruleForm" ref="addForm">
        <el-form-item label="展示分类名称：" prop="gcName">
            <el-input v-model.trim.trim="dataForm.gcName"  maxlength="30" show-word-limit style="width:400px;"></el-input>
        </el-form-item>
        <el-form-item label="上级分类：">
            <el-cascader v-model="value" :options="dataArray" @change="handleChange" clearable change-on-select :disabled="row.type=='addNext'"></el-cascader>
        </el-form-item>
        <el-form-item label="关联后台分类：" prop="classId">
            <el-cascader v-model="value2" :options="dataArray2" @change="handleChange2" clearable change-on-select></el-cascader>
        </el-form-item>
        <el-form-item label="排序：" prop="sort">
             <el-input-number v-model="dataForm.sort" :step="1" step-strictly></el-input-number>
        </el-form-item>
        <el-form-item label="展示分类图片：" prop="gcPic" >
             <div class="pcCoverUrl imgUrl" >
                  <!-- :aspectRatio="1 / 1" -->
                    <img-cropper
                            v-loading="uploading"
                            ref="cropperImg"
                            :index="'1'"
                            :cropImg="dataForm.gcPic"
                            :imgWidth='"100px"'
                            :imgHeight='"100px"'
                            @GiftUrlHandle="GiftUrlHandle"
                    ></img-cropper>
            </div>
        </el-form-item>

        <el-form-item>
            <el-button @click="goList()"  type="primary" plain>返回</el-button>
            <el-button type="primary" @click="dataFormSubmit('addForm')" :loading="saveLoading">{{saveLoading?"提交中...":"确认"}}</el-button>
            <!-- <el-button type="primary" plain @click="resetForm('addForm')">重置</el-button> -->
        </el-form-item>
        </el-form>
        

  </div>
</template>

<script>


import {brandList} from "@/api/api.js";
import {addGoodsclasscustom,updataGoodsclasscustom} from "@/api/api.js";

import { allGoodsclass } from "@/api/api";
// 根据分类id查询品牌，规格，
import { goodsclasscustomById } from "@/api/api.js";

  import imgCropper from "@/components/model-photo-cropper";
import { uploadPicBase64 } from '@/api/api'
import Bread from "@/components/bread";

export default {
   data() {
    return {
      breaddata: ["商品", "类目管理", "展示分类", ""],
      uploading:false,
      saveLoading:false,
      value:[],
      value2:[],
      dataArray2:[],
      dataForm:{
        "brandName":'',//XX
        "gcName": "",//分类名称 ,
        "brandId": 0,//品牌ID ,
        // "gcIdpath": "",//层级path ,
        // "brandIds":[],
        "storeId": 0,//店铺ID
        // "id":''
        "sort":0,
         "showFlag":0,
         "gcParentId": 0,//父ID ,
         "classId":"",
        "gcPic":"",
       
        
        // "gcUrl"
    },
      row:'',
      dataRule : {
        gcName : [
            { required: true, message: '必填项不能为空', trigger: 'blur' },
        ],
        gcParentId : [
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
        // brandName : [
        //     { required: true, message: '必填项不能为空', trigger: 'blur' },
        // ],
      },
    //   dataArray:[{
    //       value: 'zhinan',
    //       label: '指南',
    //       children: [
    //           {
    //         value: 'shejiyuanze',
    //         label: '设计原则',
    //         children: [{
    //           value: 'yizhi',
    //           label: '一致'
    //         }, {
    //           value: 'fankui',
    //           label: '反馈'
    //         }, {
    //           value: 'xiaolv',
    //           label: '效率'
    //         }, {
    //           value: 'kekong',
    //           label: '可控'
    //         }]
    //        }
    //        ]
    //     }],
    }
  },
  props:['dataArray'],
  components:{
    imgCropper,
    Bread,
  },
  created () {
  },
  methods: {
        init(row){
            this.getTree2();
            this.saveLoading = false;
            this.row = row;
           this.$nextTick(()=>{
                if(row){
                    if(row.type && row.type=="addNext"){
                     this.breaddata = ["商品", "类目管理", "展示分类", "新增下级"]
                    this.gcParentId = row.id;   
                    }else if(row.type && row.type=="edit"){
                        // 編輯
                         this.breaddata = ["商品", "类目管理", "展示分类", "编辑"]
                        this.dataForm.id= row.id;
                        this.dataForm.gcName = row.label;
                    }
                    // this.dataForm.gcParentId = row.gcParentId;
                    this.backScan(this.row);
                }else {
                     this.breaddata = ["商品", "类目管理", "展示分类", "新增"]
                }
           })
        },
        changePage(){
            this.goList();
        },
        backScan(row){
            var obj = {
                params:{
                    gcId:row.id,
                }
            }
            goodsclasscustomById(obj).then((res)=>{
                if(res.code == 200){
                    console.log(res.data)
                    this.value = res.data.idPath.split(',')
                    // 防止后端反回的字符串中最后一位是“，”
                    if(this.value.length>0 && this.value[this.value.length-1] ==""){
                        this.value.splice(this.value.length-1,1);
                    }
                    
                    if(res.data.gcIdPath) this.value2 = res.data.gcIdPath.split(',')
                    // 防止后端反回的字符串中最后一位是“，”
                    if(this.value2.length>0 && this.value2[this.value2.length-1] ==""){
                        this.value2.splice(this.value2.length-1,1);
                    }

                    // 如果是编辑，要计算他的父级id
                    if(row.type=="edit"){
                        var index = this.value.indexOf(this.row.id);
                        if(index!=-1) this.value.splice(index,1);
                        this.dataForm.gcParentId =  res.data.gcParentId;
                         this.dataForm.gcPic =  res.data.gcPic;
                        
                    }
                    this.dataForm.sort =  res.data.sort;
                    // this.dataForm.brandId =  res.data.brandId;
                    // this.dataForm.brandName =  res.data.brandName;
                }
            })
        }, 

        getTree2() {
            allGoodsclass().then(res => {
                //Promise后 对数据格式进行处理
                if (res.code == 200) {
                    var data = res.data
                    //处理树形数据
                    // this.treeConfig.rows =  data; 
                    var dataStr = JSON.stringify(data);
                    dataStr = dataStr.replace(/gcName/g,"label")
                    dataStr = dataStr.replace(/goodsClassListDTO/g,"children")
                    var rows = [].concat(JSON.parse(dataStr));

                    var dataArray = JSON.stringify(rows);
                    var dataArrayStr = dataArray.replace(/id/g,"value");
                    dataArrayStr = dataArrayStr.replace(/\[]/g,'""');
                    this.dataArray2 = JSON.parse(dataArrayStr);
                    console.log(this.dataArray2 );

                    
                }
            });
        },
        handleSelect(item){
          console.log(item);
          this.dataForm.brandName= item.brandName
          this.dataForm.brandId= item.id
       },
      dataFormSubmit(formName){ 
          this.handleChange();
          this.handleChange2();
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
                    let fn = this.row.type=="edit"?updataGoodsclasscustom:addGoodsclasscustom
                   fn(this.dataForm).then((res)=>{
                        this.saveLoading = false;
                       let status = "warning"
                        if(res.code=="200"){
                            status = "success"
                            this.goList();
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
        goList(){
            this.$emit("showList");
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
  }
}
</script>
<style>
</style>

