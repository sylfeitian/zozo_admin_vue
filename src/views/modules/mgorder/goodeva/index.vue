<template>
  <div v-if="isList">
    <Bread :breaddata="breaddata"></Bread>
    <el-form
      :inline="true"
      class="grayLine topGapPadding"
      :model="dataForm"
      @keyup.enter.native="getDataList()"
    >
      <el-form-item label="评价时间：">
        <el-date-picker
          v-model="timeArr"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          align="left"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="评价状态：">
        <el-select v-model="dataForm.evaluateState" placeholder="请选择活动区域">
          <el-option label="全部" value=""></el-option>
          <el-option label="显示" value="0"></el-option>
          <el-option label="隐藏" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button class="btn" type="primary" @click="getData()">查询</el-button>
        <el-button class="btn" type="primary" plain @click="reset()" >重置</el-button>
      </el-form-item>
      <br />
      
    </el-form>
    
    <el-form>
    	<el-form-item style="display:block">
        <el-button class="btn" @click="changeShow()" type="primary" plain>批量显示</el-button>
        <el-button class="btn" @click="deleteHandle()" type="danger" plain>批量删除</el-button>
        <el-button class="btn" @click="changeHide()" type="info" plain>批量隐藏</el-button>
      </el-form-item>
    </el-form>
    <el-table
      width="100%"
      :data="dataList"
      border=""
      @selection-change="dataListSelectionChangeHandle"
      v-loading="dataListLoading"
      style="width: 100%,maigin-top:20px;"
    > 
    <el-table-column type="selection" width="70" align="center"></el-table-column>
      <el-table-column
	  		type='index'
	  	  prop="$index"
	    	label="序号"
				align="center"
	    	width="70">
	    	<template slot-scope="scope">
          {{scope.$index+1+(parseInt(page)-1)* parseInt(limit) }}
        </template>
	  	</el-table-column>      
      <el-table-column prop="specInfo" label="商品信息" align="center"></el-table-column>
      <el-table-column prop="evaluateContent" label="评价内容" align="center" min-width="150"></el-table-column>
      <el-table-column prop="memberName" label="用户信息" align="center"></el-table-column>
      <el-table-column prop="createDate" label="评价时间" align="center"></el-table-column>
      <el-table-column prop="evaluateState" label="状态" align="center" :formatter="formatInviter"></el-table-column>
      <el-table-column label="操作" min-width="100" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="handleEdit(scope.row)">详情</el-button>
          <el-button
            size="mini"
            @click="changeHide( scope.row.id)"
            v-if="scope.row.evaluateState==0"
            type="text"
          >隐藏</el-button>
          <el-button
            size="mini"
            @click="changeShow( scope.row.id)"
            type="text"
            v-if="scope.row.evaluateState==1"
          >显示</el-button>
          <el-button size="mini" type="text" @click="reply( scope.row)">回复</el-button>
          <el-button class="artdanger" size="mini" type="text" @click="deleteHandle( scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="pageSizeChangeHandle"
      @current-change="pageCurrentChangeHandle"
      :current-page="page"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="limit"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
  </div>
  <evaDet v-else @changeState="changeModel" :evaDetails="evaDetails"></evaDet>
</template>
<script>
import Bread from "@/components/bread";
import evaDet from "./evaDet.vue";
import { goodseva, deleva } from "@/api/url";
import { msgReply, changeStatus, evaDets } from "@/api/api";
import mixinViewModule from "@/mixins/view-module";
export default {
  mixins: [mixinViewModule],
  data() {
    return {
      mixinViewModuleOptions: {
        getDataListURL: goodseva,
        getDataListIsPage: true,
        // exportURL: '/admin-api/log/login/export',
        deleteURL: deleva,
        deleteIsBatch: true,
        deleteIsBatchKey: "id"
      },
      breaddata: ["订单系统", "售后管理", "商品评价"],
      dataForm: {
        evaluateState: ""
      },
      evaDetails: "", //评价详情
      dataListLoading: false,
      totalPage: 0,
      isList: true, //列表页 false-详情页
      params: {
        currentPage: 1, //当前页数
        currentPageSize: 10 //每页显示的条数
      },
      timeArr: "", //下单时间
      dataList: [],
      formatInviter: function(row, column) {
        return row.evaluateState == 0 ? <el-tag type="success">显示</el-tag> : <el-tag type="info">隐藏</el-tag>;
      }
    };
  },
  created() {},
  components: { Bread, evaDet },
  methods: {
    //详情
    handleEdit(index) {
      const obj = { id: index.id };
      evaDets(obj).then(res => {
        if (res.code == 200) {
          this.evaDetails = res.data;
        } else {
          this.$message({
            type: "warning",
            message: res.msg
          });
        }
      });
      this.isList = false;
    },
    //返回上一级
    changeModel() {
      this.isList = !this.isList;
    },
    //条件查询
    getData() {
      this.dataForm.startDate = this.timeArr && this.timeArr[0];
      this.dataForm.endDate = this.timeArr && this.timeArr[1];
      this.getDataList();
    },
    //重置
    reset() {
      this.timeArr = [];
      this.dataForm = {};
      this.getDataList();
    },
    //评价回复
    reply(index) {
      this.$prompt("回复内容", "回复", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          const obj = {
            id: index.id,
            content: value
          };
          msgReply(obj).then(res => {
            if (res.code == 200) {
              this.$message({
                type: "success",
                message: res.msg
              });
              this.getDataList();
            } else {
              this.$message({
                type: "warning",
                message: res.msg
              });
            }
          });
        })
        .catch(() => {
          // this.$message({
          //   type: "info",
          //   message: "取消回复"
          // });
        });
    },
    //批量显示/显示
    changeShow(id) {
      if (id == undefined && this.dataListSelections.length == 0) {
        this.$message({
          type: "warning",
          message: "请选择批量处理的数据"
        });
        return false;
      }
      const arrId = [];
      this.dataListSelections.forEach(function(val, index, arr) {
        arrId.push(val.id);
      });
      this.$confirm("您确认显示所有选中评价吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const obj = {
            ids: id == null ? arrId : [id],
            state: 0
          };
          changeStatus(obj).then(res => {
            if (res.code == 200) {
              this.$message({
                type: "success",
                message: "修改成功!"
              });
              this.getDataList();
            } else {
              this.$message({
                type: "warning",
                message: "修改失败!"
              });
              this.getDataList();
            }
          });
        })
        .catch(() => {
          // this.$message({
          //   type: "info",
          //   message: "已取消"
          // });
        });
    },
    //批量隐藏/隐藏
    changeHide(id) {
      if (id == undefined && this.dataListSelections.length == 0) {
        this.$message({
          type: "warning",
          message: "请选择批量处理的数据"
        });
        return false;
      }
      const arrId = [];
      this.dataListSelections.forEach(function(val, index, arr) {
        arrId.push(val.id);
      });
      this.$confirm("您确认隐藏所有选中评价吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const obj = {
            ids: id == null ? arrId : [id],
            state: 1
          };
          changeStatus(obj).then(res => {
            if (res.code == 200) {
              this.$message({
                type: "success",
                message: "修改成功!"
              });
              this.getDataList();
            } else {
              this.$message({
                type: "warning",
                message: "修改失败!"
              });
              this.getDataList();
            }
          });
        })
        .catch(() => {
          // this.$message({
          //   type: "info",
          //   message: "已取消"
          // });
        });
    }
  }
};
</script>
<style>
/* .el-form-item{width:auto;} */
</style>
