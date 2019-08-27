<template>
  <div v-if="listOrAdd">
    <Bread :breaddata="breaddata"></Bread>
    <el-form style="margin-top:20px;">
      <el-form-item>
        <el-button type="primary" @click="addRowFn()">新增展示分类</el-button>
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
			  :page-sizes="[20, 50, 100]"
			  :page-size="formData.limit"
			  :total="total"
			  layout="total, sizes, prev, pager, next, jumper">
			</el-pagination>
			
			<!--新增的弹窗-->
			<el-dialog title="新增分类" :visible.sync="dialogTableVisible" width="50%" :before-close="handleClose">
				<el-form :model="dataForm" label-width="140px" 	:rules="dataRule" class="demo-ruleForm" ref="addForm">
			    <el-form-item v-if='dataForm.parentname' label="上级分类：" prop="gcName">
	            <el-input v-model="dataForm.parentname" type="text" :disabled="true" placeholder="dataForm.parentname" show-word-limit style="width:400px;"></el-input>
	        </el-form-item>
	        <el-form-item v-else label="上级分类：">  
		        <el-select
		          v-model="dataForm.messageType"
		          placeholder="请选择"
		          loading-text="加载中···">
		          <el-option
		            v-for="item in goodKindList1"
		            :key="item.id"
		            :label="item.name"
		            :value="item.id">
		          </el-option>
		        </el-select>
			    </el-form-item>
	        <el-form-item label="优惠券名称：" prop="name">
	            <el-input v-model="dataForm.name " type="text" placeholder="请输入4个汉字/8个字符以内的内容" show-word-limit style="width:400px;"></el-input>
	        </el-form-item>
	        <el-form-item label="排序：" prop="sort">
	            <el-input v-model="dataForm.sort" type="text" placeholder="0-255" show-word-limit style="width:200px;"></el-input>
	        		<div class="grey">(数字越小越靠前)</div>
	        </el-form-item>
	        <el-form-item label="关联日本分类：">
		        <el-select
		          v-model="dataForm.messageType"
		          placeholder="请选择"
		          loading-text="加载中···">
		          <el-option
		            v-for="item in goodKindList1"
		            :key="item.id"
		            :label="item.name"
		            :value="item.id">
		          </el-option>
		        </el-select>
		        <br />
		        <el-select
		          v-model="dataForm.messageType"
		          placeholder="请选择"
		          loading-text="加载中···">
		          <el-option
		            v-for="item in goodKindList1"
		            :key="item.id"
		            :label="item.name"
		            :value="item.id">
		          </el-option>
		        </el-select>
		        <div class="grey">添加</div>
					 </el-form-item>
				 	<el-form-item label="评价类型：" prop="appraisal">
            <el-input v-model="dataForm.appraisal" type="text" maxlength="6" placeholder="请输入6字以内的内容" show-word-limit style="width:400px;"></el-input>
        	</el-form-item>
        	{{dataForm.methodUrl}}
        	<el-form-item label="测量方法：" prop="methodUrl">
							<div class="pcCoverUrl imgUrl">
								<!-- :aspectRatio="1 / 1" -->
									<img-cropper
											ref="cropperImg1"
											:index="'1'"
											:imgWidth='"100px"'
											:imgHeight='"100px"'
											@GiftUrlHandle="GiftUrlHandle"
									></img-cropper>
							</div>
					</el-form-item>
        	<el-form-item label="分类性别：" prop="appraisal">
            <el-input v-model="dataForm.appraisal" type="text" maxlength="6" placeholder="请输入6字以内的内容" show-word-limit style="width:400px;"></el-input>
        	</el-form-item>
				</el-form>
		  	
		  	
			  <span slot="footer" class="dialog-footer artFooter">
			    <el-button @click="dialogTableVisible = false">取 消</el-button>
			    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
			  </span>
			</el-dialog>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import mixinViewModule from "@/mixins/view-module";
import TableTreeColumn from "@/components/table-tree-column";


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
      dialogTableVisible: false,
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
    	dataRule : {
        name : [
            { required: true, message: '必填项不能为空', trigger: 'blur' },
            { validator: checkName,trigger: 'blur' }
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
   		this.reset();     //清空弹窗内容
   		this.dialogTableVisible = true;
   		if(row){
      	if(row.grade == 2){
	   			this.$message('二级分类不可以新增下一级');
	   			return;
	   		}
	      row.type="addNext"
	      if(row.label){
	      	this.dataForm.parentname = row.label;
	      	console.log(this.dataForm.parentname)
	      }
	      updataCategoryCn().then(()=>{
	      	
	      })
      }else{
      	
      }
   		
   }, 
   //是否显示
   stopPropagation(row){
   	console.log("是否显示" + row);
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
        if(row.children && row.children.length != 0){
        	this.$message("请先删除子级分类，再删除父级分类");
        	return;
        }
        this.dataListSelections = [row]
       	deleteCategoryCn(row,false).then((res)=>{
          console.log(res);
          if(res.code == 200){
          	this.$message.success("删除成功");
          	this.getTree();
          }else{
          	this.$message("服务器错误")
          }
        });
    },
    //设为推荐
    artRecommend(row){  
    	console.log(row);   
    	alert(row.showFlag);
       	recommendCategoryCn(row,false).then((res)=>{
          console.log(res);
          if(res.code == 200){
          	if(row.showFlag == 1){
          		this.$message.success("设为推荐成功");
          	}else{
          		this.$message("取消推荐成功");
          	}
          	
          	this.getTree();
          }else{
          	this.$message("服务器错误")
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
          	this.$message.success("设为显示成功")
          	this.getTree();
          }else{
          	this.$message("服务器错误")
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
