<template>
  <div>
      <Bread  :breaddata="breaddata"  @changePage="changePage"  :index="'2'" ></Bread>
      <el-table
        width="100%"
        :data="dataList"
        border
        v-loading="dataListLoading"
        style="width: 100%"
        >  
        <el-table-column
          label="序号"
          width="70"
          align="center">
            <template slot-scope="scope">
              {{scope.$index+1+(parseInt(page)-1)* parseInt(limit) }}
            </template>
        </el-table-column>
        
        <el-table-column
		      prop="sku"
		      label="SKU"
          width="120"
		      align="center">
		    </el-table-column>

        <el-table-column
		      prop="updater"
		      label="修改人"
		      align="center">
		    </el-table-column>

        <el-table-column
		      prop="goodsName"
		      label="商品名称"
          width="180"
		      align="center">
		    </el-table-column>

        <el-table-column
		      prop="brandName"
		      label="品牌"
		      align="center">
		    </el-table-column>

        <el-table-column
		      label="价格修改前（销售价\成本价）"
          width="220"
		      align="center">
              <template slot-scope="scope">
                <div class="priceWrap">  
                    <div class="price1">￥{{scope.row.beforeCostPrice}}</div>
                    <div class="price2">￥{{scope.row.beforeMarketPrice}}</div>
                </div>
              </template>
		    </el-table-column>

        <el-table-column
        width="220"
		      label="价格修改后（销售价\成本价）"
		      align="center">
             <template slot-scope="scope">
                <div class="priceWrap">  
                    <div class="price1">￥{{scope.row.afterCostPrice}}</div>
                    <div class="price2">￥{{scope.row.afterMarketPrice}}</div>
                </div>
              </template>
		    </el-table-column>

        <el-table-column
		      prop="storeName"
		      label="店铺名称"
		      align="center">
		    </el-table-column>

        <el-table-column
		      prop="updateDate"
          width="180"
		      label="修改时间"
		      align="center">
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
import mixinViewModule from '@/mixins/view-module'


import addEditData from './model-add-edit-data'
import { priceLogPageUrl } from '@/api/url'
  // import { deletepriceLogUrl } from '@/api/url'
import Bread from "@/components/bread";

export default {
  mixins: [mixinViewModule],
  data () {
    return {
       breaddata: ["商品", "商品管理", "价格管理","修改记录"],
    mixinViewModuleOptions: {
      activatedIsNeed: false, 
      getDataListURL: priceLogPageUrl,
      getDataListIsPage: true,
      // exportURL: '/admin-api/log/login/export',
      // deleteURL: deletepriceLogUrl,
      // deleteIsBatch: true,
      // deleteIsBatchKey: 'id'
    },
    addEditDataVisible:false,
    dataForm:{},
    }
  },
  components: {
    addEditData,
    Bread
  },
  created () {
  },
  mounted(){
  },
  methods: {
    init(){
      this.getDataList();
    },
    // 新建和编辑
    addOrEditHandle(index=-1,row=""){
       this.setAddEditDataVisible(true);
        this.$nextTick(() => {
          this.$refs.addEditData.init(row)
        })
    },
    setAddEditDataVisible(boolargu){
      this.addEditDataVisible =  boolargu;
    },
    changePage(){
      this.$emit("showListFn");
    },
    // 重置
    reset(){
        this.dataForm.attrName = "";
    },
  }
}
</script>
<style lang="scss"  scoped>
@import "@/element-ui/theme-variables.scss";    
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
</style>
