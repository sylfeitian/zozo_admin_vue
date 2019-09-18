<template>
  <div class="addGoodsPages">
    <Bread :breaddata="breaddata" :index = "'1'" @changePage = "changePage"></Bread>
    <el-form :inline="true" class="grayLine topGapPadding" :model="dataForm" @keyup.enter.native="getDataList()" >
        <el-form-item label="商品名称：">
            <el-input v-model="dataForm.storeId" placeholder="请输入商品名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="商品货号：">
            <el-input v-model="dataForm.storeId" placeholder="请输入spu编号" clearable></el-input>
        </el-form-item>
         <el-form-item label="店铺名称：">
            <el-input v-model="dataForm.storeId" placeholder="请输入店铺名称" clearable></el-input>
        </el-form-item>
         <el-form-item label="品牌名称：">
            <el-input v-model="dataForm.storeId" placeholder="请输入品牌名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
            <el-button  class="btn" type="primary" @click="getDataList()">搜索</el-button>
            <el-button class="btn"  type="primary" plain @click="reset()" plain>重置</el-button>
        </el-form-item>
        <br />
        <el-form-item>
            <el-button type="primary" @click="showDetail(activityId)">查看商品</el-button>
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
		    width="180">
		</el-table-column>
		<el-table-column
		    prop="storeName"
		    label="商品名称">
		</el-table-column>
		<el-table-column
		    prop="account"
		    label="销售价格">
		</el-table-column>
		<el-table-column
		    prop="gradeName"
		    label="所属分类">
		</el-table-column>
		<el-table-column
		    prop="createDate"
		    label="所属店铺"
             width="180">
		</el-table-column>
        <el-table-column
		    prop="creator"
		    label="品牌">
		</el-table-column>
	    <el-table-column
	   		prop="address"
	    	label="操作">
		    <template slot-scope="scope">
		    	<el-button type="text" size="small">取消选择</el-button>
		    	<el-button type="text" size="small" @click="editGoods(scope.row.id)">修改</el-button>
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



    <!-- 修改弹框 -->
    <el-dialog
        :visible.sync="editVisible"
        :close-on-click-modal = "false"
        :show-close = "false"
        class="editDialog"
        width="70%">
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
                label="活动库存">
                <template slot-scope="scope">
                        <el-input v-model="kucun" :maxlength="6" type="number"></el-input>
                </template>
            </el-table-column>
            <el-table-column
                prop="gradeName"
                label="日本限购数量">
            </el-table-column>
            <el-table-column
                prop="createDate"
                label="每人限购"
                width="180">
                <template slot-scope="scope">
                        <el-input v-model="kucun" :maxlength="6" type="number"></el-input>
                </template>
            </el-table-column>
            <el-table-column
                prop="address"
                label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small">适用于全部规格</el-button>
                </template>
            </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
            <el-button @click="noCheck('editDataForm')">取 消</el-button>
            <el-button type="primary" @click="subEdit('editDataForm')" :loading="buttonStatus">确 定</el-button>
        </span>
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
                breaddata: ["营销管理", "预售活动","添加商品"],
                editVisible:false,//弹框状态
                buttonStatus:false,
                moneyNum:99.9,
                kucun:'',
            }
        },
        created(){
            console.log('活动id',this.activityId)
            this.demo();
        },
        methods: {
                //回调跳转查看商品页面
                showDetail(id){
                    this.$emit("showDetail",id);
                    // this.$router.push({'name': 'marketing-coupon',})
                },
                //重置
                reset() {
                    this.dataForm = {};
                    this.getDataList();
                },
                //回调返回列表
                changePage(){
                    this.$emit('addGoodsActivity')
                },
                //弹出修改弹框
                editGoods(id){
                    this.editVisible = true;
                },
                noCheck(){
                    this.editVisible = false;
                },
                subEdit(){
                    this.editVisible = false;
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
