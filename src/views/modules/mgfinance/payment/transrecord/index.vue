<template>
  <div v-if="isList">
    <bread :breaddata="breaddata"></bread>
    <el-form
      :inline="true"
      ref="dataForm"
      class="grayLine topGapPadding"
      :model="dataForm"
      @keyup.enter.native="getDataList()"
    >
      <!-- <el-scrollbar style="height:90px;margin-right: 30px;"> -->
      <el-form-item label="交易流水号：" prop="tradeSn">
        <el-input v-model.trim.trim="dataForm.tradeSn" placeholder="交易流水号" clearable></el-input>
      </el-form-item>
      <el-form-item label="交易单号：" prop="paymentSn">
        <el-input v-model.trim.trim="dataForm.paymentSn" placeholder="交易单号" clearable></el-input>
      </el-form-item>
      <el-form-item label="交易渠道：" prop="paymentCode">
        <el-select v-model="dataForm.paymentCode" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option
            v-for="(item,index) in paymentList"
            :label="item.paymentName"
            :value="item.paymentCode"
            :key="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户名称：" prop="buyerName">
        <el-input v-model.trim.trim="dataForm.buyerName" placeholder="用户名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="收支状态：" prop="transactionStatus">
        <el-select v-model="dataForm.transactionStatus" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="收" value="0"></el-option>
          <el-option label="支" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="交易时间：">
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
        <el-button class="btn" type="primary" @click="getData()">搜索</el-button>
        <el-button class="btn" @click="reset('dataForm')" type="primary" plain>重置</el-button>
      </el-form-item>
      <br />
      <!-- <el-form-item>
        <el-button calss="btn" @click="expot()" style="color:#999999FF;">导出</el-button>
      </el-form-item>-->
    </el-form>
    <el-table
      width="100%"
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%"
    >
      <el-table-column
          type="index"
          prop="$index"
          label="序号"
          align="center"
          width="70">
          <template slot-scope="scope">
          {{scope.$index+1+(parseInt(page)-1)* parseInt(limit) }}
          </template>
      </el-table-column>
      <el-table-column label="交易流水号" align="center" prop="tradeSn" width="190"></el-table-column>
      <el-table-column prop="orderSn" label="订单编号" align="center" width="190"></el-table-column>
      <el-table-column prop="buyerName" label="用户名" align="center" width="140"></el-table-column>
      <el-table-column prop="paymentSn" label="交易单号" align="center" width="190"></el-table-column>
      <el-table-column prop="createDate" label="交易时间" align="center" width="190"></el-table-column>
      <el-table-column prop="paymentName" label="交易渠道" align="center" width="100"></el-table-column>
      <el-table-column prop="paymentAmount" label="交易金额" align="right" width="120">
        <template slot-scope="scope">￥{{scope.row.paymentAmount.toFixed(2)}}</template>
      </el-table-column>
      <el-table-column
        prop="transactionStatus"
        label="收支"
        align="center"
        width="80"
        :formatter="statusRules"
      ></el-table-column>
      <el-table-column prop="paymentRemarks" label="备注" align="center"></el-table-column>
      <el-table-column label="操作" width="120" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="handleEdit( scope.row)">查看订单</el-button>
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
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </div>
  <div v-else>
    <Bread :breaddata="orderDetData" @changePage="changePage" :index="'2'"></Bread>
    <el-steps :active="1" align-center>
      <el-step title="提交订单" icon="el-icon-edit" description="2019-09-11 12:39:08"></el-step>
      <el-step title="付款成功" icon="el-icon-upload" description="2019-09-11 12:39:08"></el-step>
      <el-step title="商品出库" icon="el-icon-picture" description="2019-09-11 12:39:08"></el-step>
    </el-steps>
    <div class="orderUerInfo">
      <div class="orderDe">
        <div class="orderDelf">
          <div>
            订单编号：
            <span>{{data.orderSn}}</span>
            <el-button
              class="btn"
              type="primary"
              size="mini"
              icon="el-icon-message"
              plain
              @click="copyOrder()"
            >复制</el-button>
          </div>
          <div>订单状态：{{data.orderStatus==0?'已取消':data.orderStatus==10?'待付款':data.orderStatus==20?'待发货':data.orderStatus==30?'待收货':'交易完成' }}</div>
        </div>
        <div class="orderDerg">
          <div>
            操作:
            <el-button type="primary" plain  @click="getDiscount()">查看订单优惠明细</el-button>
            <!-- <span @click="getDiscount()">查看订单优惠明细</span> -->
          </div>
          <!-- <div @click="addRemarks()">增加备注</div> -->
        </div>
      </div>
      <div class="buyerInfo">
        <ul>
          <li>购买用户：{{addressInfo.mobPhone}}</li>
          <li>用户等级：--</li>
        </ul>
        <ul>
          <li>备注等级：--</li>
          <li>商家备注：--</li>
        </ul>
      </div>
    </div>
    <div class="orderRecord">
      <div class="orderInfo">
        <div>包裹</div>
        <p>送货方式:{{data.transportCompanyName }}</p>
        <p>承运单号:{{data.transportCode }}</p>
        <p>承运人:--</p>
        <p>承运人电话:--</p>
      </div>
      <div class="orderText">
        <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="textarea"></el-input>
      </div>
    </div>
    <div class="orderConfig">
      <div class="orderConList">
        <div>收货人信息</div>
        <p>联系买家:{{addressInfo.trueName}}</p>
        <p>收货人:--</p>
        <p>收货地址:{{addressInfo.address}}</p>
        <p>手机号:{{addressInfo.mobPhone}}</p>
        <p>
          买家留言:
          <input type="textarea" :value="data.orderMessage">
        </p>
      </div>
      <div class="orderConList">
        <div>配送信息</div>
        <p>配送方式:{{data.transportCompanyName }}</p>
        <p>运费:{{data.shippingFee!=null?data.shippingFee.toFixed(2):''}}</p>
        <p>配送日期:--</p>
      </div>
      <div class="orderConList">
        <div>付款信息</div>
        <p>付款方式:{{data.paymentName}}</p>
        <p>付款时间:{{data.paymentTime}}</p>
        <p>商品总额:{{data.goodsAmount!=null?data.goodsAmount.toFixed(2):''}}</p>
        <p>运费金额:{{data.shippingFee!=null?data.shippingFee.toFixed(2):''}}</p>
        <p>促销价格:{{data.preferentialPrice !=null?data.preferentialPrice.toFixed(2):''}}</p>
        <p>优惠券:{{data.couponAmount!=null?data.couponAmount.toFixed(2):''}}</p>
        <p>积分:--</p>
        <p>应支付金额:{{data.orderAmount!=null?data.orderAmount.toFixed(2):''}}</p>
      </div>
      <div class="orderConList">
        <div>发票信息</div>
        <p>发票类型:--</p>
        <p>发票抬头:--</p>
        <p>纳税人识别号:--</p>
        <p>发票内容:--</p>
      </div>
    </div>
    <div>
      <el-table :data="orderData" border="" style="width: 100%">
        <el-table-column prop="goodsName" label="商品名称" width="180"></el-table-column>
        <el-table-column prop="specId" label="商品货号" width="180"></el-table-column>
        <el-table-column prop="specCostPrice" label="单价">
          <template slot-scope="scope">{{scope.row.rudePri!=''?'￥'+scope.row.specCostPrice.toFixed(2):''}}</template>
        </el-table-column>
        <el-table-column prop="rudePri" label="优惠金额">
          <template slot-scope="scope">{{scope.row.rudePri!=''?'￥'+scope.row.rudePri.toFixed(2):''}}</template>
        </el-table-column>
        <el-table-column prop="num" label="赠送积分"></el-table-column>
        <el-table-column prop="score" label="积分优惠购"></el-table-column>
        <el-table-column prop="goodsNum" label="数量"></el-table-column>
        <el-table-column prop="goodsTotalPrice" label="总价">
          <template slot-scope="scope">{{scope.row.goodsTotalPrice!=''?'￥'+scope.row.goodsTotalPrice.toFixed(2):''}}</template>
        </el-table-column>
      </el-table>
      <div class="summary">
        <ul>
          <li>商品总价:{{data.goodsAmount!=null?'￥'+data.goodsAmount.toFixed(2):''}}</li>
          <li>运费:{{data.shippingFee!=null?'￥'+data.shippingFee.toFixed(2):''}}</li>
          <li>促销金额:{{data.preferentialPrice!=null?'￥'+data.preferentialPrice.toFixed(2):''}}</li>
          <li>优惠券:{{data.couponAmount!=null?'￥'+data.couponAmount.toFixed(2):''}}</li>
          <li>积分抵扣:--</li>
          <li>应付金额:{{data.orderAmount!=null?'￥'+data.orderAmount.toFixed(2):''}}</li>
        </ul>
      </div>
    </div>
    <div class="operationRecord">
      <p>操作日志</p>
      <p v-for="item in orderLog" :key>{{item.statusInfo}}</p>
    </div>
  </div>
</template>
<script>
import Bread from "@/components/bread";
import { dealListUrl, dealListExportUrl } from "@/api/url";
import { paymentOrder, paymentList } from "@/api/api";
import mixinViewModule from "@/mixins/view-module";
export default {
  mixins: [mixinViewModule],
  data() {
    return {
      mixinViewModuleOptions: {
        getDataListURL: dealListUrl,
        getDataListIsPage: true,
        exportURL: "dealListExportUrl"
        // deleteURL: deleteAttributeUrl,
        // deleteIsBatch: true,
        // deleteIsBatchKey: "id"
      },
      tableData: [],
      textarea: "",
      isList: true,
      breaddata: ["财务系统", "支付管理", "交易记录"],
      orderDetData: ["财务系统", "支付管理", "交易记录", "订单详情"],
      dataListLoading: false,
      dataForm: {
        tradeSn: "",
        paymentSn: "",
        paymentCode: "",
        buyerName: "",
        transactionStatus: "",
        startDate: "",
        endDate: ""
      },
      paymentList: "", //交易渠道
      timeArr: "", //活动时间
      addressInfo: [], //地址数据
      packageInfo: [], //包裹数据
      orderLog: [], //操作日志
      goodKind2loading: false,
      goodKind3loading: false,
      statusRules(row, column) {
        return row.transactionStatus == 1 ? "支" : "收";
      }
    };
  },
  methods: {
    //条件查询
    getData() {
      this.dataForm.startDate = this.timeArr && this.timeArr[0];
      this.dataForm.endDate = this.timeArr && this.timeArr[1];
      this.getDataList();
    },
    //交易渠道
    getPaymentList() {
      paymentList().then(res => {
        if (res.code == 200) {
          this.paymentList = res.data;
        } else {
          this.$message({
            type: "warning",
            message: res.msg
          });
        }
      });
    },
    //重置
    reset(formName) {
      this.timeArr = [];
      this.dataForm.startDate = "";
      this.dataForm.endDate = "";
      this.$refs[formName].resetFields();
      this.getDataList();
    },
    //导出
    expot() {
      this.exportHandle();
    },
    //查看订单
    handleEdit(index) {
      const obj = { orderSn: index.orderSn };
      paymentOrder(obj).then(res => {
        if (res.code == 200) {
          console.log(res, "333s");
          this.addressInfo = res.data.orderAddressDTO; //收货人信息
          this.orderData = res.data.orderGoodsDTOList;
          this.orderLog = res.data.orderLogDTOList;
          this.data = res.data;
          this.isList = false;
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
      this.isList = !this.isList;
      this.$emit("showListFn");
    }
  },
  components: {
    Bread
  },
  created() {
    this.getPaymentList();
  }
};
</script>
<style lang="scss" scoped>
.el-textarea {
  width: 30%;
}
#bar {
  border: none;
  margin-right: 10px;
  min-width: 180px;
  display: inline-block;
}
.orderUerInfo {
  width: 100%;
  height: auto;
  margin-top: 20px;
  border: 1px solid #d1d1d1;
}
.orderDe {
  /* border: 1px solid #333; */
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.orderDelf,
.orderDerg {
  /* display: flex; */
  display: flex;
  align-items: center;
}
.orderDelf div {
  margin-left: 20px;
}
.orderDerg div {
  margin-right: 20px;
}
.buyerInfo {
  box-sizing: border-box;
  border-radius: 5px;
  padding: 0px 8px;
  height: auto;
  /* margin: 5px 10px; */
  border: 1px solid #d1d1d1;
  display: flex;
}
.buyerInfo ul {
  width: 50%;
  padding: inherit;
}
.buyerInfo ul li {
  list-style-type: none;
  padding: 3px;
}
.orderRecord {
  widows: 100%;
  height: auto;
  height: 200px;
  display: flex;
  margin-top: 10px;
  border: 1px solid #d1d1d1;
}
.orderText {
  width: 80%;
  height: 100%;
  display: flex;
  padding: 10px;
  justify-content: center;
}
.orderInfo {
  width: 20%;
  padding: 20px 0 0 30px;
  border-right: 1px solid #d1d1d1;
  text-align: left;
  height: 100%;
}
.el-textarea {
  width: 100%;
}
.el-textarea__inner {
  height: 100%;
  resize: none;
}
.orderConfig {
  width: 100%;
  border: 1px solid #d1d1d1;
  height: auto;
  display: flex;
  justify-content: flex-start;
  margin-top: 10px;
}
.orderConList {
  width: 25%;
  padding: 20px 0 0 30px;
  border-right: 1px solid #d1d1d1;
  text-align: left;
  height: auto;
}
.summary {
  width: 100%;
  display: flex;
  margin-top: 20px;
  justify-content: flex-end;
}
.summary ul li {
  list-style: none;
  width: 200px;
  line-height: 30px;
}
.operationRecord {
  width: 100%;
  padding-left: 20px;
  margin: 20px 0;
  height: auto;
  border: 1px solid #d1d1d1;
}
.operationRecord p {
  line-height: 30px;
}
.el-table {
  margin-top: 20px;
}
</style>
