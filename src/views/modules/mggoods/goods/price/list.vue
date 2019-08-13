<template>
  <div>
    <!-- <el-breadcrumb separator="/">
		  <el-breadcrumb-item :to="{ path: '/' }">商品</el-breadcrumb-item>
		  <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
		  <el-breadcrumb-item>商品列表</el-breadcrumb-item>
		</el-breadcrumb> -->
    <div style="display:flex;justify-content: space-between">
      <Bread  :breaddata="breaddata"></Bread>
      <el-button type="primary" @click="showLogListFn">修改记录</el-button>
    </div>
    <!--      <el-tabs v-model="activeName" @tab-click="handleClick" class="botttomGapPadding">-->
    <!--        <el-tab-pane label="全部" name="first">-->
    <!--          <listItem :dataForm="dataForm" ref="firstList" @showLogListFn="showLogListFn"></listItem>-->
    <!--        </el-tab-pane>-->
    <!--        <el-tab-pane label="上架" name="second">-->
    <!--          <listItem :dataForm="dataForm"  ref="secondList" @showLogListFn="showLogListFn"></listItem>-->
    <!--        </el-tab-pane>-->
    <!--        <el-tab-pane  label="下架" name="third">-->
    <!--          <listItem :dataForm="dataForm" ref="thirdList" @showLogListFn="showLogListFn"></listItem>-->
    <!--        </el-tab-pane>-->
    <!--        <el-tab-pane  label="未上架" name="four">-->
    <!--          <listItem :dataForm="dataForm" ref="fourList" @showLogListFn="showLogListFn"></listItem>-->
    <!--        </el-tab-pane>-->
    <!--     </el-tabs>-->
    <el-radio-group v-model="activeName" @change="handleClick">
      <el-radio-button label="">全部</el-radio-button>
      <el-radio-button label="upper">上架</el-radio-button>
      <el-radio-button label="lower">下架</el-radio-button>
      <el-radio-button label="not">未上架</el-radio-button>
    </el-radio-group>
    <el-table
            width="100%"
            :data="dataList"
            border
            v-loading="dataListLoading"
            style="width: 100%"
            @selection-change="dataListSelectionChangeHandle"
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
              prop="id"
              label="spu"
              width="180"
              align="center">
      </el-table-column>

      <el-table-column
              label="图片"
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
              width="180"
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
              label="价格"
              align="center">
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
      </el-table-column>

      <el-table-column
              prop="storeName"
              label="店铺名称"
              align="center">
      </el-table-column>

      <el-table-column
              label="操作"
              align="center"
      >
        <template slot-scope="scope">
          <el-button @click.native.prevent="addOrEditHandle(scope.$index, scope.row)"type="text"size="mini">改价</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
            :current-page="page"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="limit"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="pageSizeChangeHandle"
            @current-change="pageCurrentChangeHandle">
    </el-pagination>

    <!-- 弹窗, 新建 -->
    <addEditData  v-if="addEditDataVisible" ref="addEditData" @searchDataList="getDataList"></addEditData>
  </div>
</template>

<script>

  import Bread from "@/components/bread";
  import listItem from "./listItem.vue"
  import { setTimeout } from 'timers';
  import mixinViewModule from '@/mixins/view-module'
  import { goodsPageUrl } from '@/api/url'
  // import { deletepriceLogUrl } from '@/api/url'
  import addEditData from './model-add-edit-data'
  export default {
    mixins: [mixinViewModule],
    data () {
      return {
        mixinViewModuleOptions: {
          getDataListURL: goodsPageUrl,
          activatedIsNeed:false,
          getDataListIsPage: true,
          // exportURL: '/admin-api/log/login/export',
          // deleteURL: deletepriceLogUrl,
          // deleteIsBatch: true,
          // deleteIsBatchKey: 'id'
        },
        addEditDataVisible:false,
        breaddata: ["商品", "商品管理", "价格管理"],
        dataForm: {
          goodsShow:"",//上下架状态:0下架;1上架
        },
        activeName: "",
      };
    },
    components: {
      Bread,
      listItem,
      addEditData
    },
    created() {
      // 第一次请求数据
      this.handleClick();
    },
    methods: {
      handleClick(tab) {
        if(tab== ""){
          this.dataForm.goodsShow = ""
        }else if(tab== "upper"){
          this.dataForm.goodsShow = "1"
        }else if(tab== "lower"){
          this.dataForm.goodsShow = "0"
        }else if(tab== "not"){
          this.dataForm.goodsShow = "2"
        }
        this.getDataList();
      },
      // reset() {
      //   this.dataForm.goodsShow = "";//商品名称/商品货号
      // },
      showLogListFn(){
        this.$emit("showLogListFn");
      },
      addOrEditHandle(index=-1,row=""){
        this.setAddEditDataVisible(true);
        this.$nextTick(() => {
          this.$refs.addEditData.init(row)
        })
      },
      setAddEditDataVisible(boolargu){
        this.addEditDataVisible =  boolargu;
      },
      // 重置
      reset(){
        this.dataForm.attrName = "";
      }
    }
  };
</script>
<style lang="scss" scoped>
  @import "@/element-ui/theme-variables.scss";
  /* .el-scrollbar__wrap {
    overflow-x: hidden;
  } */
  .el-popper {
    left: 292px !important;
  }
  .el-table--border {
    margin-top: 20px;
  }
  .el-radio-group {
    margin-top: 20px;
  }
  .orderUerInfo {
    width: 100%;
    height: auto;
    margin-top: 20px;
    border: 1px solid #d1d1d1;
  }
  .el-scrollbar .el-scrollbar__wrap .el-scrollbar__view {
    white-space: nowrap;
  }
  .el-form--inline .el-form-item {
    margin-right: 76px;
  }
  *::-webkit-scrollbar {
    width: 7px;
    height: 1px;
    background-color: transparent;
  } /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
  *::-webkit-scrollbar-track {
    background-color: #f0f6ff;
  } /*定义滚动条轨道 内阴影+圆角*/
  *::-webkit-scrollbar-thumb {
    background-color: #e3e4e4;
    border-radius: 6px;
  } /*定义滑块 内阴影+圆角*/
  .scrollbarHide::-webkit-scrollbar {
    display: none;
  }
  .scrollbarShow::-webkit-scrollbar {
    display: block;
  }

  .el-button {

  }
  .el-input {
    width: 170px;
    height: 40px;
  }
  /deep/ .el-tabs__nav-wrap {
    border-bottom: 2px #efefef dotted;
    &::after {
      content: unset;
    }
  }
  /deep/ .el-tabs__nav-scroll {
    height: 60px;
    line-height: 60px;
    /deep/ .el-tabs__item {
      width: 120px;
      // box-sizing: border-box;
      text-align: center;
    }
  }
  /deep/ .el-tabs__active-bar {
    // width: 120px !important;
  }
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
  .grayBtn {
  }
</style>
