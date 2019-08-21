<template>
  <div v-if="listOrAdd">
    <Bread :breaddata="breaddata"></Bread>
    <el-form style="margin-top:20px;">
      <el-form-item>
        <el-button type="primary" @click="">导入信息</el-button>
      </el-form-item>
    </el-form>
    <!-- <el-table :data="table" empty-text style="width: 100%">
      <el-table-column prop="date" label="分类管理" width="550"></el-table-column>
      <el-table-column prop="name" label="排序" width="180"></el-table-column>
      <el-table-column prop="address" label="操作"></el-table-column>
    </el-table> -->
     <MyTableTree 
          v-loading="dataListLoading"
          :children="'childs'"
          :label="'idJp'"
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
			
			<!--新增的弹窗-->
			<el-dialog title="编辑分类条件信息" :visible.sync="dialogTableVisible" width="50%" :before-close="handleClose">
				<el-form 
					:model="dataForm" 
					label-width="140px" 	
					:rules="dataRule" 
					class="demo-ruleForm" 
					@keyup.enter.native="artuploadtag('addForm')"
					ref="addForm">
					<el-form-item label="日本分类条件ID：" prop="idJp">
			            <div>{{dataForm.idJp}}</div>
			       	</el-form-item>
			        <el-form-item label="日本分类条件信息：" prop="nameJp">
			            <div>{{dataForm.nameJp}}</div>
			        </el-form-item>
			        
		        	<el-form-item label="分类条件信息：" prop="name">
		            	<el-input v-model="dataForm.name" type="text" placeholder="请输入分类条件信息" show-word-limit style="width:400px;"></el-input>
		        	</el-form-item>
					<el-form-item style="text-align: center;">
		                <el-button @click="dialogTableVisible = false">取 消</el-button>
					    <el-button type="primary" @click="artuploadtag('addForm')">确 定</el-button>
		           	</el-form-item>
				</el-form>
			</el-dialog>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import mixinViewModule from "@/mixins/view-module";
import TableTreeColumn from "@/components/table-tree-column";



import { goodsclasscustomUpdateShow } from '@/api/api'
import { gettagdatalist,updataCategoryCn,uploadPicBase64} from '@/api/api'
import imgCropper from "@/components/model-photo-cropper";


import { uploadtag } from '@/api/api'


// import { backstageList,goodsclassPage } from "@/api/api";
import { treeDataTranslate } from "@/utils";
import Bread from "@/components/bread";
import MyTableTree from "./MyTableTree.vue";
let id = 1000;
export default {
  mixins: [mixinViewModule],
  data() {
  	//这里就是整个checkName啦，就是方法一的使用
    var checkName = (rule, value, callback) => {
            var len = 0;  
            for (var i=0; i<value.length; i++) {   
                var c = value.charCodeAt(i);   
                //单字节加1   
                if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {   
                    len++;   
                } else {   
                    len+=2;   
                }   
            };   
            if (len = 0 || len > 8) {
                //重点重点，下面就是填写提示的文字
                callback(new Error('名称长度不超过8个字符，一个中文字等于2个字符。'));
            } else {
                callback();
            }
    };
    var sortminmax = (rule, value, callback) => {
    	if(value > 0 && value < 255){
    		callback();
    	}else{
    		callback('排序值在0-255之间');
    	}
    };
    return {
      table: [],
      goodKindList1: [{ id: '', name: "全部" },{ id: 1, name: "系统信息" },{ id: 0, name: "私信" }],
      value: [],
      addForm: {},
      listOrAdd: true,
      breaddata: ["基础资料管理", "中国分类管理"],
      mixinViewModuleOptions: {
        // activatedIsNeed: false,
        getDataListURL: '',
        getDataListIsPage: true,
        // exportURL: '/admin-api/log/login/export',
        deleteURL: '',
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
                  label: '日本分类条件名称',
                  prop: 'nameJp',
                  span: 8
              },
              {
                  label: '分类条件名称',
                  prop: 'name',
                  span: 7
              }
          ],
          
          //操作按钮列表
          actions: [
//            {    
//                type: "",//同el-button 的 type
//                prop: "新增下级",  //支持函数返回html 和 文本字符串
//                action: this.addRowFn //按钮点击触发的函数 回调函数是该行的row
//            },
              {
                  type: "",//同el-button 的 type
                  prop:  "编辑",  //支持函数返回html 和 文本字符串
                  action: this.eidtRowFn //按钮点击触发的函数 回调函数是该行的row
              },
//            {
//                type: "",//同el-button 的 type
//                prop: "删除",  //支持函数返回html 和 文本字符串
//                action: this.deleteRowFn //按钮点击触发的函数 回调函数是该行的row
//            },{
//                type: "",//同el-button 的 type
//                prop: this.judgeStatusFn,  //支持函数返回html 和 文本字符串,
//                action: this.forbitFn, //按钮点击触发的函数 回调函数是该行的row
//                className: "forbitClass"
//            }
          ],
          //tree 的数据来源
          rows: [],
      },
      dialogTableVisible: false,
      dataForm:{},
    	dataRule : {
        name : [
            { required: true, message: '必填项不能为空', trigger: 'blur' },
//          { validator: checkName,trigger: 'blur' }
        ],
        sort: [
         		{ required: true, message: '必填项不能为空', trigger: 'blur' },
         		{ validator: sortminmax,trigger: 'blur'},
        ],
        appraisal: [
       		 { required: true, message: '必填项不能为空', trigger: 'blur' },
        ],
     },
    };
  },
  components: {
    TableTreeColumn,
    Bread,
    MyTableTree,
    imgCropper,
  },
  created() {
      this.getTree();
  },
  mounted() {},
  methods: {
    handleChange(value) {
      console.log(value);
    },
    //编辑
    artuploadtag(dataRule){
    	var data = {
    		name:this.dataForm.name,
    		id:this.dataForm.id
    	}
    	 this.$refs[dataRule].validate((valid) => {
          if (valid) {
            uploadtag(data).then(res =>{
				this.dialogTableVisible = false;
				if(res && res.code == "200"){
					this.$message(res.msg);
				}else {
					this.$message('服务器错误');
				}
			})
            
          } else {
            return false;
          }
        });
    	
    },
    reset(){
    	this.dataForm.gcName = "";
    	this.dataForm.messageType = "";
    	this.dataForm.parentId = "";
    	this.dataForm.parentname = "";
    	this.dataForm.name = "";
    	this.dataForm.sort = "";
    },
    GiftUrlHandle(val){
			console.log("base64上传图片接口");
			console.log(val);
			this.uploadPic(val);
		},
		//上传图片
		uploadPic(base64){
				const params = { "imgStr": base64 };
				const that = this;
				this.uploading = true;
				return new Promise(function(resolve){
					uploadPicBase64(params).then(res =>{
						that.uploading = false
						if(res && res.code == "200"){
							var url = res.data.url
							that.dataForm.methodUrl  = url;
							// that.currentIndex = -1;//不能这样写，防止网络延迟
							resolve("true")
						}else {
							// that.currentIndex = -1;//不能这样写，防止网络延迟
							resolve("false")
						}
					})
				});
			},
    //新增关闭
    handleClose(done) {
      done();
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
	addshowid(data){
		data.forEach((item)=>{
	      	if(item.idJp){
	      		this.$set(item,'showid',item.idJp);
	      	}
	      	if(item.childs && item.childs.length > 0){
	      		this.addshowid(item.childs);
	      	}else{
	      		return;
	      	}
	    })
	},
    getTree() {
    	  let obj = {
            params:this.formData
        }
       gettagdatalist(obj).then(res => {
          //Promise后 对数据格式进行处理
          if (res.code == 200) {
              var data = res.data.list;
              data.forEach((item)=>{
              	if(item.idJp){
              		this.$set(item,'showid',item.idJp);
              	}
              	if(item.childs && item.childs.length > 0){
              		this.addshowid(item.childs);
              	}
              })
              this.total = res.data.total;
              console.log(data);
                //处理树形数据
              // this.treeConfig.rows =  data; 
              var dataStr = JSON.stringify(data);
              dataStr = dataStr.replace(/idJp/g,"label")
              dataStr = dataStr.replace(/childs/g,"children")
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
    // 新增下级
   addRowFn(row){
   		this.reset();     //清空弹窗内容
      row.type="addNext"
      this.dialogTableVisible = true;
      if(row.label){
      	
      	this.dataForm.parentname = row.label;
      	console.log(this.dataForm.parentname)
      }
      updataCategoryCn().then(()=>{
      	
      })      
   }, 
     // 编辑回调
    eidtRowFn(row){
      console.log(row);
      this.dialogTableVisible = true;
      this.dataForm = row;
      this.$set(this.dataForm,'idJp',row.showid);
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
    nodeClick(event, list){
      console.log("node-click");
      console.log(event, list);
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
</style>
