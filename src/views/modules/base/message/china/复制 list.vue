<template>
  <div v-if="listOrAdd">
    <Bread :breaddata="breaddata"></Bread>
    <el-form style="margin-top:20px;">
      <el-form-item>
        <el-button type="primary" @click="addOrEditHandle()">新增展示分类</el-button>
        <el-button type="danger"  plain @click="deletRowsFn()" >批量删除</el-button>
      </el-form-item>
    </el-form>
    <!-- <el-table :data="table" empty-text style="width: 100%">
      <el-table-column prop="date" label="分类管理" width="550"></el-table-column>
      <el-table-column prop="name" label="排序" width="180"></el-table-column>
      <el-table-column prop="address" label="操作"></el-table-column>
    </el-table> -->
    
     <MyTableTree 
          v-loading="dataListLoading"
          :children="'list'"
          :label="'name'"
          :mate="treeConfig" 
          ref="MyTree" 
          @check-change="checkChange"
          @node-click="nodeClick"
          @current-change="currentChange">
      </MyTableTree>
			
			<!-- 分页 -->
			<el-pagination
			  @size-change="sizeChangeHandle"
			  @current-change="currentChangeHandle"
			  :current-page="formData.page"
			  :page-sizes="[20, 50, 100]"
			  :page-size="formData.limit"
			  :total="total"
			  layout="total, sizes, prev, pager, next, jumper">
			</el-pagination>
  </div>

</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import mixinViewModule from "@/mixins/view-module";
import TableTreeColumn from "@/components/table-tree-column";

// import { categoryUrl } from "@/api/url";
// import { goodsclassPageUrl } from "@/api/url";
import { categoryUrl } from "@/api/url";
import { deleteGoodsclasscustomUrl } from "@/api/url";

import { goodsclasscustomUpdateShow } from '@/api/api'
import { getdatalist} from '@/api/api'

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
      breaddata: ["基础资料管理", "中国分类管理"],
      mixinViewModuleOptions: {
        // activatedIsNeed: false,
        getDataListURL: categoryUrl,
        getDataListIsPage: true,
        // exportURL: '/admin-api/log/login/export',
        deleteURL: deleteGoodsclasscustomUrl,
        deleteIsBatch: true,
        dataListLoading: false,
        deleteIsBatch: true,
        deleteIsBatchKey: "id"
      },
      formData:{  
      	page:1,   
      	limit: 10,
      	parentId:0,
      	delFlag:0
      },
      total: 0,
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
                  prop: function (a,data){ if(data.sort){return data.sort}else{return 0}},
                  span: 2
              },
              {
                  label: '分类属性',
                  prop: function (a,data){ if(data.grade == 1){return '一级'}else if(data.grade == 2){return '二级'}else{return '三级'}},
                  span: 4
              },
//            {
//                label: '分类图片',
//                prop:function (a,data){ if(data.genderMain){return <img src="data.genderMain" alt="" /> }else{return 0}} ,
//                span: 3
//            },
//            {
//                label: "是否显示",
//                prop: function (a,data){ console.log(data); if(data.showFlag == 1){return '已启用'}else{return '已禁用'}},
//                span: 3
//            },
              {
                  label: "评价类型",
                  prop: 'appraisal',
                  span: 4
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
              },{
                  type: "",//同el-button 的 type
                  prop: this.judgeStatusFn,  //支持函数返回html 和 文本字符串,
                  action: this.forbitFn, //按钮点击触发的函数 回调函数是该行的row
                  className: "forbitClass"
              }
          ],
          //tree 的数据来源
          rows: [],
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
    // 每页数
		sizeChangeHandle (val) {
			this.formData.page= 1;
			this.formData.limit = val;
			this.getTree();
		},
		// 当前页
		currentChangeHandle (val) {
			this.formData.page = val;
			this.getTree();
		},
    getTree() {
    	  let obj = {
            params:this.formData
        }
       getdatalist(obj).then(res => {
          //Promise后 对数据格式进行处理
          if (res.code == 200) {
              var data = res.data.list;
              this.total = res.data.total;
              console.log(data);
                //处理树形数据
              // this.treeConfig.rows =  data; 
              var dataStr = JSON.stringify(data);
              dataStr = dataStr.replace(/name/g,"label")
              dataStr = dataStr.replace(/list/g,"children")
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
    judgeStatusFn(data){
        //  前台展示（0不展示，默认为1展示） ,
        if(data.showFlag == 1){
          return "<span class='artdisable'>禁用</span>"
        }else{
          return "<span class=' artstart'>启用</span>"
        }
    },
    showJudgeStatusFn(data){
      if(data.showFlag == 1){
          return "<span class='artstart'>启用</span>"
        }else{
          return "<span class='artdisable'>禁用</span>"
        }
    },
    // 启用禁用
    forbitFn(arguRow){
         console.log(arguRow);
         var row = cloneDeep(arguRow);
         if(row.showFlag){
           row.showFlag = 0;
         }else{
            row.showFlag = 1;
         }
         var obj  = {
           params:{
             id:row.id,
             showFlag:row.showFlag
           }
         }
      var msg = ""
      row.showFlag==0?msg="禁用":msg="启用"
      this.$confirm('是否'+msg+'该分类?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          goodsclasscustomUpdateShow(obj).then((res)=>{
                let status = "error"
                  if(res.code == 200){
                      status = "success";
                      this.getTree();
                  }
                  this.$message({
                    message: res.msg,
                    type: status,
                    duration: 1000,
                  })
          })
        }).catch(() => {});
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
<style >
.el-table__empty-block {
  display: none;
}
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
