<template>
    <div>
        <Bread :breaddata="orderDiscount" @changePage="changePageDet(2)" :index="'2'"></Bread>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="">
                <el-input v-model="formInline.user" placeholder="输入订单号查询优惠明细"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
        </el-form>
        <div class="order">
            <p>订单编号:43545324535435</p>
            <p>
                订单时间:
                2019-09-11 12:39:08
            </p>
        </div>
        <div class="ssss">
            <div
                style=" width: 20px;border: 1px solid #e1e1e1;margin-top: 20px;padding: 16px 0;"
            >订单列表</div>
            <el-table :data="tableData" border="" style="width: 100%">
                <el-table-column prop="id" label="促销类型" width="180"></el-table-column>
                <el-table-column prop="name" label="优惠金额" width="180"></el-table-column>
                <el-table-column prop="amount1" label="促销ID"></el-table-column>
                <el-table-column prop="amount2" label="活动名称"></el-table-column>
                <el-table-column prop="amount3" label="活动ID"></el-table-column>
            </el-table>
        </div>
        <div class="ssss">
            <div
                style=" width: 20px;border: 1px solid #d1d1d1;margin-top: 20px;padding: 16px 0;"
            >订单列表</div>
            <el-table :data="tableData" border="" style="width: 100%">
                <el-table-column prop="id" label="促销类型" width="180"></el-table-column>
                <el-table-column prop="name" label="优惠金额" width="180"></el-table-column>
                <el-table-column prop="amount1" label="促销ID"></el-table-column>
                <el-table-column prop="amount2" label="活动名称"></el-table-column>
                <el-table-column prop="amount3" label="活动ID"></el-table-column>
            </el-table>
        </div>
        <div class="order">
            <p>订单金额明细拆分（SKU维度)</p>
        </div>
    </div>
</template>
<script>
import Bread from "@/components/bread";
export default {
  data() {
    return {
      orderDiscount: ["订单系统", "订单管理", "订单详情", "订单优惠明细"],
      formInline: {}, //订单优惠明细
      tableData: []
    };
  },
  methods: {
    //查询订单优惠明细
    onSubmit() {
      console.log("订单优惠明细");
    },
    //页面跳转 2-订单详情 
    changePageDet(nums) {
      this.$emit("changeState", nums);
    }
  },
  components: { Bread }
};
</script>
<style lang="scss" scoped>
.ssss{display: flex;}
</style>
