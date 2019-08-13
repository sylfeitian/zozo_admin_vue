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
            <el-form-item label="商品审核设置：" prop="goodsAuditOpen">
                <el-radio-group v-model="ruleForm.goodsAuditOpen">
                    <el-radio label="0">开启</el-radio>
                    <el-radio label="1">关闭</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="退货审核设置：" prop="goodsReturnOpen">
                <el-radio-group v-model="ruleForm.goodsReturnOpen">
                    <el-radio label="0">开启</el-radio>
                    <el-radio label="1">关闭</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="换货审核设置：" prop="goodsExchangeOpen">
                <el-radio-group v-model="ruleForm.goodsExchangeOpen">
                    <el-radio label="0">开启</el-radio>
                    <el-radio label="1">关闭</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item>
                <el-button @click="getExtaStatus" style="margin-top: 20px">取消</el-button>
                <el-button type="primary" @click="submitForm()">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import Bread from "@/components/bread";
import { sysWebExamineCon, sysWebExamineSave } from "@/api/api";
export default {
  data() {
    return {
      breaddata: ["设置系统", "系统设置", "审核设置"],
      ruleForm: {
        goodsExchangeOpen: 1,
        goodsReturnOpen: 1,
        goodsAuditOpen: 0
      },
      //   goodsReturnOpen: "1",
      //   goodsExchangeOpen: "0",//
      //   goodsAuditOpen: "1",
      rules: {}
    };
  },
  components: { Bread },
  methods: {
    getExtaStatus() {
      //获取审核状态
      sysWebExamineCon().then(res => {
        if (res.code == 200) {
          console.log(res);
          this.ruleForm = res.data;
        } else {
          this.$message({
            message: res.msg,
            type: "warning",
            duration: 1500
          });
        }
      });
    },
    //保存提交
    submitForm() {
      const obj = {
       
        
        // goodsAuditOpen: {
            goodsExchangeOpen: this.ruleForm.goodsExchangeOpen,
            goodsReturnOpen: this.ruleForm.goodsReturnOpen,
            goodsAuditOpen: this.ruleForm.goodsAuditOpen
        // }  
        
      };
      sysWebExamineSave(obj).then(res => {
        if (res.code == 200) {
          this.$message({
            message: res.msg,
            type: "success",
            duration: 2000
          });
        } else {
          this.$message({
            message: res.msg,
            type: "warning",
            duration: 2000
          });
        }
      });
    }
  },
  created() {
    this.getExtaStatus();
  }
};
</script>
<style scoped>
</style>
