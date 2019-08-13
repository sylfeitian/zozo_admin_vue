<template>
  <div>
    <Bread :breaddata="breaddata"></Bread>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="140px"
      class="demo-ruleForm artinputcontent"
    >
      <el-form-item label="结算周期：" prop="statisticalCycle">
        <el-select v-model="ruleForm.statisticalCycle" placeholder="请选择结算周期">
          <el-option label="日结" value="0"></el-option>
          <el-option label="周结" value="1"></el-option>
          <el-option label="月结" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="自动打款设置：" prop="automaticMoney">
        <el-radio-group v-model="ruleForm.automaticMoney">
          <el-radio label="0">开启</el-radio>
          <el-radio label="1">关闭</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button @click="resetForm('ruleForm')" style="margin-top: 20px">取消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import Bread from "@/components/bread";
import { settlAdvCon, settlAdvSave } from "@/api/api";
export default {
  data() {
    return {
      breaddata: ["设置系统", "系统设置", "结算设置"],
      ruleForm: { statisticalCycle: "", automaticMoney: "" },
      rules: {
        statisticalCycle: [{ required: true, message: "请选择结算周期", trigger: "blur" }],
        automaticMoney: [{ required: true, message: "请选择状态", trigger: "blur" }]
      }
    };
  },
  components: { Bread },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          settlAdvSave(this.ruleForm).then(res => {
            if (res.code == 200 && res) {
              this.$message({
                message: res.msg,
                type: "suceess",
                duration: 1500
              });
            } else {
              this.$message({
                message: res.msg,
                type: "warning",
                duration: 1500
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm() {
      this.getSettlData();
    },
    //获取结算设置数据
    getSettlData() {
      settlAdvCon().then(res => {
        if (res.code == 200 && res) {
          this.ruleForm = res.data;
        } else {
          this.$message({
            message: res.msg,
            type: "warning",
            duration: 1500
          });
        }
      });
    }
  },
  created() {
    this.getSettlData();
  }
};
</script>
<style scoped>
</style>
