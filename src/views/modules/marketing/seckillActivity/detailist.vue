<template>
    <div class="detailListGoodsPages">
        <Bread :breaddata="breaddata" :index="'1'" @changePage="changePage"></Bread>
        <el-form :inline="true" :model="dataForm">
            <el-form-item style="float: right;">
                <el-button @click="removeDatas('',activityId)">批量删除</el-button>
                <el-button type="primary" @click="saveSortList(sortList)">保存排序</el-button>
              <el-button type="primary" @click="addGoods(activityId)" v-if="activityState===0">添加商品</el-button>
            </el-form-item>
        </el-form>
        <el-form :inline="true" :model="sortDataList">
            <el-table
                :data="sortDataList.list"
                v-loading="dataListLoading"
                @selection-change="dataListSelectionChangeHandle"
                border=""
                style="width: 100%"
            >
                <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
                <el-table-column prop="goodsIdJp" label="商品id" width="180" align="center"></el-table-column>
                <el-table-column prop="sort" label="排序" align="center" width="180">
                    <!-- <template slot-scope="scope">
                        <el-form-item prop="sort">
                            <el-input
                                v-model="scope.row.sort"
                                @change="changeSort(scope.row.goodsId,scope.row.sort)"
                                :min="0"
                                type="number"
                            ></el-input>
                        </el-form-item>
                    </template> -->
                    <template slot-scope="scope">
                      <el-input-number v-model="scope.row.sort" :step="1" :min="0" :max="10000000" ></el-input-number>
                    </template>
                </el-table-column>
                <el-table-column prop="goodsName" label="商品名称" align="center"></el-table-column>
                <el-table-column prop="sellPrice" label="销售价格" align="center"></el-table-column>
                <el-table-column prop="activityPrice" label="秒杀价格" width="180" align="center"></el-table-column>
                <el-table-column prop="activityQuantity" label="活动库存" align="center"></el-table-column>
                <el-table-column prop="personLimit" label="每人限购" align="center"></el-table-column>
                <el-table-column prop="address" label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            size="small"
                            @click="lookShow(scope.row.activityId,scope.row.goodsId)"
                        >查看</el-button>
                        <el-button
                            type="text"
                            size="small"
                            @click="removeDatas(scope.row.goodsId,activityId) "
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-form>
        <!-- 分页 -->
        <el-pagination
            @size-change="pageSizeChangeHandle"
            @current-change="pageCurrentChangeHandle"
            :current-page="page"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="limit"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
        <!-- 查看弹框 -->
        <el-dialog :visible.sync="lookVisible" class="editDialog" width="50%">
            <div class="goodsPresent">
                <img
                    :src="goodsInfo.mainImageUrl|| defaultImg" :onerror="defaultImg"
                    alt=""
                >
                <div class="goodsPresentModle">
                    <div class="goodsTitle">{{goodsInfo.name}}</div>
                    <div class="goodsmoney">￥ {{goodsInfo.sellPrice}}</div>
                    <div class="goodsClass">
                        秒杀价格：
                        <span style="color:red">￥{{goodsInfo.activityPrice}}</span>
                    </div>
                </div>
            </div>
            <el-table :data="goodsList" v-loading="dataListLoading" border="" style="width: 100%">
                <el-table-column prop="id" label="skuID" width="180" align="center"></el-table-column>
                <el-table-column prop="specInfo" label="规格" align="center"></el-table-column>
                <el-table-column prop="activityQuantity" label="活动库存" align="center"></el-table-column>
                <el-table-column prop="cartLimit" label="日本限购数量" align="center"></el-table-column>
                <el-table-column prop="personLimit" label="每人限购" align="center"></el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script>
import mixinViewModule from "@/mixins/view-module";
import {
  seckillProPage,
  seckillProDet,
  seckillProRemove,
  seckillSortSave
} from "@/api/api";
import Bread from "@/components/bread";

export default {
  mixins: [mixinViewModule],
  props: ["activityId","activityState"],
  components: { Bread },
  data() {
    return {
      mixinViewModuleOptions: {
        getDataListURL: seckillProPage,
        getDataListIsPage: false,
        exportURL: "/admin-api/store/export",
        deleteURL: "/admin-api/store",
        deleteIsBatch: true,
        limit: 10,
        page: 1
      },
      dataForm: {},
      sortDataList: {},
      breaddata: ["营销管理", "秒杀活动", "查看商品列表"],
      defaultImg: 'this.src="' + require('../../../../assets/img/default.png') + '"' ,//默认图地址
      lookVisible: false, //弹框状态
      buttonStatus: false,
      moneyNum: 99.9,
      goodsInfo: {},
      goodsList: [],
      sortList: [], //修改排序集合
      selDataList: [] //批量操作项
    };
  },
  created() {
    console.log(this.dataForm, "活动id", this.activityId);
    this.getDataList();
    this.demo();
  },
  methods: {
    //保存排序
    saveSortList(){
      let dataArr = [];
      let that = this;
      this.sortDataList.list.forEach((item,index)=>{
        dataArr.push({
          id:item.goodsId,//活动商品id ,
          sort:item.sort,// 排序
        })
      })
      var obj = dataArr
      seckillSortSave(obj).then((res)=>{
        if(res.code==200){
          this.$message.success(res.msg);
          that.getDataList();
        }else{
          this.$message.error(res.msg);
        }
      })
    },
    //保存排序
    // saveSortList(sortList) {
    //   console.log(sortList, "00", sortList.length);
    //   if (sortList.length == 0) {
    //     this.$message({
    //       type: "warning",
    //       message: "请先修改要保存的排序"
    //     });
    //     return false;
    //   }
    //   const activityGoodsUpdateSortDTOList = sortList;
    //   seckillSortSave(activityGoodsUpdateSortDTOList).then(res => {
    //     if (res.code == 200) {
    //       this.$message({
    //         type: "success",
    //         message: res.msg
    //       });
    //       this.getDataList();
    //     } else {
    //       this.$message({
    //         type: "error",
    //         message: res.msg
    //       });
    //       this.getDataList();
    //     }
    //   });
    // },
    //批量选中数据
    dataListSelectionChangeHandle(val) {
      this.selDataList = val;
      console.log(val, "all", this.activityId);
    },
    //批量删除
    removeDatas(id, activityId) {
      var arrId = [];
      if (id == "" && this.selDataList.length == 0) {
        this.$message({
          type: "warning",
          message: "请选择批量删除的数据"
        });
        return false;
      }
      this.selDataList.forEach(function(val, index, arr) {
        arrId.push(val.goodsId);
      });
      var objList = {
        data: {
          goodsIdList: id == "" ? arrId : [id],
          activityId: activityId
        }
      };
      this.$confirm("您确认删除所有选中商品吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          seckillProRemove(objList).then(res => {
            if (res.code == 200) {
              this.$message({
                type: "success",
                message: res.msg
              });
              this.getDataList();
            } else {
              this.$message({
                type: "warning",
                message: res.msg
              });
              this.getDataList();
            }
          });
        })
        .catch(() => {});
    },

    //修改排序
    changeSort(id, sort) {
      console.log("排序", id);
      this.sortList.push({
        id: id,
        sort: sort
      });
      console.log(this.sortList, "保存排序数据");
    },
    //获取商品数据
    getDataList() {
      const params = {
        limit: this.limit,
        page: this.page,
        activityId: this.activityId
      };
      seckillProPage(params).then(res => {
        if (res.code == 200) {
          this.sortDataList = {
            list: res.data.list
          };
          this.total = res.data.total;
        } else {
          console.log("error");
        }
      });
    },
    //回调跳转添加商品页面
    addGoods(id) {
      this.$emit("addlistFun", id);
    },
    //回调返回列表
    changePage() {
      this.$emit("detailshowList");
    },
    lookShow(actId, id) {
      const obj = {
        goodsId: id,
        activityId: actId
      };
      seckillProDet(obj).then(res => {
        if (res.code == 200) {
          this.goodsList = res.data.activityGoodsChoiceSkuVOList;
          this.goodsInfo = res.data;
        } else {
          console.log("error");
        }
      });
      this.lookVisible = true;
    },
    demo() {
      function placeholderPic() {
        var w = document.documentElement.offsetWidth;
        document.documentElement.style.fontSize = w / 20 + "px";
      }
      placeholderPic();
      window.onresize = function() {
        placeholderPic();
      };
    }
  }
};
</script>
<style lang="scss" scoped>
.el-form--inline .el-form-item{margin-right: 0px!important;}
.detailListGoodsPages {
  /deep/.el-input {
    width: 170px;
    height: 40px;
  }
  .editDialog {
    /deep/.el-dialog__body {
      padding-top: 0;
    }
    /deep/.el-form-item {
      margin-bottom: 0 !important;
    }
    .goodsPresent {
      width: 100%;
      display: flex;
      margin-bottom: 20px;
      img {
        width: 110px;
        height: 110px;
        object-fit: contain;
        margin-right: 20px;
      }
      .goodsPresentModle {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 6px 0;
        .goodsmoney {
          color: red;
        }
        .goodsClass {
          width: 100%;
          display: flex;
          align-items: center;
        }
      }
    }
  }
}
/deep/ .el-input-number__decrease, .el-input-number__increase {
  height: 33px!important;
}
/deep/ .el-input-number {
  width: 160px;
}
</style>
