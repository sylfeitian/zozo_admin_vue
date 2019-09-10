<template>
  <div>
    <Bread :breaddata="breaddata"></Bread>
    <el-form
            :inline="true"
            class="grayLine topGapPadding"
            :model="dataForm"
            ref="dataForm"
    >
      <el-form-item label="会员账号/ID：">
        <el-input v-model="dataForm.memeberNameOrId" placeholder="请输入会员账号/ID" clearable></el-input>
      </el-form-item>
      <el-form-item label="消费金额：">
        <div style="display:flex">
          <el-input v-model="dataForm.minConsumeAmount" placeholder=""></el-input>
          <span>&nbsp 至 &nbsp</span>
          <el-input v-model="dataForm.maxConsumeAmount" placeholder=""></el-input>

        </div>
      </el-form-item>
      <el-form-item label="启用状态：">
        <el-select v-model="dataForm.memberState" placeholder="启用状态" clearable>
          <el-option
                  v-for="(item,index) in gradeNameOpction"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getData()">搜索</el-button>
        <el-button @click="reset()" type="primary" plain >重置</el-button>
        <el-button type="primary" plain>导出</el-button>
      </el-form-item>
      <br />
    </el-form>
    <el-table
            width="100%"
            :data="dataList"
            border=""
            v-loading="mixinViewModuleOptions.dataListLoading"
            style="width: 100%"
    >
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column type="index" prop="$index" label="序号" align="center" width="70">
        <template slot-scope="scope">{{scope.$index+1+(parseInt(page)-1)* parseInt(limit) }}</template>
      </el-table-column>
      <el-table-column prop="id" label="会员ID" align="center" width="170"></el-table-column>
      <el-table-column prop="nickName" label="会员账号" align="center"></el-table-column>
      <el-table-column prop="memberMobile" align="center" label="用户昵称" width="140"></el-table-column>
      <el-table-column prop="gradeName" align="center" label="注册时间" width="140"></el-table-column>
      <el-table-column prop="memberSource" align="center" label="会员成长值"></el-table-column>
      <el-table-column prop="createDate" align="center" label="消费金额" width="170"></el-table-column>
      <el-table-column prop="createDate" align="center" label="订单数量" width="170"></el-table-column>
      <el-table-column prop="createDate" align="center" label="积分" width="170"></el-table-column>
      <el-table-column
              prop="memberState"
              align="center"
              label="启用状态"
              width="80"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.groupStatus == 0">启用</span>
          <span v-else>禁止</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="220" align="center">
        <template slot-scope="scope">
          <el-button @click.native.prevent="goDetail(scope.row)" type="text" size="mini">查看</el-button>
          <el-button @click.native.prevent="editHandle(scope.row)" type="text" size="mini">编辑</el-button>
          <el-button
                  @click.native.prevent="forbitHandle(scope.row)"
                  type="text"
                  size="mini"
                  class="artdisable"
                  v-if="scope.row.memberState==0"
          >禁用</el-button>
          <el-button
                  @click.native.prevent="forbitHandle(scope.row)"
                  type="text"
                  class="artstart"
                  size="mini"
                  v-if="scope.row.memberState==1"
          >启用</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import Bread from "@/components/bread";
  import mixinViewModule from "@/mixins/view-module";
  import {zozomemberPageUrl} from "@/api/url.js"
  export default {
    mixins: [mixinViewModule],
    data() {
      return {
        mixinViewModuleOptions: {
          getDataListURL: zozomemberPageUrl,
          activatedIsNeed:false,
          getDataListIsPage: true,
          deleteURL: "",
          deleteIsBatch: false,
          dataListLoading: false,
          deleteIsBatch: true,
          deleteIsBatchKey: "id"
        },
        breaddata: ["会员管理", "会员列表"],
        dataForm:{
          memeberNameOrId:'',
          minConsumeAmount:'',
          maxConsumeAmount:'',
        },
        gradeNameOpction:[
          {id:"",name:"全部"},
          {id:"0",name:"正常"},
          {id:"1",name:"禁用"},
        ]
      };
    },
    components: {
      Bread
    },
    created() {
      this.getData();
    },
    methods: {
      getData(){
        this.getDataList()
      },
      reset(){
        this.dataForm.memeberNameOrId = "";
        this.dataForm.minConsumeAmount = "";
        this.dataForm.maxConsumeAmount = "";
        this.dataForm.memberState = "";
      },
      goDetail(row){
         row.activeName = "vipDetail";
          this.$emit("controlShowPage",2,row)
      },
      editHandle(row){
         row.activeName = "editVip"; 
         this.$emit("controlShowPage",2,row)
      }
    }
  };
</script>
<style>
  .el-dialog {
    width: 40%;
  }
</style>
