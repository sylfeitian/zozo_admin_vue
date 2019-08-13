<template>
  <div style="margin-left: 2%;margin-right: 2%;">
      <h3 style="margin-top: 30px;"  class="section">基本信息</h3>
      <el-form
        :model="dataForm"
        :rules="dataRule"
        ref="addForm"
        label-width="120px">
           <el-form-item label="商品类目：">
                <span>{{dataForm.gcName0}} </span>
                <span v-if="dataForm.gcName1">> {{dataForm.gcName1}} </span> 
                <span v-if="dataForm.gcName2">> {{dataForm.gcName2}} </span>
                <el-button v-if="!$route.query.gcId" @click="preStep()"  style="margin-left:20px;">编辑</el-button>
            </el-form-item>
            <el-form-item label="商品名称：" prop="goodsName" style="width:45%">
                <el-input v-model="dataForm.goodsName" maxlength="64"  show-word-limit placeholder="请输入商品名称"></el-input>
            </el-form-item>

            <el-form-item label="副标题：" prop="goodsSubTitle" style="width:45%;">
                <el-input v-model="dataForm.goodsSubTitle" maxlength="64"  show-word-limit placeholder="请输入副标题"></el-input>
            </el-form-item>

            <el-form-item label="售价：" prop="specSellPrice">
                <el-input-number v-model="dataForm.specSellPrice" :precision="2" :step="0.1" :min="0" :max="9999999.99"></el-input-number>
                <span> 元</span>
            </el-form-item>
            
            <el-form-item label="成本价：" prop="specCostPrice">
                <el-input-number v-model="dataForm.specCostPrice"  :precision="2" :step="0.1" :min="0" :max="9999999.99"></el-input-number>
                <span> 元</span>
            </el-form-item>

            <el-form-item label="总库存：" prop="specStorage">
                 <el-input-number v-model="dataForm.specStorage"   :step="1" :min="0" ></el-input-number>
                <span> 件</span>
            </el-form-item>
            
            <el-form-item label="商品品牌：" prop="brandId">
                <span style="padding:0 10px;">{{dataForm.brandName?dataForm.brandName:"未选择"}}</span>
                <el-popover
                    placement="bottom"
                    trigger="click">
                      <el-autocomplete
                        :fetch-suggestions="getBrandList"
                        placeholder="请输入内容"
                        @select="handleSelect"
                    ></el-autocomplete>
                    <el-button slot="reference" type="primary">选择商品品牌</el-button>
                  </el-popover>
            </el-form-item>

            <el-form-item label="商品属性：" class="arrrtibuteWrap">
                <!-- <el-input v-model="dataForm.name" maxlength="128" placeholder="请输入内容"></el-input> -->
                <!-- 下拉形式显示属性 -->
                  <div class="arrrtibuteWrap1">
                      <div class="attributeItem"  v-for="(item,index) in dataForm.goodsAttributeSaveDTOList" v-if="item.attributeId">
                        <span>{{item.attrName}}：</span>
                        <el-select v-model="item.attrValue"  placeholder="请选择区间">
                            <el-option
                                v-for="(item2,index) in item.attrValueOpction"
                                v-if="item2.attrValue"
                                :key="index"
                                :label="item2.attrValue"
                                :value="item2.attrValue">
                            </el-option>
                        </el-select>
                    </div>
                  </div>
                  <!-- 列表形式显示属性 -->
                  <div class="arrrtibuteWrap2">
                      <div   v-for="(item,index) in dataForm.goodsAttributeSaveDTOList" v-if="!item.attributeId" :key="index" style="display: flex;margin-bottom:20px;">
                        <el-form-item label="属性名称：">
                             <el-input v-model="dataForm.goodsAttributeSaveDTOList[index].attrName" maxlength="20" placeholder="请输入属性名称"></el-input>
                        </el-form-item>

                        <el-form-item label="属性值：" style="margin-left:20px;">
                              <el-input v-model="dataForm.goodsAttributeSaveDTOList[index].attrValue" maxlength="20" placeholder="请输入属性名称"></el-input>
                        </el-form-item>

                        <el-button type="primary" plain @click="clearAttribut(index)" style="margin-left:10px;height: 40px;">清空</el-button>
                        <el-button type="danger" plain @click="deleteAttributeGroup(index)" style="margin-left:10px;height: 40px;">删除</el-button>
                      </div>

                      <el-form-item>
                        <el-button  type="primary" @click="appendAttributeGroup()" >添加属性值</el-button>
                      </el-form-item>
                  </div>
                  
                  <!-- <div class="attributeBtWrap">
                    <el-button type="primary" @click="saveTemplate()" size="mini">存为模板</el-button>
                    <el-button type="primary" @click="useTemplate()" size="mini">立即使用</el-button>
                    <el-button type="primary" @click="chooseTemplate()" size="mini">选择模板</el-button>
                  </div> -->
            </el-form-item>
          
           <!--  选择规格 和 图片上传 -->
           <h3 style="margin-top: 30px;"  class="section">商品规格</h3>
            <chooseSpec  
                  ref="chooseSpecCompon"
                  @setGoodsSpecSaveDTOList="setGoodsSpecSaveDTOList" 
                  @setSpecAttributePictureSaveDTOList="setSpecAttributePictureSaveDTOList" 
                  :dataForm="dataForm">
            </chooseSpec>


            <h3 style="margin-top: 30px;"  class="section">商品详情</h3>
            <el-form-item label="商品详情：" >
                 <goodsDetailH5 ref="goodsDetailH5"></goodsDetailH5>
            </el-form-item>

            <h3 style="margin-top: 30px;"  class="section">售后说明</h3>
              <el-form-item label="售后说明模板：" > <!-- prop="afterSale" -->
                 <el-select
                    v-model="dataForm.afterSale"
                    placeholder="请选择"
                    :loading="afterTemplateLoading"
                    loading-text="加载中···"
                    @visible-change="chooseAfterTemplate(2)">
                    <el-option
                      v-for="item in aftertemplateListoption"
                      :key="item.id"
                      :label="item.name"
                      :value="item.value">
                    </el-option>
                </el-select>
               <!-- <quill-editor  style=" margin-top: 12px;" ref="myTextEditor" v-model="dataForm.afterSale" :options="editorOption"></quill-editor> -->
               <quill-editor-img @artmessageContent='artmessageContent' ref="myTextEditor"></quill-editor-img>

            </el-form-item>


             <el-form-item label="商品发布：" >
                 <el-radio v-model="dataForm.goodsType" label="0">立即发布</el-radio><br>
                 <el-radio v-model="dataForm.goodsType" label="1">定时发布</el-radio>
                  <el-date-picker
                   :disabled="dataForm.goodsType==0"
                    style="margin-left:8px;"
                    v-model="dataForm.shelfTime"
                    type="datetime"
                    value-format="yyyy-MM-dd hh:mm:ss"
                    placeholder="选择日期时间"
                    :picker-options="pickerOptions"
                    @change="afterTime">
                  </el-date-picker>
            </el-form-item>

      </el-form>
      <div class="nextStepWrap">
          <el-button class="nextStep" @click="preStep()" >取消</el-button>
          <el-button class="nextStep" type="primary"  @click="dataFormSubmit('addForm')"  v-loading="saveLoading">{{saveLoading?"保存中...":"保存"}}</el-button>
      </div>
    <nav style="position:fixed;right:30px;top:300px;">
         <div class="rightWarp">
            <div  class="nav1" v-for="(item, index) in navList" :key="index" :class="index==0?'current':''">
               <div class="bgCircle">
                 <div class="smallCircle"></div>
               </div>
               <a @click="jump(index)" >{{item}}</a>
            </div>
         </div>
    </nav>
  </div>
</template>

<script>

import chooseSpec from "./editSpecModules/chooseSpec.vue"

import cloneDeep from 'lodash/cloneDeep'
// 属性下拉
import {attributeList} from '@/api/api'
// 品牌下拉
import {goodsclassBrandById,brandList} from "@/api/api.js";
// 规格下拉
import { specList } from "@/api/api.js";
// 根据分类id查询品牌，规格，
import { goodsclassById } from "@/api/api.js";
// 属性值回显
import { backScanAttribute } from "@/api/api.js";
// import { backScanAttributegroup } from "@/api/api.js";
// 二级规格回显
import {backScanSpec} from '@/api/api'
import {addGoods,updateGoods} from "@/api/api.js";
// 模板下拉列表
import {aftertemplateList} from "@/api/api.js";

import { setTimeout } from 'timers';
import { type } from 'os';

// import { quillEditor } from "vue-quill-editor"; //调用编辑器
// import 'quill/dist/quill.core.css';
// import 'quill/dist/quill.snow.css';
// import 'quill/dist/quill.bubble.css';
import quillEditorImg from "@/components/quillEditor"



import goodsDetailH5 from './goodsDetailModules/goodsDetailH5.vue'
import { constants } from 'crypto';

export default {
  data () {
    return {
      scroll: '',
      navList: ["基本信息", "商品规格", "上传图片", "商品详情", "售后说明"],
      saveLoading:false,
      breaddata: ["商品", "商品管理", "商品添加"],
      showPageNumber:1,
      dataForm:{
        gcId: "",//1135755925667115009
        goodsSerial:new Date().getTime(),
        gcName  :'',
        gcId0: "",
        gcId1: "",
        gcId2: "",
        gcName0:'',
        gcName1:'',
        gcName2:'',
        goodsName:'',//商品名称
        goodsSubTitle:'',
        specSellPrice:0,
        specCostPrice:0,
        specStorage:0,
        brandId:"",
        brandName:'',
        goodsAttributeSaveDTOList:[ //属性组
          //  {
          //     "attrName":"",
          //     "attrValue":"",
          //     "attributeId":0,
          //     "goodsId":0
          //   },
        ],
        specAttributeAndValueSaveDTOList:[],
        goodsSpecSaveDTOList:[],//规格table
        specAttributePictureSaveDTOList:[],//规格对应的图片
        mobileBody:"",//商品详细内容(手机版) ,
        afterSale :'',//售后说明
        goodsType:"0",//商品发布类型 0:立即发布; 1:定时发布 ,
        shelfTime:new Date(), //发布时间 ,

        // 编辑时需要多穿
        specAttributeModifyIds:[], //移除规格属性数组 ,
        specAttributeAndValueModifyIds:[],//移除规格属性值数组 ,

      },

      // {
 //   "id": 0,//主键 ,
 //   "goodsSerial": 0,//商品货号 ,
 //   "storeId": 0,//店铺ID ,
 //   "storeName": "string"//店铺名称
 //   "goodsStorePrice": 0,//商品店铺价格 ,

 //  "gcId": 0,商品分类id ,
//   "gcName": "string",商品分类名称 ,
//   "goodsName": "string",商品名称 ,
//   "goodsSubTitle": "string",//商品副标题 ,
//   "brandId": 0,商品品牌id
//   "brandName": "string",品牌名称 ,
//    //商品属性集合 ,
//   "goodsAttributeSaveDTOList": [
//     {
//       "attrName": "string",//属性名称 
//       "attrValue": "string",//属性值（多个属性值之间用逗号隔开） ,
//       "attributeId": 0,//属性ID
//       "goodsId": 0//商品ID
//     }
//   ],
//   // 商品规格属性和规格值保存对象
//   "specAttributeAndValueSaveDTOList": [
//     {
//       "addType": 0,//修改操作填写 是否新增 0:原有; 1:新增属性值 2:新增属性和属性值 ,
//       "goodsId": 0,//商品ID ,
//       "isMain": 0,//是否为主规格（默认0否，1是） ,
//       "isSelect": 0,// 是否选中（0未选中，默认1选中） ,
//       "specAttrId": 0,//规格属性ID ,
//       "specAttrName": "string",//规格属性名称 ,
//       "specAttrValue": "string",//规格属性值名称 ,
//       "specAttrValueId": 0,//规格属性值ID ,
//       "tempSpecAttrValueId": 0 //后台使用
//     }
//   ],
//   //商品规格集合 ,表格
//   "goodsSpecSaveDTOList": [
//     {
//       "goodsId": 0,//商品ID ,
//       "id": 0,//主键id ,
//       "specAttrName": "string",//商品规格属性值名称（中间用逗号隔开） ,
//       "specAttributeRelationSaveDTOList": [
//         {
//           "isMain": 0,
//           "specAttrId": 0,
//           "specAttrValueId": 0
//         }
//       ],
//       "specCostPrice": 0,//成本价 ,
//       "specMainPicture": "string",//商品规格主图 ,
//       "specName": "string",//商品规格名称 ,
//       "specSellPrice": 0,//销售价 ,
//       "specSerial": 0,//商品规格编号 ,
//       "specStorage": 0//规格库存
//     }
//   ],
//    //商品规格属性和规格值集合 ,//图片
//   "specAttributePictureSaveDTOList": [//商品图片集合 ,
//     {
//       "isMainPicture": 0,//是否主图（默认0否，1是） ,
//       "pictureUrl": "string",//图片地址 
//       "sort": 0,//排序 
//       "specAttrId": 0,//商品规格属性ID ,
//       "specAttrValueId": 0//商品规格属性值ID
//     }
//   ],

//   "goodsBoby": "string",//商品详细内容(pc) ,
//   "mobileBody": "string",//商品详细内容(手机版) ,
//   "afterSale": "string",售后服务 ,
//   "goodsType": //0,商品发布类型 0:立即发布; 1:定时发布 ,
//   "shelfTime": "string",//发布时间
// }
      attributeList:[
          {label:"价格区间",option:'priceOption'},
          {label:"口碑",option:'mouthWordOption'},
          {label:"配送",option:'DeliveryOption'},
          {label:"产地",option:'placeOriginOption'},
      ],
      priceOption:[],//价格
      mouthWordOption:[],//口碑
      DeliveryOption:[],//配送
      placeOriginOption:[],//产地
      attributeValueDTOItem: {
            "attrName":"",
            "attrValue":"",
            "attributeId":"",
            "goodsId":null
      },
      skuLoading:false,//属性loading
      skuOptions:[],//属性下拉列表,
      editorOption: {
          placeholder: '请输入您要编辑的内容'
      },
      afterTemplateLoading:false,
      aftertemplateListoption:[],//售后模板下拉
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },// 日期组件 设置项
      dataRule : {
        goodsName: [
          { required: true, message: '必填项不能为空', trigger: 'blur' },
        ], 
         goodsSubTitle: [
          { required: true, message: '必填项不能为空', trigger: 'blur' },
        ], 
         specSellPrice: [
          { required: true, message: '必填项不能为空', trigger: 'blur' },
        ], 
         specCostPrice: [
          { required: true, message: '必填项不能为空', trigger: 'blur' },
        ], 
         specStorage: [
          { required: true, message: '必填项不能为空', trigger: 'blur' },
        ], 
        afterSale: [//售后说明
          { required: true, message: '必填项不能为空', trigger: 'blur' },
        ], 
      },
    }
  },
  watch: {
    // 'dataForm.goodsName' (val) {
    //   this.composeTableDataDelay();
    // },
    scroll: function () {
      this.loadSroll()
    }
  },
  components: {
      // quillEditor,
      chooseSpec,
      goodsDetailH5,
      quillEditorImg

  },
  created () {
       // 获取属性下拉列表
        // this.getAttributeList();
        // this.getGoodsclassById();
        // 获取售后下拉列表
        this.aftertemplateListPull();
       window.addEventListener('scroll', this.dataScroll);
  },
  methods: {
      init(dataForm){
          console.log(dataForm);
          console.log(this.dataForm);
          Object.assign(this.dataForm,dataForm);
        
          // 获取属性下拉列表
          // this.getAttributeList();
          this.$nextTick(()=>{
              if(!dataForm.id){//如果是新增商品，需要根据分类id查数据
                 this.getGoodsclassById();
              }else{//商品编辑
                  this.backScanEditAttribute();
                  this.backScanEditSpec();
                  this.backScanGoodDetail();
              }
          })
      },
      // 页面滚动右侧锚点代码-----------------------------------------------------------------------------------------
      dataScroll: function () {
          this.scroll = document.documentElement.scrollTop || document.body.scrollTop;
      },
      jump(index) {
          let jump = document.getElementsByClassName('section');
          // 获取需要滚动的距离
          let total = jump[index].offsetTop-30;
          // Chrome
          document.body.scrollTop = total;
          // Firefox
          document.documentElement.scrollTop = total;
          // Safari
          window.pageYOffset = total;
          // $('html, body').animate({
          // 'scrollTop': total
          // }, 400);
      },
      loadSroll: function () {
          var self = this;
          var $navs = $(".nav1");
          var sections = document.getElementsByClassName('section');
          for (var i = sections.length - 1; i >= 0; i--) {
            if (self.scroll >= sections[i].offsetTop - 200) {
              $navs.eq(i).addClass("current").siblings().removeClass("current")
              break;
            }
          }
      },
      // 新建回显----------------------------------------------------------------------------------------------------
      // // 根据分类id查询品牌，规格，
      getGoodsclassById(){
        if(!this.dataForm.gcId){
          this.preStep();
        }
        var obj = {
          params:{
            gcId:this.dataForm.gcId,
            gcName:this.dataForm.gcName,
          }
        }
        goodsclassById(obj).then((res)=>{
					 if(res.code == 200){
              this.dataForm.brandId =  res.data.brandId;
              this.dataForm.brandName =  res.data.brandName;
              this.dataForm.gcIdpath =  res.data.gcIdpath;
              this.dataForm.gcParentId =  res.data.gcParentId;
              this.dataForm.gcSort =  res.data.gcSort;
              this.backScanAttributeFn(res.data.goodsClassAttrDTOS);
              this.backScanSpecFn(res.data.goodsClassSpecDTOS);
					 }
				})
      },
      // 属性回显
      backScanAttributeFn(goodsClassAttrDTOS){
        if(goodsClassAttrDTOS){
          this.dataForm.goodsAttributeSaveDTOList = [];
          goodsClassAttrDTOS.forEach((item,index)=>{
            this.backScan(item);
              // this.dataForm.goodsAttributeSaveDTOList.push({
              //   "attrName":item.attrId,
              //   "attrValue":item.attrName,
              //   "attributeId":item.id,
              //   "goodsId":0,//tudo
              //   // "attrValueOpction":
              // });
          })
        }
      },
      // 编辑回显
			backScan(item){
          let  that = this;
				  var obj  = {
							id:item.attrId,
					}
					backScanAttribute(obj).then((res)=>{
							if(res.code == 200){
                  // 属性单独处理回显
                  var attrValueOpction = [];
									res.data.attributeValueDTOList.forEach((item2,index2)=>{
										 attrValueOpction.push(
                       {attrValue:item2.attrValueName}
                     );
									})
                  
                  that.dataForm.goodsAttributeSaveDTOList.push({
                    "attrName":item.attrName,
                    // "attrValue":item.attrName,
                    "attributeId":item.attrId,
                    "goodsId":0,//tudo
                    "attrValueOpction":attrValueOpction
                  });
							}
					})
			},
      // 规格回显
      backScanSpecFn(goodsClassSpecDTOS){
        this.$refs.chooseSpecCompon.specLevel_1 = [
            {specId:"10086",name:'颜色',checked:false},
        ];
        this.$refs.chooseSpecCompon.specLevel_2 = [
            [
                { id:"1008601",specId:"10086",name:'红色',checked:false},
                { id:"1008602",specId:"10086",name:'橙色',checked:false},
                { id:"1008603",specId:"10086",name:'黄色',checked:false},
                { id:"1008604",specId:"10086",name:'绿色',checked:false},
                { id:"1008605",specId:"10086",name:'青色',checked:false},
                { id:"1008606",specId:"10086",name:'粉色',checked:false},
                { id:"1008607",specId:"10086",name:'蓝色',checked:false},
                { id:"1008608",specId:"10086",name:'紫色',checked:false},
                { id:"1008609",specId:"10086",name:'粉色',checked:false},
                { id:"1008610",specId:"10086",name:'黑色',checked:false},
                { id:"1008611",specId:"10086",name:'白色',checked:false},
                { id:"1008612",specId:"10086",name:'棕色',checked:false},
            ]
        ];
        goodsClassSpecDTOS.forEach((item,index)=>{
            // 回显规格一级
            this.$refs.chooseSpecCompon.specLevel_1.push(
              {
                // id:item.id,
                specId:item.specId,
                name:item.specName,
                checked:false
              }
            )
            this.$refs.chooseSpecCompon.specLevel_2.push([]);
            var obj  = {id:item.specId}
            // 回显规格二级
            backScanSpec(obj).then((res)=>{
              if(res.code == 200){
                if(res.data.specValueDTOList){
                  res.data.specValueDTOList.forEach((item2,index2)=>{
                    this.$refs.chooseSpecCompon.specLevel_2[index+1].push(
                      {
                        id:item2.id,//红色id
                        specId:item2.specId,//颜色id
                        name:item2.specValueName,
                        checked:false
                      },
                    );
                  })
                }
              }
            })
            // console.log("000000000000000000000000000000000000");
            // console.log(this.$refs.chooseSpecCompon.specLevel_2);
        })
      },
      // 编辑回显---------------------------------------------------------------------------------------------------- 
      // 回显编辑属性
      backScanEditAttribute(){
          this.dataForm.goodsAttributeSaveDTOList = this.dataForm.goodsAttributeDTOList;
          this.dataForm.goodsAttributeSaveDTOList.forEach((item,index)=>{
                if(item.attributeId){
                    backScanAttribute({id:item.attributeId}).then((res)=>{
                        // 属性单独处理回显
                        var attrValueOpction = [];
                        res.data.attributeValueDTOList.forEach((item2,index2)=>{
                          attrValueOpction.push(
                            {attrValue:item2.attrValueName}
                          );
                        })
                        item.attrValueOpction = cloneDeep(attrValueOpction);
                        this.$set( this.dataForm.goodsAttributeSaveDTOList,index,this.dataForm.goodsAttributeSaveDTOList[index]);
                    })

                } 
                
          })

          // delete this.dataForm.goodsAttributeDTOList;
      },
      // 回显规格
      backScanEditSpec(){
          //规格数据 ************************************
          // specAttributeDetailDTOList
          var specAttributeDetailDTOList  = cloneDeep(this.dataForm.specAttributeDetailDTOList);
          this.$refs.chooseSpecCompon.specLevel_1 = [];
          this.$refs.chooseSpecCompon.specLevel_2 = [];
          specAttributeDetailDTOList.forEach((item,index)=>{
                // 回显规格一级
                this.$refs.chooseSpecCompon.specLevel_1.push(
                  {
                    // id:item.id,
                    specId:item.id,
                    name:item.specAttrName,
                    // isMain:item.isMain,
                    checked:false
                  }
                );
                 // 回显规格二级
                this.$refs.chooseSpecCompon.specLevel_2.push([]);
                item.specAttributeValueDetailDTOList.forEach((item2,index2)=>{
                  // 如果有规格值选中，那么规格也要选中
                   if(item2.isSelect){ this.$refs.chooseSpecCompon.specLevel_1[index].checked = true }
                   console.log("编辑规格回显数据",[index2,item2.specAttrValueId,item.id]);
                    this.$refs.chooseSpecCompon.specLevel_2[index].push(
                      {
                        id:item2.specAttrValueId,//红色id
                        specId:item.id,//颜色id
                        name:item2.specAttrValue,
                        checked:item2.isSelect?true:false,
                        // isSelect:item2.isSelect
                      },
                    );
                })
          })
          delete this.dataForm.specAttributeDetailDTOList;

          // 表格数据************************************
          // goodsSpecDetailDTOList 
            var goodsSpecDetailDTOList  = cloneDeep(this.dataForm.goodsSpecDetailDTOList);
            this.$refs.chooseSpecCompon.goodsSpecSaveDTOList = [];
            goodsSpecDetailDTOList.forEach((item,index)=>{
                  console.log(["============",item]);
                   this.$refs.chooseSpecCompon.goodsSpecSaveDTOList.push(item)
                  
            })
            this.$refs.chooseSpecCompon.composeTableDataDelay();

            delete this.dataForm.goodsSpecDetailDTOList;

           // 图片主规格属性图回显************************************
            var specAttributePictureDetailDTOList = cloneDeep(this.dataForm.specAttributePictureDetailDTOList);
            let imgListDefalt= [];
            specAttributePictureDetailDTOList.forEach((item,index)=>{
                console.log([item,index]);
                imgListDefalt.push({
                  // specName:item.specAttrValue,
                  specName1:item.specAttrValue,
                  id:item.specAttrValueId,
                  specId:item.specAttrId,
                  imgListItem:[]
                })
                item.specAttributePictureDTOLists.forEach((item2,index2)=>{
                   console.log(item2);
                   imgListDefalt[index].imgListItem.push({
                          image:item2.pictureUrl ,
                          id:item.specAttrValueId,//规格属性值id//"1144611004190105603"
                          specId:item.specAttrId,//规格属性id //"1144611004190105604"
                          sort:item2.sort,
                   });
                })
            }) 
            // 因为图片的数据监听了表格数据的变化，而表格数据监听复选框的变化，所以这里需要加哥延迟
          setTimeout(()=>{
              this.$refs.chooseSpecCompon.$refs.imageListCompon.editImgBackSacn(imgListDefalt);
              console.log("编辑回显imgList值：");
              console.log(imgListDefalt);
            console.log( this.$refs.chooseSpecCompon.$refs.imageListCompon.imgList);
          },100)
            
         // 图片商品图图回显************************************
          var specAttributePictureDetailDTOList = cloneDeep(this.dataForm.specPictureDTOListDefault);
          let imgList = [];
           imgList.push({
              // specName:item.specAttrValue,
              specName1:"上传图片",
              id:"1008601",
              specId:"10086",
              imgListItem:[]
            })
          specAttributePictureDetailDTOList.forEach((item,index)=>{
                  console.log(item);
                  imgList[0].imgListItem.push({
                        image:item.pictureUrl ,
                        isMainPicture: item.isMainPicture,
                        id:"1008601",
                        specId:"10086",
                        sort:item.sort,
                  });
          }) 
            // 因为图片的数据监听了表格数据的变化，而表格数据监听复选框的变化，所以这里需要加哥延迟
          setTimeout(()=>{
              this.$refs.chooseSpecCompon.$refs.imageListDefaultCompon.editImgBackSacn(imgList);
              console.log("编辑回显imgList值：");
              console.log(imgList);
            console.log( this.$refs.chooseSpecCompon.$refs.imageListDefaultCompon.imgList);
          },100)
             
           
      },
      backScanGoodDetail(){
          if(this.dataForm.mobileBody){
             this.$refs.goodsDetailH5.imgList =  JSON.parse(this.dataForm.mobileBody);
          }
      },
       // 获取品牌下拉列表
      getBrandList(queryString,cb){
        queryString?queryString:''
          var obj = {
             params:{
               gcClassId:this.dataForm.gcId,
                brandName:queryString,
             }
          }
          // brandList
          goodsclassBrandById(obj).then((res)=>{
              if(res.code == 200){
                  var showData = []
                  res.data.forEach((item,index) => {
                        item.value = item.brandName;
                        item.id= item.brandId
                        showData.push(item);
                  });
                  cb(showData)
              }
          })
      },
      handleSelect(item){
          console.log(item);
          this.dataForm.brandName= item.brandName
          this.dataForm.brandId= item.id
      },
      // 追加属性条
      appendAttributeGroup(){
          var  attributeValueDTOItem= cloneDeep(this.attributeValueDTOItem);
          this.dataForm.goodsAttributeSaveDTOList.push(attributeValueDTOItem);
      },
      //删除属性条
      deleteAttributeGroup(index){
          this.dataForm.goodsAttributeSaveDTOList.splice(index,1)
      },
      // 清除某条属性的属性
      clearAttribut(index){
          this.dataForm.goodsAttributeSaveDTOList[index].attrValue = "";
          this.dataForm.goodsAttributeSaveDTOList[index].attrName = "";
      },
      // changeArrtibute(index){
      //      console.log(this.dataForm.goodsAttributeSaveDTOList[index]);
      // },
      // 保存模板
      saveTemplate(){},
      // 使用模板
      useTemplate(){},
      // 选择模板
      chooseTemplate(){ },

      // 商品规格模块 ------------------------------------------------------------------------------------------------------------------
      // 模块化了 
      // 列举有的的规格(不包括一级未选中的);
      setSpecAttributeAndValueSaveDTOList(){

        console.log("啊啊啊啊啊 啊  啊啊");
        console.log(this.$refs.chooseSpecCompon.specLevel_2);
        // this.$refs.chooseSpecCompon.specLevel_1
          let isChooseMiain = false;
          this.dataForm.specAttributeAndValueSaveDTOList = [];
          this.$refs.chooseSpecCompon.specLevel_1.forEach((item,index)=>{
                  // 第一层的主规格的第一个必须选中
                  if(index==0 && item.checked){isChooseMiain = true;}
            // if(item.checked){
                  this.$refs.chooseSpecCompon.specLevel_2[index].forEach((item2,index2)=>{
                    var addType = 2;
                    if(this.dataForm.id){
                      addType = item2.addType?item2.addType:0;
                    }
                    this.dataForm.specAttributeAndValueSaveDTOList.push({
                          "addType": addType,// 新增传2或者不传//修改操作填写 是否新增 0:原有; 1:新增规格属性值 2:新增规格属性和规格属性值 ,//todu
                          "goodsId": null,//商品ID ,//todu
                          "isMain": index==0?1:0,//是否为主规格（默认0否，1是） ,
                          "isSelect": item2.checked?1:0,// 是否选中（0未选中，默认1选中） ,
                          "specAttrId": item2.specId?item2.specId:new Date().getTime(),//规格属性ID , //如 颜色，尺寸
                          "specAttrName": item.name,//规格属性名称 ,
                          "specAttrValue": item2.name,//规格属性值名称 ,
                          "specAttrValueId":  item2.id?item2.id:new Date().getTime(),//规格属性值ID ,//如红色，s码
                          // "tempSpecAttrValueId": 0 //后台使用
                    })
                  })
            // }
          })
          return isChooseMiain;
          
      },
      // 表格 -------------------------
      setGoodsSpecSaveDTOList(goodsSpecSaveDTOList){
          this.dataForm.goodsSpecSaveDTOList = cloneDeep(goodsSpecSaveDTOList);
      },
      // 图片 -------------------------
      setSpecAttributePictureSaveDTOList(specAttributePictureSaveDTOList){
          this.dataForm.specAttributePictureSaveDTOList = cloneDeep(specAttributePictureSaveDTOList);
      },

     // 售后模板--------------------------------------------------------------------------------------------------------------------
      aftertemplateListPull(){
        var obj  = {
          params:{
            // page:1,
            // limit:50
          }
        }
        this.afterTemplateLoading = true;
         aftertemplateList(obj).then((res)=>{
           this.afterTemplateLoading = false;
           if(res.code = '200'){
              this.aftertemplateListoption = res.data;
           }
           
         })
      },
       chooseAfterTemplate(){
      },
      artmessageContent(messageContent){
  	  	this.dataForm.afterSale = messageContent;
    	},
      // 底部按钮------------------------------------------------------------------------------------------------------------
      filterTime(value){
       	  function add0(m){return m<10?'0'+m:m }
          var time = new Date(value);
          var y = time.getFullYear();
          var m = time.getMonth()+1;
          var d = time.getDate();
          var h = time.getHours();
          var mm = time.getMinutes();
          var s = time.getSeconds();
				  return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s)
            // return y+'-'+add0(m)+'-'+add0(d)
      },
      afterTime(){
           console.log(this.dataForm.shelfTime);
           if(new Date(this.dataForm.shelfTime).getTime() < new Date().getTime()){
                this.dataForm.shelfTime = this.filterTime(new Date());
           }
      },
      // 统计取消勾选的规格的id
      updateSpecIds(){
          let specAttributeModifyIds = [];//勾选的的规格属性id
          let specAttributeAndValueModifyIds= [];//移除的规格属性值id
          this.$refs.chooseSpecCompon.specLevel_1.forEach((item,index)=>{
              if(item.checked && item.specId) specAttributeModifyIds.push(item.specId);
              this.$refs.chooseSpecCompon.specLevel_2[index].forEach((item2,index2)=>{
                  if(!item2.checked  && item2.id) specAttributeAndValueModifyIds.push(item2.id);
              })
          })
          this.dataForm.specAttributeModifyIds = specAttributeModifyIds;
          this.dataForm.specAttributeAndValueModifyIds = specAttributeAndValueModifyIds;
          console.log("specAttributeModifyIds");
          console.log(this.dataForm.specAttributeModifyIds);
          console.log("specAttributeAndValueModifyIds");
          console.log(this.dataForm.specAttributeAndValueModifyIds);
      },
      //  商品属性不能有空值
      judgeGoodsAttribute(){
        let isHaveNullValue = false;
        console.log(this.dataForm.goodsAttributeSaveDTOList);
        this.dataForm.goodsAttributeSaveDTOList.forEach((item,index)=>{
               if(!item.attrValueOpction && (!item.attrName || !item.attrValue)){
                  isHaveNullValue = true
                  }
        
        })
        if(isHaveNullValue){
             this.$message({
              message: "属性名或属性值不能为空",
              type: "warning",
              duration: 800
            });
        }
        return  isHaveNullValue;
      },
      dataFormSubmit(formName){
          this.afterTime();
          // 如果正在提交商品，这里 
          if(this.saveLoading){
            return;
          }
          if(this.judgeGoodsAttribute()){
              return;
          }
           if( this.$refs.chooseSpecCompon.$refs.imageListCompon.uploading){
               this.$message({
                  message: "正在上传商品主图,请稍后提交",
                  type: "warning",
                  duration: 800
                });
                return;
           }
          //  this.dataForm.specAttributePictureSaveDTOListDefault = [{
          //         "goodsId":0,
          //         "isMainPicture":1,
          //         "pictureUrl":"https://mockplus-prototype-host.mockplus.cn/525794/EK3GDFF6HGADXAGA/7/images/%E9%A6%96%E9%A1%B5/u6.png",
          //         "sort":0
          //  }]
          this.dataForm.specAttributePictureSaveDTOListDefault =  this.$refs.chooseSpecCompon.$refs.imageListDefaultCompon.specAttributePictureSaveDTOListDefault

            this.dataForm.firstGcId = this.dataForm.gcId0
            this.dataForm.firstGcName = this.dataForm.gcName0
            this.dataForm.secondGcId = this.dataForm.gcId1
            this.dataForm.secondGcName = this.dataForm.gcName1
            this.dataForm.thirdGcId = this.dataForm.gcId2
            this.dataForm.thirdGcName = this.dataForm.gcName2

            if(this.dataForm.thirdGcId){
               this.dataForm.gcId =  this.dataForm.thirdGcId
               this.dataForm.gcName = this.dataForm.thirdGcName
            }else if(this.dataForm.secondGcId){
               this.dataForm.gcId =  this.dataForm.secondGcId
               this.dataForm.gcName = this.dataForm.secondGcName
            }else{
               this.dataForm.gcId =  this.dataForm.firstGcId
               this.dataForm.gcName = this.dataForm.firstGcName
            }
            //  提交之前先拼数据
            this.setSpecAttributeAndValueSaveDTOList()
            if(!this.$refs.chooseSpecCompon.$refs.imageListDefaultCompon.imgList[0].imgListItem[0].image){
                this.$message({
                  message: "请上传主规格图!",
                  type: "warning",
                  duration: 800
                });
                return;
            }
            this.updateSpecIds();
            let obj = {
                ...this.dataForm,
                shelfTime:this.dataForm.goodsType==0?null:this.filterTime(this.dataForm.shelfTime),
            }
           console.log(JSON.stringify(obj));
            this.$refs[formName].validate((valid) => {
                if (valid) {
                 
                  let fn = addGoods;
                  // 如果是编辑
                  if(this.dataForm.id){
                    fn = updateGoods;
                    delete obj.specAttributePictureDetailDTOList;
                    delete obj.goodsAttributeSaveDTOList;
                  }
                  this.saveLoading = true;
                  fn(obj).then((res)=>{
                        this.saveLoading = false;
                      let status = "warning"
                        if(res.code=="200"){
                            status = "success"
                            this.$emit("showPageNumberFn",3);
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
      preStep(){
        // return;
        if(this.dataForm.id){
            this.$router.go(-1);//当详情页
        }else{
           this.$emit("showPageNumberFn",1);
        }
 
      },
  }
}
</script>
<style lang="scss" scoped>

@import "@/element-ui/theme-variables.scss";
.arrrtibuteWrap{
  .arrrtibuteWrap1{
      width: 85%;
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      .attributeItem{
         margin-right:10px;
          display: flex;
          margin-bottom: 30px;
      }
  }
  .arrrtibuteWrap2{
      .el-form-item{
        display: flex;
        /deep/ .el-form-item__label{
          width:auto !important;
        }
        /deep/ .el-form-item__content{
          margin-left:0 !important;
        }
      }
  }
}

 /deep/ .el-form-item__content::before{
      content: none !important;
  }

 .skuSelect{
    min-width: 400px;
 }
 .attributeBtWrap{
   margin-top:20px;
 }
.nextStepWrap{
   margin-top:40px;
   margin-bottom:40px;
   text-align: center;
}
.clickSpan{
  cursor: pointer;
}
/deep/ .el-form-item{
    margin-top: 0; 
}

.rightWarp{
    width: 100px;
    border-left: 2px solid #cac9c9;
    z-index:10;
}
 .nav1 {
    display: flex;
    // width: 100px;
    // height: 40px;
    text-align: center;
    line-height: 40px;
    background: white;
    margin: 10px 0;
    align-items: center;
    font-size:14px;
    a{
      color:rgba(0, 0, 0, 0.647058823529412);
      text-decoration:none;
       cursor: pointer;
    }
    .bgCircle{
        visibility: hidden;
        display: flex;
        position: relative;
        left: -7.5px;
        border-radius: 50%;
        width: 14px;
        height: 14px;
        background-color:  $--color-primary;
        align-items: center;
        justify-content: center;
      .smallCircle{
        border-radius: 50%;
        width: 5px;
        height: 5px;
        background-color: white;
      }
    }
  }
  .current {
      color:  $--color-primary;
      .bgCircle{
          visibility: visible;
      }
  }

</style>