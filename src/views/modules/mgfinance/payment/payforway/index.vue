<template>
  <div>
    <Bread :breaddata="breaddata"></Bread>
    <el-table :data="dataList" style="width: 100%" border v-loading="dataListLoading">
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
      <el-table-column label="名称" align="center" prop="paymentName"></el-table-column>
      <el-table-column label="Logo" align="center" prop="paymentLogo">
         <template slot-scope="scope">
          <img :src="$imgDomain+scope.row.paymentLogo" alt v-if="scope.row.picPath!=''" style="width: 150px;">
        </template>
      </el-table-column>
      <el-table-column label="说明" align="center" prop="remark"></el-table-column>
      <el-table-column label="状态" align="center" prop="paymentState" :formatter="statusRole"></el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button @click.native.prevent="edit(scope.row)" type="text" size="mini">编辑</el-button>
          <el-button
            @click.native.prevent="changeStatus(scope.row)"
            type="text"
            size="mini"
            v-if="scope.row.paymentState==1"
          > <span class="artdanger">禁用</span></el-button>
          <el-button  @click.native.prevent="changeStatus(scope.row)" type="text" size="mini" v-else> <span class="artstart">启用</span></el-button>
        </template>
      </el-table-column>
    </el-table>
    <updateEditData v-if="addEditDataVisible" ref="updateEditData" @searchDataList="getDataList"></updateEditData>
  </div>
</template>
<script>
import updateEditData from './model-update-edit-data'
import { paymentWayUrl } from "@/api/url";
import { paymentStatus } from "@/api/api";
import mixinViewModule from "@/mixins/view-module";
import Bread from "@/components/bread";
export default {
  mixins: [mixinViewModule],
  data() {
    return {
      mixinViewModuleOptions: {
        getDataListURL: paymentWayUrl,
        getDataListIsPage: false,
        // exportURL: '/admin-api/log/login/export',
        deleteIsBatch: false,
        dataListLoading: false,
        deleteIsBatch: true,
        deleteIsBatchKey: "id"
      },
      addEditDataVisible:false,
      tableData: [
        {
          name: "测试微信",
          intro: "【微信APP支付】商城Androd、IOS客户端使用微信支付",
          status: "1"
        },
        {
          name: "测试支付宝",
          intro: "【JSAPI支付】微信内/WAP商城内使用微信支付",
          status: "0"
        }
      ],
      breaddata: ["财务系统", "支付管理", "支付方式"],
      statusRole: function(row, column) { //状态 0--禁用  1--开启
        return row.paymentState == 0 ? <el-tag type="danger">关闭</el-tag> : <el-tag type="success">开启</el-tag>;
      }
    };
  },
  created() {
    this.getDataList();
  },
  components: {
    Bread,
    updateEditData
  },
  methods: {
    changeStatus(index) {//修改支付状态 0--禁用  1--开启
      var obj = {
        "id": index.id,
        "paymentState": index.paymentState == "1" ? "0" : "1"
      };
      paymentStatus(obj).then(res => {
        if (res && res.code == 200) {
          this.$message({
            message: res.msg,
            type: "success",
            duration: 5000
          });
          this.getDataList();
        } else {
          this.$message({
            message: res.msg,
            type: "warning",
            duration: 5000
          });
        }
      });
    },
    edit(index) {
      this.setAddEditDataVisible(true);
        this.$nextTick(() => {
          this.$refs.updateEditData.dataForm.id = index.id;
        this.$refs.updateEditData.init();
        })
    },
    setAddEditDataVisible(boolargu){
      this.addEditDataVisible =  boolargu;
    },
  }
};
</script>
<style lang="sass" scoped>

</style>
