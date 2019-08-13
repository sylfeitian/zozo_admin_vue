<template>
  <div>
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
		      label="商品"
		      align="center"
           width="330">
            <template slot-scope="scope">
              <div class="goodsPropsWrap">
                  <div class="goodsImg">
                    <img :src="scope.row.pictureUrl | filterImgUrl" alt=""/>
                  </div>
                  <div class="goodsProps">
                      <span class="goodsName">
                            <label class="goodsNameTitle">名称:</label>
                            <el-tooltip class="item" effect="dark" :content="scope.row.goodsName" placement="top-start">
                                  <a class="goodsNameContent" :href="scope.row.id | filterhrefUrl"  target="view_window">{{scope.row.goodsName}}</a>
                            </el-tooltip>
                      </span>
                     <span  class="goodsBrand">
                         <label class="goodsNameTitle">品牌:</label>
                         <span class="goodsBrandName">{{scope.row.brandName}}</span>
                      </span>
                     <span class="goodsNum">
                        <label class="goodsNameTitle">编号:</label>
                        <span class="goodsBrandName">{{scope.row.goodsSerial}}</span>
                      </span>
                  </div>
              </div>
            </template>
		    </el-table-column>

        <el-table-column
		      prop="price"
		      label="价格(销售价/成本价)"
          width="170"
		      align="right">
            <template slot-scope="scope">
              <div class="priceWrap">  
                  <div class="price1">￥{{scope.row.specSellPrice}}</div>
                  <div class="price2">￥{{scope.row.specCostPrice}}</div>
              </div>
            </template>
		    </el-table-column>

        <el-table-column
		      prop="createDate"
		      label="创建时间"
          width="180"
		      align="center">
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
		      >
            <template slot-scope="scope">
			        <el-button @click="goEidt(scope.row)" type="text" size="mini">编辑</el-button>
              <el-button  @click="cotrolGoodsShow('singe',scope.row)" type="text" size="mini" >
                  <span  v-if="scope.row.goodsShow==0 || scope.row.goodsShow==2">上架</span>
                  <span  v-if="scope.row.goodsShow==1" class="artclose">下架</span>
                  <!-- <span  v-if="scope.row.goodsShow==2"   style="color:#FF0000">未上架</span> -->
              </el-button>
              <el-button  @click="editSku(scope.row)" type="text" size="mini">SKU</el-button>
              <!-- <div class="btnWrap" >
                <div  class="editWrap" @click="goEidt(scope.row)">
                    <svg class="icon-svg btsvg" aria-hidden="true"><use xlink:href="#icon-edit-square"></use></svg>
                    <span>编辑</span>
                </div>

                <div class="upDownWrap" @click="cotrolGoodsShow('singe',scope.row)">
                    <span v-if="scope.row.goodsShow==0" style="color:#0B9D27;" >
                        <svg class="icon-svg btsvg" aria-hidden="true"><use xlink:href="#icon-vertical-align-top"></use></svg>
                        <span>上架</span>
                    </span>
                    <span v-else-if="scope.row.goodsShow==1"  style="color:#FF0000" >
                        <svg class="icon-svg btsvg" aria-hidden="true"><use xlink:href="#icon-vertical-align-botto"></use></svg>
                        <span>下架</span>
                    </span>
                    <span v-else-if="scope.row.goodsShow==2"  style="color:#FF0000" >
                        <svg class="icon-svg btsvg" aria-hidden="true"><use xlink:href="#icon-vertical-align-botto"></use></svg>
                        <span>未上架</span>
                    </span>
                </div>

                <div  class="skuWrap" @click="editSku(scope.row)">
                  <svg class="icon-svg btsvg" aria-hidden="true"><use xlink:href="#icon-unorderedlist"></use></svg>
                  <span>SKU</span>
                </div>
              </div> -->
			      </template>
		    </el-table-column>
	  </el-table>
    <div  class="bottomFun"> 
        <div class="bottomFunLeft">
            <!-- <el-checkbox v-model="checked" @change="change">全选</el-checkbox> -->
           <div class="grayBtnWarp">
              <el-button type="primary" plain @click="cotrolGoodsShow('batch',1)">上架</el-button>
              <el-button type="info" plain @click="cotrolGoodsShow('batch',0)">下架</el-button>
              <!-- <el-button type="danger" plain @click="deleteHandle()">删除</el-button> -->
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
  </div>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'

import { showBatchGoods } from '@/api/api'
import { goodsPageUrl,deleteGoodsUrl } from '@/api/url'

export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
          getDataListURL: goodsPageUrl,
          activatedIsNeed:false,
          getDataListIsPage: true,
          // exportURL: '/admin-api/log/login/export',
          deleteURL: deleteGoodsUrl,
          deleteIsBatch: true,
          deleteIsBatchKey: 'id'
      },
      checked:false,
      multipleSelection:[],
      dataForm:{},
    }
  },
  created () {
  },
  methods: {
    init(dataForm){
        Object.assign(this.dataForm,dataForm)
        this.getDataList();
    },
    reset () {

    },
    editRow(){
      
    },
    change(tab){
        console.log(tab);
    },
    handleSelectionChange(val){
      this.multipleSelection = val;
       this.dataListSelectionChangeHandle(val);
    },
    getIds(){
      var ids= [];
      console.log(this.multipleSelection);
      this.multipleSelection.forEach((item,index)=>{
          if("object" == typeof(item)){
            ids.push(item.id);
          }else{
            ids.push(id);
          }
      })
      return ids;
    },
    // 编辑
    goEidt(row){
        console.log(row);
        this.$router.push({ 
          path: 'mggoods-goods-add',
          query:{
            gcId:row.id,
          }
        })
    },
    // 控制上下架
    cotrolGoodsShow(type,rowOrstatus){
        var ids= [];
        var goodsShow = 0;
        if(type=="batch"){ //批量
          if(this.multipleSelection.length==0){
            this.$message({
              message: "请选择商品",
              type:"warning",
              duration: 1500,
            })
            return;
          }
          ids = this.getIds();
          goodsShow = rowOrstatus
        }else{ //单个
          ids = [rowOrstatus.id]
          goodsShow = rowOrstatus.goodsShow==1?0:1;
        }

        // if(ids.length==0){
        //    this.$message({
        //       message: "请先选择商品",
        //       type: 'warning',
        //       duration: 500
        //     })
        //     return;
        // }
        var obj = {
            ids:ids,
            goodsShow:goodsShow,
        }
        showBatchGoods(obj).then(res=>{
            let status="";
            let msg = "";
            if(res.code=="200"){
              status= "success"
              msg = goodsShow==1?"商品上架成功":"商品下架成功"
              this.getDataList();
            }else{
               status= "error"
                msg = res.msg;
            }
            this.$message({
               message: msg,
              type:status,
              duration: 1500,
            })
        })
    },
    // 
    editSku(row){
        this.$emit("showSkuListFn",row)
    }
      
  }
}
</script>
<style lang="scss"  scoped>
@import "@/element-ui/theme-variables.scss";
// 表头背景和字体颜色
/deep/ .el-table__header  th{
  background:#f5f7fa;
}
// 勾选表格复选框居中
/deep/ tr .cell{
    display: flex;
    justify-content: center
}
// 表内字体默认颜色
/deep/ .el-table__row{
 color: #999999FF;
 font-size: 14px;
}

// 复选框颜色改正
/deep/ .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner{
    // background-color: #666666 !important;
    // border-color: #666666 !important;
}
// 表格内部纵向分割线颜色
.el-table--border td, .el-table--border th, .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed{
      border-right: 1px solid white;
}
// 商品 
.goodsPropsWrap{
  margin: auto;
  height: 110px;
  width: 330px;
    display: flex;
  justify-content: space-around;
  align-items: center;
  .goodsImg{
      width: 70px;
      height: 70px;
      img{
        width:100%;
        height: 100%;
      }
  }
   .goodsProps{
      width: 210px;
      height: 70px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      color: #999999;
      .goodsNameTitle{
          display: inline-block;
          width: 50px;
           color: #666666FF;
      }
      .goodsBrandName{
        text-align: left;
      }
      .goodsName{
          display: flex;
        .goodsNameContent{
          width: 150px;
          text-align: left;
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      
      }
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

// 分类


// 店铺名称

// 操作
.btnWrap{
    display: flex;
    justify-content: space-around;
    align-items: center;
    .editWrap{
       cursor: pointer;
    }
  .skuWrap{
    cursor: pointer;
  }
  .btsvg{
    margin-right: 3px;
  }
}
.el-table__row:hover {
  .editWrap,.skuWrap{
    color: #2260D2; 
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


</style>
