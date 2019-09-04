<template>
  <div>
    <Bread :breaddata="breaddata"></Bread>
    <el-form
      :inline="true"
      class="grayLine topGapPadding"
      :model="dataForm"
      ref="dataForm"
    >
      <el-form-item label="会员ID/名称：">
        <el-input v-model="dataForm.memeberNameOrId" placeholder="会员ID/名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="消费金额：">
        <div style="display:flex">
            <el-input v-model="dataForm.minConsumeAmount" placeholder=""></el-input>
            <span>&nbsp 至 &nbsp</span>
            <el-input v-model="dataForm.maxConsumeAmount" placeholder=""></el-input>

        </div>
      </el-form-item>
      <el-form-item label="会员等级：">
        <el-select v-model="dataForm.memberState" placeholder="会员等级" clearable>
          <el-option
            v-for="(item,index) in gradeNameOpction"
            :key="index"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getData()">查询</el-button>
        <el-button @click="reset()" type="primary" plain >重置</el-button>
      </el-form-item>
      <br />
    </el-form>
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
  }
};
</script>
<style>
.el-dialog {
  width: 40%;
}
</style>
