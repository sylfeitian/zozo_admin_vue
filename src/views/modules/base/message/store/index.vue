<template>
  <div>
    <Bread :breaddata="breaddata"></Bread>
    <el-form
      :inline="true"
      class="grayLine topGapPadding"
      :model="dataFormShow"
      @keyup.enter.native="getDataList()"
    >
      <el-form-item label="店铺ID：">
        <el-input v-model="dataFormShow.idJp" placeholder="请输入" maxlength="30" ></el-input>
      </el-form-item>
      <el-form-item label="店铺名称：">
        <el-input v-model="dataFormShow.stName" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="营业状态：">
        <el-select v-model="dataFormShow.operateFlag" placeholder="请选择">
          <el-option
            v-for="item in operateShopStore"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button class="btn" type="primary" @click="getData()">搜索</el-button>
        <el-button class="btn" type="primary" plain @click="reset()">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- <el-button @click class="btn" type="primary">导入店铺信息</el-button> -->
     <importAndExport :importAndExportOptions="importAndExportOptions" :dataForm="dataForm"  @getDataList="getDataList"></importAndExport>
    <el-table
      width="100%"
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%;margin-top: 10px;"
    >
      <el-table-column prop="idJp" label="店铺id" align="center"></el-table-column>
      <el-table-column prop="storeLogo" label="店铺logo" align="center">
        <template slot-scope="scope">
          <img
            :src="scope.row.storeLogo | filterImgUrl"
            alt
            style=" object-fit: contain;width: 70px;height:70px;border-radius:100px;"
          />
        </template>
      </el-table-column>
      <el-table-column prop="storeNameJp" label="店铺日本名称" align="center"></el-table-column>
      <el-table-column prop="storeNameGlo" label="全球名称" align="center"></el-table-column>
      <el-table-column prop="storeName" label="店铺中文名称" align="center"></el-table-column>
      <el-table-column label="营业状态" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.operateFlag==0" type="warning">待营业</el-tag>
          <el-tag v-if="scope.row.operateFlag==1" type="success">营业中</el-tag>
          <el-tag v-if="scope.row.operateFlag==2" type="info">已停业</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="japanState" label="日本店铺状态" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.operateFlagJp==0" type="success">营业中</el-tag>
          <el-tag v-if="scope.row.operateFlagJp==1" type="info">已停业</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="updateDate" label="更新时间" align="center"></el-table-column>
      <el-table-column prop="mainTag" label="店铺主风格标签" align="center">
        <template slot-scope="scope">
          <div :title="scope.row.mainTag">
            {{scope.row.mainTag}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="subTag" label="店铺副风格标签" align="center">
        <template slot-scope="scope">
          <div :title="scope.row.subTag">
            {{scope.row.subTag}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop label="设为推荐" align="center">
        <template slot-scope="scope">
          <div style="position: relative;">
            <el-switch
              v-model="scope.row.recommendFlag"
              :active-value="1"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
            <div @click="switchHandle('singe',scope.row)" class="hiddenSwitch">
              <!-- 遮罩层 -->
              <!-- {{scope.row.recommendFlag}} -->
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="售卖品牌" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click.native.prevent="addHandle(scope.row)" size="mini">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120px">
        <template slot-scope="scope">
          <el-button type="text" @click="editHandle(scope.$index, scope.row)" size="mini" :disabled="scope.row.operateFlagJp==1">编辑</el-button>
          <!--                    <el-button  @click="forbitHandle('singe',scope.row)" type="text" size="mini" >-->
          <!--                        <span  v-if="scope.row.operateFlag==0">营业</span>-->
          <!--                        <span  v-if="scope.row.operateFlag==1" class="artclose">停业</span>-->
          <!--                    </el-button>-->
          <el-button
           :disabled="scope.row.operateFlagJp==1"
            @click.native.prevent="forbitHandle(scope.$index,scope.row)"
            type="text"
            size="mini"
          >
            <span
              v-if="scope.row.operateFlag==1"
              class="artdisable"
            >{{scope.$index==currentIndex&&forbitLoading?"停业中..":"停业"}}</span>
            <span
              v-else
              class="artstart"
            >{{scope.$index==currentIndex && forbitLoading?"营业中..":"营业"}}</span>
          </el-button>
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
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
    <!-- 弹窗, 查看 -->
    <addEditData v-if="addDataVisible" ref="addEditData" @searchDataList="getAndHandleDataList"></addEditData>
    <!-- 弹窗, 编辑 -->
    <editData v-if="editDataVisible" ref="editData" @searchDataList="getAndHandleDataList"></editData>
  </div>
</template>

<script>
import mixinViewModule from "@/mixins/view-module";
import Bread from "@/components/bread";
 import importAndExport from "@/components/import-and-export"
import addEditData from "./model-add-edit-data";
import editData from "./model-edit-data";
import { shopPageUrl } from "@/api/url";
import { operateShopStore, recommendShopStore } from "@/api/api";
  import { importShopStore} from '@/api/io'
export default {
  mixins: [mixinViewModule],
  data() {
    return {
      importAndExportOptions:{
            importUrl:importShopStore,//导入接口
            importWord:"导入",
            // exportUrl:exportRegisterUrl,//导出接口
            // exportWord:"导出数据",
        },
      mixinViewModuleOptions: {
        getDataListURL: shopPageUrl,
        getDataListIsPage: true,
        exportURL: "/admin-api/shopStore",
        deleteURL: "/admin-api/shopStore",
        deleteIsBatch: true
        // deleteIsBatchKey: 'id'
      },
      value: true,
      breaddata: ["基础资料管理", "店铺管理"],
      options: [],
      dataFormShow: {
        id: "",
        idJp: "", //店铺ID
        stName: "", //店铺名称
        operateFlag: "", //营业状态:0待营业;1营业中;2已停业
        operateFlagJp: "" //日本营业状态:0营业;1停业
      },
      dataList: [],
      dataListLoading: false,
      addDataVisible: false,
      editDataVisible: false,
      multipleSelection: [],
      row: "",
      operateShopStore: [
        { id: "", name: "全部" },
        { id: "1", name: "营业中" },
        { id: "2", name: "已停业" },
        { id: "0", name: "待营业" }
      ], //营业状态
      currentIndex: "",
      forbitLoading: false,
      recommendFlag: ""
    };
  },
  created() {
    // let obj = {
    //     params:{
    //         page:1,
    //         limit:10,
    //     }
    // }
    // shopStorePage(obj).then((res)=>{
    //     console.log('店铺信息',res)
    //     if(res.code == 200 && res.data.list){
    //         // this.operateShopStore = [...this.operateShopStore,...res.data.list]
    //         this.dataList = res.data.list;
    //     }
    // })
    this.getAndHandleDataList();
  },
  components: {
    Bread,
    addEditData,
    editData,
    importAndExport
  },
  // ID类搜索框仅可输入数字、英文，最多可输入30个字符
  watch:{
    'dataFormShow.idJp':function(newV,oldV) {
      for(let i=0;i<newV.length;i++){
        if(!/[a-zA-Z0-9\s]/.test(newV[i])){
          this.dataFormShow.idJp = newV.replace(newV[i],"")
        }
      }
      if(newV.length>30){
        this.dataFormShow.idJp = newV.substr(0,30)
      }
}
  },
  methods: {
    getData() {
      this.page = 1;
      this.dataForm = {};
      for (let key in this.dataFormShow) {
        this.$set(this.dataForm, `${key}`, this.dataFormShow[key]);
      }
      console.log(this.dataForm);
      this.getAndHandleDataList();
    },
    getAndHandleDataList() {
      this.getDataList();
    },
    // 重置
    reset() {
      this.dataFormShow.idJp = ""; //店铺ID
      this.dataFormShow.stName = ""; //店铺名称
      this.dataFormShow.operateFlag = ""; //营业状态
      this.dataForm.idJp = ""; //店铺ID
      this.dataForm.stName = ""; //店铺名称
      this.dataForm.operateFlag = ""; //营业状态
      this.getAndHandleDataList();
    },
    // 查看
    addHandle( row ) {
      this.setAddDataVisible(true);
      this.$nextTick(() => {
        this.$refs.addEditData.init(row);
      });
    },
    setAddDataVisible(boolargu) {
      this.addDataVisible = boolargu;
    },
    //编辑
    editHandle(index = -1, row = "") {
      this.setEditDataVisible(true);
      this.$nextTick(() => {
        this.$refs.editData.init(row);
      });
    },
    setEditDataVisible(boolargu) {
      this.editDataVisible = boolargu;
    },
    // forbitHandle(index,row){
    //     console.log(row);
    //     this.currentIndex = index;
    //     console.log(obj)
    //     var obj = {
    //         "storeId": row.id,
    //         "operateFlag":row.operateFlag==1?0:1  //
    //     }
    //     var msg = ""
    //     row.operateFlag==1?msg="停业":msg="营业"
    //     this.$confirm('是否进行'+msg+'操作?', '提示', {
    //         confirmButtonText: '确定',
    //         cancelButtonText: '取消',
    //         type: 'warning'
    //     }).then(() => {
    //         this.forbitLoading = true;
    //         operateShopStore(obj).then((res)=>{
    //             this.forbitLoading = false;
    //             // console.log(res);
    //             if(res.code==200){
    //                 this.getDataList();
    //                 this.$message({
    //                     message:res.msg,
    //                     type: 'success',
    //                     duration: 1500,
    //                 })
    //             }else{
    //                 this.$message({
    //                     message:res.msg,
    //                     type: 'error',
    //                     duration: 1500,
    //                 })
    //             }
    //         })
    //
    //     }).catch(() => {});
    // },
    forbitHandle(index, row) {
      // 如果日本那边状态是已停业，这边不能操作
      if(row.operateFlagJp==1) return;
      console.log(row);
      this.currentIndex = index;
      var obj = {
        storeId: row.id,
        operateFlag: row.operateFlag == 1 ? 2 : 1 //0:待营业 1:营业中 2已停业 ,
      };
      var msg = "";
      var msg1 = "";
      obj.operateFlag == 1 ? (msg = "营业") : (msg = "停业");
      obj.operateFlag == 1 ? (msg1 = "可以") : (msg1 = "不可以");
      this.$confirm("您正在进行" + msg + "操作，"+msg+"后前台"+msg1+"看到该店铺，你还要继续吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.forbitLoading = true;
          operateShopStore(obj).then(res => {
            this.forbitLoading = false;
            if (res.code == 200) {
              this.getAndHandleDataList();
              this.$message({
                message: res.msg,
                type: "success",
                duration: 1500
              });
            } else {
              this.$message({
                message: res.msg,
                type: "error",
                duration: 1500
              });
            }
          });
        })
        .catch(() => {});
    },
    switchHandle(index, row) {
      console.log(row);
      this.currentIndex = index;
      var obj = {
        storeId: row.id,
        recommendFlag: row.recommendFlag ? 0 : 1
      };

      var msg = "";
      row.recommendFlag == 1 ? (msg = "不推荐") : (msg = "推荐");
      this.$confirm("是否进行" + msg + "操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.forbitLoading = true;
          recommendShopStore(obj).then(res => {
            this.forbitLoading = false;
            // console.log(res);
            if (res.code == 200) {
              this.getAndHandleDataList();
              this.$message({
                message: res.msg,
                type: "success",
                duration: 1500
              });
            } else {
              this.$message({
                message: res.msg,
                type: "error",
                duration: 1500
              });
            }
          });
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="scss" scoped>
  /deep/ .cell{
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  /*/deep/ .cell {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
  }*/

.hiddenSwitch {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
</style>