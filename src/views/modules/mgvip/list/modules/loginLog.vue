<template>
  <div>
    <el-table width="100%" :data="dataList" border style="margin-top:40px;">
      <el-table-column type="index" prop="$index" label="序号" align="center" width="70">
        <template
          slot-scope="scope"
        >{{scope.$index+1+(parseInt(formData.page)-1)* parseInt(formData.limit) }}</template>
      </el-table-column>
      <el-table-column prop="createDate" align="center" label="时间"></el-table-column>
      <el-table-column prop="ip" align="center" label="IP"></el-table-column>
      <el-table-column prop="loginArea" align="center" label="地区"></el-table-column>
      <el-table-column prop="source" align="center" label="机型">
        <template slot-scope="scope">
          <span v-if="scope.row.source==0">Android</span>
          <span v-else-if="scope.row.source==1">IOS</span>
          <span v-else>ios</span>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="formData.page"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="formData.limit"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
  </div>
</template>

<script>
import { memberloginlogById } from "@/api/api.js";
export default {
  data() {
    return {
      dataList: [],
      formData: {
        page: 1,
        limit: 10,
        parentId: 0
      },
      total: 0,
      row: ""
    };
  },
  components: {},
  methods: {
    init(row) {
      (this.row = row), this.getData();
    },
    // 每页数
    sizeChangeHandle(val) {
      this.formData.page = 1;
      this.formData.limit = val;
      this.getData();
    },
    // 当前页
    currentChangeHandle(val) {
      this.formData.page = val;
      this.getData();
    },
    // 回显数据
    getData() {
      var obj = {
        params: {
          ...this.formData,
          memberId: this.row.id
        }
      };
      memberloginlogById(obj).then(res => {
        console.log(res);
        if (res.code == 200) {
          this.dataList = res.data.list;
          this.total = res.data.total;
        }
      });
    }
  }
};
</script>

<style>
</style>