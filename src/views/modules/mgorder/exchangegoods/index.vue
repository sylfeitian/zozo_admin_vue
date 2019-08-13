<template>
  <div v-if="isExchange">
    <Bread :breaddata="breaddata"></Bread>
    <el-form
      :inline="true"
      ref="dataForm"
      class="grayLine topGapPadding"
      :model="dataForm"
      @keyup.enter.native="getDataList()"
    >
      <el-form-item label="退货单号：" prop="aftersaleSn">
        <el-input v-model="dataForm.aftersaleSn" placeholder="换货单号" clearable></el-input>
      </el-form-item>
      <el-form-item label="商品货号：" prop="specSerial">
        <el-input v-model="dataForm.specSerial" placeholder="商品货号" clearable></el-input>
      </el-form-item>
      <el-form-item label="商品名称：" prop="storeName">
        <el-input v-model="dataForm.storeName" placeholder="商品名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="用户名称：" prop="memberName">
        <el-input v-model="dataForm.memberName" placeholder="用户名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="商户ID/名称：" prop="goodsName">
        <el-input v-model="dataForm.goodsName" placeholder="商户ID/名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="活动时间：">
        <el-date-picker
          v-model="timeArr"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          align="left"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button class="btn" type="primary" @click="getData()">查询</el-button>
        <el-button class="btn" type="primary" plain @click="reset()">重置</el-button>
      </el-form-item>
    </el-form>
    <el-radio-group v-model="radio1" @change="agreeChange">
      <el-radio-button :label="item.id" v-for="(item,index) in status" :key="item.id">{{item.title}}</el-radio-button>
    </el-radio-group>
    <el-table
      width="100%"
      :data="dataList"
      border=""
      v-loading="dataListLoading"
      style="width: 100%,maigin-top:20px;"
    >
      <el-table-column type="index" prop="$index" label="序号" align="center" width="70">
        <template slot-scope="scope">{{scope.$index+1+(parseInt(page)-1)* parseInt(limit) }}</template>
      </el-table-column>
      <el-table-column prop="aftersaleSn" label="换货单号" align="center"></el-table-column>
      <el-table-column prop="specSerial" label="商品货号" align="center"></el-table-column>
      <el-table-column prop="goodsName" label="商品名称" align="center"></el-table-column>
      <el-table-column prop="memberName" label="用户名" align="center"></el-table-column>
      <el-table-column prop="createDate" label="申请时间" align="center"></el-table-column>
      <el-table-column
        prop="aftersaleStatus"
        v-if="changeVal==''"
        label="换货状态"
        align="center"
        :formatter="statusRules"
      ></el-table-column>
      <el-table-column prop="aftersaleStatus" v-if="changeVal=='1'" label="商家审核状态" align="center"></el-table-column>
      <el-table-column prop="aftersaleStatus" v-if="changeVal=='1'" label="平台审核状态" align="center"></el-table-column>
      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="handleGoodDet(scope.row.aftersaleSn)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="pageSizeChangeHandle"
      @current-change="pageCurrentChangeHandle"
      :current-page="page"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="limit"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
  </div>
  <div v-else>
    <Bread :breaddata="detdata" @changePage="changePage" :index="'2'"></Bread>
    <div class="orderState">
      <div>
        当前换货状态：
        <span>{{barinfor.aftersaleStatus==1?'用户取消':barinfor.aftersaleStatus==2?'退款失败':barinfor.aftersaleStatus==3?'待退货入库':barinfor.aftersaleStatus==4?'退款中':barinfor.aftersaleStatus==5?'退款成功':barinfor.aftersaleStatus==6?'换货失败':barinfor.aftersaleStatus==7?'待换货入库':barinfor.aftersaleStatus==8?'换货出库中':'换货成功'}}</span>
      </div>
      <div>
        换货单号：
        <span class="nums">{{aftersale.aftersaleSn}}</span>
      </div>
      <div>
        订单编号：
        <span class="nums">{{aftersale.orderSn}}</span>
      </div>
    </div>
    <div class="buyerInfo">
      <p>买家换货申请</p>
      <div>
        <span class="inforTit">买家</span>
        <span class="inforRight">{{aftersale.contacts}}</span>
      </div>
      <div>
        <span class="inforTit">电话</span>
        <span class="inforRight">{{aftersale.contactsPhone}}</span>
      </div>
      <div>
        <span class="inforTit">申请时间</span>
        <span class="inforRight">{{aftersale.createDate}}</span>
      </div>
      <div>
        <span class="inforTit">换货原因</span>
        <span class="inforRight">{{aftersale.aftersaleReason}}</span>
      </div>
      <div>
        <span class="inforTit">换货说明</span>
        <span class="inforRight">{{aftersale.aftersaleExplain}}</span>
      </div>
      <div>
        <span class="inforTit right">换货凭证</span>
        <img class="imglist right" v-for="item in piclist" :src="$imgDomain + item" alt="">
        <!-- <span class="inforRight">待照片</span> -->
      </div>
    </div>
    <div class="sellerInfo">
      <p>商家换货审核</p>
      <div>
        <span class="inforTit">商家名称</span>
        <span class="inforRight">{{aftersale.storeName}}</span>
      </div>
      <div>
        <span class="inforTit">审核时间</span>
        <span class="inforRight">{{aftersale.createDate}}</span>
      </div>
      <div>
        <span class="inforTit">审核理由</span>
        <span class="inforRight">{{saleAuditLog==""?"":saleAuditLog.reason}}</span>
      </div>
      <div>
        <span class="inforTit">审核结果</span>
        <span class="inforRight">{{saleAuditLog.result==1?'同意':'拒绝'}}</span>
      </div>
    </div>
    <div class="buyerInfo" v-if="adminAuditLog!=''">
      <p>平台换货处理</p>
      <div>
        <span class="inforTit">审核时间</span>
        <span class="inforRight">{{adminAuditLog.createDate}}</span>
      </div>
      <div>
        <span class="inforTit">审核理由</span>
        <span class="inforRight">{{adminAuditLog==''?'':adminAuditLog.reason}}</span>
      </div>
      <div>
        <span class="inforTit">审核结果</span>
        <span class="inforRight">{{adminAuditLog.result==1?'同意':'拒绝'}}</span>
      </div>
    </div>
    <div class="goodsLog">
      <p>退换货物流</p>
      <div>
        <span class="inforTit">换货时间</span>
        <span class="inforRight">{{barinfor.createDate}}</span>
      </div>
      <div>
        <span class="inforTit">换货物流</span>
        <span class="inforRight">{{barinfor.sellerLogisticsCompany}}</span>
      </div>
      <div>
        <span class="inforTit">换货单号</span>
        <span class="inforRight">{{barinfor.aftersaleSn}}</span>
      </div>
    </div>
    <div class="goods">
      <p>换货商品</p>
      <el-table :data="saleGoods" border="" style="width: 100%">
        <el-table-column prop="goodsName" label="商品名称" width="180" align="center"></el-table-column>
        <el-table-column prop="specSerial" label="商品货号" width="180" align="center" ></el-table-column>
        <el-table-column prop="specName" label="规格" align="center"></el-table-column>
        <el-table-column prop="specSellPrice" label="单价" align="center">
          <template slot-scope="scope">￥{{scope.row.specSellPrice.toFixed(2)}}</template>
        </el-table-column>
        <el-table-column prop="goodsNum" label="数量" align="center"></el-table-column>
        <el-table-column prop="specPayPrice" label="总价" align="center">
          <template slot-scope="scope">￥{{scope.row.specPayPrice.toFixed(2)}}</template>
        </el-table-column>
      </el-table>
    </div>
    <div class="operationList">
      <p>操作日志</p>
      <p v-for="item in logList">
        {{item.updateDate}}
        <span class="creater">{{item.updater}}</span>
        {{item.message}}
      </p>
    </div>
  </div>
</template>
<script>
import Bread from "@/components/bread";
import { exchangegoods } from "@/api/url";
import { exchDetail } from "@/api/api";
import mixinViewModule from "@/mixins/view-module";
export default {
  mixins: [mixinViewModule],
  data() {
    return {
      mixinViewModuleOptions: {
        getDataListURL: exchangegoods,
        getDataListIsPage: true,
        // exportURL: '/admin-api/log/login/export',
        // deleteURL: deleteAttributeUrl,
        deleteIsBatch: true,
        deleteIsBatchKey: "id"
      },
      isExchange: true,
      breaddata: ["订单系统", "售后管理", "换货管理"],
      detdata: ["订单系统", "售后管理", "换货管理", "换货详情"],
      status: [
        { title: "所有换货订单", id: "" },
        { title: "待换货入库", id: "7" },
        { title: "换货出库中", id: "8" },
        { title: "换货成功", id: "9" },
        { title: "用户取消", id: "1" }
      ],
      tableData: [],
      timeArr: "", //活动时间
      dataForm: {
        specSerial: "",
        aftersaleSn: "",
        storeName: "",
        goodsName: "",
        memberName: "",
        endTime: "",
        startTime: ""
      },
      totalPage: 0,
      goodsData: [], //售后商品table
      saleGoods: [], //售后申请数据
      saleAuditLog: [], //售后理由数据-平台审核数据
      data: {}, //总数据
      piclist: [], //凭证图片
      total: 0,
      changeVal: "",
      dataListLoading: false,
      detailOrList: true,
      radio1: "",
      goodsData: "",
      data: [],
      params: {
        currentPage: 1, //当前页数
        currentPageSize: 10 //每页显示的条数
      },
      statusRules: function(row, column) {
        return row.aftersaleStatus == 1 ? (
          <el-tag type="danger">用户取消</el-tag>
        ) : row.aftersaleStatus == 2 ? (
          <el-tag type="info">退款失败</el-tag>
        ) : row.aftersaleStatus == 3 ? (
          <el-tag type="warning">待退货入库</el-tag>
        ) : row.aftersaleStatus == 4 ? (
          <el-tag type="warning">退款中</el-tag>
        ) : row.aftersaleStatus == 5 ? (
          <el-tag type="success">退款成功</el-tag>
        ) : row.aftersaleStatus == 6 ? (
          <el-tag type="info">换货失败</el-tag>
        ) : row.aftersaleStatus == 7 ? (
          <el-tag type="warning">待换货入库</el-tag>
        ) : row.aftersaleStatus == 8 ? (
          <el-tag type="warning">换货出库中</el-tag>
        ) : (
          <el-tag type="success">换货成功</el-tag>
        );
      }
    };
  },
  methods: {
    //筛选订单状态
    agreeChange(val) {
      this.dataForm.page = 1;
      this.dataForm.limit = 10;
       this.params= {
        currentPage: 1, //当前页数
        currentPageSize: 10 //每页显示的条数
      };
      this.changeVal = val;
      this.dataForm.aftersaleStatus = val;
      this.getDataList();
    },
    //条件查询
    getData() {
      this.dataForm.startTime = this.timeArr && this.timeArr[0];
      this.dataForm.endTime = this.timeArr && this.timeArr[1];
      this.getDataList();
    },
    //重置
    reset() {
      this.timeArr = [];
      this.dataForm = {};
      this.getDataList();
    },
    //返回上一级
    changePage() {
      this.isExchange = !this.isExchange;
      this.$emit("showListFn");
    },
    //换货详情
    handleGoodDet(id) {
      const obj = {
        aftersaleSn: id
      };
      exchDetail(obj).then(res => {
        if (res.code == 200) {
          this.data = res.data;
          this.aftersale = res.data.aftersaleApplyDTO;
          this.saleGoods = res.data.aftersaleGoodsDTOList;
           this.barinfor = res.data.aftersaleBarterDTO;
          this.saleAuditLog = res.data.aftersaleAuditLogDTOList[0]; //商家审核数据
          this.adminAuditLog = res.data.aftersaleAuditLogDTOList[1] ||''; //平台审核数据
          this.logList = res.data.aftersaleLogListDTOList;
          this.isExchange = !this.isExchange;
          this.piclist = this.aftersale.aftersalePics.split(",");
        } else {
          this.$message({
            type: "warning",
            message: res.msg
          });
        }
      });
    }
  },
  created() {
    //   this.getDataListURL
  },
  components: { Bread }
};
</script>
<style scoped>
.creater {
  display: inline-block;
  width: 80px;
  margin: 0 15px;
}
.el-table--border {
  margin-top: 20px;
}
.el-radio-group {
  margin-top: 20px;
}
.orderState {
  /* width: 100%; */
  border: 1px solid #d1d1d1;
  height: 80px;
  display: flex;
  align-items: center;
}
.orderState div {
  margin-left: 5%;
}
.orderState div .nums {
  color: red;
}
.buyerInfo {
  flex-direction: column;
}
.buyerInfo,
.sellerInfo,
.buyerInfo,
.goodsLog,
.goods,
.operationList {
  border: 1px solid #e1e1e1;
  margin-top: 10px;
  padding: 10px 10px 20px 10px;
}
.inforTit {
  width: 100px;
  font-weight: 600;
  text-align: right;
  display: inline-block;
}
.imglist {
  width: 100px;
  height: 100px;
}
.inforRight {
  margin-left: 40px;
  display: inline-block;
}
.right {
  margin-right: 15px;
}
.buyerInfo span,
.sellerInfo span,
.buyerInfo span,
.goodsLog span {
  margin-top: 20px;
}

/deep/ .el-form-item {
  margin-top: 0px !important;
}
</style>
