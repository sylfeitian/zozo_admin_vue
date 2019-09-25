<template>
  <div class="detailGoodsPages">
    <Bread :breaddata="breaddata" :index = "'1'" @changePage = "changePage"></Bread>
    <el-form :inline="true" :model="dataForm">
        <el-form-item style="float: right;">
            <el-button>批量删除</el-button>
            <el-button type="primary">保存排序</el-button>
            <el-button type="primary" @click="addGoods()">添加商品</el-button>
            <!-- <el-button type="primary"   @click="lookShow('asassasasasasa')">修改</el-button> -->
        </el-form-item>
    </el-form>
    <el-table
	  :data="dataList"
      v-loading="dataListLoading"
      @selection-change="dataListSelectionChangeHandle"
      border
	  style="width: 100%">
        <el-table-column 
            type="selection" 
            header-align="center" 
            align="center" 
            width="50">
        </el-table-column>
		
        <el-table-column
		    prop="sort"
            align="center"
		    label="排序">
		</el-table-column>
        <el-table-column
		    prop="goodsId"
            align="center"
		    label="商品id"
		    width="180">
		</el-table-column>
		<el-table-column
		    prop="name"
		    label="商品名称">
		</el-table-column>
        <el-table-column
		    prop="isAllCheck"
            align="center"
		    label="规格">
            <template slot-scope="scope">
                <el-button  v-if="scope.row.isAllCheck==0" type="text" size="small" @click="lookShow(scope.row)">部分规格</el-button>
                <el-button v-else-if="scope.row.isAllCheck==1" type="text" size="small" @click="lookShow(scope.row)">部分规格</el-button>
		    </template>
		</el-table-column>
		<el-table-column
		    prop="sellPrice"
            align="center"
		    label="销售价格">
            <template slot-scope="scope">
		    	<span>￥{{scope.row.sellPrice?scope.row.sellPrice:'0.00'}}</span>
		    </template>
		</el-table-column>
        <el-table-column
            prop="activityQuantity"
            align="center"
            label="活动库存">
        </el-table-column>
        <el-table-column
		    prop="cartLimit"
             align="center"
		    label="日本限购数量">
		</el-table-column>
        <el-table-column
            prop="personLimit"
             align="center"
            label="每人限购">
        </el-table-column>
	    <el-table-column
            align="center"
	    	label="操作">
		    <template slot-scope="scope">
		    	<el-button type="text" size="small">删除</el-button>
		    </template>
	  	</el-table-column>
	</el-table>
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


    <!-- 查看弹框 -->
    <showGoodsSku v-if="modelShowSkuVisible" ref="showGoodsSkuCompon"></showGoodsSku>
  </div>
</template>

<script>
    import mixinViewModule from '@/mixins/view-module'
    import { limitActivityReleGoodsList } from '@/api/url'
    import { storeGrade } from '@/api/api'
    import Bread from "@/components/bread";
    import showGoodsSku from "./modules/model-show-sku.vue"

    export default {
        mixins: [mixinViewModule],
        components:{ 
            Bread,
            showGoodsSku
        },
        data () {
            return {
                modelShowSkuVisible:false,
                mixinViewModuleOptions: {
                    getDataListURL: limitActivityReleGoodsList,
                    activatedIsNeed:false,
                    getDataListIsPage: true,
                    exportURL: '/admin-api/store/export',
                    deleteURL: '/admin-api/store',
                    deleteIsBatch: true,
                },
                dataForm: {
                    activityId:"",
                },
                breaddata: ["营销管理", "限量活动","查看商品"],
                buttonStatus:false,
                moneyNum:99.9,
            }
        },
        created(){
        },
        methods: {
                init(row){
                    this.row = row;
                    console.log(row);
                    this.dataForm.activityId = this.row.id;
                    this.getData();
                    // this.getDatacategoryFn();
                },
                getData(){
                    this.page =1;
                    this.getDataList();
                },
                //回调跳转添加商品页面
                addGoods(){
                    this.$emit("addAditFun",this.row);
                },
                lookShow(row){
                    this.modelShowSkuVisible = true;
                    this.$nextTick(()=>{
                        this.$refs.showGoodsSkuCompon.init(this.row,row);
                    })
                },
                //重置
                reset() {
                    this.dataForm = {};
                    this.getDataList();
                },
                //回调返回列表
                changePage(){
                    this.$emit('detailno')
                },
        }
    };
</script>
<style lang="scss">
    .detailGoodsPages{
        /deep/.el-input {
            width: 170px;
            height: 40px;
        }
        .editDialog{
            /deep/.el-dialog__body{
                padding-top: 0;
            }
            /deep/.el-form-item{
                margin-bottom: 0 !important;
            }
            .goodsPresent{
                width: 100%;
                display: flex;
                margin-bottom: 20px;
                img{
                    width: 110px;
                    height: 110px;
                    object-fit: contain;
                    margin-right: 20px;
                }
                .goodsPresentModle{
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    padding: 6px 0;
                    .goodsmoney{
                        color:red;
                        margin-top: 26px;
                    }
                }
            }
        }
    }
        
</style>
