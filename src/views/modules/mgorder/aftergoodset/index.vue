<template>
    <div class='artinputcontent'>
        <h3>售后流程设置</h3>
        <el-form :model="ruleForm" ref="ruleForm" label-width="150px" class="demo-ruleForm">
            <el-form-item label="商品退货：" prop="region">
                <el-switch
                    v-model="ruleForm.goodsReturn"
                    @change="changeReturnStatus"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                ></el-switch>
            </el-form-item>
            <div v-if="ruleForm.goodsReturn" class="tipBox">
                <p><span class="title">买家发起退货申请</span>
                    <el-input-number
                        v-model="ruleForm.agreeReturn"
                        controls-position="right"
                        :min="1"
                        type="number"
                        :max="100"
                    ></el-input-number>天后，商家未处理，按商家同意退货处理
                </p>
                <p><span class="title">审核同意退货申请</span>
                    <el-input-number
                        v-model="ruleForm.cancelReturn"
                        controls-position="right"
                        :min="1"
                        type="number"
                        :max="100"
                    ></el-input-number>天后，买家未处理，自动取消退货处理
                </p>
                <p><span class="title">买家已退货</span>
                    <el-input-number
                        v-model="ruleForm.autoReturn"
                        controls-position="right"
                        :min="1"
                        type="number"
                        :max="100"
                    ></el-input-number>天后，商家未处理，自动进行退货处理
                </p>
            </div>
            <el-form-item label="商品换货：" prop="region">
                <el-switch
                    v-model="ruleForm.goodsBarter"
                    @change="changeBarterStatus"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                ></el-switch>
            </el-form-item>
            <div v-if="ruleForm.goodsBarter" class="tipBox">
                <p><span class="title">买家发起换货申请</span>
                    <el-input-number
                        v-model="ruleForm.agreeBarter"
                        controls-position="right"
                        :min="1"
                        :max="100"
                        type="number"
                    ></el-input-number>天后，商家未处理，按商家同意换货处理
                </p>
                <p><span class="title">审核同意换货申请</span>
                    <el-input-number
                        v-model="ruleForm.cancelBarter"
                        controls-position="right"
                        :min="1"
                        type="number"
                        :max="100"
                    ></el-input-number>天后，买家未处理，自动取消换货处理
                </p>
                <p><span class="title">买家已换货</span>
                    <el-input-number
                        v-model="ruleForm.autoBarter"
                        controls-position="right"
                        :min="1"
                        :max="100"
                        type="number"
                    ></el-input-number>天后，商家未处理，自动进行换货处理
                </p>
            </div>
        </el-form>
        <h3>售后基础设置</h3>
        <el-form :model="ruleForm" ref="basicsForm" label-width="240px" class="demo-ruleForm">
            <el-form-item label="退换货物流单号是否必填：" prop="region">
                <el-switch
                    v-model="ruleForm.aftersaleExpressSn"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                ></el-switch>
            </el-form-item>
            <p class="orderNum">该开关默认关闭，开启后退货物流单号必须填写</p>
            <el-form-item style="margin-top:80px;">
                <el-button @click="resetForm()">取消</el-button>
                <el-button type="primary" @click="submitForm()">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import { goodSetting, updataGoodSetting } from "@/api/api";
import cloneDeep from "lodash/cloneDeep";
export default {
  data() {
    return {
      ruleForm: {}
    };
  },
  created() {
    this.getdata();
  },
  methods: {
    getdata() {
      goodSetting().then(res => {
        if (res.code == 200) {
          this.source = cloneDeep(res.data);
          this.ruleForm = res.data;
          if (res.data.goodsBarter == 1) {
            this.ruleForm.goodsBarter = true;
          } else {
            this.ruleForm.goodsBarter = false;
          }
          if (res.data.goodsReturn == 1) {
            this.ruleForm.goodsReturn = true;
          } else {
            this.ruleForm.goodsReturn = false;
          }
          if (res.data.aftersaleExpressSn == 1) {
            this.ruleForm.aftersaleExpressSn = true;
          } else {
            this.ruleForm.aftersaleExpressSn = false;
          }
        } else {
          this.$message({
            type: "warning",
            message: res.msg
          });
        }
      });
    },
    //退货设置
    changeReturnStatus(val) {
      this.ruleForm.goodsReturn = val;
    },
    //换货设置
    changeBarterStatus(val) {
      this.ruleForm.goodsBarter = val;
    },
    //保存退换货设置
    submitForm() {
      if (this.ruleForm.goodsBarter == false) {
        this.ruleForm.goodsBarter = 0;
        this.ruleForm.agreeBarter = this.source.agreeBarter;
        this.ruleForm.autoBarter = this.source.autoBarter;
        this.ruleForm.cancelBarter = this.source.cancelBarter;
      } else {
        this.ruleForm.goodsBarter = 1;
      }
      if (this.ruleForm.goodsReturn == false) {
        this.ruleForm.goodsReturn = 0;
        this.ruleForm.agreeReturn = this.source.agreeReturn;
        this.ruleForm.autoReturn = this.source.autoReturn;
        this.ruleForm.cancelReturn = this.source.cancelReturn;
      } else {
        this.ruleForm.goodsReturn = 1;
      }
       if (this.ruleForm.aftersaleExpressSn == false) {
        this.ruleForm.aftersaleExpressSn = 0;
      } else {
        this.ruleForm.aftersaleExpressSn = 1;
      }
      updataGoodSetting(this.ruleForm).then(res => {
        if (res.code == 200) {
           this.$message({
            type: "success",
            message: res.msg,
            duration:5000
          });
          this.getdata()
        } else {
          this.$message({
            type: "warning",
            message: res.msg,
            duration:3000
          });
        }
      });
    },
    //取消设置
    resetForm(){
        this.getdata()
    }
  }
};
</script>
<style scoped>
.el-form-item__content {
  width: 20%;
}
.tipBox {
  margin-left: 10%;
}
.orderNum {
  margin-left: 70px;
  color: #d1d1d1;
}
.title{
  display: inline-block;
  width:140px;
}
.el-input-number{margin-right: 10px;}
</style>
