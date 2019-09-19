<template>
  <div>
       <Bread  :breaddata="breaddata"></Bread>
      <el-form :inline="true" class="grayLine topGapPadding" :model="dataForm" >
        <!-- <el-scrollbar style="height:90px;margin-right: 30px;"> -->
            <el-form-item label="输入搜索：">
              <el-input v-model="dataForm.goodsName" placeholder="商品名称/商品货号" clearable></el-input>
            </el-form-item>
            <el-form-item  label="所属店铺：">
              <el-input v-model="dataForm.storeName" placeholder="店铺名称" clearable></el-input>
            </el-form-item>

             <el-form-item  label="审核状态:">
                <el-select
                v-model="dataForm.goodsStatus"
                placeholder="请选择">
                    <el-option
                        v-for="item in goodsStatusOption"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item  label="商品品牌：">
                <!-- <el-select
                v-model="dataForm.brandId"
                placeholder="请选择">
                    <el-option
                        v-for="item in brandListOption"
                        :key="item.id"
                        :label="item.brandName"
                        :value="item.id">
                    </el-option>
                </el-select> -->
                <el-autocomplete
                  v-model="state4"
                  :fetch-suggestions="getBrandListPull"
                  placeholder="请输入品牌"
                  @select="handleSelect"
                ></el-autocomplete>
            </el-form-item>
            <el-form-item label="商品分类：">
                <!-- <el-select
                  v-model="dataForm.gcId0"
                  placeholder="请选择"
                  loading-text="加载中···"
                  @visible-change="getGoodsClassFn(1)">
                  <el-option
                    v-for="item in goodscalssOption0"
                    :key="item.id"
                    :label="item.gcName"
                    :value="item.id">
                  </el-option>
                </el-select>
                <span style="color:#999999"> - </span>
                <el-select
                v-model="dataForm.gcId1"
                  placeholder="请选择"
                  :loading="goodKind2loading"
                  loading-text="加载中···"
                  @visible-change="getGoodsClassFn(2)">
                  <el-option
                    v-for="item in goodscalssOption1"
                    :key="item.id"
                    :label="item.gcName"
                    :value="item.id">
                  </el-option>
                </el-select>
                <span style="color:#999999"> - </span>
                <el-select
                v-model="dataForm.gcId2"
                  placeholder="请选择"
                  :loading="goodKind3loading"
                  loading-text="加载中···">
                  <el-option
                    v-for="item in goodscalssOption2"
                    :key="item.id"
                    :label="item.gcName"
                    :value="item.id">
                  </el-option>
                </el-select> -->
                     <el-cascader
                clearable=""
                  v-model="gcIds"
                  :options="goodscalssOption"
                  @active-item-change="handleItemChange"
                  @change ="finishCange()"
                ></el-cascader>
            </el-form-item>
        <!-- </el-scrollbar> -->
        <el-form-item>
          <el-button  class="btn" type="primary" @click="getData()">搜索</el-button>
          <el-button   class="btn"  @click="reset()" type="primary" plain>重置</el-button>
        </el-form-item>
      </el-form>


      <el-table
        width="100%"
        :data="dataList"
        border
        v-loading="dataListLoading"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        >
        <el-table-column
          type="selection"
          width="70">
        </el-table-column>

        <el-table-column
          label="序号"
          width="70"
          align="center">
            <template slot-scope="scope">
              {{scope.$index+1+(parseInt(page)-1)* parseInt(limit) }}
            </template>
        </el-table-column>
        <el-table-column
		      prop="goodsSerial"
		      label="spu"
         min-width="100"
		      align="center">
		    </el-table-column>

		    <el-table-column
		      label="商品"
		      align="center">
            <template slot-scope="scope">
                  <div class="goodsImg">
                    <img  :src="scope.row.pictureUrl | filterImgUrl" style="width:60px;height:60px;object-fit: contain;" alt=""/>
                  </div>
            </template>
		    </el-table-column>

        <el-table-column
		      prop="goodsName"
		      label="商品名称"
          width="200"
		      align="center">
              <template slot-scope="scope">
                <div class="towEllipsis">
                  <a :href="scope.row.id | filterhrefUrl"  target="view_window">{{scope.row.goodsName}}</a>
                </div>
             </template>
		    </el-table-column>

        <el-table-column
		      prop="brandName"
		      label="品牌"
		      align="center">
		    </el-table-column>

        <el-table-column
		      prop="price"
		      label="价格(销售价/成本价)"
		      align="center"
          width="150">
            <template slot-scope="scope">
              <div class="priceWrap">  
                  <div class="price1">￥{{scope.row.specSellPrice}}</div>
                  <div class="price2">￥{{scope.row.specCostPrice}}</div>
              </div>
            </template>
		    </el-table-column>

        <el-table-column
		      prop="gcName"
		      label="分类"
		      align="center">
            <template slot-scope="scope">
              <div>
                 {{scope.row.gcName}}
              </div>
            </template>
		    </el-table-column>
        <el-table-column
		      prop="storeName"
		      label="店铺名称"
		      align="center"
         >
            <template slot-scope="scope">
              <div>
                  {{scope.row.storeName}}
              </div>
            </template>
		    </el-table-column>

		    <el-table-column
		      label="操作"
		      align="center"
          width="140px"
		      >
            <template slot-scope="scope">
			        <div v-if="scope.row.goodsStatus==10">
                 <el-button @click.native.prevent="addOrEditHandle('sing',scope.row,1)" type="text"size="mini">通过</el-button>
                 <el-button @click.native.prevent="addOrEditHandle('sing',scope.row,0)" type="text" class="artdisable" size="mini">拒绝</el-button>
              </div>
              <el-tag type="info"  v-if="scope.row.goodsStatus==20">审核未通过</el-tag>
              <el-tag type="success"  v-if="scope.row.goodsStatus==30">审核已通过</el-tag>
              <!-- <span v-if="scope.row.goodsStatus==20" >审核未通过</span> -->
              <!-- <span v-if="scope.row.goodsStatus==30">审核已通过</span> -->
			      </template>
		    </el-table-column>
	  </el-table>
    <div  class="bottomFun"> 
        <div class="bottomFunLeft">
            <!-- <el-checkbox v-model="checked" @change="change">全选</el-checkbox> -->
           <div class="grayBtnWarp">
              <el-button @click="addOrEditHandle('batch',{},1)" type="primary">通过</el-button>
              <el-button @click="addOrEditHandle('batch',{},0)" type="primary" plain>拒绝</el-button>
           </div>
        </div>

       <!-- 分页 -->
       <el-pagination
	      @size-change="pageSizeChangeHandle"
	      @current-change="pageCurrentChangeHandle"
	      :current-page="page"
	      :page-sizes="[10, 20, 50, 100]"
	      :page-size="limit"
	      :total="total"
	      layout="total, sizes, prev, pager, next, jumper">
	    </el-pagination>
    </div>

    	<!-- 弹窗, 新建 -->
	    	<addEditData  v-if="addEditDataVisible" ref="addEditData" @searchDataList="getDataList"></addEditData>
  </div>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'

import {brandListPull} from "@/api/api.js";
import {getGoodscalss} from "@/api/api.js";
import { goodsVerifyPageUrl } from '@/api/url'
  
import addEditData from './model-add-edit-data'
import Bread from "@/components/bread"

export default {
  mixins: [mixinViewModule],
  data () {
    return {
        gcIds:[],
        state4:"",
        breaddata: ["商品", "商品管理", "商品审核"],
        goodKind2loading:false,
        goodKind3loading:false,
        mixinViewModuleOptions: {
          getDataListURL: goodsVerifyPageUrl,
          getDataListIsPage: true,
          // exportURL: '/admin-api/log/login/export',
          // deleteURL: deleteAttributeUrl,
          // deleteIsBatch: true,
          // deleteIsBatchKey: 'id'
        },
        addEditDataVisible:false,
        dataForm: {
              goodsName: "",//商品名称/商品货号
              storeName: "",//所属店铺
              brandId: "",//品牌id
              gcId: "",//分类ID
              goodsShow:"",//上下架状态:0下架;1上架
              gcId0:'',
              gcId1:'',
              gcId2:'',
              goodsStatus:"",//审核状态:10:待审核，20:审核未通过，30:审核通过,40:违规下架,50:未发布
        },
        brandListOption:[],//品牌列表
        // goodscalssOption0: [],
        // goodscalssOption1: [],
        // goodscalssOption2: [],
        goodscalssOption:[
            // {
            //     value: '123',
            //     label: '江苏2',
            //     children: []
            // },
        ],
        multipleSelection:[
        
        ],
        // 商品审核状态
        goodsStatusOption:[
            {id:"",name:"全部"},
            {id:"10",name:"待审核"},
            {id:"20",name:"审核未通过"},
            {id:"30",name:"审核通过"},
            // {id:"40",name:"违规下架"},
            // {id:"50",name:"未发布"},
        ]
    }
  },
  components: {
    addEditData,
    Bread
  },
  created () {
     // 获取商品品牌下拉
      // this.getBrandListPull();
      // 获取商品分类下拉
         // this.getGoodsClassFn(0);
    this.handleItemChange();
  },
    
  watch:{
		state4(val){
	      if(!val){
	        this.dataForm.brandId = ""
	      }
	    }
	},
  mounted(){
    // this.getDataList();
  },
  methods: {
    // 新建和编辑
    addOrEditHandle(type,row="",inspectType){
      var ids = [];

      if(type=="batch"){//批量处理
          // 没有勾选商品
          if(this.multipleSelection.length==0){
              this.$message({
                message:"请先选择商品",
                type: "warning",
                duration: 1500
              })
              return;
          }
          ids = this.getIds();
      }else{//单个处理
        ids = [row.id];
      }
       this.setAddEditDataVisible(true);
       row.inspectType = inspectType;
       row.ids = ids;
        this.$nextTick(() => {
          this.$refs.addEditData.init(row)
        })
    },
    setAddEditDataVisible(boolargu){
      this.addEditDataVisible =  boolargu;
    },
    // 获取品牌下拉列表
    getBrandListPull(brandName,cb){
        var obj = {
           params:{
              // page:1,
            // limit:50,
            brandName:brandName,
           }
        }
        brandListPull(obj).then((res)=>{
            if(res.code == 200){
                  // this.brandListOption =  [{"id":"",brandName:"全部"}].concat(res.data);
                   var showData = []
                  res.data.forEach((item,index) => {
                        item.value = item.brandName;
                        showData.push(item);
                  });
                  cb(showData)
            }
        })
    },
      // // 获取品牌下拉列表
      handleSelect(item){
          console.log(item);
          this.dataForm.brandId = item.id
          // this.dataForm.brandName= item.brandName
          // this.dataForm.brandId= item.id
      },
    // // 后去商品分类（三级联动）
    // getGoodsClassFn(arguId){
    //   // setTimeout(()=>{
    //     var id= 0;
    //       if(arguId==1){//二级关联
    //           if(!this.dataForm.gcId0){this["goodscalssOption"+arguId] = []; return;}
    //           id = this.dataForm.gcId0;

    //           this.dataForm.gcId1 = "";
    //           this.dataForm.gcId2 = "";
    //           this["goodscalssOption1"] = [];
    //           this["goodscalssOption2"] = [];
       
    //       }else if(arguId==2){//三级关联
    //           if(!this.dataForm.gcId1) {this["goodscalssOption"+arguId] = []; return;}
    //           id = this.dataForm.gcId1;

    //            this.dataForm.gcId2 = "";
    //           this["goodscalssOption2"] = [];
    //       }else{//一级关联
    //           id=0;
    //           this.dataForm.gcId1 = "";
    //           this.dataForm.gcId2 = "";
    //           this["goodscalssOption1"] = [];
    //           this["goodscalssOption2"] = [];
    //       }
    //       var obj = {
    //           id:id
    //       }
    //       getGoodscalss(obj).then((res)=>{
    //           console.log(res)
    //           if(res.code == 200){
    //             if(arguId==0){
    //                 this["goodscalssOption"+arguId] = [{id:"",gcName:"全部"}].concat(res.data);
    //             }else{
    //               this["goodscalssOption"+arguId] = res.data;
    //             }
                  
    //           }
    //       })

         
    //   // },100)
    // },
     handleItemChange(val){
        console.log('active item:', val, typeof val);
        // console.log(val);
         var val1 = [];
        if(val && typeof(val) == "string"){
            val1 =  JSON.parse(val); 
        }
        else{
          val &&  val.forEach((item,index)=>{
                if(typeof(item) == "string"){
                   val1.push(JSON.parse(item))
                }else{
                     val1.push(item)
                }
           })
        }
        if(val1)
        // console.log(val1)
        var id =0
        let takeBlack = true
        if(Object.prototype.toString.call(val1) === '[object Object]'){
             id = val1.id ?val1.id:0;
        }else if(Object.prototype.toString.call(val1) === '[object Array]' && val1.length>0){
             id =  val1[val1.length-1].id;
             if(val1.length==2) takeBlack = false
        }
        var obj = {
             id:id
        }
        // console.log(val1.length,Object.prototype.toString.call(val1),takeBlack);
        getGoodscalss(obj).then((res)=>{
              if(res.code == 200){
                 res.data.forEach((item,index)=>{
                     item.label = item.gcName
                     takeBlack?item.children = []:""
                     item.value = JSON.stringify(item);
                    // item.value = item.id
                 })
                 if(!val){
                    this.goodscalssOption = res.data;
                 }else{
                     this.goodscalssOption.forEach((item,index)=>{
                        if(item.id == id){
                             item.children= res.data.length>0?res.data:"";
                        }
                        item.children.forEach((item2,index2)=>{
                            if(item2.id == id){
                                item2.children =  res.data.length>0?res.data:"";
                            }
                        })
                     })
                 }
              }
              // console.log(this.goodscalssOption);
          })
    },
    finishCange(){
      console.log(this.gcIds);
      if(this.gcIds.length>0){
           this.dataForm.gcId = JSON.parse(this.gcIds[this.gcIds.length-1]).id
           console.log(JSON.parse(this.gcIds[this.gcIds.length-1]).id);
      }else{ 
          this.dataForm.gcId="";
      }
       
    },
    getData(){
        // var gcId0 = this.dataForm.gcId0
        // var gcId1 = this.dataForm.gcId1
        // var gcId2 = this.dataForm.gcId2
        // this.dataForm.gcId =gcId2?gcId2:(gcId1?gcId1:gcId0)
        this.getDataList();
    },
    handleSelectionChange(val){
      this.multipleSelection = val;
      this.dataListSelectionChangeHandle(val);
    },

    getIds(){
      var ids= [];
      // console.log(this.multipleSelection);
      this.multipleSelection.forEach((item,index)=>{
          if("object" == typeof(item)){
            ids.push(item.id);
          }else{
            ids.push(id);
          }
      })
      return ids;
    },
    // 重置
    reset(){
       this.dataForm.goodsName = "";//商品名称/商品货号
       this.dataForm.storeName = "";//所属店铺
      this.dataForm.brandId = "";//品牌id
      this.dataForm.gcId = "";//分类ID
       this.state4  = ""
      // this.dataForm.gcId0 = "";//分类ID
      // this.dataForm.gcId1 = "";//分类ID
      // this.dataForm.gcId2 = "";//分类ID
      this.dataForm.goodsStatus = "";//商品审核状态
       this.getDataList();
    },
  }
}
</script>
<style lang="scss"  scoped>
@import "@/element-ui/theme-variables.scss";
 .goodsImg{
      width: 70px;
      height: 70px;
      margin: auto;
      img{
        width:100%;
        height: 100%;
      }
  } 
// 价格
.priceWrap{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  .price1{
    color: $--color-primary;
  }
  div{
    width: 100%;
    text-align: right;
  }
}
.bottomFun{
    display: flex;
    justify-content: space-between;
    align-items: center;
  .bottomFunLeft{
    width: 450px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.towEllipsis{
  text-align: left;
   text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
/deep/.el-input__inner{
    padding-right: 0!important;
}

</style>