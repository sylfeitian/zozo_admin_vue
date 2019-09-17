<template>
  <div v-if="listOrAdd">
    <Bread :breaddata="breaddata"></Bread>
    <el-form style="margin-top:20px;">
      <el-form-item>
        <el-button type="primary" @click="addRowFn()">新增分类</el-button>
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
          @act-click="actshowFlag"
          @check-change="checkChange"
          @node-click="nodeClick"
          @current-change="currentChange">
      </MyTableTree>
			
			<!-- 分页 -->
			<el-pagination
			  @size-change="sizeChangeHandle"
			  @current-change="currentChangeHandle"
			  :current-page="formData.page"
			  :page-sizes="[10,20, 50, 100]"
			  :page-size="formData.limit"
			  :total="total"
			  layout="total, sizes, prev, pager, next, jumper">
			</el-pagination>
			
			<!--新增分类-->
			<add-data v-if="dialogTableVisible" ref="addshow" @addshow="addshow"></add-data>
			
			<!--编辑分类-->
			<edit-data v-if="editdialogTableVisible" ref="editshow" @editshow="editshow"></edit-data>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
// import mixinViewModule from "@/mixins/view-module";
// import TableTreeColumn from "@/components/table-tree-column";


import { categoryUrl } from "@/api/url";
import { deleteGoodsclasscustomUrl } from "@/api/url";

import { goodsclasscustomUpdateShow } from '@/api/api'
import { getdatalist,updataCategoryCn,uploadPicBase64} from '@/api/api'
import { deleteCategoryCn,recommendCategoryCn,showCategoryCn } from '@/api/api'  //删除分类  设为推荐  是否显示
import imgCropper from "@/components/model-photo-cropper";

// import { backstageList,goodsclassPage } from "@/api/api";
import { treeDataTranslate } from "@/utils";
import Bread from "@/components/bread";
import MyTableTree from "@/components/treeTable/MyTableTree.vue";

import addData from "./add"
import editData from "./edit"
let id = 1000;
export default {
  // mixins: [mixinViewModule],
  data() {
    return {
      table: [],
      value: [],
      addForm: {},
      listOrAdd: true,
      breaddata: ["基础资料管理", "中国分类管理"],
      dataListLoading: false,
      // mixinViewModuleOptions: {
      //   // activatedIsNeed: false,
      //   getDataListURL: categoryUrl,
      //   getDataListIsPage: true,
      //   // exportURL: '/admin-api/log/login/export',
      //   deleteURL: deleteGoodsclasscustomUrl,
      //   deleteIsBatch: true,
      //   deleteIsBatch: true,
      //   deleteIsBatchKey: "id"
      // },
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
              'show-checkbox': false
              // 'show-checkbox': true
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
              {
                  label: '分类图片',
                  prop:'genderMain',
                  span: 3
              },
              {
                  label: "是否显示",
                  prop: 'showFlag',
                  span: 3
              },
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
                  action: this.addRowFn, //按钮点击触发的函数 回调函数是该行的row
                  className: "artadd"
              },{    
                  type: "",//同el-button 的 type
                  prop: "设为推荐",  //支持函数返回html 和 文本字符串
                  action: this.artRecommend, //按钮点击触发的函数 回调函数是该行的row
                  className: "arttuijian"
              },
              {
                  type: "",//同el-button 的 type
                  prop:  "编辑",  //支持函数返回html 和 文本字符串
                  action: this.eidtRowFn, //按钮点击触发的函数 回调函数是该行的row
                  className: "artedit"
              },{
                  type: "",//同el-button 的 type
                  prop: "删除",  //支持函数返回html 和 文本字符串
                  action: this.deleteRowFn, //按钮点击触发的函数 回调函数是该行的row
                  className: "artdel"
              },
          ],
          //tree 的数据来源
          rows: [],
      },
      dialogTableVisible: false,  //添加
      editdialogTableVisible: false, //编辑
      dataForm:{
        gcName: "",//分类名称 ,
        messageType:'',
        parentId:'',//父级id
        parentname:'',
        name:'', //分类名称
        sort:'', //排序
        appraisal:'', //评价管理 
        methodUrl:'', //测量方法
    	},
    	
    };
  },
  components: {
    // TableTreeColumn,
    Bread,
    MyTableTree,
    imgCropper,
    addData,
    editData
  },
  created() {
      this.getTree();
  },
  mounted() {},
  methods: {
    handleChange(value) {
      console.log(value);
    },
    reset(){
    	this.dataForm.gcName = "";
    	this.dataForm.messageType = "";
    	this.dataForm.parentId = "";
    	this.dataForm.parentname = "";
    	this.dataForm.name = "";
    	this.dataForm.sort = "";
    },
    //新增分类
    addshow(){
    	this.dialogTableVisible = false;
    	this.getTree();
    },
    //编辑分类
    editshow(){
    	this.editdialogTableVisible = false;
    	this.getTree();
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
        // 获取表格数据
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
   		this.reset();     //清空弹窗内容
   		this.dialogTableVisible = true;   //新增分类弹窗
   		if(row){ //添加下一级
      	if(row.grade == 2){
	   			this.$message('二级分类不可以新增下一级');
	   			return;
	   		}
	      if(row.label){
	      	this.dataForm.parentname = row.label;
	      	console.log(this.dataForm.parentname)
	      }
	      this.$nextTick(()=>{
	      	this.$refs.addshow.init(row);
	    	})
     	}else{ //新增
      	this.$nextTick(()=>{
	      	this.$refs.addshow.init();
	    	})
      }
   		
   }, 
   //是否显示
   stopPropagation(row){
   	console.log("是否显示" + row);
   },
     // 编辑回调
    eidtRowFn(row){
    	this.editdialogTableVisible = true;
    	this.$nextTick(()=>{
      	this.$refs.editshow.init(row);
    	})
    },
    // 删除回调
    deleteRowFn(row){
        console.log(row);   
        if(row.children && row.children.length != 0){
        	this.$message("请先删除子级分类，再删除父级分类");
        	return;
        }
        this.dataListSelections = [row]
       	deleteCategoryCn(row,false).then((res)=>{
          console.log(res);
          if(res.code == 200){
            if(res.data){
              this.$message.success("删除成功 ");
              this.getTree();
            }else{
                this.$message.error("删除的分类存在关联的分类或商品");
            }
          	
          }else{
            this.$message.error("删除失败");
          }
        
        });
    },
    //设为推荐
    artRecommend(row){  
    		console.log(row); 
    		row.recommendFlag = row.recommendFlag ?  0 : 1;
       	recommendCategoryCn(row).then((res)=>{
          console.log(res);
          if(res.code == 200){
          	if(row.recommendFlag == 1){
          		this.$message.success("设为推荐成功");
          	}else{
          		this.$message("取消推荐成功");
          	}
          	
          	this.getTree();
          }else{
          	this.$message(res.msg);
          }
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
    nodeClick(event, list){
      console.log("node-click");
      console.log(event, list);
    },
    //是否显示
    actshowFlag(data){
    	showCategoryCn(data,false).then((res)=>{
          console.log(res);
          if(res.code == 200){
          	this.$message.success("设为"+(data.showFlag==1?'显示':'不显示')+"成功")
          	this.getTree();
          }else{
          	this.$message(res.msg);
          }
        });
    },
    currentChange(list){
      console.log("current-change");
      console.log(list);
    }

  }
};
</script>
<style lang="scss" scoped>
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

.artFooter {
	display: flex;
	justify-content: center;
}
.el-form-item__content {
	display: flex;
}
.grey{
		color: #999;
	}
  .el-tree img{
    width:60px;
    height: 60px;
    padding:8px;
  }
</style>
