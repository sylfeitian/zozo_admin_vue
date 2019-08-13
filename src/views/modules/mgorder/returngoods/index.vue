<template>
  <div v-if="isOrderDet">
    <Bread :breaddata="breaddata"></Bread>
    <el-form
      :inline="true"
      ref="dataForm"
      class="grayLine topGapPadding"
      :model="dataForm"
      @keyup.enter.native="getDataList()"
    >
      <el-form-item label="退货单号：" prop="aftersaleSn">
        <el-input v-model="dataForm.aftersaleSn" placeholder="退货单号" clearable></el-input>
      </el-form-item>
      <el-form-item label="商品货号：" prop="specSerial">
        <el-input v-model="dataForm.specSerial" placeholder="商品货号" clearable></el-input>
      </el-form-item>
      <el-form-item label="商户名称：" prop="storeName">
        <el-input v-model="dataForm.storeName" placeholder="商户名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="用户名称：" prop="memberName">
        <el-input v-model="dataForm.memberName" placeholder="用户名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="商品ID/名称：" prop="goodnum">
        <el-input v-model="dataForm.goodnum" placeholder="商品货号" clearable></el-input>
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
        <el-button
          class="btn"
          type="primary"
          plain
          @click="resetForm('dataForm')"
          style="color:#999999FF;"
        >重置</el-button>
      </el-form-item>
      <br>
      <!-- <el-form-item>
                <el-button calss="btn" @click="exForm()" style="color:#999999FF;">导出</el-button>
      </el-form-item>-->
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
      <el-table-column prop="aftersaleSn" label="退货单号" align="center" width="200"></el-table-column>
      <el-table-column prop="specSerial" label="商品货号" align="center"></el-table-column>
      <el-table-column prop="goodsName" label="商品名称" align="center"></el-table-column>
      <el-table-column prop="memberName" label="用户名" align="center" width="100"></el-table-column>
      <el-table-column prop="storeName" label="商户名称" align="center"></el-table-column>
      <el-table-column prop="createDate" label="申请时间" align="center" width="180"></el-table-column>
      <el-table-column prop="refundAmount" label="退款金额" align="right">
        <template slot-scope="scope">￥{{scope.row.refundAmount.toFixed(2)}}</template>
      </el-table-column>
      <el-table-column
        prop="aftersaleStatus"
        v-if="changeVal==''"
        label="退货状态"
        align="center"
        :formatter="statusRules"
      ></el-table-column>
      <el-table-column label="操作" min-width="100" align="center">
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
        当前退货状态：
        <span>{{returnInfo.aftersaleStatus==1?'用户取消':returnInfo.aftersaleStatus==2?'退款失败':returnInfo.aftersaleStatus==3?'待退货入库':returnInfo.aftersaleStatus==4?'退款中':returnInfo.aftersaleStatus==5?'退款成功':returnInfo.aftersaleStatus==6?'换货失败':returnInfo.aftersaleStatus==7?'待换货入库':returnInfo.aftersaleStatus==8?'换货出库中':'换货成功'}}</span>
      </div>
      <div>
        退货单号：
        <span class="nums">{{aftersale.aftersaleSn}}</span>
      </div>
      <div>
        订单编号：
        <span class="nums">{{aftersale.orderSn}}</span>
      </div>
    </div>
    <div class="buyerInfo">
      <p>买家退货申请</p>
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
        <span class="inforTit">退货原因</span>
        <span class="inforRight">{{aftersale.aftersaleReason}}</span>
      </div>
      <div>
        <span class="inforTit">退货说明</span>
        <span class="inforRight">{{aftersale.aftersaleExplain}}</span>
      </div>
      <div>
        <span class="inforTit right">退货凭证</span>
        <img class="imglist right" v-for="item in piclist" :src="$imgDomain + item" alt="">
      </div>
    </div>
    <div class="sellerInfo">
      <p>商家退货审核</p>
      <div>
        <span class="inforTit">商家名称</span>
        <span class="inforRight">{{aftersale.storeName}}</span>
      </div>
      <div>
        <span class="inforTit">审核时间</span>
        <span class="inforRight">{{saleAuditLog.createDate}}</span>
      </div>
      <div>
        <span class="inforTit">审核理由</span>
        <span class="inforRight">{{saleAuditLog==""?'':saleAuditLog.reason}}</span>
      </div>
      <div>
        <span class="inforTit">审核结果</span>
        <span class="inforRight">{{saleAuditLog.result==1?'同意':'拒绝'}}</span>
      </div>
    </div>
     <div class="sellerInfo" v-if="adminAuditLog!=''">
      <p>平台退货审核</p>
      <div>
        <span class="inforTit">审核时间</span>
        <span class="inforRight">{{adminAuditLog.createDate}}</span>
      </div>
      <div>
        <span class="inforTit">审核理由</span>
        <span class="inforRight">{{adminAuditLog==""?'':saleAuditLog.reason}}</span>
      </div>
      <div>
        <span class="inforTit">审核结果</span>
        <span class="inforRight">{{adminAuditLog.result==1?'同意':'拒绝'}}</span>
      </div>
    </div>
    <div class="goodsLog">
      <p>退换货物流</p>
      <div>
        <span class="inforTit">退货时间</span>
        <span class="inforRight">{{returnInfo.createDate}}</span>
      </div>
      <div>
        <span class="inforTit">退货物流</span>
        <span class="inforRight">{{returnInfo.logisticsCompany}}</span>
      </div>
      <div>
        <span class="inforTit">退货单号</span>
        <span class="inforRight">{{returnInfo.aftersaleSn}}</span>
      </div>
    </div>
    <div class="goods">
      <p>退货商品</p>
      <el-table :data="saleGoods" border="" style="width: 100%">
        <el-table-column prop="goodsName" label="商品名称" width="180" align="center"></el-table-column>
        <el-table-column prop="specSerial" label="商品货号" width="180" align="center"></el-table-column>
        <el-table-column prop="specAttrName" label="规格" align="center"></el-table-column>
        <el-table-column prop="specSellPrice" label="单价" align="center">
          <template
            slot-scope="scope"
            v-if="scope.row.specSellPrice!==''&&scope.row.specSellPrice!==null"
          >￥{{scope.row.specSellPrice.toFixed(2)}}</template>
        </el-table-column>
        <el-table-column prop="goodsNum" label="数量" align="center"></el-table-column>
        <el-table-column prop="specPayPrice" label="总价" align="center">
          <template
            slot-scope="scope"
            v-if="scope.row.specPayPrice!==''&&scope.row.specPayPrice!==null"
          >￥{{scope.row.specPayPrice.toFixed(2)}}</template>
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
import { returngoods, exportsales } from "@/api/url";
import { returnDetail } from "@/api/api";
import mixinViewModule from "@/mixins/view-module";
export default {
  mixins: [mixinViewModule],
  data() {
    return {
      mixinViewModuleOptions: {
        getDataListURL: returngoods,
        getDataListIsPage: true,
        exportURL: exportsales,
        // deleteURL: deleteAttributeUrl,
        deleteIsBatch: true,
        deleteIsBatchKey: "id"
      },
      goodsData: [],
      isOrderDet: true,
      breaddata: ["订单系统", "售后管理", "退货管理"],
      detdata: ["订单系统", "售后管理", "退货管理", "退货详情"],
      status: [
        { title: "所有退货订单", id: "" },
        { title: "待退货入库", id: "3" },
        { title: "退款中", id: "4" },
        { title: "退款成功", id: "5" },
        { title: "用户取消", id: "1" }
      ],
      tableData: [],
      timeArr: "", //下单时间
      dataForm: {
        aftersaleSn: "",
        specSerial: "",
        storeName: "",
        memberName: "",
        goodnum: "",
        startTime: "",
        endTime: ""
      },
      piclist: [],
      changeVal: "",
      totalPage: 0,
      dataListLoading: false,
      detailOrList: true,
      radio1: "",
      goodsData: [], //售后商品table
      saleGoods: [], //售后申请数据
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
  components: { Bread },
  methods: {
    //导出
    exForm() {
      this.exportHandle();
    },
    //订单状态筛选
    agreeChange(val) {
       this.params= {
        currentPage: 1, //当前页数
        currentPageSize: 10 //每页显示的条数
      };
      this.dataForm.page = 1;
      this.dataForm.limit = 10;
      this.changeVal = val;
      this.dataForm.aftersaleStatus = val;
      this.getDataList();
    },
    //重置
    resetForm(formName) {
      this.timeArr = [];
      this.dataForm.startTime = "";
      this.dataForm.endTime = "";
      this.$refs[formName].resetFields();
      this.getDataList();
    },
    //条件查询
    getData() {
      this.dataForm.startTime = this.timeArr && this.timeArr[0];
      this.dataForm.endTime = this.timeArr && this.timeArr[1];
      this.getDataList();
    },
    //查看详情
    handleGoodDet(id) {
      const obj = {
        aftersaleSn: id
      };
      returnDetail(obj).then(res => {
        if (res.code == 200) {
          this.isOrderDet = false;
          console.log(res.data);
          this.aftersale = res.data.aftersaleApplyDTO;
          this.saleGoods = res.data.aftersaleGoodsDTOList;
          this.returnInfo = res.data.aftersaleReturnDTO;
          this.saleAuditLog = res.data.aftersaleAuditLogDTOList[0]; //商家审核数据
          this.adminAuditLog = res.data.aftersaleAuditLogDTOList[1] ||''; //平台审核数据
          this.logList = res.data.aftersaleLogListDTOList; //操作日志
          this.piclist = this.aftersale.aftersalePics.split(",");
        } else {
          this.$message({
            type: "warning",
            message: res.msg
          });
        }
      });
    },
    //返回上一级
    changePage() {
      this.isOrderDet = !this.isOrderDet;
      // console.log("列表页面");
      this.$emit("showListFn");
    }
  }
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
.imglist {
  width: 100px;
  height: 100px;
}
.right {
  margin-right: 15px;
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
.inforRight {
  margin-left: 40px;
  display: inline-block;
}
.buyerInfo span,
.sellerInfo span,
.goodsLog span {
  margin-top: 20px;
}
/deep/ .el-form-item {
  margin-top: 0px !important;
}
</style>
