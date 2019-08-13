<template>
  <div>
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
      </div>
    </div>
    <div class="sellerInfo" v-if="isSellerFin">
      <p>商家换货审核</p>
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
        <span class="inforRight">{{saleAuditLog.reason}}</span>
      </div>
      <div>
        <span class="inforTit">审核结果</span>
        <span class="inforRight">{{saleAuditLog.result==1?'同意':'拒绝'}}</span>
      </div>
    </div>
    <div class="sellerInfo" v-if="isAdminFin">
      <p>平台换货审核</p>
      <div>
        <span class="inforTit">审核时间</span>
        <span class="inforRight">{{adminAuditLog.createDate}}</span>
      </div>
      <div>
        <span class="inforTit">审核理由</span>
        <span class="inforRight">{{adminAuditLog.reason}}</span>
      </div>
      <div>
        <span class="inforTit">审核结果</span>
        <span class="inforRight">{{adminAuditLog.result==1?'同意':'拒绝'}}</span>
      </div>
    </div>
    <div class="goodsLog" v-if="isLog">
      <!-- status=3 && result=1 -->
      <p>退换货物流</p>
      <div>
        <span class="inforTit">换货时间</span>
        <span class="inforRight">{{barinfor.createDate}}</span>
      </div>
      <div>
        <span class="inforTit">换货物流</span>
        <span class="inforRight">{{barinfor.logisticsCompany}}</span>
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
        <el-table-column prop="specId" label="商品货号" width="180" align="center"></el-table-column>
        <el-table-column prop="specName" label="规格" align="center"></el-table-column>
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
    <div class="operationList" v-if="isBtn">
      <p>平台退换货处理</p>
      <el-form ref="form" :model="form" label-width="80px" :rules="reaRule">
        <el-form-item label="审核理由" prop="reason">
          <el-input
            type="textarea"
            v-model="form.reason"
            style="resize:none;"
            :autosize="{ minRows: 4, maxRows: 6}"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="agreeGoods(0)">取消</el-button>
          <el-button type="danger" plain @click="agreeGoods(2)">拒绝</el-button>
          <el-button type="primary" plain @click="agreeGoods(1)">同意</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="operationList" v-else>
      <p>操作日志</p>
      <p v-for="item in saleLogs">
        {{item.updateDate}}
        <span class="creater">{{item.updater}}</span>
        {{item.message}}
      </p>
    </div>
  </div>
</template>
<script>
import Bread from "@/components/bread";
import { examineGoods } from "@/api/api";
export default {
  data() {
    return {
      form: { reason: "" }, //审核理由
      reaRule: {
        reason: [{ required: true, message: "请输入审核理由", trigger: "blur" }]
      }
    };
  },
  components: {
    Bread
  },
  props: [
    "detdata",
    "aftersale",
    "isBtn",
    "isSellerFin",
    "isAdminFin",
    "isLog",
    "saleLogs",
    "saleAuditLog",
    "adminAuditLog",
    "data",
    "barinfor",
    "saleGoods",
    "piclist" //凭证照片
  ],
  methods: {
    //返回上一级
    changePage() {
      this.$emit("changeState");
    },
    //审核退换货
    agreeGoods(type) {
      //0 取消 1 同意 2 拒绝
      if (type == 0) {
        this.changePage();
        return;
      }
      this.$refs["form"].validate(valid => {
        if (valid) {
          const obj = {
            aftersaleSn: this.aftersale.aftersaleSn,
            aftersaleType: this.aftersale.aftersaleType,
            process: 2, //1:商家审核,2:平台审核
            reason: this.form.reason,
            result: type
          };
          examineGoods(obj).then(res => {
            if (res.code == 200) {
              this.$message({
                type: "success",
                message: res.message
              });
              this.changePage();
            } else {
              this.$message({
                type: "warning",
                message: res.message
              });
            }
          });
        } else {
          return false;
        }
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
.imglist {
  width: 100px;
  height: 100px;
}
.right {
  margin-right: 15px;
}
.buyerInfo span,
.sellerInfo span,
.goodsLog span {
  margin-top: 20px;
}
.el-textarea {
  width: 30%;
}
</style>
