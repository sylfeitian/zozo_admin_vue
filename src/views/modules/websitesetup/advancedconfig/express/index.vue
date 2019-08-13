<template>
  <div>
    <Bread :breaddata="breaddata"></Bread>
    <el-form
      :model="numberValidateForm"
      :rules="rules"
      ref="numberValidateForm"
      label-width="150px"
      class="demo-ruleForm artinputcontent"
    >
      <el-form-item label="快递100 Key：" prop="expressKey">
        <el-input type="text" v-model="numberValidateForm.expressKey" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="快递100 Customer：" prop="expressCustomer">
        <el-input type="text" v-model="numberValidateForm.expressCustomer" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="resetForm()" style="margin-top: 20px">取消</el-button>
        <el-button type="primary" @click="submitForm('numberValidateForm')">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import Bread from "@/components/bread";
import { expressAdvCon, expressAdvSave } from "@/api/api";
export default {
  data() {
    return {
      breaddata: ["设置系统", "系统设置", "快递设置"],
      numberValidateForm: { expressKey: "", expressCustomer: "" },
      rules: {
        expressKey: [
          { required: true, message: "请输入快递100 Key", trigger: "blur" }
        ],
        expressCustomer: [
          { required: true, message: "请输入快递100 Customer", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          expressAdvSave(this.numberValidateForm).then(res => {
            if (res.code == 200 && res) {
              this.$message({
                message: res.msg,
                type: "success",
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
          return false;
        }
      });
    },
    //取消修改
    resetForm() {
      this.getExpressData();
    },
    //获取快递设置数据
    getExpressData() {
      expressAdvCon().then(res => {
        if (res.code == 200 && res) {
          this.numberValidateForm = res.data;
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
  components: { Bread },
  created() {
    this.getExpressData();
  }
};
</script>
<style scoped>
.el-input {
  width: 20%;
}
</style>
