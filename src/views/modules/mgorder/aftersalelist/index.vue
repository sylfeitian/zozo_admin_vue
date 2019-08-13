<template>
  <div v-if="isChange">
    <Bread :breaddata="breaddata"></Bread>
    <el-form
      :inline="true"
      ref="dataForm"
      class="grayLine topGapPadding"
      :model="dataForm"
      @keyup.enter.native="getDataList()"
    >
      <el-form-item label="申请单号：" prop="aftersaleSn">
        <el-input v-model="dataForm.aftersaleSn" placeholder="退货单号" clearable></el-input>
      </el-form-item>
      <el-form-item label="商品货号：" prop="specId">
        <el-input v-model="dataForm.specId" placeholder="商品货号" rable></el-input>
      </el-form-item>
      <el-form-item label="商品名称：" prop="storeName">
        <el-input v-model="dataForm.storeName" placeholder="商户名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="用户名称：" prop="memberName">
        <el-input v-model="dataForm.memberName" placeholder="用户名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="商户ID/名称：" prop="goodsName">
        <el-input v-model="dataForm.goodsName" placeholder="商品ID/名称" clearable></el-input>
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
      <el-form-item label="售后类型：" prop="aftersaleType">
        <el-select v-model="dataForm.aftersaleType" placeholder="售后类型">
          <el-option label="全部" value=""></el-option>
          <el-option label="退货" value="0">退货</el-option>
          <el-option label="换货" value="1">换货</el-option>
          <!-- <el-option label="仅退款" value="2">仅退款</el-option> -->
        </el-select>
      </el-form-item>
      <el-form-item label="售后状态：">
        <el-select v-model="dataForm.auditResult" placeholder="售后状态">
          <el-option label="全部" value=""></el-option>
          <el-option label="审核中" value="3">审核中</el-option>
          <el-option label="审核通过" value="1">审核通过</el-option>
          <el-option label="审核拒绝" value="2">审核拒绝</el-option>
          <el-option label="用户取消" value="4">用户取消</el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button class="btn" type="primary" @click="getData()">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button class="btn" type="primary" plain @click="reset('dataForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <el-radio-group v-model="dataForm.auditStatus" @change="agreeChange">
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
      <el-table-column prop="aftersaleSn" label="申请单号" align="center" width="180"></el-table-column>
      <el-table-column prop="specSerial" label="商品货号" align="center" width="160"></el-table-column>
      <el-table-column prop="goodsName" label="商品名称" align="center"></el-table-column>
      <el-table-column prop="memberName" label="用户名" align="center"></el-table-column>
      <el-table-column prop="storeName" label="商户名称" align="center"></el-table-column>
      <el-table-column prop="createDate" label="申请时间" align="center" width="170"></el-table-column>
      <el-table-column prop="refundAmount" label="退款金额" align="right">
        <template
          slot-scope="scope"
          v-if=" scope.row.refundAmount!=null"
        >{{scope.row.aftersaleType==1?"---":'￥'+scope.row.refundAmount.toFixed(2)}}</template>
      </el-table-column>
      <el-table-column
        prop="auditStatus"
        label="平台审核状态"
        v-if="changeVal==''"
        align="center"
        width="120"
        :formatter="sellerState"
      ></el-table-column>
      <el-table-column
        prop="auditResult"
        width="120"
        label="售后状态"
        align="center"
        :formatter="buyerState"
      ></el-table-column>
      <el-table-column
        prop="aftersaleType"
        width="100"
        label="售后类型"
        align="center"
        :formatter="saleState"
      ></el-table-column>
      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="detShowChange(scope.row)">查看详情</el-button>
          <el-button
            size="mini"
            type="text"
            v-if="scope.row.auditStatus==2"
            @click="detShowChange(scope.row)"
          >审核申请</el-button>
          <!-- v-if="scope.row.auditStatus==2" -->
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
  <afterDet
    @changeState="changeState"
    v-else
    :data="data"
    :detdata="detdata"
    :isBtn="isBtn"
    :isSellerFin="isSellerFin"
    :isAdminFin="isAdminFin"
    :isLog="isLog"
    :piclist="piclist"
    :aftersale="aftersale"
    :saleGoods="saleGoods"
    :saleAuditLog="saleAuditLog"
    :saleLogs="saleLogs"
    :barinfor="barinfor"
    :adminAuditLog="adminAuditLog"
    
  ></afterDet>
</template>

<script>
import Bread from "@/components/bread";
import afterDet from "./afterDet";
import { aftersales } from "@/api/url";
import { exchDetail, returnDetail, salesDetail } from "@/api/api";
import mixinViewModule from "@/mixins/view-module";
export default {
  mixins: [mixinViewModule],
  data() {
    return {
      mixinViewModuleOptions: {
        getDataListURL: aftersales,
        getDataListIsPage: true,
        // exportURL: '/admin-api/log/login/export',
        // deleteURL: deleteAttributeUrl,
        deleteIsBatch: true,
        deleteIsBatchKey: "id"
      },
      isChange: true, //true--列表 false--审核/退换货详情
      isExamine: true, //true--审核详情  false--退换货详情
      dataList: [],
      timeArr: "", //活动时间
      breaddata: ["订单系统", "售后管理", "售后审核"],
      status: [
        { title: "所有售后审核", id: "" },
        { title: "待审核", id: "1" },
        { title: "审核通过", id: "2" },
        { title: "审核拒绝", id: "3" },
        { title: "用户取消", id: "4" }
      ],
      radio1: "",
      changeVal: "",
      tableData: [],
      piclist: [], //凭证照片
      aftersale: [],
      goodsData: [], //售后商品table
      saleGoods: [], //售后申请数据
      barinfor:[],//物流
      saleAuditLog: [], //商家售后理由数据
      adminAuditLog: [], //平台售后理由数据
      saleLogs: [], //操作日志
      data: {}, //总数据
      dataForm: {
        aftersaleType: "", //售后类型
        auditStatus: "", //平台审核状态
        auditResult: "", //筛选状态
        aftersaleSn: "", //售后单号
        specId: "", //商品货号
        storeName: "", //商户名称
        memberName: "", //用户名称
        goodsName: "", //商品名称
        startTime: "",
        endTime: ""
      },
      totalPage: 0,
      dataListLoading: false,
      params: {
        currentPage: 1, //当前页数
        currentPageSize: 10 //每页显示的条数
      },
      saleState(row, column) {
        return row.aftersaleType == 0
          ? "退货"
          : row.aftersaleType == 1
            ? "换货"
            : "仅退款";
      },
      sellerState: function(row, column) {
        return row.auditStatus == 1 ? (
          <el-tag type="warning">未审核</el-tag>
        ) : row.auditStatus == 2 ? (
          <el-tag type="warning">待审核</el-tag>
        ) : row.auditStatus == 3 ? (
          <el-tag type="success">已完成</el-tag>
        ) : (
          <el-tag type="info">用户取消</el-tag>
        );
      },
      buyerState: function(row, column) {
        return row.auditResult == 1 ? (
          <el-tag type="success">审核通过</el-tag>
        ) : row.auditResult == 2 ? (
          <el-tag type="danger">审核不通过</el-tag>
        ) : row.auditResult == 3 ? (
          <el-tag type="warning">审核中</el-tag>
        ) : (
          <el-tag type="info">已取消</el-tag>
        );
      }
    };
  },
  components: { Bread, afterDet },
  methods: {
    //条件查询
    getData() {
      this.dataForm.startTime = this.timeArr && this.timeArr[0];
      this.dataForm.endTime = this.timeArr && this.timeArr[1];
      this.getDataList();
    },
    //详情页展示判断
    detShowChange(index) {
      //auditStatus =2,审核申请,有按钮有商家无平台无物流
      if (index.auditStatus == 2) {
        this.isBtn = true; //操作按钮
        this.isSellerFin = true; //商家审核
        this.isAdminFin = false; //平台审核
        this.isLog = false; //物流
        this.detdata = ["订单系统", "售后管理", "售后审核", "审核申请"];
        this.isChange = false;
        this.getSalesExamine(index);
      } else if (index.auditStatus == 1 || index.auditStatus == 4) {
        //auditStatus =1||4,审核申请,无按钮无商家无平台无物流
        this.isBtn = false; //操作按钮
        this.isSellerFin = false; //商家审核
        this.isAdminFin = false; //平台审核
        this.isLog = false; //物流
        this.detdata = ["订单系统", "售后管理", "售后审核", "售后详情"];
        this.isChange = false;
        this.getSalesExamine(index);
      } else {
        //auditStatus =3,审核申请,无按钮无商家无平台无物流
        this.isBtn = false; //操作按钮
        this.isSellerFin = true; //商家审核
        this.isAdminFin = true; //平台审核
        this.detdata = ["订单系统", "售后管理", "售后审核", "售后详情"];
        this.isLog = index.auditResult == 1 ? true : false; //物流-审核通过
        this.isChange = false;
        this.getSalesDet(index);
      }
    },
    //查看详情
    getSalesDet(index, statue) {
      const obj = {
        aftersaleSn: index.aftersaleSn
      };
      //0:退货,1:换货,
      if (index.aftersaleType == 0) {
        returnDetail(obj).then(res => {
          if (res.code == 200) {
            this.data = res.data;
            this.aftersale = res.data.aftersaleApplyDTO;
            this.saleGoods = res.data.aftersaleGoodsDTOList;
            this.barinfor = res.data.aftersaleReturnDTO;
            this.saleAuditLog = res.data.aftersaleAuditLogDTOList[0]; //商家审核数据
            this.adminAuditLog = res.data.aftersaleAuditLogDTOList[1] || ""; //平台审核数据
            this.saleLogs = res.data.aftersaleLogListDTOList;
            this.piclist = this.aftersale.aftersalePics.split(",");
          } else {
            this.$message({
              type: "warning",
              message: res.msg
            });
          }
        });
      } else {
        exchDetail(obj).then(res => {
          if (res.code == 200) {
            this.data = res.data;
            this.aftersale = res.data.aftersaleApplyDTO;
            this.barinfor = res.data.aftersaleBarterDTO;
            this.saleGoods = res.data.aftersaleGoodsDTOList;
            this.saleAuditLog = res.data.aftersaleAuditLogDTOList[0]; //商家审核数据
            this.adminAuditLog = res.data.aftersaleAuditLogDTOList[1] || ""; //平台审核数据
            this.saleLogs = res.data.aftersaleLogListDTOList;
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
    //审核申请
    getSalesExamine(index) {
      const obj = {
        aftersaleSn: index.aftersaleSn
      };
      //0:退货,1:换货,

      salesDetail(obj).then(res => {
        if (res.code == 200) {
          this.detdata = ["订单系统", "售后管理", "售后审核", "审核详情"];
          this.data = res.data;
          this.isChange = false;
          this.isExamine = true;
          this.aftersale = res.data.aftersaleApplyDTO;
          this.saleGoods = res.data.aftersaleGoodsDTOList;
          this.saleAuditLog = res.data.aftersaleAuditLogDTOList[0];
          this.saleLogs = res.data.aftersaleLogListDTOList;
        } else {
          this.$message({
            type: "warning",
            message: res.msg
          });
        }
      });
    },

    //重置筛选
    reset() {
      this.timeArr = [];
      this.dataForm.startTime = "";
      this.dataForm.endTime = "";
      this.$refs["dataForm"].resetFields();
      this.getDataList();
    },
    //筛选状态
    agreeChange(val) {
      this.dataForm.page = 1;
      this.dataForm.limit = 10;
      this.params = {
        currentPage: 1, //当前页数
        currentPageSize: 10 //每页显示的条数
      };
      this.changeVal = val;
      this.dataForm.auditStatus = val;
      this.getDataList();
    },
    //页面跳转
    changeState() {
      this.isChange = !this.isChange;
      this.getDataList(); //刷新页面数据
    }
  },
  created() {}
};
</script>

<style scoped>
.el-breadcrumb {
  margin-bottom: 20px;
}
.el-table--border {
  margin-top: 20px;
}
.el-radio-group {
  margin-top: 20px;
}

/deep/ .el-form-item {
  margin-top: 0px !important;
}
</style>
