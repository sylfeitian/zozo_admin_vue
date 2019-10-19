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
        <el-input v-model.trim="dataForm.memeberNameOrId" placeholder="请输入会员账号/ID" clearable maxlength="30" ></el-input>
      </el-form-item>
      <el-form-item label="消费金额：">
        <div style="display:flex">
          <el-input v-model.trim="dataForm.minConsumeAmount" placeholder="" @blur="compare"></el-input>
          <span>&nbsp 至 &nbsp</span>
          <el-input v-model.trim="dataForm.maxConsumeAmount" placeholder="" @blur="compare"></el-input>

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
        <el-button @click="reset()" type="primary" plain style="margin-right:20px;" >重置</el-button>
        <!-- <el-button type="primary" plain>导出</el-button> -->
         <!-- <importAndExport :importAndExportOptions="importAndExportOptions" :dataForm="dataForm"  @getDataList="getDataList"></importAndExport> -->
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
      <el-table-column prop="memberCode" label="会员ID" align="center" width="170"></el-table-column>
      <el-table-column prop="memberName" label="会员账号" align="center"></el-table-column>
      <el-table-column prop="nickName" align="center" label="用户昵称" width="140"></el-table-column>
      <el-table-column prop="createDate" align="center" label="注册时间" width="140">
        <template slot-scope="scope">
          <div :title="scope.row.createDate">
            {{scope.row.createDate}}
          </div>
        </template>

      </el-table-column>
      <el-table-column prop="point" align="center" label="会员成长值"></el-table-column>
      <el-table-column prop="consumeAmount" align="center" label="消费金额" width="170">
          <template slot-scope="scope">
            <span>￥{{scope.row.consumeAmount}}</span>
          </template>
      </el-table-column>
      <el-table-column prop="orderNums" align="center" label="订单数量" width="170">
        <template slot-scope="scope">
            <span>{{scope.row.orderNums?scope.row.orderNums:0}}</span>
          </template>
      </el-table-column>
      <el-table-column prop="point" align="center" label="积分" width="170">
         <template slot-scope="scope">
            <span>{{scope.row.point?scope.row.point:0}}</span>
          </template>
      </el-table-column>
      <el-table-column
              prop="memberState"
              align="center"
              label="启用状态"
              width="80"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.memberState == 0">启用</span>
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

       <!-- 分页 -->
        <el-pagination
                @size-change="pageSizeChangeHandle"
                @current-change="pageCurrentChangeHandle"
                :current-page="page"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="limit"
                :total="total"
                layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>

  </div>
</template>

<script>
  import Bread from "@/components/bread";
  import mixinViewModule from "@/mixins/view-module";
  import {zozomemberPageUrl,} from "@/api/url.js"
 import importAndExport from "@/components/import-and-export"
 import { vipExport} from '@/api/io'
  export default {
    mixins: [mixinViewModule],
    data() {
      return {
        importAndExportOptions:{
            // importUrl:colorImportExcel,//导入接口
            // importWord:"导入信息",
            exportUrl:vipExport,//导出接口
            exportWord:"导出",
        },
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
      Bread,
      importAndExport
    },
    // ID类搜索框仅可输入数字、英文，最多可输入30个字符
    watch:{
      'dataForm.memeberNameOrId':function(newV,oldV) {
        for(let i=0;i<newV.length;i++){
          if(!/[a-zA-Z0-9\s]/.test(newV[i])){
            this.dataForm.memeberNameOrId = newV.replace(newV[i],"")
          }
        }
        if(newV.length>30){
          this.dataForm.memeberNameOrId = newV.substr(0,30)
        }
      },
      // 消费金额 可输入2小数点 最大99999
      'dataForm.minConsumeAmount':function (newV,oldV) {
        if(newV.toString().indexOf('.') !==-1){
          // 截取到小数点后2位
          this.dataForm.minConsumeAmount = newV.substr(0,newV.indexOf('.')+3)
          // 小数点之前的长度>5位 不让输入整数位
          if(newV.split(".")[0].length>5){
            this.dataForm.minConsumeAmount = oldV
          }
        // 加上小数点 截取8位
          if(newV.length>8){
            this.dataForm.minConsumeAmount = newV.substr(0,8)
          }
        }else{
          this.dataForm.minConsumeAmount = newV.substr(0,5)
        }
        for (let i = 0; i < newV.length; i++) {
          // 只能输入数字
          if (!/[0-9]/g.test(newV[i])) {
            this.dataForm.minConsumeAmount = newV.replace(newV[i], "")
          }
        }
      },
      // 消费金额 可输入2小数点 最大99999
      'dataForm.maxConsumeAmount':function (newV,oldV) {
        if(newV.toString().indexOf('.') !==-1){
          // 截取到小数点后2位
          this.dataForm.maxConsumeAmount = newV.substr(0,newV.indexOf('.')+3)
          // 小数点之前的长度>5位 不让输入整数位
          if(newV.split(".")[0].length>5){
            this.dataForm.maxConsumeAmount = oldV
          }
        // 加上小数点 截取8位
          if(newV.length>8){
            this.dataForm.maxConsumeAmount = newV.substr(0,8)
          }
        }else{
          this.dataForm.maxConsumeAmount = newV.substr(0,5)
        }
        for (let i = 0; i < newV.length; i++) {
          // 只能输入数字
          if (!/[0-9]/g.test(newV[i])) {
            this.dataForm.minConsumeAmount = newV.replace(newV[i], "")
          }
        }
      }
    },
    created() {
      this.getData();
    },
    methods: {
      // input失去焦点时判断金额大小 置换位置
      compare(){
        var temp=this.dataForm.maxConsumeAmount;
        // 比较整数的大小
        if(parseInt(this.dataForm.maxConsumeAmount)<parseInt(this.dataForm.minConsumeAmount)){
          this.dataForm.maxConsumeAmount=this.dataForm.minConsumeAmount
          this.dataForm.minConsumeAmount=temp
        }else if(parseInt(this.dataForm.maxConsumeAmount)===parseInt(this.dataForm.minConsumeAmount)){ // 整数相等的情况下 比较小数点后的大小
          var minTemp,maxTemp = 0;
          if(this.dataForm.minConsumeAmount.indexOf('.') !==-1){
            minTemp = this.dataForm.minConsumeAmount.substr(this.dataForm.minConsumeAmount.indexOf('.')+1)
          }
         if(this.dataForm.maxConsumeAmount.indexOf('.') !==-1){
            maxTemp = this.dataForm.maxConsumeAmount.substr(this.dataForm.maxConsumeAmount.indexOf('.')+1)
         }
          if(parseInt(maxTemp)<parseInt(minTemp)){
            this.dataForm.maxConsumeAmount=this.dataForm.minConsumeAmount
            this.dataForm.minConsumeAmount=temp
          }

        }
      },
      getData(){
        this.page = 1
        this.getDataList()
      },
      reset(){
        this.dataForm.memeberNameOrId = "";
        this.dataForm.minConsumeAmount = "";
        this.dataForm.maxConsumeAmount = "";
        this.dataForm.memberState = "";
        this.getData();
      },
      goDetail(row){
         row.activeName = "vipDetail";
          this.$emit("controlShowPage",2,row)
      },
      editHandle(row){
         row.activeName = "editVip"; 
         this.$emit("controlShowPage",2,row)
      },
      forbitHandle(row){
        var obj = {
           "ids": [row.id],
           "memberStatus":row.memberState==1?0:1
        }
        var msg = ""
        obj.memberStatus==0?msg="禁用":msg="启用"
        this.$confirm('是否'+msg+'该用户?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
              updateZozomemberState(obj).then((res)=>{
                  this.forbitLoading = false;
                  // console.log(res);
                  if(res.code==200){
                      this.getDataList();
                      this.$message({
                        message:res.msg,
                          type: 'success',
                          duration: 1500,
                      })
                  }else{
                    this.$message({
                        message:res.msg,
                        type: 'error',
                        duration: 1500,
                    })
                  }
              })
          
        }).catch(() => {});
      },
     
  }
};
</script>
<style>
  .el-dialog {
    width: 40%;
  }
</style>
