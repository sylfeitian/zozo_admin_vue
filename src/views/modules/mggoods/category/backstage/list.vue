<template>
  <div v-if="listOrAdd">
    <Bread :breaddata="breaddata"></Bread>
    <el-form style="margin-top:20px;">
      <el-form-item>
        <el-button type="primary" @click="addOrEditHandle()">新增后台分类</el-button>
        <el-button type="danger" plain @click="deletRowsFn()" >批量删除</el-button>
      </el-form-item>
    </el-form>
    <!-- <el-table :data="table" empty-text style="width: 100%">
      <el-table-column prop="date" label="分类管理" width="550"></el-table-column>
      <el-table-column prop="name" label="排序" width="180"></el-table-column>
      <el-table-column prop="address" label="操作"></el-table-column>
    </el-table> -->

     <MyTableTree 
          v-loading="dataListLoading"
          :children="'goodsClassListDTO'"
          :label="'gcName'"
          :mate="treeConfig" 
          ref="MyTree" 
          @check-change="checkChange"
          @node-click="nodeClick"
          @current-change="currentChange">
      </MyTableTree>

  </div>

</template>

<script>

import mixinViewModule from "@/mixins/view-module";
import TableTreeColumn from "@/components/table-tree-column";

// import { categoryUrl } from "@/api/url";
// import { goodsclassPageUrl } from "@/api/url";
import { allGoodsclassUrl } from "@/api/url";
import { deleteGoodsclassUrl } from "@/api/url";

// import { backstageList,goodsclassPage } from "@/api/api";
import { treeDataTranslate } from "@/utils";
import Bread from "@/components/bread";
import MyTableTree from "@/components/treeTable/MyTableTree.vue";
let id = 1000;
export default {
  mixins: [mixinViewModule],
  data() {
    return {
      table: [],
      value: [],
      addForm: {},
      listOrAdd: true,
      breaddata: ["商品", "类目管理", "后台分类"],
    
      mixinViewModuleOptions: {
        activatedIsNeed: false,
        getDataListURL: allGoodsclassUrl,
        getDataListIsPage: true,
        // exportURL: '/admin-api/log/login/export',
        deleteURL: deleteGoodsclassUrl,
        deleteIsBatch: true,
        dataListLoading: false,
        deleteIsBatch: true,
        deleteIsBatchKey: "id"
      },
      gridData: [],//品牌table
      specData:[],//规格table
      attrData:[],//属性table
      formLabelWidth: "120px",
      treeConfig: {
          //等于 el-tree 的选项配置
          options: {
              'show-checkbox': true
          },
          //自定义表格列 目前只支持文本渲染
          columns: [
             {
                  label: '排序',
                  prop: function (a,data){ if(data.sort){return data.sort}else{return 0}} ,
                  span: 3
              },
              {
                  label: '分类管理',
                  prop: 'label',
                  span: 8
              }
          ],
          //操作按钮列表
          actions: [
              {    
                  type: "",//同el-button 的 type
                  prop: "新增下级",  //支持函数返回html 和 文本字符串
                  action: this.addRowFn //按钮点击触发的函数 回调函数是该行的row
              },
              {
                  type: "",//同el-button 的 type
                  prop:  "编辑",  //支持函数返回html 和 文本字符串
                  action: this.eidtRowFn //按钮点击触发的函数 回调函数是该行的row
              },{
                  type: "",//同el-button 的 type
                  prop: "删除",  //支持函数返回html 和 文本字符串
                  action: this.deleteRowFn //按钮点击触发的函数 回调函数是该行的row
              }
          ],
          //tree 的数据来源
          rows: []
      }
    };
  },
  components: {
    TableTreeColumn,
    Bread,
    MyTableTree,
  },
  created() {
      this.getTree();
  },
  mounted() {},
  methods: {
    handleChange(value) {
      console.log(value);
    },
    getTree() {
       this.getDataList().then(res => {
          //Promise后 对数据格式进行处理
          if (res.code == 200) {
              var data = res.data
                //处理树形数据
              // this.treeConfig.rows =  data; 
              var dataStr = JSON.stringify(data);
              dataStr = dataStr.replace(/gcName/g,"label")
              dataStr = dataStr.replace(/goodsClassListDTO/g,"children")
              this.treeConfig.rows = [].concat(JSON.parse(dataStr));
              
              console.log("treeTable数据:");
              console.log(this.treeConfig.rows);

              var dataArray = JSON.stringify(this.treeConfig.rows);
              var dataArrayStr = dataArray.replace(/id/g,"value");
              dataArrayStr = dataArrayStr.replace(/\[]/g,'""');
              this.$parent.dataArray = JSON.parse(dataArrayStr);
              console.log( dataArrayStr );
          }
      });
    },

     // 新建和编辑
    addOrEditHandle(row = "") {
        this.$emit("hiddenList",row);
    },
    // 新增下级
   addRowFn(row){
      console.log(row)
      row.type="addNext"
      this.addOrEditHandle(row)
   }, 
     // 编辑回调
    eidtRowFn(row){
      console.log(row);
      row.type="edit"
       this.addOrEditHandle(row)
    },
    // 删除回调
    deleteRowFn(row){
        console.log(row);
        this.dataListSelections = [row]
        this.deleteHandle("",false).then((res)=>{
          console.log(res);
            if(res=="ok"){this.getTree();}
        });
    },

    deletRowsFn(){
       console.log(this.$refs.MyTree.$refs.myTreeGrid.getCheckedNodes());
       console.log(this.$refs.MyTree.$refs.myTreeGrid.getCheckedKeys());
       var arr = this.$refs.MyTree.$refs.myTreeGrid.getCheckedNodes();
       if(arr.length!=0){
          this.dataListSelections = arr
          this.deleteHandle("",false).then((res)=>{
             if(res=="ok"){this.getTree();}
          });
       }
      
    },
    checkChange(list){
      console.log("check-change");
      console.log(list);
    },
    nodeClick(list){
      console.log("node-click");
      console.log(list);
    },
    currentChange(list){
      console.log("current-change");
      console.log(list);
    }

  }
};
</script>
<style lang="scss" scoped>
.el-tree-node__content {
  border: 1px solid #d1d1d1;
}
.nums {
  width: 100px;
  display: inline-block;
  margin-left: 80px;
}
.operation {
  width: 500px;
  display: inline-block;
  text-align: center;
  margin-left: 200px;
}
.nums_level {
  min-width: 450px;
  display: inline-block;
}

/* .el-tree-node{padding-left: 80px;} */
</style>
