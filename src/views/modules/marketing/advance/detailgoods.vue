<template>
  <div class="detailGoodsPages">
    <Bread :breaddata="breaddata" :index = "'1'" @changePage = "changePage"></Bread>
    <el-form :inline="true" :model="dataForm">
        <el-form-item style="float: right;">
            <el-button>批量删除</el-button>
            <el-button type="primary">保存排序</el-button>
            <el-button type="primary" @click="addGoods(activityId)">添加商品</el-button>
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
		    prop="storeName"
		    label="排序">
		</el-table-column>
        <el-table-column
		    prop="id"
		    label="商品id"
		    width="180">
		</el-table-column>
		<el-table-column
		    prop="storeName"
		    label="商品名称">
		</el-table-column>
        <el-table-column
		    prop="createDate"
		    label="规格">
		</el-table-column>
		<el-table-column
		    prop="gradeName"
		    label="销售价格">
		</el-table-column>
        <el-table-column
            prop="asassa"
            label="活动库存">
        </el-table-column>
        <el-table-column
		    prop="creator"
		    label="日本限购数量">
		</el-table-column>
        <el-table-column
            prop="createDate"
            label="每人限购">
        </el-table-column>
	    <el-table-column
	   		prop="address"
	    	label="操作">
		    <template slot-scope="scope">
		    	<el-button type="text" size="small" @click="lookShow(scope.row.id)">查看</el-button>
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
    <el-dialog
        :visible.sync="lookVisible"
        class="editDialog"
        width="50%">
            <div class="goodsPresent">
                <img src="@/assets/img/avatar.png" alt="" />
                <div class="goodsPresentModle">
                    <div class="goodsTitle">施华洛初恋珍珠耳环</div>
                    <div class="goodsmoney">￥ {{moneyNum}}</div>
                </div>
            </div>
           <!-- scope.$index+1+(parseInt(page)-1)* parseInt(limit) -->
            <el-table
                :data="dataList"
                v-loading="dataListLoading"
                border
                style="width: 100%">
                <el-table-column
                    prop="id"
                    label="skuID"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="storeName"
                    label="规格">
                </el-table-column>
                <el-table-column
                    prop="gradeName"
                    label="销售价格">
                </el-table-column>
                <el-table-column
                    prop="storeName"
                    label="活动库存">
                </el-table-column>
                <el-table-column
                    prop="gradeName"
                    label="日本限购数量">
                </el-table-column>
                <el-table-column
                    prop="createDate"
                    label="每人限购">
                </el-table-column>
            </el-table>
    </el-dialog>
  </div>
</template>

<script>
    import mixinViewModule from '@/mixins/view-module'
    import { businessPageUrl } from '@/api/url'
    import { storeGrade } from '@/api/api'
    import Bread from "@/components/bread";

    export default {
        mixins: [mixinViewModule],
        props:['activityId'],
        components:{ Bread},
        data () {
            return {
                mixinViewModuleOptions: {
                    getDataListURL: businessPageUrl,
                    getDataListIsPage: true,
                    exportURL: '/admin-api/store/export',
                    deleteURL: '/admin-api/store',
                    deleteIsBatch: true,
                },
                dataForm: {},
                breaddata: ["营销管理", "预售活动","查看商品"],
                lookVisible:false,//弹框状态
                buttonStatus:false,
                moneyNum:99.9,
            }
        },
        created(){
            console.log('活动id',this.activityId)
            this.demo();
        },
        methods: {
                //回调跳转添加商品页面
                addGoods(id){
                    this.$emit("addAditFun",id);
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
                lookShow(id){
                    this.lookVisible = true;
                },
                demo(){
                    function placeholderPic(){
                                var w = document.documentElement.offsetWidth;
                                document.documentElement.style.fontSize=w/20+'px';
                            }
                                placeholderPic();
                            window.onresize=function(){
                                placeholderPic();
                            }
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
