<template>
  <div>
    <Bread :breaddata="breaddata"></Bread>
    <el-form :inline="true" class="grayLine topGapPadding" :model="dataForm" @keyup.enter.native="getDataList()" >
        <el-form-item label="等级名称：">
            <el-input v-model.trim="dataForm.sgName" placeholder="等级名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="getDataList()">搜索</el-button>
            <el-button @click="reset()" type="primary" plain>重置</el-button>
        </el-form-item>
        <br />
        
    </el-form>
    
    <el-form>
    	<el-form-item>
        <el-button type="primary" @click="toAdd('新增商家等级')">新增等级</el-button>
        <el-button type="danger" plain @click="deleteHandle()">批量删除</el-button>
    	</el-form-item>
    </el-form>
    <el-table
	  :data="dataList"
      v-loading="dataListLoading"
      border
      @selection-change="dataListSelectionChangeHandle"
	  style="width: 100%">
	    <el-table-column
	      type="selection"
	      width="70">
	    </el-table-column>
        <el-table-column
            type="index"
            prop="$index"
            label="序号"
            align="center"
            width="70">
            <template slot-scope="scope">
            {{scope.$index+1+(parseInt(page)-1)* parseInt(limit) }}
            </template>
        </el-table-column>
		<el-table-column
		    prop="sgName"
            align="center"
		    label="等级名称"
		    width="180">
		</el-table-column>
		<el-table-column
		    prop="sgGoodsLimit"
            align="center"
		    label="商品数">
		</el-table-column>
		<el-table-column
		    prop="sgPrice"
            align="right"
		    label="收费标准">
		</el-table-column>
		<el-table-column
		    prop="brokerageScale"
            align="right"
		    label="佣金比例">
            <template slot-scope="scope">
		    	<span>{{scope.row.brokerageScale?scope.row.brokerageScale:'0'}}%</span>
		    </template>
		</el-table-column>
		<el-table-column
		    prop="showFlag"
        align="center"
		    label="状态">
		   
        <template slot-scope="scope">
        	<el-tag type="success" v-if="scope.row.showFlag ==1">启用</el-tag>
					<el-tag type="danger" v-else>禁用</el-tag>
		    </template>
		</el-table-column>
	    <el-table-column
	   		prop="address"
            align="center"
	    	label="操作">
		    <template slot-scope="scope">
		    	<el-button type="text" size="small" @click="toAdd('编辑商家等级',scope.row.id)">编辑</el-button>
		    	<el-button class="artdanger" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
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

    <!-- 新增等级 -->
    <el-dialog
        :title="gradeTitle"
        :visible.sync="centerDialogVisible"
        :close-on-click-modal = "false"
        :show-close = "false"
        class="gradeDialog"
        width="22%">
        <el-form :model="gradeDataForm" :rules="dataRule" ref="gradeDataForm" @keyup.enter.native="gradeSubmitHandle()" label-width="120px">
            <el-form-item label="等级名称：" prop="sgName">
                <el-input v-model.trim="gradeDataForm.sgName"></el-input>
            </el-form-item>
            <el-form-item label="商品数量：" prop="sgGoodsLimit">
                <el-input v-model.trim="gradeDataForm.sgGoodsLimit" type="number" maxlength="6"></el-input>
            </el-form-item>
            <el-form-item label="收费标准：" prop="sgPrice">
                <el-input v-model.trim="gradeDataForm.sgPrice" type="number" maxlength="5">
                    <template slot="append">人民币</template>
                </el-input>
            </el-form-item>
            <el-form-item label="佣金比例：" prop="brokerageScale">
                <el-input v-model.trim="gradeDataForm.brokerageScale" type="number" maxlength="4">
                    <template slot="append">%</template>
                </el-input>
            </el-form-item>
            <el-form-item label="是否启用：" prop="showFlag">
                <el-radio-group v-model="gradeDataForm.showFlag">
                    <el-radio label="0">禁用</el-radio>
                    <el-radio label="1">启用</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="noCheck">取 消</el-button>
            <el-button type="primary" @click="gradeSubmitHandle" :loading="buttonStatus">确 定</el-button>
        </span>
    </el-dialog>

  </div>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import { storeGradePageUrl } from '@/api/url'
import { addGrade,storeGradeNews,updatestoreGrade } from '@/api/api'
import { showGrade } from '@/api/api'
import { constants } from 'fs';
import Bread from "@/components/bread";
  
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
          getDataListURL: storeGradePageUrl,
          getDataListIsPage: true,
          deleteURL: '/admin-api/store/grade',
          deleteIsBatch: true,
          deleteIsBatchKey: 'id'    
      },
      breaddata:["商家系统", "商户管理", "商户等级"],
      buttonStatus:false,
      gradeTitle:'',
      dataForm: {},
      gradeDataForm:{
        brokerageScale: '',
        sgGoodsLimit: '',
        // sgGradeScore: '',
        sgName: '',
        sgPrice: '',
        showFlag: '1',
      },
      gradeId:'',
      centerDialogVisible:false,
      dataRule:{
          brokerageScale: [
            { required: true, message: '佣金比例不能为空！', trigger: 'blur' },
            {
                validator: function (rule, value, callback) {
                    if (Number(value)>100||Number(value)<=0) {
                        callback(new Error('佣金比例应处于0-100'))
                    }else if(JSON.stringify(value).indexOf(".") != -1){
                        if(JSON.stringify(value).split(".")[1]&&JSON.stringify(value).split(".")[1].length>2){
                            callback(new Error('只能保留一位小数'))
                        }else{
                            callback()
                        }
                    }else {
                        callback()
                    }
                }, trigger: 'change'
            }
          ],
          sgGoodsLimit: [
            { required: true, message: '商品数量不能为空！', trigger: 'blur' },
            {
                validator: function (rule, value, callback) {
                    let reg = /^[0-9]+$/;
                    if (Number(value)>100000||Number(value)<0) {
                        callback(new Error('商品数量应处于0-100000'))
                    }else if(!(reg.test(Number(value)))){
                        callback(new Error('商品数量应为整数'))
                    }else {
                        callback()
                    }
                }, trigger: 'change'
            }
          ],
            //   sgGradeScore: [
            //     { required: true, message: '佣金比例不能为空！', trigger: 'blur' }
            //   ],
          sgName: [
            { required: true, message: '等级名称不能为空！', trigger: 'blur' }
          ],
          sgPrice: [
            { required: true, message: '收费标准不能为空！', trigger: 'blur' },
            {
                validator: function (rule, value, callback) {
                    if (Number(value)>1000000||Number(value)<0) {
                        callback(new Error('收费标准应处于0-10000000'))
                    }else {
                        callback()
                    }
                }, trigger: 'change'
            }
          ],
          showFlag: [
            { required: true, message: '是否启用不能为空！', trigger: 'blur' }
          ],
        }
    }
  },
  watch:{
      'gradeDataForm.brokerageScale'(newVal,oldVal){
          
        }
  },
  components: {
    Bread
  },
  methods: {
      noCheck(){
        this.centerDialogVisible = false
        this.$refs['gradeDataForm'].resetFields();//校验隐藏
      },
      
      //重置
        reset() {
            this.dataForm = {};
            this.getDataList();
        },
        //判断新增还是修改
        toAdd(title,id){
            this.gradeTitle = title;
            this.gradeId = '';
            this.centerDialogVisible = true;
            if(id){
                this.gradeId = id;
                var obj  = {
                    id:id
                }
                storeGradeNews(obj).then((res)=>{
                    console.log('等级回显',res.data.showFlag,JSON.stringify(res.data.showFlag))
                    if(res.code == 200&&res.data){
                        Object.assign(this.gradeDataForm,res.data)
                        this.gradeDataForm.showFlag = JSON.stringify(res.data.showFlag);
                    }
                })
            }else{
                this.gradeDataForm = {
                    brokerageScale: '',
                    sgGoodsLimit: '',
                    sgName: '',
                    sgPrice: '',
                    showFlag: '1',
                }
            }
        },
        // 新增修改提交
        gradeSubmitHandle(){
            this.$refs['gradeDataForm'].validate((valid) => {
                if (valid) {
                    this.buttonStatus = true;
                    if(this.gradeId){
                        this.gradeDataForm.id = this.gradeId;
                        updatestoreGrade(this.gradeDataForm).then((res)=>{
                            console.log(res)
                                if(res.code==200){
                                    this.centerDialogVisible = false;
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
                                this.buttonStatus = false;
                        })
                    }else{
                        addGrade(this.gradeDataForm).then((res)=>{
                            console.log(res)
                                if(res.code==200){
                                    this.centerDialogVisible = false;
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
                                    this.getDataList();
                                }
                                this.buttonStatus = false;
                        })
                    }
                }
            })
            
        },
        changeStatus(showFlag,id){
            console.log('状态值',showFlag)
            let obj = {
                showFlag:showFlag?0:1,
                id:id
            }
            showGrade(obj).then((res)=>{
                console.log(res)
                if(res.code == 200){
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
        }
  }
};
</script>
<style lang="scss">
// @import "@/element-ui/theme-variables.scss";

// .el-input {
//   width: 170px;
//   height: 40px;
// }
    .gradeDialog{
        .el-input{
            width: 250px !important;
        }
    }

</style>
