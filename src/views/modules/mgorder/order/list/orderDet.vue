<template>
  <div>
    <Bread :breaddata="orderDetData" @changePage="getList(1)" :index="'2'"></Bread>
    <el-steps
      :active="data.orderStatus==10?1:data.orderStatus==20?2:data.orderStatus==30?3:5"
      align-center
    >
      <el-step title="提交订单" icon="el-icon-document" :description="data.createDate"></el-step>
      <el-step title="付款成功" icon="el-icon-mobile-phone" description=""></el-step>
      <el-step title="商品出库" icon="el-icon-goods" description=""></el-step>
      <el-step title="待收货" icon="el-icon-time" description=""></el-step>
      <el-step title="完成" icon="el-icon-circle-check" description=""></el-step>
    </el-steps>
    <div class="orderUerInfo">
      <div class="orderDe">
        <div class="orderDelf">
          <div>订单编号：
            <!-- <span>{{data.orderSn}}</span> -->
            <input type="text" v-model="data.orderSn" id="bar">
            <el-button
              class="btn"
              type="info"
              size="mini"
              id="copy"
              icon="el-icon-message"
              plain
              @click="copyOrder()"
              data-clipboard-action="copy"
              data-clipboard-target="#bar"
            >复制</el-button>
          </div>
          <div>订单状态：{{data.orderStatus==0?'已取消':data.orderStatus==10?'待付款':data.orderStatus==20?'待发货':data.orderStatus==30?'待收货':'交易完成' }}</div>
        </div>
        <div class="orderDerg">
          <div>操作:
            <el-button type="primary" size="mini" plain @click="getList(3)">查看订单优惠明细</el-button>
            <!-- <span @click="getList(3)">查看订单优惠明细</span> -->
          </div>
          <el-button
            type="primary"
            plain
            size="mini"
            @click="addRemarks()"
            style="margin-right:10px;"
          >增加备注</el-button>
          <!-- <div @click="addRemarks()">增加备注</div> -->
        </div>
      </div>
      <div class="buyerInfo">
        <ul>
          <li><span class="inforTit">购买用户：</span>{{addressInfo.mobPhone}}</li>
          <li><span class="inforTit">用户等级：</span>--</li>
        </ul>
        <ul>
          <li><span class="inforTit">备注等级：</span>--</li>
          <li><span class="inforTit">商家备注：</span>--</li>
        </ul>
      </div>
    </div>
    <div class="orderRecord">
      <div class="orderInfo">
        <div class="title">包裹</div>
        <p><span class="inforTit">送货方式：</span>{{data.transportCompanyName }}</p>
        <p><span class="inforTit">承运单电话：</span>--</p>
      </div>
      <div class="orderText">
          暂无物流信息
        <!-- <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="textarea"></el-input> -->
      </div>
    </div>
    <div class="orderConfig">
      <div class="orderConList">
        <div class="title">收货人信息</div>
        <p><span class="inforTit">联系买家：</span>{{addressInfo.trueName}}</p>
        <p><span class="inforTit">收货人：</span>--</p>
        <p><span class="inforTit">收货地址：</span>{{addressInfo.address}}</p>
        <p><span class="inforTit">手机号：</span>{{addressInfo.mobPhone}}</p>
        <p>
          <span class="inforTit">买家留言：</span>
          <!-- <input type="textarea" :value="data.orderMessage" readonly> -->
          <span>{{data.orderMessage}}</span>
        </p>
      </div>
      <div class="orderConList">
        <div class="title">配送信息</div>
        <p><span class="inforTit">配送方式：</span>{{data.transportCompanyName }}</p>
        <p><span class="inforTit">运费：</span>{{data.shippingFee!=null?'￥'+data.shippingFee.toFixed(2):''}}</p>
        <p><span class="inforTit">配送日期：</span>--</p>
      </div>
      <div class="orderConList">
        <div class="title"> 付款信息</div>
        <p><span class="inforTit">付款方式：</span>{{data.paymentName}}</p>
        <p><span class="inforTit">付款时间：</span>{{data.paymentTime}}</p>
        <p><span class="inforTit">商品总额：</span>{{data.goodsAmount!=null?'￥'+data.goodsAmount.toFixed(2):''}}</p>
        <p><span class="inforTit">运费金额：</span>{{data.shippingFee!=null?'￥'+data.shippingFee.toFixed(2):''}}</p>
        <p><span class="inforTit">促销价格：</span>{{data.preferentialPrice!=null?'￥'+data.preferentialPrice.toFixed(2):''}}</p>
        <p><span class="inforTit">优惠券：</span>{{data.couponAmount!=null?'￥'+data.couponAmount.toFixed(2):''}}</p>
        <p><span class="inforTit">积分：</span>--</p>
        <p><span class="inforTit">应支付金额：</span>{{data.orderAmount!=null?'￥'+data.orderAmount.toFixed(2):''}}</p>
      </div>
      <div class="orderConList">
        <div class="title">发票信息</div>
        <p><span class="inforTit">发票类型：</span>--</p>
        <p><span class="inforTit">发票抬头：</span>--</p>
        <p><span class="inforTit">纳税人识别号：</span>--</p>
        <p><span class="inforTit">发票内容：</span>--</p>
      </div>
    </div>
    <div>
      <el-table :data="orderData" style="width: 100%" border="">
        <el-table-column prop="goodsName" label="商品名称" width="180" align="center"></el-table-column>
        <el-table-column prop="specId" label="商品货号" width="180" align="center"></el-table-column>
        <el-table-column prop="specCostPrice" label="单价" align="center">
          <template
            slot-scope="scope"
          >{{scope.row.specCostPrice!=''?'￥'+scope.row.specCostPrice.toFixed(2):''}}</template>
        </el-table-column>
        <el-table-column prop="rudePri" label="优惠金额" align="center"></el-table-column>
        <el-table-column prop="num" label="赠送积分" align="center"></el-table-column>
        <el-table-column prop="score" label="积分优惠购" align="center"></el-table-column>
        <el-table-column prop="goodsNum" label="数量" align="center"></el-table-column>
        <el-table-column prop="goodsTotalPrice" label="总价" align="center">
          <template
            slot-scope="scope"
          >{{scope.row.goodsTotalPrice!=''?'￥'+scope.row.goodsTotalPrice.toFixed(2):''}}</template>
        </el-table-column>
      </el-table>
      <div class="summary">
        <ul>
          <li><span class="inforTit">商品总价：</span>{{data.goodsAmount!=null?'￥'+data.goodsAmount.toFixed(2):''}}</li>
          <li><span class="inforTit">运费：</span>{{data.shippingFee!=null?'￥'+data.shippingFee.toFixed(2):''}}</li>
          <li><span class="inforTit">促销金额：</span>{{data.preferentialPrice!=null?'￥'+data.preferentialPrice.toFixed(2):''}}</li>
          <li><span class="inforTit">优惠券：</span>{{data.couponAmount!=null?'￥'+data.couponAmount.toFixed(2):''}}</li>
          <li><span class="inforTit">积分抵扣：</span>--</li>
          <li><span class="inforTit">应付金额：</span>{{data.orderAmount!=null?'￥'+data.orderAmount.toFixed(2):''}}</li>
        </ul>
      </div>
    </div>
    <div class="operationRecord">
      <p class="title">操作日志</p>
      <p v-for="item in orderLog">
        {{item.updateDate}}
        <span class="creater">{{item.updater}}</span>
        {{item.message}}
      </p>
    </div>
    <el-dialog title="填写备注" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="备注信息：">
          <el-input type="textarea" v-model="form.desc"></el-input>
        </el-form-item>
        <el-form-item label="等级：">
          <el-radio-group v-model="form.resource">
            <el-radio label="一级" value="0"></el-radio>
            <el-radio label="二级" value="1"></el-radio>
            <el-radio label="三级" value="2"></el-radio>
            <el-radio label="四级" value="3"></el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" plain @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Bread from "@/components/bread";
import Clipboard from "clipboard";

export default {
  data() {
    return {
      textarea: "",
      dialogFormVisible: false,
      orderDetData: ["订单系统", "订单管理", "订单列表", "订单详情"],
      form: {
        desc: "",
        resource: 0
      }
    };
  },
  components: {
    Bread
  },
  props: ["data", "addressInfo", "orderLog", "orderData", "packageInfo"],
  methods: {
    //页面跳转 1-列表页
    getList(nums) {
      this.$emit("changePage", nums);
    },

    //添加备注
    addRemarks() {
      this.dialogFormVisible = !this.dialogFormVisible;
    },
    copyOrder() {
      var clipboard = new Clipboard(".btn");
      let that = this;
      clipboard.on("success", e => {
        that.$message({
          message: "订单号复制成功",
          type: "success",
          duration: 1000
        });
        clipboard.destroy();
      });

      clipboard.on("error", e => {
        that.$message({
          message: "订单号复制失败，请重新复制",
          type: "error",
          duration: 1000
        });
        clipboard.destroy();
      });
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
.el-textarea {
  width: 30%;
}
.inforTit{
   width: 100px;
  font-weight: 600;
  text-align: left;
  color:#333;
  display: inline-block;
}
.title{
  font-size: 16px;
  font-weight: 700;
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

  justify-content: flex-start;
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
