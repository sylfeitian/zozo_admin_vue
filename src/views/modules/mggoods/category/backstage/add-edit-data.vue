<template>
  <div>
        <Bread :breaddata="breaddata" @changePage="changePage" :index="'2'"></Bread>
        <el-form :model="dataForm" label-width="140px" 	:rules="dataRule" class="demo-ruleForm" ref="addForm">
        <el-form-item label="后台分类名称：" prop="gcName">
            <el-input v-model="dataForm.gcName"  maxlength="30" show-word-limit style="width:400px;"></el-input>
        </el-form-item>
        <el-form-item label="上级分类：">
            <!-- <el-popover placement="right" width="400" trigger="click"> -->
            <el-cascader v-model="value" :options="dataArray" @change="handleChange" clearable change-on-select :disabled="row.type=='addNext'"></el-cascader>
            <!-- <el-button slot="reference">上级</el-button> -->
            <!-- </el-popover> -->
        </el-form-item>
        <el-form-item label="排序：" prop="gcSort">
             <el-input-number v-model="dataForm.gcSort" :step="1" step-strictly></el-input-number>
        </el-form-item>
        <div>
            <el-form-item label="关联品牌：" prop="brandName">
                 <el-button type="primary" @click="brand()" size="mini">查看商品品牌</el-button>
            </el-form-item>
            <el-form-item label="关联规格：" prop="desc">
                 <el-button type="primary" @click="spec()" size="mini">查看商品规格</el-button>
            </el-form-item>
            <el-form-item label="关联属性：" prop="desc">
                 <el-button type="primary" @click="attribute()" size="mini">查看商品属性</el-button>
            </el-form-item>
        </div>
        <el-form-item>
            <el-button @click="goList()">返回</el-button>
            <el-button type="primary" @click="dataFormSubmit('addForm')" :loading="saveLoading">{{saveLoading?"提交中...":"确认"}}</el-button>
            <!-- <el-button @click="resetForm('addForm')">重置</el-button> -->
        </el-form-item>
        </el-form>
        
        <modelBrand  ref="brandCompon"  v-if="modelBrandVisible"></modelBrand>
        <modelSpec  ref="specCompon"  v-if="modelSpecVisible"></modelSpec>
        <modelAttribute  ref="attributeCompon" v-if="modelAttributeVisible"></modelAttribute>

  </div>
</template>

<script>

import modelAttribute from "./model-attribute";
import modelSpec from "./model-spec";
import modelBrand from "./model-brand";

import {brandList} from "@/api/api.js";
import {addGoodsclass,updataGoodsclass} from "@/api/api.js";

// 根据分类id查询品牌，规格，
import { goodsclassById } from "@/api/api.js";
import Bread from "@/components/bread";
import { setTimeout } from 'timers';
export default {
   data() {
    return {
      breaddata: ["商品", "类目管理", "后台分类", ""],
      modelBrandVisible:false,
      modelSpecVisible:false,
      modelAttributeVisible:false,
      saveLoading:false,
      value:[],
      dataForm:{
        "brandName":'',//XX
        "gcName": "",//分类名称 ,
        "brandId": 0,//品牌ID ,
        // "gcIdpath": "",//层级path ,
        "gcParentId": 0,//父ID ,
        "gcSort": 0,// 排序 ,
        // "brandIds":[],
        "goodsClassBrandSaveDTOList":[
            // {
            //     "brandId": 0,
            //     "brandName": "string",
            //     // "gcClassId": 0
            // }
        ],
        "attrIds":[],//属性关联数组 ,
        "specIds":[],//规格关联数组 ,
        "storeId": 0//店铺ID
        // "id":''
    },
      row:'',
      dataRule : {
        gcName : [
            { required: true, message: '必填项不能为空', trigger: 'blur' },
        ],
        gcParentId : [
            { required: true, message: '必填项不能为空', trigger: 'blur' },
        ],
        gcSort : [
            { required: true, message: '必填项不能为空', trigger: 'blur' },
        ],
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
    modelAttribute,
    modelSpec,
    modelBrand,
    Bread,
  },
  created () {
  },
  methods: {
        init(row){
            this.saveLoading = false;
            this.row = row;
             this.$nextTick(()=>{
                if(row){
                    if(row.type && row.type=="addNext"){
                        this.breaddata = ["商品", "类目管理", "后台分类", "新增下级"]
                        this.gcParentId = row.id;   
                    }else if(row.type && row.type=="edit"){
                        // 編輯
                        this.breaddata = ["商品", "类目管理", "后台分类", "编辑"]
                        this.dataForm.id= row.id;
                        this.dataForm.gcName = row.label;
                    }
                    // this.dataForm.gcParentId = row.gcParentId;
                    this.backScan(row);
                }else {
                    this.breaddata = ["商品", "类目管理", "后台分类", "新增"]
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
                    gcName:row.label,
                }
            }
            goodsclassById(obj).then((res)=>{
                if(res.code == 200){
                    console.log(res.data)
                    this.value = res.data.gcIdpath.split(',')
                    // 防止后端反回的字符串中最后一位是“，”
                    if(this.value.length>0 && this.value[this.value.length-1] ==""){
                        this.value.splice(this.value.length-1,1);
                    }
                    // 如果是编辑，要计算他的父级id
                    if(row.type=="edit"){
                        var index = this.value.indexOf(this.row.id);
                        if(index!=-1) this.value.splice(index,1);
                        this.dataForm.gcParentId =  res.data.gcParentId;
                        this.dataForm.goodsClassBrandSaveDTOList = res.data.goodsClassBrandUpdateDTOS
                        this.dataForm.attrIds = [];
                        this.dataForm.specIds = []
                        res.data.goodsClassAttrDTOS.forEach((item,index)=>{
                            this.dataForm.attrIds.push(item.attrId);
                        })
                        res.data.goodsClassSpecDTOS.forEach((item,index)=>{
                            this.dataForm.specIds.push(item.specId);
                        })
                    }

                    this.dataForm.gcSort =  res.data.gcSort;
                    // this.dataForm.brandId =  res.data.brandId;
                    // this.dataForm.brandName =  res.data.brandName;
                }
            })
        }, 
        handleSelect(item){
          console.log(item);
          this.dataForm.brandName= item.brandName
          this.dataForm.brandId= item.id
       },
        brand(){
            this.modelBrandVisible = true;
            this.$nextTick(()=>{
                this.$refs.brandCompon.init();
            })
        },  
        spec(){
            this.modelSpecVisible = true;
            this.$nextTick(()=>{
                this.$refs.specCompon.init();
            })
        },  
        attribute(){
            this.modelAttributeVisible = true;
            this.$nextTick(()=>{
                this.$refs.attributeCompon.init();
            })
        },
      dataFormSubmit(formName){ 
           this.handleChange();
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
                   
                    let fn = this.row.type=="edit"?updataGoodsclass:addGoodsclass
                    this.dataForm.goodsClassBrandSaveDTOS = this.dataForm.goodsClassBrandSaveDTOList
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
  }
}
</script>
<style>

.el-form-item{
    margin-bottom: 45px;
}
</style>

