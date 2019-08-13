<template>
    <div>
        <Bread :breaddata="breaddata"></Bread>
        <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="150px"
            class="demo-ruleForm artinputcontent"
        >
            <el-form-item label="正常订单超过：" prop="cancelOrder">
                <div>
                    <el-input
                        placeholder="请输入分钟"
                        min="0"
                        type="number"
                        v-model="ruleForm.cancelOrder"
                    >
                        <template slot="append">分</template>
                    </el-input>未付款，订单自动关闭
                </div>
            </el-form-item>
            <el-form-item label="发货超过：" prop="autoCompleteOrder">
                <div>
                    <el-input placeholder="请输入天数" v-model="ruleForm.autoCompleteOrder">
                        <template slot="append">天</template>
                    </el-input>未收货，订单自动完成
                </div>
            </el-form-item>
            <el-form-item label="订单完成超过：" prop="cannotReturn">
                <div>
                    <el-input placeholder="请输入天数" v-model="ruleForm.cannotReturn">
                        <template slot="append">天</template>
                    </el-input>自动结束交易,不能申请退货售后
                </div>
            </el-form-item>
            <el-form-item label="订单完成超过：" prop="cannotBarter">
                <div>
                    <el-input placeholder="请输入天数" v-model="ruleForm.cannotBarter">
                        <template slot="append">天</template>
                    </el-input>自动结束交易,不能申请换货售后
                </div>
            </el-form-item>
            <el-form-item label="订单完成超过：" prop="autoComment">
                <div>
                    <el-input placeholder="请输入天数" v-model="ruleForm.autoComment">
                        <template slot="append">天</template>
                    </el-input>自动好评
                </div>
            </el-form-item>
            <el-form-item>
                <el-button @click="ret()" style="margin-top: 20px">取消</el-button>
                <el-button type="primary" @click="submitForm()">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import Bread from "@/components/bread";
import { orderAdvCon, orderAdvSave } from "@/api/api";
export default {
  data() {
    return {
      breaddata: ["设置系统", "高级设置", "订单设置"],
      ruleForm: {
        autoComment: "", //好评
        cannotBarter: "", //换货
        cannotReturn: "", //退货
        autoCompleteOrder: "", //未收货，自动完成
        cancelOrder: "" //关闭
      },
      rules: {
        autoComment: [
          { required: true, message: "请输入天数", trigger: "blur" }
        ],
        cannotBarter: [
          { required: true, message: "请输入天数", trigger: "blur" }
        ],
        cannotReturn: [
          { required: true, message: "请输入天数", trigger: "blur" }
        ],
        autoCompleteOrder: [
          { required: true, message: "请输入天数", trigger: "blur" }
        ],
        cancelOrder: [
          { required: true, message: "请输入分钟数", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    //获取订单设置数据
    getOrderCon() {
      orderAdvCon().then(res => {
        if (res.code == 200) {
          this.ruleForm = res.data;
        } else {
          this.$message({
            message: res.msg,
            type: "error",
            duration: 1500
          });
        }
      });
    },
    //保存修改
    submitForm() {
      //   console.log(this.ruleForm, "表单数据");
      orderAdvSave(this.ruleForm).then(res => {
        if (res.code == 200 && res) {
          this.$message({
            message: res.msg,
            type: "success",
            duration: 1500
          });
        } else {
          this.$message({
            message: res.msg,
            type: "error",
            duration: 1500
          });
        }
      });
    },
    //取消修改
    ret() {
      this.getOrderCon();
    }
  },
  components: { Bread },
  created() {
    this.getOrderCon();
  }
};
</script>
<style scoped>
.el-input-group {
  width: 20%;
}
</style>
