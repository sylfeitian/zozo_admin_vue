<template>
  <div class="addGoodsPages">
    <Bread :breaddata="breaddata" :index = "'1'" @changePage = "changePage"></Bread>
    <el-form :inline="true" class="grayLine topGapPadding" :model="dataForm" @keyup.enter.native="getDataList()" >
        <el-form-item label="商品名称：">
            <el-input v-model="dataForm.goodsName" placeholder="请输入商品名称" clearable maxlength="300"></el-input>
        </el-form-item>
        <el-form-item label="选择分类：">
            <!-- <el-input v-model="dataForm.categoryId" placeholder="请输入spu编号" clearable></el-input> -->
            <el-cascader
                        :options="selectCategoryOption"
                        v-model="classList"
                        change-on-select
                        :clearable="true"
                        :props="props"
                        @change="handleChange">
            </el-cascader>
        </el-form-item>
        <el-form-item label="商品货号：">
            <el-input v-model="dataForm.goodsId" placeholder="请输入spu编号" clearable></el-input>
        </el-form-item>
         <el-form-item label="店铺名称：">
            <el-input v-model="dataForm.storeName" placeholder="请输入店铺名称" clearable></el-input>
        </el-form-item>
         <el-form-item label="品牌名称：">
            <el-input v-model="dataForm.brandName" placeholder="请输入品牌名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
            <el-button  class="btn" type="primary" @click="getDataList()">搜索</el-button>
            <el-button class="btn"  type="primary" plain @click="reset()" plain>重置</el-button>
        </el-form-item>
        <br />
        <el-form-item>
            <el-button type="primary" @click="showDetail()">查看商品</el-button>
            <!-- <el-button type="primary"   @click="editGoods('asassasasasasa')">修改</el-button> -->
        </el-form-item>
    </el-form>
    <el-table
	  :data="dataList"
      v-loading="dataListLoading"
      border
	  style="width: 100%">
	    <!-- <el-table-column
	    	type="index"
		    prop="$index"
				align="center"
		    label="序号"
		    width="70">
		    <template slot-scope="scope">
                {{scope.$index+1+(parseInt(page)-1)* parseInt(limit) }}
            </template>
		</el-table-column> -->
		<el-table-column
		    prop="id"
		    label="商品id"
            align="center"
		    width="180">
		</el-table-column>
		<el-table-column
		    prop="goodsName"
		    label="商品名称">
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
		    prop="goodsTypeName"
            align="center"
		    label="所属分类">
		</el-table-column>
		<el-table-column
		    prop="storeName"
            align="center"
		    label="所属店铺"
             width="180">
		</el-table-column>
        <el-table-column
		    prop="brandName"
            align="center"
		    label="品牌">
		</el-table-column>
	    <el-table-column
            align="center"
	    	label="操作">
		    <template slot-scope="scope">
                <!-- activityState ： 0 添加
activityState ： 1 ， selfActivityState 0 冲突
activityState ： 1 ， selfActivityState 1 修改 -->
                <div v-if="scope.row.activityState ==0">
                    <el-button  v-if="scope.row.selfActivityState==1" type="text" size="small" @click="chooseFn(scope.row)" >取消选择</el-button>
                    <el-button v-else type="text" size="small" @click="chooseFn(scope.row)">选择</el-button>
                </div>
                <div  v-else-if="scope.row.activityState ==1">
                    <span v-if="scope.row.selfActivityState ==0">与其他活动冲突</span>
                    <el-button v-if="scope.row.selfActivityState ==1" type="text" size="small" @click="editGoodsSku(scope.row)">修改</el-button>
                </div>
                <span v-else>与其他活动冲突</span>

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

    <editGoodsSku v-if="modelEditSkuVisible" ref="editGoodsSkuCompon"></editGoodsSku>
  </div>
</template>

<script>
    import mixinViewModule from '@/mixins/view-module'
    import { presellActivityGoodsList } from '@/api/url'
    import { storeGrade,getdatacategory} from '@/api/api'
    import Bread from "@/components/bread";
    import editGoodsSku from "./modules/model-eidt-sku.vue"

    export default {
        mixins: [mixinViewModule],
        props:['activityId'],
        components:{
            Bread,
            editGoodsSku
        },
        data () {
            return {
                mixinViewModuleOptions: {
                    getDataListURL: presellActivityGoodsList,
                    activatedIsNeed:false,
                    getDataListIsPage: true,
                    exportURL: '/admin-api/store/export',
                    deleteURL: '/admin-api/store',
                    deleteIsBatch: true,
                },
                dataForm: {
                    goodsName:'',
                    goodsId:'',
                    activityId:'',//活动ID
                    categoryId:'',//分类ID
                    storeName:'',
                    brandName:'',
                },
                breaddata: ["营销管理", "预售活动","添加商品"],
                selectCategoryOption: [],//中国分类id
                classList:[],
                props: {
                    label:'name',
                    value: 'id',
                    children:'list'
                },
                modelEditSkuVisible:false,
                row:'',
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
                    this.getDatacategoryFn();
                },
                getData(){
                    this.page =1;
                    this.getDataList();
                },
                getDatacategoryFn(){
                    //获取中国分类
                    getdatacategory().then((res)=>{
                        if(res.code == 200){
                            console.log(res);
                            this.selectCategoryOption = res.data;
                            this.selectCategoryOption.forEach((item,index)=>{
                                // item.label = item.name
                                // item.value = item.id
                                item.list && item.list.forEach((item2,index2)=>{
                                    // item2.label = item2.name
                                    // item2.value = item2.id
                                    item2.list="";
                                })
                            })
                        }else{
                            this.$message(res.msg);
                        }
                    }).catch(()=>{
                        this.$message("服务器错误");
                    })
                },
                 // 切换中国分类
                handleChange(){
                    if(this.classList.length!=0){
                        this.dataForm.categoryId = this.classList[this.classList.length-1]
                    }else{
                    this.dataForm.categoryId = "";//分类id

                    }
                    console.log(this.dataFormShow.categoryId)
                },
                //回调跳转查看商品页面
                showDetail(){
                    this.$emit("showDetail",this.row);
                    // this.$router.push({'name': 'marketing-coupon',})
                },
                //重置
                reset() {
                    this.dataForm.goodsName = ""
                    this.dataForm.goodsId = ""
                    this.dataForm.activityId = ""
                    this.dataForm.categoryId = ""
                    this.dataForm.storeName = ""
                    this.dataForm.brandName = ""
                    this.classList = ""
                    this.getData();
                },
                //回调返回列表
                changePage(){
                    this.$emit('addGoodsActivity')
                },
                // 选择或取消选择
                chooseFn(row){
                     this.modelEditSkuVisible = true;
                    this.$nextTick(()=>{
                        this.$refs.editGoodsSkuCompon.init(this.row,row,"choose");
                    })
                },
                //弹出修改弹框
                editGoodsSku(row){
                    this.modelEditSkuVisible = true;
                    this.$nextTick(()=>{
                        this.$refs.editGoodsSkuCompon.init(this.row,row,"edit");
                    })
                },
                noCheck(){
                    this.editVisible = false;
                },
                subEdit(){
                    this.editVisible = false;
                },
        }
    };
</script>
<style lang="scss">
    .addGoodsPages{
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
